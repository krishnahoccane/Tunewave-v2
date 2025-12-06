import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TrackDetails.css";

import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import ContributorsSection from "../components/ContributorsSection.jsx";
const allLanguages = [
  "Ahirani",
  "Arabic",
  "Assamese",
  "Awadhi",
  "Banjara",
  "Bengali",
  "Bhojpuri",
  "Burmese",
  "Chhattisgarhi",
  "Chinese",
  "Dogri",
  "English",
  "French",
  "Garhwali",
  "Garo",
  "Gujarati",
  "Haryanvi",
  "Himachali",
  "Hindi",
  "Iban",
  "Indonesian",
  "Instrumental",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kashmiri",
  "Khasi",
  "Kokborok",
  "Konkani",
  "Korean",
  "Kumauni",
  "Latin",
  "Maithili",
  "Malay",
  "Malayalam",
  "Mandarin",
  "Manipuri",
  "Marathi",
  "Marwari",
  "Naga",
  "Nagpuri",
  "Nepali",
  "Odia",
  "Pali",
  "Persian",
  "Punjabi",
  "Rajasthani",
  "Sainthili",
  "Sambalpuri",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Sinhala",
  "Spanish",
  "Swahili",
  "Tamil",
  "Telugu",
  "Thai",
  "Tibetan",
  "Tulu",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Zxx",
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

  const [crbts, setCrbts] = useState([
    { hours: "00", minutes: "00", seconds: "00" },
  ]);
  const [isrcOption, setIsrcOption] = useState("no");
  const [isrcCode, setIsrcCode] = useState("");
  const [explicitStatus, setExplicitStatus] = useState("");

  // Contributors states
  const [showicons, setShowIcons] = useState(true);
  const [contributors, setContributors] = useState({
    primaryArtist: [],
    producer: [],
    director: [],
    composer: [],
    lyricist: [],
  });

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
    const { track, trackIdx } = locationState;

    // First, try to restore from localStorage (for navigation back)
    try {
      const savedTrackData = localStorage.getItem(`trackDetails_${trackIdx}`);
      if (savedTrackData) {
        const savedData = JSON.parse(savedTrackData);
        console.log(`[TrackDetails] Restoring all fields from localStorage for trackIdx ${trackIdx}:`, savedData);
        
        // Restore all fields from localStorage
        if (savedData.trackTitle !== undefined) setTrackTitle(savedData.trackTitle);
        if (savedData.catalogId !== undefined) setCatalogId(savedData.catalogId);
        if (savedData.lyricsLanguage !== undefined) setLyricsLanguage(savedData.lyricsLanguage);
        if (savedData.lyricsLanguageOption !== undefined) setLyricsLanguageOption(savedData.lyricsLanguageOption);
        if (savedData.explicitStatus !== undefined) setExplicitStatus(savedData.explicitStatus);
        if (savedData.crbts && Array.isArray(savedData.crbts)) setCrbts(savedData.crbts);
        if (savedData.isrcOption !== undefined) setIsrcOption(savedData.isrcOption);
        if (savedData.isrcCode !== undefined) setIsrcCode(savedData.isrcCode);
        if (savedData.contributors) {
          if (typeof savedData.contributors === 'object' && !Array.isArray(savedData.contributors)) {
            setContributors(savedData.contributors);
          } else if (Array.isArray(savedData.contributors)) {
            // Convert array format to object format
            const contributorsObj = {
              primaryArtist: [],
              producer: [],
              director: [],
              composer: [],
              lyricist: [],
            };
            savedData.contributors.forEach((contrib) => {
              const category = contrib.type === "Main Primary Artist" ? "primaryArtist" : 
                              contrib.type?.toLowerCase() || "primaryArtist";
              if (contributorsObj.hasOwnProperty(category)) {
                contributorsObj[category].push({
                  name: contrib.name,
                  profiles: contrib.linkedProfiles || contrib.profiles || {},
                });
              }
            });
            setContributors(contributorsObj);
          }
        }
        console.log(`[TrackDetails] ✅ All fields restored from localStorage`);
        return; // Use localStorage data, don't override with track data
      }
    } catch (error) {
      console.warn("[TrackDetails] Failed to load track details from localStorage:", error);
    }

    // If no localStorage data, use track data from navigation state
    if (track) {
      setTrackTitle(track.trackTitle || track.name || "");
      setCatalogId(track.catalogId || "");
      setLyricsLanguage(track.lyricsLanguage || "");
      setLyricsLanguageOption(track.lyricsLanguageOption || "");
      setExplicitStatus(track.explicitStatus || "");
      setCrbts(track.crbts || [{ hours: "00", minutes: "00", seconds: "00" }]);
      setIsrcOption(track.isrcOption || "no");
      setIsrcCode(track.isrcCode || "");
      
      // Restore contributors if available
      if (track.contributors) {
        if (typeof track.contributors === 'object' && !Array.isArray(track.contributors)) {
          setContributors(track.contributors);
        } else if (Array.isArray(track.contributors)) {
          // Convert array format to object format
          const contributorsObj = {
            primaryArtist: [],
            producer: [],
            director: [],
            composer: [],
            lyricist: [],
          };
          track.contributors.forEach((contrib) => {
            const category = contrib.type === "Main Primary Artist" ? "primaryArtist" : 
                            contrib.type?.toLowerCase() || "primaryArtist";
            if (contributorsObj.hasOwnProperty(category)) {
              contributorsObj[category].push({
                name: contrib.name,
                profiles: contrib.linkedProfiles || contrib.profiles || {},
              });
            }
          });
          setContributors(contributorsObj);
        }
      }
    }
  }, []);

  // Save form data to localStorage whenever fields change
  useEffect(() => {
    const locationState = window.history.state?.usr || {};
    const { trackIdx } = locationState;
    
    if (trackIdx === undefined || trackIdx === null) return;
    
    const saveTrackData = () => {
      try {
        const trackDataToSave = {
          trackTitle,
          catalogId,
          lyricsLanguage,
          lyricsLanguageOption,
          explicitStatus,
          crbts,
          isrcOption,
          isrcCode,
          contributors,
        };
        
        localStorage.setItem(`trackDetails_${trackIdx}`, JSON.stringify(trackDataToSave));
        console.log("💾 Auto-saved track details to localStorage for trackIdx:", trackIdx);
      } catch (error) {
        console.warn("Failed to save track details to localStorage:", error);
      }
    };
    
    // Debounce saves
    const timeoutId = setTimeout(saveTrackData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    trackTitle,
    catalogId,
    lyricsLanguage,
    lyricsLanguageOption,
    explicitStatus,
    JSON.stringify(crbts),
    isrcOption,
    isrcCode,
    JSON.stringify(contributors),
  ]);

  const handleInputFocus = () => {
    setFilteredLanguages(allLanguages);
    setShowDropdown(true);
  };

  const handleInputChange = (value) => {
    setLyricsLanguage(value);
    setFilteredLanguages(
      allLanguages.filter((lang) =>
        lang.toLowerCase().startsWith(value.toLowerCase())
      )
    );
    setShowDropdown(true);
  };

  const handleAddCrbt = () =>
    setCrbts([...crbts, { hours: "00", minutes: "00", seconds: "00" }]);
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
    setContributors({
      primaryArtist: [],
      producer: [],
      director: [],
      composer: [],
      lyricist: [],
    });
  };

  //   const handleSaveAndContinue = () => {
  //   const locationState = window.history.state?.usr || {};
  //   const { track, trackIdx } = locationState;

  //   const trackData = {
  //     ...track,
  //     trackTitle,
  //     catalogId,
  //     lyricsLanguageOption,
  //     lyricsLanguage:
  //       lyricsLanguageOption === "Select Language" ? lyricsLanguage : "",
  //     explicitStatus:
  //       lyricsLanguageOption === "Select Language" ? explicitStatus : "",
  //     crbts,
  //     isrcOption,
  //     isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
  //     detailsCompleted: true,
  //   };

  //   let tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");

  //   if (typeof trackIdx === "number" && tracks[trackIdx]) {

  //     tracks[trackIdx] = trackData;
  //   } else {

  //     tracks.push(trackData);
  //   }

  //   localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

  //   resetForm();
  //   navigate("/upload-tracks");
  // };

  const handleSaveAndContinue = () => {
    // 🧾 Validation for required fields
    if (!trackTitle.trim()) {
      toast.dark("Please enter the Track Title.", { transition: Slide });
      return;
    }

    if (lyricsLanguageOption === "") {
      toast.dark("Please select Lyrics Language option.", {
        transition: Slide,
      });
      return;
    }

    if (lyricsLanguageOption === "Select Language" && !lyricsLanguage.trim()) {
      toast.dark("Please select the Language of Lyrics.", {
        transition: Slide,
      });
      return;
    }

    if (lyricsLanguageOption === "Select Language" && !explicitStatus) {
      toast.dark("Please select Explicit Content status.", {
        transition: Slide,
      });
      return;
    }

    if (isrcOption === "yes" && !isrcCode.trim()) {
      toast.dark("Please enter ISRC Code.", { transition: Slide });
      return;
    }

    // ✅ If validation passes
    const locationState = window.history.state?.usr || {};
    const { track, trackIdx } = locationState;

    const trackData = {
      ...track,
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
      contributors, // Include contributors in track data
      detailsCompleted: true,
    };

    let tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");

    if (typeof trackIdx === "number" && tracks[trackIdx]) {
      tracks[trackIdx] = trackData;
    } else {
      tracks.push(trackData);
    }

    localStorage.setItem("uploadedTracks", JSON.stringify(tracks));
    
    // Also save to track-specific localStorage for restoration
    if (typeof trackIdx === "number") {
      const trackDataToSave = {
        trackTitle: trackTitle.trim(),
        catalogId: catalogId.trim(),
        lyricsLanguage,
        lyricsLanguageOption,
        explicitStatus,
        crbts,
        isrcOption,
        isrcCode: isrcOption === "yes" ? isrcCode.trim() : "",
        contributors,
      };
      localStorage.setItem(`trackDetails_${trackIdx}`, JSON.stringify(trackDataToSave));
    }

    toast.dark("Track details saved successfully!", { position: "top-center" });
    resetForm();
    navigate("/upload-tracks");
  };

  // Ensure valid time input and auto-format to 2 digits
  const handleCrbtInputChange = (index, unit, value) => {
    let num = value.replace(/\D/g, ""); // remove non-digits
    if (num === "") num = "00";

    const limit = unit === "hours" ? 23 : 59;
    if (parseInt(num, 10) > limit) num = limit.toString();

    const updated = [...crbts];
    updated[index][unit] = num.slice(0, 2).padStart(2, "0");
    setCrbts(updated);
  };

  const handleTimeBlur = (index, unit, value) => {
    let formatted = value.padStart(2, "0");
    const updated = [...crbts];
    updated[index][unit] = formatted;
    setCrbts(updated);
  };

  return (
    // <div className="page-container">
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Track Details</h2>

      <div className="section-container section">
        {/* <h3 className="track-title">Tracks</h3> */}
        <label className="section-title " style={{ marginLeft: "10%" }}>
          Track Title <span className="primary-required">*</span>
        </label>
        <input
          style={{ width: "50%" }}
          className="input-group"
          type="text"
          placeholder="e.g. I got my summer"
          value={trackTitle}
          onChange={(e) => setTrackTitle(e.target.value)}
        />

        <label className="section-title" style={{ marginLeft: "10%" }}>
          Version
        </label>
        <input
          style={{ width: "50%" }}
          type="text"
          placeholder="e.g. 3.0"
          className="input-group"
          value={catalogId}
          onChange={(e) => setCatalogId(e.target.value)}
        />
      </div>

      {/* Contributors Section */}
      {/* <div className="section">
        <h3>Artists</h3>
        {showicons && (
          <div className="contributors-buttons">
            <button className="btn-cancel">+ Add Main Primary Artist</button>
            <button className="btn-cancel">+ Add Producer</button>
            <button className="btn-cancel">+ Add Director</button>
            <button className="btn-cancel">+ Add Composer</button>
            <button className="btn-cancel">+ Add Lyricist</button>
          </div>
        )}
      </div> */}
        <ContributorsSection 
          contributors={contributors}
          onContributorsChange={setContributors}
        />
      {/* Lyrics Language */}
      <div className="section-container section">
        <label className="section-title">Language of Lyrics <span className="required">*</span></label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="lyricsOption"
              value="Select Language"
              checked={lyricsLanguageOption === "Select Language"}
              onFocus={handleInputFocus}
              onChange={(e) => setLyricsLanguageOption(e.target.value)}
            />
            Select Language
          </label>
          <label>
            <input
              type="radio"
              name="lyricsOption"
              value="Instrumental"
              checked={lyricsLanguageOption === "Instrumental"}
              onChange={(e) => setLyricsLanguageOption(e.target.value)}
            />
            Instrumental
          </label>
        </div>

        {lyricsLanguageOption === "Select Language" && (
          <div
            ref={dropdownRef}
            style={{ position: "relative", marginTop: "10px", width: "100%" }}
          >
            <input
              style={{ width: "50%" }}
              type="text"
              placeholder="Select Language *"
              value={lyricsLanguage}
              onChange={(e) => handleInputChange(e.target.value)}
              className="form-input"
            />
            {showDropdown && filteredLanguages.length > 0 && (
              <ul className="dropdown-list">
                {filteredLanguages.map((lang, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setLyricsLanguage(lang);
                      setShowDropdown(false);
                    }}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {lyricsLanguageOption === "Select Language" && lyricsLanguage && (
        <div className="section-container section">
          <label className="section-title">Explicit Content <span className="required">*</span></label>
          <div className="radio-group" style={{ flexDirection: "column" }}>
            {["Explicit", "Not Explicit", "Cleaned"].map((label, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <label
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
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
                  <p
                    style={{
                      marginLeft: "25px",
                      fontSize: "13px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
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
              {["hours", "minutes", "seconds"].map((unit, i) => (
                <React.Fragment key={i}>
                  <input
                    type="number"
                    className="time-input"
                    value={crbt[unit]}
                    onChange={(e) =>
                      handleCrbtInputChange(index, unit, e.target.value)
                    }
                    min={0}
                    max={unit === "hours" ? 23 : 59}
                    onBlur={(e) => handleTimeBlur(index, unit, e.target.value)}
                  />
                  {i < 2 && <span>:</span>}
                </React.Fragment>
              ))}
              {crbts.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteCrbt(index)}
                  className="btn-cancel"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="crbt-labels">
          <span>
            <p>HH</p>
          </span>
          <span>
            <p>MM</p>
          </span>
          <span>
            <p>SS</p>
          </span>
        </div>
      </div>

      {/* Labels under dropdowns */}

      {/* ISRC */}
      <div className="section-container">
        <label className="section-title">Do you have an ISRC?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="isrc"
              value="no"
              checked={isrcOption === "no"}
              onChange={() => setIsrcOption("no")}
            />{" "}
            No
          </label>
          <label>
            <input
              type="radio"
              name="isrc"
              value="yes"
              checked={isrcOption === "yes"}
              onChange={() => setIsrcOption("yes")}
            />{" "}
            Yes
          </label>
        </div>
        {isrcOption === "yes" && (
          <input
            type="text"
            placeholder="Enter ISRC Code"
            className="form-input"
            value={isrcCode}
            onChange={(e) => setIsrcCode(e.target.value)}
          />
        )}
      </div>

      <div className="popup-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/upload-tracks")} // Navigate back
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn-gradient"
          onClick={handleSaveAndContinue}
        >
          Save & Continue
        </button>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
    // </div>
  );
};

export default TrackDetails;
