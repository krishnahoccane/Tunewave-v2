// hooks and libraries
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// css
// import "../styles/UploadTracks.css";
import "react-toastify/dist/ReactToastify.css";

// assets
import defaultCover from "../assets/coverArt.jpg";

// Services
import * as TracksService from "../services/tracks";
import * as FilesService from "../services/files";

// Global File objects storage that persists across component remounts
const globalFileObjects = new Map();

const UploadTracks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get release metadata from location state or localStorage as fallback
  const releaseMetadataFromState = location.state || {};
  const releaseMetadataFromStorage = JSON.parse(
    localStorage.getItem("releaseMetadata") || "{}"
  );
  const releaseMetadata = Object.keys(releaseMetadataFromState).length > 0 
    ? releaseMetadataFromState 
    : releaseMetadataFromStorage;
  
  // Debug logging
  console.log("UploadTracks - releaseMetadata from state:", releaseMetadataFromState);
  console.log("UploadTracks - releaseMetadata from storage:", releaseMetadataFromStorage);
  console.log("UploadTracks - final releaseMetadata:", releaseMetadata);
  console.log("UploadTracks - releaseId:", releaseMetadata.releaseId);
  
  const [tracks, setTracks] = useState(() =>
    JSON.parse(localStorage.getItem("uploadedTracks") || "[]")
  );
  const [draggedTrackIdx, setDraggedTrackIdx] = useState(null);
  const fileInputRef = useRef(null);
  const fileObjectsRef = useRef(globalFileObjects);
  const [isProcessing, setIsProcessing] = useState(false);

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

    files.forEach((file) => {
      if (!validFormats.includes(file.type)) {
        toast.dark(`❌ ${file.name} is not a valid format.`);
        return;
      }

      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);

      audio.onloadedmetadata = () => {
        const trackId = Date.now() + Math.random();
        const newTrack = {
          id: trackId,
          name: file.name,
          format: file.type,
          url: audioURL,
          duration: audio.duration,
          metadata: {},
          detailsCompleted: false,
        };
        
        // Store File object for later upload
        fileObjectsRef.current.set(trackId, file);
        globalFileObjects.set(trackId, file);
        
        newTracks.push(newTrack);

        if (newTracks.length === files.length) {
          const updatedTracks = [...tracks, ...newTracks];
          saveTracksToStorage(updatedTracks);
        }
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
    // Also remove File object
    fileObjectsRef.current.delete(id);
    globalFileObjects.delete(id);
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

  // Proceed to next page - Create tracks and upload files via API
  const handleNextStep = async () => {
    if (tracks.length === 0) {
      toast.dark("⚠️ Please upload at least one track before continuing.");
      return;
    }

    if (tracks.some((t) => !t.detailsCompleted)) {
      toast.dark("ℹ️ Please complete track details before proceeding.");
      return;
    }

    const releaseId = releaseMetadata.releaseId;
    if (!releaseId) {
      toast.dark("⚠️ Release ID not found. Please go back and create release first.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.dark("Please login to continue.");
      return;
    }

    setIsProcessing(true);
    toast.dark("Creating tracks and uploading files...", { autoClose: false });

    try {
      // Step 0: Get existing tracks to find next available trackNumber
      let nextTrackNumber = 1;
      try {
        // Method 1: Try to get tracks from release endpoint (includes tracks array)
        const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const releaseData = releaseResponse.data?.release || releaseResponse.data;
        
        // Check if tracks are included in release response
        let existingTracks = [];
        if (releaseData?.tracks && Array.isArray(releaseData.tracks)) {
          existingTracks = releaseData.tracks;
        } else {
          // Method 2: Fetch tracks using tracks service
          try {
            const tracksResponse = await TracksService.getTracksByReleaseId(releaseId);
            existingTracks = Array.isArray(tracksResponse) ? tracksResponse : 
                           (tracksResponse?.tracks || tracksResponse?.data || []);
          } catch (tracksError) {
            console.warn("Could not fetch tracks via service, trying trackIds:", tracksError);
            // Method 3: Fallback to fetching by trackIds
            const existingTrackIds = releaseData?.trackIds || [];
            if (existingTrackIds.length > 0) {
              const trackPromises = existingTrackIds.map(trackId =>
                TracksService.getTrackById(trackId).catch(() => null)
              );
              existingTracks = (await Promise.all(trackPromises)).filter(t => t !== null);
            }
          }
        }
        
        // Extract all trackNumbers from existing tracks
        const existingTrackNumbers = existingTracks
          .map(t => t.trackNumber)
          .filter(n => n !== undefined && n !== null && n > 0);
        
        if (existingTrackNumbers.length > 0) {
          // Find the highest trackNumber and start from next
          const maxTrackNumber = Math.max(...existingTrackNumbers);
          nextTrackNumber = maxTrackNumber + 1;
          console.log(`Found ${existingTrackNumbers.length} existing tracks. Max trackNumber: ${maxTrackNumber}, starting from: ${nextTrackNumber}`);
        } else {
          console.log("No existing tracks found, starting from trackNumber 1");
        }
      } catch (fetchError) {
        console.warn("Could not fetch existing tracks, starting from trackNumber 1:", fetchError);
      }
      
      const createdTracks = [];
      
      // Process each track
      for (let idx = 0; idx < tracks.length; idx++) {
        const track = tracks[idx];
        
        try {
          // Step 1: Create track via API
          const durationSeconds = Math.floor(track.duration || 0);
          if (!durationSeconds || durationSeconds <= 0) {
            throw new Error(`Invalid duration for track "${track.trackTitle || track.name}"`);
          }

          const assignedTrackNumber = nextTrackNumber++;
          console.log(`Assigning trackNumber ${assignedTrackNumber} to track "${track.trackTitle || track.name}"`);
          
          const trackData = {
            releaseId: releaseId,
            trackNumber: assignedTrackNumber, // Use next available trackNumber and increment
            title: track.trackTitle || track.name || `Track ${idx + 1}`,
            durationSeconds: durationSeconds,
            explicitFlag: track.explicitStatus === "Explicit" || false,
            isrc: track.isrcCode && track.isrcCode.trim() !== "" ? track.isrcCode.trim() : null,
            language: track.lyricsLanguage && track.lyricsLanguage.trim() !== "" ? track.lyricsLanguage.trim() : null,
            trackVersion: track.catalogId && track.catalogId.trim() !== "" ? track.catalogId.trim() : null,
            primaryArtistId: 0,
            audioFileId: 0,
          };

          const createdTrack = await TracksService.createTrack(trackData);
          const trackId = createdTrack.trackId || createdTrack.id;
          
          if (!trackId) {
            throw new Error(`Failed to create track ${idx + 1}: No trackId returned`);
          }

        // Step 2: Upload file if available
        let audioFileId = 0;
        const fileObject = fileObjectsRef.current.get(track.id);
        
        if (fileObject) {
          try {
            // Step 2a: Upload file directly to API
            console.log(`Uploading file for track ${idx + 1}:`, {
              releaseId,
              trackId,
              fileName: fileObject.name,
              fileSize: fileObject.size,
            });
            
            const uploadResult = await FilesService.uploadFileDirectly({
              releaseId: Number(releaseId),
              trackId: Number(trackId),
              fileType: "Audio",
              file: fileObject,
            });
            
            console.log(`File upload response:`, uploadResult);

            const fileId = uploadResult?.fileId || uploadResult?.id;
            
            if (!fileId || fileId === 0) {
              console.error(`No fileId in upload response:`, uploadResult);
              throw new Error("File upload failed: No fileId returned");
            }

            // Step 2b: Complete file upload
            const completeData = {
              fileId: Number(fileId),
              checksum: uploadResult?.checksum || "",
              fileSize: Number(fileObject.size),
              cloudfrontUrl: uploadResult?.cloudfrontUrl || uploadResult?.url || "",
              backupUrl: uploadResult?.backupUrl || "",
            };
            
            console.log(`Completing file upload for track ${idx + 1}:`, completeData);
            
            const completeResult = await FilesService.completeFileUpload(completeData);
            
            console.log(`Complete file upload response:`, completeResult);
            
            // Get fileId from complete result or use the one from upload
            audioFileId = completeResult?.fileId || completeResult?.id || fileId;
            
            if (audioFileId && audioFileId > 0) {
              // Update track with audioFileId
              await TracksService.updateTrack(trackId, { audioFileId });
            } else {
              // Fallback: use fileId from initiate
              audioFileId = fileId;
              await TracksService.updateTrack(trackId, { audioFileId });
            }
          } catch (uploadError) {
            console.error(`Failed to upload file for track ${idx + 1}:`, uploadError);
            console.error(`Upload error details:`, {
              status: uploadError.response?.status,
              statusText: uploadError.response?.statusText,
              data: uploadError.response?.data,
              message: uploadError.message,
              config: {
                url: uploadError.config?.url,
                method: uploadError.config?.method,
                data: uploadError.config?.data,
              },
            });
            const errorMsg = uploadError.response?.data?.message || 
                           uploadError.response?.data?.error || 
                           uploadError.message || 
                           "Network Error";
            throw new Error(`Failed to upload audio file for "${track.trackTitle || track.name}": ${errorMsg}`);
          }
        }

          // Ensure audioFileId is set correctly
          const finalAudioFileId = audioFileId && audioFileId > 0 ? audioFileId : 0;
          
          createdTracks.push({
            ...track,
            trackId: trackId,
            audioFileId: finalAudioFileId,
          });
          
          console.log(`Track ${idx + 1} processed: trackId=${trackId}, audioFileId=${finalAudioFileId}`);
        } catch (trackError) {
          console.error(`Error processing track ${idx + 1}:`, trackError);
          const errorMsg = trackError.response?.data?.message || trackError.message || "Unknown error";
          throw new Error(`Failed to process track "${track.trackTitle || track.name}": ${errorMsg}`);
        }
      }

      // Step 3: Update release with trackIds
      const trackIds = createdTracks.map(t => t.trackId).filter(id => id);
      if (trackIds.length > 0) {
        const token = localStorage.getItem("jwtToken");
        await axios.post(`/api/releases/${releaseId}`, {
          trackIds: trackIds,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.dismiss();
      toast.success("✅ Tracks created and files uploaded successfully!", { autoClose: 3000 });
      
      localStorage.setItem("uploadedTracks", JSON.stringify(createdTracks));
      navigate("/select-stores", {
        state: { ...releaseMetadata, tracks: createdTracks },
      });
    } catch (error) {
      console.error("Error creating tracks:", error);
      toast.dismiss();
      toast.dark(`Error: ${error.message || "Failed to create tracks"}. Please try again.`, { autoClose: 5000 });
    } finally {
      setIsProcessing(false);
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
                    </div>
                    <div className="track-controls">
                      <audio controls src={track.url}></audio>
                      <span className="duration">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        className={`edit-btn ${
                          !track.detailsCompleted ? "incomplete" : ""
                        }`}
                        onClick={() => handleEditTrack(track, idx)}
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
            isProcessing ||
            tracks.length === 0 || 
            tracks.some((t) => !t.detailsCompleted)
          }
          onClick={handleNextStep}
          style={{
            cursor:
              isProcessing ||
              tracks.length === 0 || 
              tracks.some((t) => !t.detailsCompleted)
                ? "not-allowed"
                : "pointer",
            opacity:
              isProcessing ||
              tracks.length === 0 || 
              tracks.some((t) => !t.detailsCompleted)
                ? 0.6
                : 1,
          }}
        >
          {isProcessing ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default UploadTracks;
