// // // import React, { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import "../styles/PreviewDistributePage.css";

// // // const PreviewDistributePage = () => {
// // //   const navigate = useNavigate();
// // //   const [showAddLinkPopup, setShowAddLinkPopup] = useState(false);
// // //   const [showAttachFilePopup, setShowAttachFilePopup] = useState(false);

// // //   const [links, setLinks] = useState([]);
// // //   const [files, setFiles] = useState([]);
// // //   const [currentLink, setCurrentLink] = useState("");
// // //   const [currentFile, setCurrentFile] = useState(null);

// // //   const handleAddLink = () => {
// // //     if (currentLink.trim()) {
// // //       setLinks([...links, currentLink.trim()]);
// // //       setCurrentLink("");
// // //       setShowAddLinkPopup(false);
// // //     }
// // //   };

// // //   const handleAttachFile = () => {
// // //     if (currentFile) {
// // //       setFiles([...files, currentFile]);
// // //       setCurrentFile(null);
// // //       setShowAttachFilePopup(false);
// // //     }
// // //   };

// // //   const handleRemove = (index, type) => {
// // //     if (type === "link") {
// // //       setLinks(links.filter((_, i) => i !== index));
// // //     } else {
// // //       setFiles(files.filter((_, i) => i !== index));
// // //     }
// // //   };

// // //   const helpText = `If you used free beats or samples from YouTube or from elsewhere, please add the link(s) or attach relevant files here so we can process your release faster.
// // // The beat(s) are 100% self-produced & Original`;

// // //   return (
// // //     <div className="preview-container">
// // //       <div className="preview-card">
// // //         {/* Left-top back symbol */}
// // //         <span
// // //           className="back-button"
// // //           onClick={() => navigate(-1)}
// // //           style={{
// // //             position: "absolute",
// // //             left: "20px",
// // //             top: "20px",
// // //             cursor: "pointer",
// // //             fontSize: "24px",
// // //             fontWeight: "bold",
// // //           }}
// // //         >
// // //           ⏴
// // //         </span>

// // //         {/* Right-top cross symbol */}
// // //         <span
// // //           className="close-button"
// // //           onClick={() => alert("Close clicked!")}
// // //           style={{
// // //             position: "absolute",
// // //             right: "20px",
// // //             top: "20px",
// // //             cursor: "pointer",
// // //             fontSize: "24px",
// // //             fontWeight: "bold",
// // //           }}
// // //         >
// // //           ×
// // //         </span>

// // //         <h2 className="page-title" style={{ textAlign: "center" }}>
// // //           Preview & Distribute
// // //         </h2>

// // //         <div className="preview-details">
// // //           <div><strong>Title:</strong> Happy days</div>
// // //           <div><strong>Artist:</strong> Micky j meyer</div>
// // //           <div><strong>Label:</strong> Vivo</div>

// // //           <hr />

// // //           <div><strong>Track 1:</strong> Happy days - Micky j meyer 8008008 (05:51)</div>
// // //           <div><strong>Track 2:</strong> Happy days - Micky j meyer 8008008 (03:58)</div>

// // //           <hr />

// // //           <div><strong>Language:</strong> English</div>
// // //           <div><strong>Primary Genre:</strong> Alternative/Experimental</div>
// // //           <div><strong>Explicit Lyrics:</strong> Yes</div>
// // //           <div><strong>Secondary Genre:</strong> Experimental</div>
// // //           <div><strong>Copyright:</strong> 2025 ABC</div>
// // //           <div><strong>Digital Release Date:</strong> 15/02/2025</div>
// // //           <div><strong>Publishing rights:</strong> 2025 aBABAB</div>
// // //           <div><strong>Original Release Date:</strong> 15/02/2025</div>
// // //           <div><strong>ISRC Code:</strong> AA18079998989</div>
// // //           <div>
// // //             <strong>Stores:</strong>{" "}
// // //             <button
// // //               className="new-release-button"
// // //               onClick={() => navigate("/four-page")}
// // //             >
// // //               View Store
// // //             </button>
// // //           </div>
// // //           <div><strong>UPC Code:</strong> AA18079998989</div>

