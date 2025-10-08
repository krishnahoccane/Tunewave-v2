import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ReleaseMetadataPage.css";

const ReleaseMetadataPage = () => {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("English");
  const [digitalDate, setDigitalDate] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  //const [lyricsLanguage, setLyricsLanguage] = useState("English");
  const [lyricsLanguageOption, setLyricsLanguageOption] = useState("Select Language");
  const [explicitStatus, setExplicitStatus] = useState(""); // Explicit / Not Explicit
  const [showPopup, setShowPopup] = useState(false);
  const [titleGradient, setTitleGradient] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);

//   const handleNext = () => { navigate("/upload-tracks"), 
//     console.log({
//       language,
//       digitalDate,
//       originalDate,
//       lyricsLanguageOption,
//       lyricsLanguage,
//       explicitStatus,
//     });
const handleNext = () => {
    navigate("/upload-tracks", {
      state: {
        language,
        digitalDate,
        originalDate,
        //lyricsLanguageOption,
        //lyricsLanguage,
        explicitStatus,
      },
    });
  };

  const handleCloseClick = () => {
    setShowPopup(true);
  };

  const handleConfirmLeave = () => {
    setTitleGradient(true);
    navigate("/dashboard");
  };

  const handleCancelLeave = () => {
    setShowPopup(false);
  };

  return (
    <div className="release-metadata-container">
      <div className="release-metadata-card">
        {/* Just the cross symbol */}
        <span
          className="close-button"
          onClick={handleCloseClick}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          ×
        </span>

        <h2 className={`page-title ${titleGradient ? "gradient-title" : ""}`}>
          Create A New Release
        </h2>

        <div className="step">02 / 5</div>

        {/* Toggle Switch Section */}
        <div className="toggle-switch">
          <span>Please Release Information From Track Metadata</span>
          <label className="toggle-switch-label">
            <input
              type="checkbox"
              checked={showMetadata}
              onChange={() => setShowMetadata(!showMetadata)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Show/Hide metadata content */}
        {showMetadata && (
          <>
            {/* Metadata Language */}
            <div className="language-container">
              <div className="language-box">
                <label>Metadata Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {/* Date Fields */}
            <div className="date-container">
              <div className="date-box">
                <label>Digital Release Date *</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={digitalDate}
                  onChange={(e) => setDigitalDate(e.target.value)}
                />
              </div>

              <div className="date-box">
                <label>Original Release Date *</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={originalDate}
                  onChange={(e) => setOriginalDate(e.target.value)}
                />
              </div>
            </div>

            {/* Language of Lyrics */}
            {/* <div className="language-container">
              <div className="language-box">
                <label>Language of Lyrics</label>
                <div className="radio-group" style={{ gap: "12px" }}>
                  <label>
                    <input
                      type="radio"
                      name="lyricsLanguageOption"
                      value="Select Language"
                      checked={lyricsLanguageOption === "Select Language"}
                      onChange={(e) => setLyricsLanguageOption(e.target.value)}
                    />
                    Select Language
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="lyricsLanguageOption"
                      value="Instrumental"
                      checked={lyricsLanguageOption === "Instrumental"}
                      onChange={(e) => setLyricsLanguageOption(e.target.value)}
                    />
                    Instrumental
                  </label>
                </div>

                {lyricsLanguageOption === "Select Language" && (
                  <select
                    value={lyricsLanguage}
                    onChange={(e) => setLyricsLanguage(e.target.value)}
                    style={{ marginTop: "10px" }}
                  >
                    <option value="">Select Language *</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                )}
              </div>
            </div> */}
          </>
        )}

        {/* Explicit Content Container */}
        {lyricsLanguageOption === "Instrumental" && (
          <div
            className="language-container"
            style={{
              flexDirection: "column",
              padding: "20px",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <div className="language-box">
              <div className="section-title">Explicit Content *</div>

              <div className="radio-group" style={{ flexDirection: "column", gap: "12px" }}>
                <label>
                  <input
                    type="radio"
                    name="explicitStatus"
                    value="Explicit"
                    checked={explicitStatus === "Explicit"}
                    onChange={() => setExplicitStatus("Explicit")}
                  />
                  Explicit
                </label>
                {explicitStatus === "Explicit" && (
                  <p style={{ fontSize: "13px", color: "#555", marginLeft: "20px", marginTop: "4px" }}>
                    The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children.
                  </p>
                )}

                <label>
                  <input
                    type="radio"
                    name="explicitStatus"
                    value="Not Explicit"
                    checked={explicitStatus === "Not Explicit"}
                    onChange={() => setExplicitStatus("Not Explicit")}
                  />
                  Not Explicit
                </label>
                {explicitStatus === "Not Explicit" && (
                  <p style={{ fontSize: "13px", color: "#555", marginLeft: "20px", marginTop: "4px" }}>
                    The track does NOT include any explicit language in lyrics or title.
                  </p>
                )}
              </div>

              <p
                className="explicit-note"
                style={{ marginTop: "12px", fontSize: "13px", color: "#555" }}
              >
                If your track contains explicit content, you MUST mark it as “Explicit”. Otherwise, your release may be rejected when you attempt to distribute it.
              </p>
            </div>
          </div>
        )}

        {/* UPC Field */}
        <div className="form-group upc-field">
          <label>UPC (Universal Product Code) *</label>
          <input type="text" value="" placeholder="Enter UPC" />
        </div>

        {/* Next Button */}
        <button className="new-release-button next-btn" onClick={handleNext}>
          Next
        </button>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Do you want to leave this page?</p>
            <div className="popup-buttons">
              <button className="yes-button" onClick={handleConfirmLeave}>
                Yes
              </button>
              <button className="no-button" onClick={handleCancelLeave}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReleaseMetadataPage;
