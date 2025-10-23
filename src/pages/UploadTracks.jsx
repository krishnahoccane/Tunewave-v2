
// hooks and libraries
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import { toast, ToastContainer } from "react-toastify";


// css
import "../styles/UploadTracks.css";
import "react-toastify/dist/ReactToastify.css";


// assets
import defaultCover from "../assets/coverArt.jpg";




const UploadTracks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const releaseMetadata = location.state || {};
  const [tracks, setTracks] = useState(() =>
    JSON.parse(localStorage.getItem("uploadedTracks") || "[]")
  );
  const [draggedTrackIdx, setDraggedTrackIdx] = useState(null);
  const fileInputRef = useRef(null);

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
        toast.error(`❌ ${file.name} is not a valid format.`);
        return;
      }

      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);
      audio.onloadedmetadata = () => {
        const newTrack = {
          id: Date.now() + Math.random(),
          name: file.name,
          format: file.type,
          url: audioURL,
          duration: audio.duration,
          metadata: {},
          detailsCompleted: false,
        };
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

  // Proceed to next page
  const handleNextStep = () => {
    if (tracks.length === 0) {
      toast.dark("⚠️ Please upload at least one track before continuing.");
      return;
    }

    if (tracks.some((t) => !t.detailsCompleted)) {
      toast.dark("ℹ️ Please complete track details before proceeding.");
      return;
    }

    localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

    navigate("/select-stores", {
      state: { ...releaseMetadata, tracks },
    });
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
                <p><strong>Album Name</strong></p>
                <p>{releaseMetadata.title || "Tunewave"}</p>
              </div>
              <div className="preview-item">
                <p><strong>Main Primary Artist</strong></p>
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
              toast.error("Only FLAC and WAV files are allowed.");
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
                      <span className="duration">{formatDuration(track.duration)}</span>
                      <button
                        className={`edit-btn ${!track.detailsCompleted ? "incomplete" : ""}`}
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

          <div
            className="form-actions"
            >
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/create-release")}
              >
                Back
              </button>
              <button
                className="btn-gradient"
                disabled={tracks.length === 0 || tracks.some((t) => !t.detailsCompleted)}
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