// // //           <hr />

// // //           <div>
// // //             <strong>Free Beat(s) / Samples:</strong>
// // //             <p>{helpText}</p>
// // //             <div style={{ display: "flex", gap: "10px" }}>
// // //               <button
// // //                 className="new-release-button"
// // //                 onClick={() => setShowAddLinkPopup(true)}
// // //               >
// // //                 + Add Link
// // //               </button>
// // //               <button
// // //                 className="new-release-button"
// // //                 onClick={() => setShowAttachFilePopup(true)}
// // //               >
// // //                 + Attach File
// // //               </button>
// // //             </div>

// // //             <div className="attachments-list" style={{ marginTop: "10px" }}>
// // //               {links.map((link, i) => (
// // //                 <div key={i} className="attachment-item">
// // //                   {link}
// // //                   <button
// // //                     className="remove-button"
// // //                     onClick={() => handleRemove(i, "link")}
// // //                   >
// // //                     Remove
// // //                   </button>
// // //                 </div>
// // //               ))}

// // //               {files.map((file, i) => (
// // //                 <div key={i} className="attachment-item">
// // //                   {file.name}
// // //                   <button
// // //                     className="remove-button"
// // //                     onClick={() => handleRemove(i, "file")}
// // //                   >
// // //                     Remove
// // //                   </button>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           {/* Submit & Cancel Buttons */}
// // //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
// // //             <button
// // //               className="btn-secondary"
// // //               onClick={() => navigate("/dashboard")} // ✅ redirect to dashboard
// // //             >
// // //               Cancel
// // //             </button>
// // //             <button
// // //               className="new-release-button"
// // //               onClick={() => alert("Submitted!")}
// // //             >
// // //               Submit
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Add Link Popup */}
// // //       {showAddLinkPopup && (
// // //         <div className="popup-overlay">
// // //           <div className="popup-content">
// // //             <h3>Add Free Beat / Sample Link</h3>
// // //             <p>{helpText}</p>

// // //             <input
// // //               type="text"
// // //               placeholder="Enter Link"
// // //               value={currentLink}
// // //               onChange={(e) => setCurrentLink(e.target.value)}
// // //               style={{
// // //                 width: "100%",
// // //                 padding: "10px",
// // //                 marginBottom: "20px",
// // //                 borderRadius: "8px",
// // //                 border: "1px solid #ccc",
// // //               }}
// // //             />

// // //             <div className="popup-buttons">
// // //               <button className="new-release-button" onClick={handleAddLink}>
// // //                 Add Link
// // //               </button>
// // //               <button className="btn-secondary" onClick={() => setShowAddLinkPopup(false)}>
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Attach File Popup */}
// // //       {showAttachFilePopup && (
// // //         <div className="popup-overlay">
// // //           <div className="popup-content">
// // //             <h3>Attach Free Beat / Sample File</h3>
// // //             <p>{helpText}</p>

// // //             <input
// // //               type="file"
// // //               onChange={(e) => setCurrentFile(e.target.files[0])}
// // //               style={{ marginBottom: "20px" }}
// // //             />

// // //             <div className="popup-buttons">
// // //               <button className="new-release-button" onClick={handleAttachFile}>
// // //                 Attach File
// // //               </button>
// // //               <button className="btn-secondary" onClick={() => setShowAttachFilePopup(false)}>
// // //                 Cancel
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default PreviewDistributePage;
// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import "../styles/PreviewDistributePage.css";

// // const PreviewDistributePage = () => {
// //   const navigate = useNavigate();

// //   // Popups
// //   const [showDistributionPopup, setShowDistributionPopup] = useState(false);
// //   const [showStoresPopup, setShowStoresPopup] = useState(false);
// //   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

