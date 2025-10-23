
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/PreviewDistributePage.css";
import previewImg from "../assets/lsi.jpeg";

export default function PreviewDistributePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stores = location.state?.stores || [];
  const [showPopup, setShowPopup] = useState(false);

  const handleFinalSubmit = () => setShowPopup(true);
  const handleConfirm = () => {
    setShowPopup(false);
    navigate(0);
  };
  const handleCancel = () => setShowPopup(false);

  const tracks = [
    { id: 1, title: "Happy Days - Micky J Meyer", audioUrl: "/tracks/track1.mp3", duration: "05:51" },
    { id: 2, title: "Happy Days - Micky J Meyer", audioUrl: "/tracks/track2.mp3", duration: "03:58" },
  ];

 const publishers = [
  
  { id: 1, name: "XYZ Records", symbol: "℗" },          // ℗ for sound recording
  { id: 2, name: "ABC Music Publishing", symbol: "©" }, 
];



  const [status, setStatus] = useState("Pending"); // Default statu


return (
  <div className="pages-layout-container">
    
    {/* ===== Page Title ===== */}
    <h2 className="pages-main-title">
      Preview & Distribute
      <span className={`status-bar status ${status.toLowerCase()}`}> {status}</span>
    </h2>

    {/* ===== Preview Content Container ===== */}
    <div className="preview-container">

      {/* ===== Main Content Wrapper ===== */}
      <div className="main-content-wrapper">

        {/* ===== Left Column ===== */}
        <div className="prev-left-column">

          {/* --- Release Info --- */}
          <div className="release-info-top section-container">
            <div className="metadata-row">
              <span className="meta-label">Title</span>
              <span className="meta-value">Happy Days</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Artist</span>
              <span className="meta-value">Micky J Meyer</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Label</span>
              <span className="meta-value">Vivo</span>
            </div>
          </div>

          {/* --- Tracks Section --- */}
          <div className="tracks-section section-container">
            {/* <h3>Tracks</h3> */}
            {tracks.map((track) => (
              <div className="track-card" key={track.id}>
                <div className="metadata-row">
                  <span className="meta-label"> {track.id}</span>
                  <span className="meta-value">{track.title}</span>
                </div>
                <div className="duration-player-row">
                  <span>{track.duration}</span>
                  <audio controls>
                    <source src={track.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))}
          </div>

          {/* --- Metadata Section --- */}
          <div className="metadata-container section-container">
            {/* <h3>Metadata</h3> */}
            <div className="metadata-row">
              <span className="meta-label">Language</span>
              <span className="meta-value">English</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Primary Genre</span>
              <span className="meta-value">Alternative/Experimental</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Secondary Genre</span>
              <span className="meta-value">Experimental</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Explicit Lyrics</span>
              <span className="meta-value">Yes</span>
            </div>
          </div>

          {/* --- Release Dates & Codes --- */}
          <div className="metadata-codes-container section-container">
            {/* <h3>Release Dates & Codes</h3> */}
            <div className="metadata-row">
              <span className="meta-label">Digital Release Date</span>
              <span className="meta-value">15/02/2025</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Original Release Date</span>
              <span className="meta-value">15/02/2025</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">ISRC Code</span>
              <span className="meta-value">AA18079998989</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">UPC Code</span>
              <span className="meta-value">AA18079998989</span>
            </div>
            <div className="metadata-row">
              <span className="meta-label">Stores</span>
              <span className="meta-value">
                {stores.length > 0 ? stores.join(", ") : "No stores selected"}
              </span>
            </div>

          </div>
<div className="metadata-copyright section-container">
  {/* <h3>Publishers and Copyright</h3> */}
  {publishers.map((pub) => (
    <div className="metadata-row" key={pub.id}>
      <span className="meta-label">{pub.symbol}</span>
      <span className="meta-value">{pub.name}</span>
    </div>
  ))}
</div>



        </div>

        {/* ===== Right Column: Cover Image ===== */}
        <div className="prev-right-column">
          <img src={previewImg} alt="Cover" className="prev-cover-image" />
        </div>

      </div>

      {/* ===== Action Buttons ===== */}
      <div className="action-buttons">
        <button className="btn-cancel" onClick={() => navigate(-1)}>Back</button>
        <button className="btn-gradient" onClick={handleFinalSubmit}>Final Submit</button>
      </div>

    </div>

    {/* ===== Confirmation Popup ===== */}
    {showPopup && (
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>Confirm Final Submission</h3>
          <p>Are you sure you want to submit your release for distribution?</p>
          <div className="popup-actions">
            <button className="btn-gradient" onClick={handleConfirm}>Yes, Submit</button>
            <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )}

  </div>
);

}






