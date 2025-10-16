// import React, { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "../styles/UploadTracks.css";

// const UploadTracks = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const releaseMetadata = location.state || {};
//   const [tracks, setTracks] = useState(() =>
//     JSON.parse(localStorage.getItem("uploadedTracks") || "[]")
//   );
//   const [draggedTrackIdx, setDraggedTrackIdx] = useState(null);
//   const fileInputRef = useRef(null);

//   // Save tracks to local storage
//   const saveTracksToStorage = (tracksArr) => {
//     setTracks(tracksArr);
//     localStorage.setItem("uploadedTracks", JSON.stringify(tracksArr));
//   };

//   // Safely format seconds into mm:ss, tolerating invalid values
//   const formatDuration = (seconds) => {
//     if (typeof seconds !== "number" || !isFinite(seconds) || seconds < 0) {
//       return "--:--";
//     }
//     const totalSeconds = Math.floor(seconds);
//     const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
//     const secs = String(totalSeconds % 60).padStart(2, "0");
//     return `${minutes}:${secs}`;
//   };

//   // Handle file upload
//   const handleTrackUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const validFormats = ["audio/flac", "audio/wav"];

//     const newTracks = [];

//     files.forEach((file) => {
//       if (!validFormats.includes(file.type)) {
//         alert(`File ${file.name} is not a valid format.`);
//         return;
//       }

//       const audioURL = URL.createObjectURL(file);
//       const audio = new Audio(audioURL);
//       audio.onloadedmetadata = () => {
//         const newTrack = {
//           id: Date.now() + Math.random(),
//           name: file.name,
//           format: file.type,
//           url: audioURL,
//           duration: audio.duration,
//           metadata: {},
//           detailsCompleted: false, // Flag to track if user filled details
//         };
//         newTracks.push(newTrack);

//         if (newTracks.length === files.length) {
//           const updatedTracks = [...tracks, ...newTracks];
//           saveTracksToStorage(updatedTracks);
//         }
//       };
//     });
//   };

//   const handleUploadSectionClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = null;
//       fileInputRef.current.click();
//     }
//   };

//   const handleDelete = (id) => {
//     const updatedTracks = tracks.filter((track) => track.id !== id);
//     saveTracksToStorage(updatedTracks);
//   };

//   // When user clicks Edit, pass track info
//   const handleEditTrack = (track, idx) => {
//     navigate("/track-details", {
//       state: { track, trackIdx: idx },
//     });
//   };

