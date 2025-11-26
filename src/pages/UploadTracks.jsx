// hooks and libraries
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast, ToastContainer, Slide } from "react-toastify";

// css
// import "../styles/UploadTracks.css";
import "react-toastify/dist/ReactToastify.css";

// assets
import defaultCover from "../assets/coverArt.jpg";

const UploadTracks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get releaseId from URL params or localStorage
  const searchParams = new URLSearchParams(location.search);
  const releaseId = searchParams.get("releaseId") || localStorage.getItem("currentReleaseId");
  
  const releaseMetadata = location.state || {};
  
  // Filter out tracks that don't have file objects (read-only tracks from previous sessions)
  const [tracks, setTracks] = useState(() => {
    const storedTracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
    // Only keep tracks that have a file object or are already completed (have trackId)
    return storedTracks.filter(track => track.file || track.trackId);
  });
  
  const [draggedTrackIdx, setDraggedTrackIdx] = useState(null);
  const fileInputRef = useRef(null);

  // Store releaseId in localStorage if not already stored
  useEffect(() => {
    if (releaseId) {
      localStorage.setItem("currentReleaseId", releaseId);
    }
    
    // Clean up localStorage: remove tracks without file objects that aren't completed
    const storedTracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
    const validTracks = storedTracks.filter(track => track.file || track.trackId);
    if (validTracks.length !== storedTracks.length) {
      localStorage.setItem("uploadedTracks", JSON.stringify(validTracks));
      setTracks(validTracks);
    }
  }, [releaseId]);

  // Save tracks to local storage
  const saveTracksToStorage = (tracksArr) => {
    setTracks(tracksArr);
    localStorage.setItem("uploadedTracks", JSON.stringify(tracksArr));
  };

  // Format seconds into mm:ss
  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || !isFinite(seconds) || seconds < 0) {
      return "--:--";
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // Handle file upload
  const handleTrackUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFormats = ["audio/flac", "audio/wav"];
    const newTracks = [];
    let loadedCount = 0;

    files.forEach((file) => {
      // Check file extension as well (some browsers may not set MIME type correctly)
      const fileExt = file.name.toLowerCase().split('.').pop();
      if (!validFormats.includes(file.type) && !["flac", "wav"].includes(fileExt)) {
        toast.dark(`❌ ${file.name} is not a valid format. Only FLAC and WAV files are allowed.`);
        return;
      }

      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);
      audio.onloadedmetadata = () => {
        const newTrack = {
          id: Date.now() + Math.random(),
          name: file.name,
          format: file.type || (fileExt === "flac" ? "audio/flac" : "audio/wav"),
          file: file, // Store file object for later upload
          url: audioURL,
          duration: audio.duration,
          durationSeconds: Math.floor(audio.duration),
          metadata: {},
          detailsCompleted: false,
          trackId: null, // Will be set after track is created via API
          fileId: null, // Will be set after file is uploaded
        };
        newTracks.push(newTrack);
        loadedCount++;

        if (loadedCount === files.length) {
          const updatedTracks = [...tracks, ...newTracks];
          saveTracksToStorage(updatedTracks);
          toast.dark(`✅ ${newTracks.length} track(s) uploaded successfully!`, { autoClose: 3000 });
        }
      };
      audio.onerror = () => {
        toast.dark(`❌ Error loading ${file.name}. Please try again.`);
      };
    });
  };

  const handleUploadSectionClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleDelete = (id) => {
    const updatedTracks = tracks.filter((track) => track.id !== id);
    saveTracksToStorage(updatedTracks);
  };

  const handleEditTrack = (track, idx) => {
    navigate("/track-details", {
      state: { track, trackIdx: idx },
    });
  };

  const handleDragStart = (idx) => setDraggedTrackIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (draggedTrackIdx === null || draggedTrackIdx === idx) return;
    const updatedTracks = [...tracks];
    const [removed] = updatedTracks.splice(draggedTrackIdx, 1);
    updatedTracks.splice(idx, 0, removed);
    setTracks(updatedTracks);
    setDraggedTrackIdx(null);
  };

  // Proceed to next page - After all tracks are created, update release with trackIds
  const handleNextStep = async () => {
    if (!releaseId) {
      toast.dark("❌ Release ID not found. Please go back and create a release first.");
      return;
    }

    if (tracks.length === 0) {
      toast.dark("⚠️ Please upload at least one track before continuing.");
      return;
    }

    if (tracks.some((t) => !t.detailsCompleted)) {
      toast.dark("ℹ️ Please complete track details before proceeding.");
      return;
    }

    // Check if all tracks have been created (have trackId)
    const tracksWithoutId = tracks.filter((t) => !t.trackId);
    if (tracksWithoutId.length > 0) {
      toast.dark(`⚠️ Please complete track details for ${tracksWithoutId.length} track(s).`);
      return;
    }

    // Update release with trackIds
    try {
      const trackIds = tracks.map((t) => t.trackId).filter((id) => id !== null && id !== undefined && id !== 0);
      
      if (trackIds.length === 0) {
        toast.error("⚠️ No valid tracks found to update release.", { transition: Slide });
        return;
      }

      console.log("📤 Updating release with trackIds:", trackIds);
      
      // Fetch release first to get all existing fields, then update with trackIds
      const { updateRelease, getReleaseById } = await import("../services/releases");
      
      try {
        // Try to get existing release data first
        const existingRelease = await getReleaseById(releaseId);
        console.log("📥 Existing release data:", existingRelease);
        
        // Update with existing data plus trackIds
        await updateRelease(releaseId, {
          ...existingRelease,
          trackIds: trackIds,
        });
      } catch (fetchError) {
        // If fetch fails, try updating with just trackIds (API might accept partial updates)
        console.warn("Could not fetch release, trying direct update:", fetchError);
        await updateRelease(releaseId, {
          trackIds: trackIds,
        });
      }

      console.log("✅ Release updated successfully with trackIds:", trackIds);
      
      // Show success toast
      toast.success("✅ Release updated with tracks successfully!", { 
        transition: Slide,
        autoClose: 3000,
      });
      
      // Clear uploaded tracks from localStorage after successful update
      localStorage.setItem("uploadedTracks", JSON.stringify(tracks));
      
      // Navigate to select stores page (next step in flow)
      navigate("/select-stores", {
        state: { 
          ...releaseMetadata, 
          tracks, 
          releaseId,
        },
      });
    } catch (error) {
      console.error("Error updating release with trackIds:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        releaseId: releaseId,
        trackIds: tracks.map((t) => t.trackId),
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message ||
                          "Failed to update release";
      
      toast.error(`❌ Error updating release: ${errorMessage}`, { 
        transition: Slide,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Upload Tracks</h2>

      <div className="upload-layout">
        {/* LEFT SIDE — PREVIEW SECTION */}
        <div className="preview-section">
          <div className="preview-content">
            {/* Cover Art */}
            <div className="cover-art-container">
              <img
                src={releaseMetadata.coverArt || defaultCover}
                alt="Cover Art"
                className="cover-art-image"
              />
            </div>

            {/* Album Info */}
            <div className="preview-info">
              <div className="preview-item">
                <p>
                  <strong>Album Name</strong>
                </p>
                <p>{releaseMetadata.title || "Tunewave"}</p>
              </div>
              <div className="preview-item">
                <p>
                  <strong>Main Primary Artist</strong>
                </p>
                <p>{releaseMetadata.mainPrimaryArtist || "Tunewave"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — UPLOAD SECTION */}
        <div
          className="upload-box"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.add("drag-over");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove("drag-over");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove("drag-over");

            const files = Array.from(e.dataTransfer.files);
            const validFiles = files.filter((file) =>
              [".flac", ".wav"].some((ext) =>
                file.name.toLowerCase().endsWith(ext)
              )
            );
            if (validFiles.length > 0) {
              handleTrackUpload({ target: { files: validFiles } });
            } else {
              toast.dark("Only FLAC and WAV files are allowed.");
            }
          }}
        >
          <div className="upload-section-wrapper">
            <div
              className="upload-section"
              onClick={handleUploadSectionClick}
              style={{ cursor: "pointer" }}
            >
              <div className="upload-area">
                <p className="upload-subtitle">Format: FLAC or WAV</p>
                <p className="upload-requirements">
                  Requirements: Minimum 16 bit, 44.1 KHz, stereo <br />
                  Recommended 24 bits, 48KHz or 24 bits, 96KHz
                </p>
                <p className="drag-drop-hint">or drag & drop files here</p>
              </div>

              <input
                type="file"
                accept=".flac,.wav"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleTrackUpload}
              />
            </div>

            {tracks.length > 0 && (
              <div className="uploaded-tracks-list">
                {tracks.map((track, idx) => (
                  <div
                    key={track.id}
                    className="track-card"
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    style={{
                      opacity: draggedTrackIdx === idx ? 0.5 : 1,
                      cursor: "move",
                    }}
                  >
                    <div className="track-info" style={{ textAlign: "center" }}>
                      <strong>Track {idx + 1}</strong>
                      <p>{track.name}</p>
                      {!track.file && !track.trackId && (
                        <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                          ⚠️ File missing
                        </p>
                      )}
                    </div>
                    <div className="track-controls">
                      {track.url && <audio controls src={track.url}></audio>}
                      <span className="duration">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        className={`edit-btn ${
                          !track.detailsCompleted ? "incomplete" : ""
                        }`}
                        onClick={() => {
                          if (!track.file && !track.trackId) {
                            toast.dark("⚠️ This track file is missing. Please delete and re-upload.", {
                              autoClose: 3000,
                            });
                            return;
                          }
                          handleEditTrack(track, idx);
                        }}
                        disabled={!track.file && !track.trackId}
                        style={{
                          opacity: (!track.file && !track.trackId) ? 0.5 : 1,
                          cursor: (!track.file && !track.trackId) ? "not-allowed" : "pointer",
                        }}
                      >
                        Edit {!track.detailsCompleted && "⚠️"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(track.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
          />
        </div>
      </div>

      <div className="btn-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/create-release")}
        >
          Back
        </button>
        <button
          className="btn-gradient"
          disabled={
            tracks.length === 0 || tracks.some((t) => !t.detailsCompleted)
          }
          onClick={handleNextStep}
          style={{
            cursor:
              tracks.length === 0 || tracks.some((t) => !t.detailsCompleted)
                ? "not-allowed"
                : "pointer",
            opacity:
              tracks.length === 0 || tracks.some((t) => !t.detailsCompleted)
                ? 0.6
                : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UploadTracks;