// //   // Distribution selection
// //   const [distribution, setDistribution] = useState("");
// //   const [selectedStores, setSelectedStores] = useState([]);

// //   // Stores list
// //   const storesList = ["Spotify", "Apple Music", "Amazon Music", "Tidal", "Deezer", "YouTube Music"];

// //   const handleStoreToggle = (store) => {
// //     if (selectedStores.includes(store)) {
// //       setSelectedStores(selectedStores.filter((s) => s !== store));
// //     } else {
// //       setSelectedStores([...selectedStores, store]);
// //     }
// //   };

// //   const handleDistributionSelect = (value) => {
// //     if (value === "manual") {
// //       setShowStoresPopup(true);
// //     } else {
// //       setDistribution(value);
// //     }
// //     setShowDistributionPopup(false);
// //   };

// //   const handleFinalSubmit = () => {
// //     setShowSuccessPopup(true);
// //     setTimeout(() => {
// //       setShowSuccessPopup(false);
// //       navigate("/dashboard");
// //     }, 5000); // 5 seconds
// //   };

// //   return (
// //     <div className="preview-container">
// //       <div className="preview-card">
// //         {/* Back button */}
// //         <span className="back-button" onClick={() => navigate(-1)}>
// //           ⏴
// //         </span>

// //         <h2 className="page-title">Preview & Distribute</h2>

// //         <div className="preview-details">
// //           {/* Track/Release Details */}
// //           <div><strong>Title:</strong> Happy Days</div>
// //           <div><strong>Artist:</strong> Micky J Meyer</div>
// //           <div><strong>Label:</strong> Vivo</div>

// //           <hr />

// //           <div><strong>Track 1:</strong> Happy Days - Micky J Meyer 8008008 (05:51)</div>
// //           <div><strong>Track 2:</strong> Happy Days - Micky J Meyer 8008008 (03:58)</div>

// //           <hr />

// //           <div><strong>Language:</strong> English</div>
// //           <div><strong>Primary Genre:</strong> Alternative/Experimental</div>
// //           <div><strong>Secondary Genre:</strong> Experimental</div>
// //           <div><strong>Explicit Lyrics:</strong> Yes</div>
// //           <div><strong>Copyright:</strong> 2025 ABC</div>
// //           <div><strong>Digital Release Date:</strong> 15/02/2025</div>
// //           <div><strong>Publishing rights:</strong> 2025 aBABAB</div>
// //           <div><strong>Original Release Date:</strong> 15/02/2025</div>
// //           <div><strong>ISRC Code:</strong> AA18079998989</div>
// //           <div><strong>UPC Code:</strong> AA18079998989</div>

// //           {/* Show selected distribution */}
// //           {distribution && (
// //             <div className="distribution-display">
// //               <strong>Distribution:</strong>{" "}
// //               {distribution === "manual"
// //                 ? `Selected Manually: ${selectedStores.join(", ")}`
// //                 : distribution.charAt(0).toUpperCase() + distribution.slice(1)}
// //             </div>
// //           )}

// //           <hr />

