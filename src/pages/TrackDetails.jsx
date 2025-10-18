


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TrackDetails.css";

const allLanguages = [
  "Ahirani","Arabic","Assamese","Awadhi","Banjara","Bengali","Bhojpuri","Burmese",
  "Chhattisgarhi","Chinese","Dogri","English","French","Garhwali","Garo","Gujarati",
  "Haryanvi","Himachali","Hindi","Iban","Indonesian","Instrumental","Italian",
  "Japanese","Javanese","Kannada","Kashmiri","Khasi","Kokborok","Konkani","Korean",
  "Kumauni","Latin","Maithili","Malay","Malayalam","Mandarin","Manipuri","Marathi",
  "Marwari","Naga","Nagpuri","Nepali","Odia","Pali","Persian","Punjabi","Rajasthani",
  "Sainthili","Sambalpuri","Sanskrit","Santali","Sindhi","Sinhala","Spanish","Swahili",
  "Tamil","Telugu","Thai","Tibetan","Tulu","Turkish","Ukrainian","Urdu","Zxx"
];

const TrackDetails = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [trackTitle, setTrackTitle] = useState("");
  const [catalogId, setCatalogId] = useState("");
  const [lyricsLanguage, setLyricsLanguage] = useState("");
  const [lyricsLanguageOption, setLyricsLanguageOption] = useState("");
  const [filteredLanguages, setFilteredLanguages] = useState(allLanguages);
  const [showDropdown, setShowDropdown] = useState(false);

  const [crbts, setCrbts] = useState([{ hours: "00", minutes: "00", seconds: "00" }]);
  const [isrcOption, setIsrcOption] = useState("no");
  const [isrcCode, setIsrcCode] = useState("");
  const [explicitStatus, setExplicitStatus] = useState("");

  // Contributors states
  const [showicons, setShowIcons] = useState(true);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const locationState = window.history.state?.usr || {};
  const { track } = locationState;

  if (track) {
    setTrackTitle(track.trackTitle || track.name || "");
    setCatalogId(track.catalogId || "");
    setLyricsLanguage(track.lyricsLanguage || "");
    setLyricsLanguageOption(track.lyricsLanguageOption || "");
    setExplicitStatus(track.explicitStatus || "");
    setCrbts(track.crbts || [{ hours: "00", minutes: "00", seconds: "00" }]);
    setIsrcOption(track.isrcOption || "no");
    setIsrcCode(track.isrcCode || "");
  }
}, []);


  const handleInputFocus = () => {
    setFilteredLanguages(allLanguages);
    setShowDropdown(true);
  };

  const handleInputChange = (value) => {
    setLyricsLanguage(value);
    setFilteredLanguages(allLanguages.filter(lang => lang.toLowerCase().startsWith(value.toLowerCase())));
    setShowDropdown(true);
  };

  const handleAddCrbt = () => setCrbts([...crbts, { hours: "00", minutes: "00", seconds: "00" }]);
  const handleDeleteCrbt = (index) => {
    if (crbts.length > 1) setCrbts(crbts.filter((_, i) => i !== index));
  };
  const handleCrbtChange = (index, field, value) => {
    const updated = [...crbts];
    updated[index][field] = value;
    setCrbts(updated);
  };

  const resetForm = () => {
    setTrackTitle("");
    setCatalogId("");
    setLyricsLanguage("");
    setLyricsLanguageOption("");
    setFilteredLanguages(allLanguages);
    setShowDropdown(false);
    setCrbts([{ hours: "00", minutes: "00", seconds: "00" }]);
    setIsrcOption("no");
    setIsrcCode("");
    setExplicitStatus("");
  };


  const handleSaveAndContinue = () => {
  const locationState = window.history.state?.usr || {}; // <-- get track info passed from navigate
  const { track, trackIdx } = locationState;

  const trackData = {
    ...track, // preserve id, url, etc.
    trackTitle,
    catalogId,
    lyricsLanguageOption,
    lyricsLanguage:
      lyricsLanguageOption === "Select Language" ? lyricsLanguage : "",
    explicitStatus:
      lyricsLanguageOption === "Select Language" ? explicitStatus : "",
    crbts,
    isrcOption,
    isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
    detailsCompleted: true,
  };

  let tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");

  if (typeof trackIdx === "number" && tracks[trackIdx]) {
    // ✅ Update existing track
    tracks[trackIdx] = trackData;
  } else {
    // ✅ Add only if new (not edit)
    tracks.push(trackData);
  }

  localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

  resetForm();
  navigate("/upload-tracks");
};



  return (
    // <div className="page-container">
      <div className="track-details-container ">
        <h2 className="track-title">Track Details</h2>

        <div className="section-container section">
          {/* <h3 className="track-title">Tracks</h3> */}
          <label className="section-title " style={{ marginLeft: "10%" }}>Track Title <span className="primary-required">*</span></label>
          <input style={{ width: "50%" }} className="input-group" type="text" placeholder="e.g. I got my summer"  value={trackTitle} onChange={e => setTrackTitle(e.target.value)} />

          <label className="section-title" style={{ marginLeft: "10%" }}>Version</label>
          <input style={{ width: "50%" }} type="text" placeholder="e.g. 3.0" className="input-group" value={catalogId} onChange={e => setCatalogId(e.target.value)} />
        </div>

        {/* Contributors Section */}
        <div className="section">
          <h3>Artists</h3>
          {showicons && (
            <div className="contributors-buttons">
              <button className="btn-secondary">+ Add Main Primary Artist</button>
              <button className="btn-secondary">+ Add Producer</button>
              <button className="btn-secondary">+ Add Director</button>
              <button className="btn-secondary">+ Add Composer</button>
              <button className="btn-secondary">+ Add Lyricist</button>
            </div>
          )}
        </div>

        {/* Lyrics Language */}
        <div className="section-container section">
          <label className="section-title">Language of Lyrics</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="lyricsOption" value="Select Language" checked={lyricsLanguageOption === "Select Language"} onFocus={handleInputFocus} onChange={e => setLyricsLanguageOption(e.target.value)} />
              Select Language
            </label>
            <label>
              <input type="radio" name="lyricsOption" value="Instrumental" checked={lyricsLanguageOption === "Instrumental"} onChange={e => setLyricsLanguageOption(e.target.value)} />
              Instrumental
            </label>
          </div>

          {lyricsLanguageOption === "Select Language" && (
            <div ref={dropdownRef} style={{ position: "relative", marginTop: "10px", width: "100%" }}>
              <input style={{ width: "50%" }}  type="text" placeholder="Select Language *" value={lyricsLanguage} onChange={e => handleInputChange(e.target.value)} className="form-input" />
              {showDropdown && filteredLanguages.length > 0 && (
                <ul className="dropdown-list">
                  {filteredLanguages.map((lang, idx) => (
                    <li key={idx} onClick={() => { setLyricsLanguage(lang); setShowDropdown(false); }}>{lang}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>


        {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
                        <div className="section-container section">
                          <label className="section-title">Explicit Content</label>
                          <div className="radio-group" style={{ flexDirection: "column" }}>
                            {["Explicit", "Not Explicit", "Cleaned"].map((label, idx) => (
                              <div key={idx} style={{ marginBottom: "10px" }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <input
                                  
                                    type="radio"
                                    value={label}
                                    checked={explicitStatus === label}
                                    onChange={() => setExplicitStatus(label)}
                                  />
                                  {label}
                                </label>

                                {/* ✅ Show description only when selected */}
                                {explicitStatus === label && (
                                  <p style={{ 
                                    marginLeft: "25px", 
                                    fontSize: "13px", 
                                    color: "#666", 
                                    marginTop: "4px" 
                                  }}>
                                    {label === "Explicit" &&
                                      "The track lyrics or title include explicit language (such as drug references, sexual, violent or discriminatory language, swearing etc.) not suitable for children."}
                                    {label === "Not Explicit" &&
                                      "The track does NOT include any explicit language in lyrics or title."}
                                    {label === "Cleaned" &&
                                      "The track was originally explicit but has been cleaned."}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}


        {/* CRBT */}
       <div className="section section-container">
            <label className="section-title">CRBT</label>
            {crbts.map((crbt, index) => (
              <div key={index} className="crbt-row-wrapper">
                <div className="crbt-row">
                  {["hours","minutes","seconds"].map((unit, i) => (
                    <React.Fragment key={i}>
                      <select
                        className="time-select"
                        value={crbt[unit]}
                        onChange={(e) => handleCrbtChange(index, unit, e.target.value)}
                      >
                        {Array.from({ length: unit==="hours"?24:60 }, (_, n) => (
                          <option key={n} value={n.toString().padStart(2,"0")}>
                            {n.toString().padStart(2,"0")}
                          </option>
                        ))}
                      </select>
                      {i < 2 && <span>:</span>}
                    </React.Fragment>
                  ))}
                  {crbts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteCrbt(index)}
                      className="btn-secondary"
                    >
                      Remove
                    </button>
                  )}
                </div>

      {/* Labels under dropdowns */}
      <div className="crbt-labels">
        <span>HH</span>
        <span>MM</span>
        <span>SS</span>
      </div>
    </div>
  ))}
</div>


        {/* ISRC */}
        <div className="section-container">
          <label className="section-title">Do you have an ISRC?</label>
          <div className="radio-group">
            <label><input type="radio" name="isrc" value="no" checked={isrcOption==="no"} onChange={()=>setIsrcOption("no")} /> No</label>
            <label><input type="radio" name="isrc" value="yes" checked={isrcOption==="yes"} onChange={()=>setIsrcOption("yes")} /> Yes</label>
          </div>
          {isrcOption === "yes" && <input type="text" placeholder="Enter ISRC Code" className="form-input" value={isrcCode} onChange={e => setIsrcCode(e.target.value)} />}
        </div>

        <div className="tracks-details-buttons">
          <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/upload-tracks")} // Navigate back
              >
                Cancel
          </button>
        <button type="button" className="new-release-button" onClick={handleSaveAndContinue}>
          Save & Continue
        </button>
        </div>
          
      </div>
    // </div>
  );
};

export default TrackDetails;