//   // Drag & Drop handlers
//   const handleDragStart = (idx) => setDraggedTrackIdx(idx);
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (idx) => {
//     if (draggedTrackIdx === null || draggedTrackIdx === idx) return;
//     const updatedTracks = [...tracks];
//     const [removed] = updatedTracks.splice(draggedTrackIdx, 1);
//     updatedTracks.splice(idx, 0, removed);
//     setTracks(updatedTracks);
//     setDraggedTrackIdx(null);
//   };

//   // Next Step
//   const handleNextStep = () => {
//     localStorage.setItem("uploadedTracks", JSON.stringify(tracks));
//     navigate("/preview-distribute", {
//       state: { ...releaseMetadata, tracks },
//     });
//   };

//   return (
//     <div className="upload-container">
//       <h2 className="title">Upload Tracks</h2>

//       <div className="upload-box">
//         <h3 className="tracks-heading">Tracks</h3>

//         <div
//           className="upload-section"
//           onClick={handleUploadSectionClick}
//           style={{ cursor: "pointer" }}
//         >
//           <div className="upload-area">
//             <p className="upload-title">Upload Tracks</p>
//             <p className="upload-subtitle">Format: FLAC or WAV</p>
//             <p className="upload-requirements">
//               Requirements: Minimum 16 bit, 44.1 KHz, stereo <br />
//               Recommended 24 bits, 48KHz or 24 bits, 96KHz
//             </p>
//           </div>
//           <input
//             type="file"
//             accept=".flac,.wav"
//             multiple
//             style={{ display: "none" }}
//             ref={fileInputRef}
//             onChange={handleTrackUpload}
//           />
//         </div>

//         {tracks.length > 0 && (
//           <div className="uploaded-tracks-list">
//             {tracks.map((track, idx) => (
//               <div
//                 key={track.id}
//                 className="track-card"
//                 draggable
//                 onDragStart={() => handleDragStart(idx)}
//                 onDragOver={handleDragOver}
//                 onDrop={() => handleDrop(idx)}
//                 style={{
//                   opacity: draggedTrackIdx === idx ? 0.5 : 1,
//                   cursor: "move",
//                 }}
//               >
//                 <div className="track-info" style={{ textAlign: "center" }}>
//                   <strong>Upload Track {idx + 1}</strong>
//                   <p>{track.name}</p>
//                 </div>
//                 <div className="track-controls">
//                   <audio controls src={track.url}></audio>
//                   <span className="duration">{formatDuration(track.duration)}</span>
//                   <button
//                     className={`edit-btn ${
//                       !track.detailsCompleted ? "incomplete" : ""
//                     }`}
//                     onClick={() => handleEditTrack(track, idx)}
//                   >
//                     Edit { !track.detailsCompleted && "⚠️" }
//                   </button>
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(track.id)}
//                   >
//                     🗑
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {tracks.length < 1 && (
//           <p style={{ color: "red" }}>Please upload at least one track.</p>
//         )}

//         <button
//           className="new-release-button"
//           disabled={tracks.some((t) => !t.detailsCompleted)}
//           style={{
//             marginLeft: "40%",
//             marginTop: "10px",
//             cursor: tracks.some((t) => !t.detailsCompleted)
//               ? "not-allowed"
//               : "pointer",
//             opacity: tracks.some((t) => !t.detailsCompleted) ? 0.5 : 1,
//           }}
//           onClick={handleNextStep}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadTracks;






import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/UploadTracks.css";


import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

//   useEffect(() => {
//   localStorage.removeItem("uploadedTracks");
//   setTracks([]);
// }, []);

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

  // ✅ Proceed to next page
  const handleNextStep = () => {
    if (tracks.length === 0) {
       toast.warn("⚠️ Please upload at least one track before continuing.");
      return;
      }

    if (tracks.some((t) => !t.detailsCompleted)) {
        toast.info("ℹ️ Please complete track details before proceeding.");
        return;
      }


    localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

    navigate("/select-stores", {
      state: { ...releaseMetadata, tracks },
    });
  };


  
  return (
    <div className="upload-container">

      <h2 className="title">Upload Tracks</h2>

      {/* <div className="upload-box">
        <h3 className="tracks-heading">Tracks</h3>



        <div
          className="upload-section"
          onClick={handleUploadSectionClick}
          style={{ cursor: "pointer" }}
        >
          <div className="upload-area">
            <p className="upload-title">Upload Tracks</p>
            <p className="upload-subtitle">Format: FLAC or WAV</p>
            <p className="upload-requirements">
              Requirements: Minimum 16 bit, 44.1 KHz, stereo <br />
              Recommended 24 bits, 48KHz or 24 bits, 96KHz
            </p>
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
                  <strong>Upload Track {idx + 1}</strong>
                  <p>{track.name}</p>
                </div>
                <div className="track-controls">
                  <audio controls src={track.url}></audio>
                  <span className="duration">{formatDuration(track.duration)}</span>
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

        {tracks.length === 0 && (
          <p style={{ color: "red", textAlign: "center" }}>
            Please upload at least one track.
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "right", marginTop: "20px", gap: "12px" }}>
          <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/create-release")} // Go back to previous page
                >
                  Back
            </button>
          <button
            className="new-release-button"
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
        <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
      </div> */}
      <div className="upload-box">
  <div className="upload-content">
    {/* LEFT SIDE — PREVIEW SECTION */}
<div className="preview-section">
  <h3 className="preview-header">Release Preview</h3>

  <div className="preview-content">
    <div className="cover-art-container">
      <img
        src={releaseMetadata.coverArt || defaultCover}
        alt="Cover Art"
        className="cover-art-image"
      />
    </div>

    <div className="preview-item"><strong>Title:</strong> {releaseMetadata.title || "—"}</div>
    <div className="preview-item"><strong>Version:</strong> {releaseMetadata.version || "—"}</div>
    <div className="preview-item"><strong>Contributors:</strong> {releaseMetadata.contributors || "—"}</div>
    <div className="preview-item"><strong>Genre:</strong> {releaseMetadata.genre || "—"}</div>
    <div className="preview-item"><strong>Digital Release:</strong> {releaseMetadata.digitalRelease || "—"}</div>
    <div className="preview-item"><strong>Original Release Date:</strong> {releaseMetadata.originalDate || "—"}</div>

    <h4 style={{ marginTop: "1rem", color: "#222" }}>Tracks</h4>
    {tracks.length > 0 ? (
      tracks.map((track, idx) => (
        <div key={idx} className="preview-item">
          <strong>Track {idx + 1}</strong><br />
          Title: {track.metadata?.title || "—"} <br />
          Version: {track.metadata?.version || "—"} <br />
          Language: {track.metadata?.language || "—"} <br />
          Artists: {track.metadata?.artists || "—"} <br />
          CRBT: {track.metadata?.crbt || "—"}
        </div>
      ))
    ) : (
      <p className="no-preview">No tracks uploaded yet.</p>
    )}
  </div>
</div>


    {/* RIGHT SIDE — EXISTING UPLOAD UI */}
    <div className="upload-section-wrapper">
      <h3 className="tracks-heading">Upload Tracks</h3>

      <div
        className="upload-section"
        onClick={handleUploadSectionClick}
        style={{ cursor: "pointer" }}
      >
        <div className="upload-area">
          <p className="upload-title">Upload Tracks</p>
          <p className="upload-subtitle">Format: FLAC or WAV</p>
          <p className="upload-requirements">
            Requirements: Minimum 16 bit, 44.1 KHz, stereo <br />
            Recommended 24 bits, 48KHz or 24 bits, 96KHz
          </p>
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
                <strong>Upload Track {idx + 1}</strong>
                <p>{track.name}</p>
              </div>
              <div className="track-controls">
                <audio controls src={track.url}></audio>
                <span className="duration">{formatDuration(track.duration)}</span>
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

      <div
        style={{
          display: "flex",
          justifyContent: "right",
          marginTop: "20px",
          gap: "12px",
        }}
      >
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate("/create-release")}
        >
          Back
        </button>
        <button
          className="new-release-button"
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
  </div>
  <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} />
</div>

    </div>
  );
};

export default UploadTracks;