// //           {/* Action buttons */}
// //           <div className="action-buttons">
// //             <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
// //               Cancel
// //             </button>
// //             <button className="btn-secondary" onClick={() => setShowDistributionPopup(true)}>
// //               Submit
// //             </button>
// //             <button className="btn-secondary final-submit-btn" onClick={handleFinalSubmit}>
// //               Final Submit
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Distribution Popup */}
// //       {showDistributionPopup && (
// //         <div className="popup-overlay">
// //           <div className="popup-content distribution-popup">
// //             <h3>Select Distribution</h3>
// //             <div className="distribution-options">
// //               <label>
// //                 <input type="radio" name="distribution" onChange={() => handleDistributionSelect("including")} />
// //                 <span>Including YouTube</span>
// //               </label>
// //               <label>
// //                 <input type="radio" name="distribution" onChange={() => handleDistributionSelect("excluding")} />
// //                 <span>Excluding YouTube</span>
// //               </label>
// //               <label>
// //                 <input type="radio" name="distribution" onChange={() => handleDistributionSelect("only youtube")} />
// //                 <span>Only YouTube</span>
// //               </label>
// //               <label>
// //                 <input type="radio" name="distribution" onChange={() => handleDistributionSelect("manual")} />
// //                 <span>Select Manually</span>
// //               </label>
// //             </div>
// //             <button className="btn-secondary" onClick={() => setShowDistributionPopup(false)}>Save</button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Stores Popup */}
// //       {showStoresPopup && (
// //         <div className="popup-overlay">
// //           <div className="popup-content stores-popup">
// //             <h3>Select Stores</h3>
// //             <div className="stores-options">
// //               {storesList.map((store, idx) => (
// //                 <label key={idx}>
// //                   <input type="checkbox" checked={selectedStores.includes(store)} onChange={() => handleStoreToggle(store)} />
// //                   <span>{store}</span>
// //                 </label>
// //               ))}
// //             </div>
// //             <button
// //               className="btn-secondary"
// //               onClick={() => {
// //                 setDistribution("manual");
// //                 setShowStoresPopup(false);
// //               }}
// //             >
// //               Save
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Success Popup */}
// //       {showSuccessPopup && (
// //         <div className="popup-overlay success-popup">
// //           <div className="popup-content">
// //             <h3>Submitted Successfully!</h3>
// //             <p>You will be redirected to Dashboard shortly.</p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PreviewDistributePage;





































// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/PreviewDistributePage.css";

// export default function PreviewDistributePage() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const stores = location.state?.stores || [];

//   const [showPopup, setShowPopup] = useState(false);

//   const handleFinalSubmit = () => setShowPopup(true);
//   const handleConfirm = () => {
//     setShowPopup(false);
//     navigate("/dashboard");
//   };
//   const handleCancel = () => setShowPopup(false);

//   return (
//     <div className="preview-full-page">
      
//       <div className="preview-content">
//         <div className="back-button" onClick={() => navigate(-1)}>
//         &larr; Back
//       </div>

//       <h2 className="page-title">Preview & Distribute</h2>

//         {/* Top Release Info: Title, Artist, Label */}
//         <div className="release-info-top">
//           <div><strong>Title:</strong> Happy Days</div>
//           <div><strong>Artist:</strong> Micky J Meyer</div>
//           <div><strong>Label:</strong> Vivo</div>
//         </div>

//         {/* Tracks */}
//         <div className="release-info-card">
//           <h3>Tracks</h3>
//           <div className="track-preview-container">
//             <div className="track-card">
//               <div><strong>Track 1:</strong></div>
//               <div>Happy Days - Micky J Meyer 8008008</div>
//               <div>05:51</div>
//             </div>
//             <div className="track-card">
//               <div><strong>Track 2:</strong></div>
//               <div>Happy Days - Micky J Meyer 8008008</div>
//               <div>03:58</div>
//             </div>
//           </div>
//         </div>

//         {/* Metadata */}
//         <div className="release-info-card">
//           <h3>Metadata</h3>
//           <div><strong>Language:</strong> English</div>
//           <div><strong>Primary Genre:</strong> Alternative/Experimental</div>
//           <div><strong>Explicit Lyrics:</strong> Yes</div>
//           <div><strong>Secondary Genre:</strong> Experimental</div>
//         </div>

//         {/* Release Dates & Stores */}
//         <div className="release-info-card">
//           <h3>Release Dates & Codes</h3>
//           <div><strong>Digital Release Date:</strong> 15/02/2025</div>
//           <div><strong>Original Release Date:</strong> 15/02/2025</div>
//           <div><strong>ISRC Code:</strong> AA18079998989</div>
//           <div><strong>UPC Code:</strong> AA18079998989</div>
//           <div><strong>Stores:</strong> {stores.length > 0 ? stores.join(", ") : "No stores selected"}</div>
//         </div>

