import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TrackDetails.css";

import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as FilesService from "../services/files";
import * as TracksService from "../services/tracks";

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

  const handleSaveAndContinue = async () => {
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

    // Get releaseId from localStorage
    const releaseId = parseInt(localStorage.getItem("currentReleaseId"), 10);
    if (!releaseId) {
      toast.dark("❌ Release ID not found. Please go back and create a release first.", {
        transition: Slide,
      });
      return;
    }

    // Validate that track has a file object
    if (!track.file && !track.fileId) {
      toast.dark("❌ Track file not found. Please go back and upload the track file again.", {
        transition: Slide,
        autoClose: 5000,
      });
      return;
    }

    // Get track number (index + 1)
    let tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
    const trackNumber = typeof trackIdx === "number" ? trackIdx + 1 : tracks.length + 1;

    // Get artistId from localStorage (required field - cannot be null)
    const storedArtistId = localStorage.getItem("artistId");
    let parsedArtistId = null;
    
    if (storedArtistId) {
      try {
        // Try to decode if it's base64 encoded
        parsedArtistId = parseInt(atob(storedArtistId), 10);
        if (isNaN(parsedArtistId)) {
          // If decoding fails, try direct parse
          parsedArtistId = parseInt(storedArtistId, 10);
        }
      } catch {
        // If atob fails, try direct parse
        parsedArtistId = parseInt(storedArtistId, 10);
      }
    }

    if (!parsedArtistId || isNaN(parsedArtistId)) {
      toast.dark("❌ Artist ID not found. Please ensure you're logged in as an artist.", {
        transition: Slide,
        autoClose: 5000,
      });
      return;
    }

    // Declare trackData outside try block for error handling
    let trackData = null;

    try {
      let fileId = track.fileId;
      let audioFileId = null;

      // Validate required fields first
      const durationSeconds = track.durationSeconds || Math.floor(track.duration || 0);
      if (durationSeconds <= 0) {
        throw new Error("Track duration must be greater than 0. Please ensure the audio file loaded correctly.");
      }

      // Step 1: Create track FIRST (without audioFileId)
      toast.dark("📝 Creating track...", { transition: Slide });

      trackData = {
        releaseId: releaseId,
        trackNumber: trackNumber,
        title: trackTitle.trim(),
        durationSeconds: durationSeconds,
        explicitFlag: explicitStatus === "yes",
        isrc: isrcOption === "yes" && isrcCode.trim() ? isrcCode.trim() : null,
        language: lyricsLanguageOption === "Select Language" && lyricsLanguage ? lyricsLanguage : null,
        trackVersion: catalogId.trim() || null,
        primaryArtistId: parsedArtistId, // Required field - use logged-in user's artistId (maps to ArtistID in DB)
        audioFileId: null, // Will be set after file upload
      };

      console.log("📤 Track data with artistId:", parsedArtistId);

      console.log("📤 Creating track with data:", JSON.stringify(trackData, null, 2));

      const createdTrack = await TracksService.createTrack(trackData);
      const trackId = createdTrack.trackId || createdTrack.id;

      if (!trackId) {
        throw new Error("Track creation failed - no trackId returned");
      }

      console.log("✅ Track created with ID:", trackId);
      toast.success("✅ Track created successfully!", { 
        transition: Slide,
        autoClose: 2000,
      });

      // Step 2: Upload file AFTER track is created (now we have trackId)
      if (track.file && !fileId) {
        toast.dark("📤 Uploading audio file...", { transition: Slide });
        
        // Determine content type based on file extension
        let contentType = track.format;
        if (!contentType) {
          const fileExt = track.file.name.toLowerCase().split('.').pop();
          contentType = fileExt === 'flac' ? 'audio/flac' : fileExt === 'wav' ? 'audio/wav' : 'audio/flac';
        }

        // Initiate file upload - NOW with actual trackId
        const uploadInitData = {
          releaseId: releaseId,
          trackId: trackId, // Use the actual trackId from created track
          fileType: "audio",
          fileName: track.file.name,
          contentType: contentType,
          expectedFileSize: track.file.size,
        };

        console.log("📤 Initiating file upload:", JSON.stringify(uploadInitData, null, 2));

        try {
          const uploadInitResponse = await FilesService.initiateFileUpload(uploadInitData);
          fileId = uploadInitResponse.fileId || uploadInitResponse.id;

          if (!fileId) {
            throw new Error("File upload initiation failed - no fileId returned");
          }

          console.log("✅ File upload initiated, fileId:", fileId, "uploadUrl:", uploadInitResponse.uploadUrl);

          // Upload file to the returned URL
          if (uploadInitResponse.uploadUrl) {
            console.log("📤 Uploading file to URL:", uploadInitResponse.uploadUrl);
            
            // Upload file using PUT to the uploadUrl
            let uploadResponse;
            try {
              uploadResponse = await fetch(uploadInitResponse.uploadUrl, {
                method: 'PUT',
                body: track.file,
                headers: {
                  'Content-Type': contentType || 'application/octet-stream',
                },
              });
            } catch (fetchError) {
              console.error("Fetch error:", fetchError);
              throw new Error(`Network error uploading file: ${fetchError.message}. Please check your internet connection and try again.`);
            }

            if (!uploadResponse.ok) {
              let errorText = "";
              try {
                errorText = await uploadResponse.text();
              } catch (e) {
                errorText = uploadResponse.statusText;
              }
              throw new Error(`File upload failed (${uploadResponse.status}): ${errorText || uploadResponse.statusText}`);
            }

            // Complete file upload
            const completeData = {
              fileId: fileId,
              checksum: uploadInitResponse.checksum || "", // You may need to calculate this
              fileSize: track.file.size,
              cloudfrontUrl: uploadInitResponse.cloudfrontUrl || uploadInitResponse.uploadUrl,
            };

            await FilesService.completeFileUpload(completeData);
            audioFileId = fileId;
            toast.dark("✅ File uploaded successfully!", { transition: Slide, autoClose: 2000 });

            // Step 3: Update track with audioFileId
            if (audioFileId) {
              toast.dark("🔄 Updating track with file reference...", { transition: Slide });
              try {
                await TracksService.updateTrack(trackId, {
                  audioFileId: audioFileId,
                });
                toast.success("✅ Track updated with file reference successfully!", { 
                  transition: Slide,
                  autoClose: 2000,
                });
                console.log("✅ Track updated with audioFileId:", audioFileId);
              } catch (updateError) {
                console.error("Error updating track with audioFileId:", updateError);
                toast.error("⚠️ Track created but failed to update file reference. Please try again later.", {
                  transition: Slide,
                  autoClose: 5000,
                });
              }
            }
          }
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          console.error("Upload error details:", {
            message: uploadError.message,
            response: uploadError.response?.data,
            status: uploadError.response?.status,
            uploadInitData: uploadInitData,
          });
          
          // Track is already created, but file upload failed
          // We can still proceed, but warn the user
          toast.error("⚠️ Track created but file upload failed. You can retry file upload later.", {
            transition: Slide,
            autoClose: 5000,
          });
        }
      } else if (fileId) {
        audioFileId = fileId;
      }

      // Step 3: Update track in localStorage with trackId and fileId
      const updatedTrackData = {
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
        detailsCompleted: true,
        trackId: trackId,
        fileId: fileId || audioFileId,
      };

      tracks = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");

      if (typeof trackIdx === "number" && tracks[trackIdx]) {
        tracks[trackIdx] = updatedTrackData;
      } else {
        tracks.push(updatedTrackData);
      }

      localStorage.setItem("uploadedTracks", JSON.stringify(tracks));

      // Step 4: Update release draft with trackId immediately
      // Note: This is optional - release will be updated when user proceeds to next step
      // We skip this to avoid 405 errors, and update only when user clicks Next
      console.log("✅ Track created successfully. Release will be updated when you proceed to next step.");

      toast.success("✅ Track created and saved successfully!", { 
        transition: Slide, 
        autoClose: 3000,
      });
      resetForm();
      navigate("/upload-tracks");
    } catch (error) {
      console.error("Error saving track:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        trackData: trackData || "Not defined",
      });
      
      // Extract validation errors if present
      let errorMessage = "Error saving track. Please try again.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for validation errors (ASP.NET Core format)
        if (errorData.errors && typeof errorData.errors === 'object') {
          const validationErrors = [];
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach((err) => {
                validationErrors.push(`${field}: ${err}`);
              });
            } else {
              validationErrors.push(`${field}: ${fieldErrors}`);
            }
          });
          
          if (validationErrors.length > 0) {
            errorMessage = `Validation errors:\n${validationErrors.join('\n')}`;
            console.error("Validation errors:", validationErrors);
          }
        }
        
        // Fallback to other error message formats
        if (errorMessage === "Error saving track. Please try again.") {
          errorMessage = errorData.title || 
                        errorData.message || 
                        errorData.error || 
                        error.message || 
                        errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      // Show error toast
      toast.error(`❌ ${errorMessage}`, { 
        transition: Slide, 
        autoClose: 8000,
      });
    }
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
        <ContributorsSection />
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