//         {/* Action Buttons */}
//         <div className="action-buttons-fullpage">
//           <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
//           <button className="btn-secondary btn-final-submit" onClick={handleFinalSubmit}>
//             Final Submit
//           </button>
//         </div>

//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="popup-overlay">
//           <div className="popup-content">
//             <h3>Confirm Final Submission</h3>
//             <p>Are you sure you want to submit your release for distribution?</p>
//             <button className="btn-secondary" onClick={handleConfirm}>
//               Yes, Submit
//             </button>
//             <button className="btn-secondary cancel-btn" onClick={handleCancel}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
















import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/PreviewDistributePage.css";
import previewImg from "../assets/preview.png";

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

  const [status, setStatus] = useState("Pending"); // Default status

  return (
    <div className="full-page-container">
      <div className="content-container">

              {/* Page Title */}
            <div className="page-title-container">
              <h2 className="page-title-left">Preview & Distribute</h2>
                                  <span className={`status-bar status ${status.toLowerCase()}`}> {status}</span>
              </div>
                              
                  
        {/* Main content wrapper */}
        <div className="main-content-wrapper">
          {/* Left Column */}
          <div className="left-column">
            {/* Release Info */}
            <div className="release-info-top">

              <div className="metadata-row">
                <span className="meta-label">
                  Title:</span> 
                  <span className="meta-value">
                    Happy Days  
                      </span>
                      </div>
              <div className="metadata-row"><span className="meta-label">Artist:</span> <span className="meta-value">Micky J Meyer</span></div>
              <div className="metadata-row"><span className="meta-label">Label:</span> <span className="meta-value">Vivo</span></div>
            </div>

            {/* Tracks */}
            <div className="tracks-section">
              <h3>Tracks</h3>
              {tracks.map(track => (
                <div className="track-card" key={track.id}>
                  <div className="metadata-row">
                    <span className="meta-label">Track {track.id}:</span>
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

            {/* Metadata */}
            <div className="metadata-container">
              <h3>Metadata</h3>
              <div className="metadata-row"><span className="meta-label">Language:</span> <span className="meta-value">English</span></div>
              <div className="metadata-row"><span className="meta-label">Primary Genre:</span> <span className="meta-value">Alternative/Experimental</span></div>
              <div className="metadata-row"><span className="meta-label">Secondary Genre:</span> <span className="meta-value">Experimental</span></div>
              <div className="metadata-row"><span className="meta-label">Explicit Lyrics:</span> <span className="meta-value">Yes</span></div>

              <h3>Release Dates & Codes</h3>
              <div className="metadata-row"><span className="meta-label">Digital Release Date:</span> <span className="meta-value">15/02/2025</span></div>
              <div className="metadata-row"><span className="meta-label">Original Release Date:</span> <span className="meta-value">15/02/2025</span></div>
              <div className="metadata-row"><span className="meta-label">ISRC Code:</span> <span className="meta-value">AA18079998989</span></div>
              <div className="metadata-row"><span className="meta-label">UPC Code:</span> <span className="meta-value">AA18079998989</span></div>
              <div className="metadata-row"><span className="meta-label">Stores:</span> <span className="meta-value">{stores.length > 0 ? stores.join(", ") : "No stores selected"}</span></div>
            </div>
          </div>

          {/* Right Column: Cover Image */}
          <div className="right-column">
            <img src={previewImg} alt="Cover" className="cover-image" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
          <button className="new-release-button" onClick={handleFinalSubmit}>Final Submit</button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Confirm Final Submission</h3>
            <p>Are you sure you want to submit your release for distribution?</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "right", justifyContent: "right" }}>
              <button className="new-release-button" onClick={handleConfirm}>Yes, Submit</button>
              <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
