import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import iIcon from "../assets/material-symbols_info-outline.png";
import cloud from "../assets/Vector@3x.png";
import dot from "../assets/Component 22.png";
import axios from "axios";

import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import "../styles/CreateRelease.css";
import "../styles/styled.css";

import ContributorsSection from "../components/ContributorsSection.jsx";

function CreateRelease() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(null);

  const [showArtistModal, setShowArtistModal] = useState(false);
  // const [artistImage, setArtistImage] = useState(null);
  // const [showLocalizeModal, setShowLocalizeModal] = useState(false);

  // const [showLinkProfileModal, setShowLinkProfileModal] = useState(false);
  // const [selectedProfile, setSelectedProfile] = useState("");
  // const [artistProfileId, setArtistProfileId] = useState("");

  // const [showAddArtistModal, setShowAddArtistModal] = useState(false);
  // const [showPerformer, setShowPerformer] = useState(false);
  // const [showProducer, setShowProducer] = useState(false);
  // const [artist, setArtist] = useState(false);
  // const [showicons, seticons] = useState(true);
  // const [mainArtist, setMainArtist] = useState("");
  // const [artistDropDownRole, setArtistDropDownRole] = useState("");
  // const [producerDropDownRole, setproducerDropDownRole] = useState("");
  // const [performerDropDownRole, setperformerDropDownRole] = useState("");
  // // State to control second dropdown visibility
  // const [showSecondDropdown, setShowSecondDropdown] = useState(false);
  // const [showthirdDropdown, setthirdDropDown] = useState(false);

  const [contributors, setContributors] = useState([]);
  const [artistdropDownName, setArtistdropDownName] = useState("");
  const [linkedProfiles, setLinkedProfiles] = useState({
    Spotify: "",
    AppleMusic: "",
    SoundCloud: "",
  });

  const genres = {
    Film: [
      "Devotional",
      "Dialogue",
      "Ghazal",
      "Hip-Hop/ Rap",
      "Instrumental",
      "Patriotic",
      "Remix",
      "Romantic",
      "Sad",
      "Unplugged",
    ],
    Pop: [
      "Acoustic Pop",
      "Band Songs",
      "Bedroom Pop",
      "Chill Pop",
      "Contemporary Pop",
      "Country Pop/ Regional Pop",
      "Dance Pop",
      "Electro Pop",
      "Lo-Fi Pop",
      "Love Songs",
      "Pop Rap",
      "Pop Singer-Songwriter",
      "Sad Songs",
      "Soft Pop",
    ],
    Indie: [
      "Indian Indie",
      "Indie Dance",
      "Indie Folk",
      "Indie Hip-Hop",
      "Indie Lo-Fi",
      "Indie Pop",
      "Indie Rock",
      "Indie Singer -Songwriter",
    ],
    "Hip-Hop/Rap": [
      "Alternative Hip-Hop",
      "Concious Hip-Hop",
      "Country Rap",
      "Emo Rap",
      "Hip-Hop",
      "Jazz Rap",
      "Pop Rap",
      "Trap",
      "Trap Beats",
    ],
    Folk: [
      "Ainchaliyan",
      "Alha",
      "Atulprasadi",
      "Baalgeet/ Children Song",
      "Banvarh",
      "Barhamasa",
      "Basant Geet",
      "Baul Geet",
      "Bhadu Gaan",
      "Bhangra",
      "Bhatiali",
      "Bhavageete",
      "Bhawaiya",
      "Bihugeet",
      "Birha",
      "Borgeet",
      "Dandiya Raas",
      "Garba",
      "Lavani",
      "Lokgeet",
      "Rasiya",
      "Tappa",
      "Tusu Gaan",
      "Villu Pattu",
    ],
    Devotional: [
      "Aarti",
      "Bhajan",
      "Carol",
      "Chalisa",
      "Chant",
      "Geet",
      "Gospel",
      "Gurbani",
      "Hymn",
      "Kirtan",
      "Mantra",
      "Paath",
      "Qawwals",
      "Shabd",
    ],
    "Hindustani Classical": ["Instrumental", "Vocal"],
    "Carnatic Classical": ["Instrumental", "Vocal"],
    "Ambient / Instrumental": [
      "Soft",
      "Easy Listening",
      "Electronic",
      "Fusion",
      "Lounge",
    ],
  };

  const [releaseTitle, setReleaseTitle] = useState("");
  const [titleVersion, setTitleVersion] = useState("");
  const [localizations, setLocalizations] = useState([
    { language: "", localizedTitle: "", titleVersion: "" },
  ]);

  // Step 2: Cover Artwork
  const [coverArtwork, setCoverArtwork] = useState(null); // File object
  const [fileError, setFileError] = useState("");

  // Step 4: Genres
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");

  // Step 5: Dates
  const [digitalReleaseDate, setDigitalReleaseDate] = useState("");
  const [originalReleaseDate, setOriginalReleaseDate] = useState("");

  // Step 6: UPC
  const [hasUPC, setHasUPC] = useState(null); // 'yes' or 'no'
  const [upcCode, setUpcCode] = useState("");
  const [profile, setProfileModel] = useState("");

  // Example: adding/updating a contributor
  const addContributor = (contributor) => {
    setContributors([...contributors, contributor]);
  };

  const openLinkProfileModal = (a) => {
    setProfileModel(a);
  };

  // Step 7: Form submission
  // const handleSubmit = async () => {
  //   const formData = new FormData();
  //   formData.append("releaseTitle", releaseTitle);
  //   formData.append("titleVersion", titleVersion);
  //   formData.append("digitalReleaseDate", digitalReleaseDate);
  //   formData.append("originalReleaseDate", originalReleaseDate);
  //   formData.append("primaryGenre", primaryGenre);
  //   formData.append("secondaryGenre", secondaryGenre);
  //   formData.append("hasUPC", hasUPC);
  //   if (coverArtwork) {
  //     formData.append("coverArtwork", coverArtwork);
  //   }
  //   if (hasUPC === "yes") formData.append("upcCode", upcCode);

  //   formData.append("localizations", JSON.stringify(localizations));
  //   formData.append("contributors", JSON.stringify(contributors));

  //   const openLinkProfileModal = (profile) => {
  //     setSelectedProfile(profile);
  //     setArtistProfileId("");
  //     setShowLinkProfileModal(true);
  //   };

  //   const object = {};
  //   formData.forEach((value, key) => {
  //     object[key] = value;
  //   });

  //   const collectionPayload = {
  //     collection: {
  //       info: {
  //         name: object.releaseTitle || "New Collection",
  //         schema:
  //           "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  //       },
  //       item: [
  //         {
  //           name: "Sample Request",
  //           request: {
  //             method: "POST",
  //             header: [],
  //             body: {
  //               mode: "raw",
  //               raw: JSON.stringify({
  //                 form_id: 1,
  //                 releaseTitle,
  //                 titleVersion,
  //                 digitalReleaseDate,
  //                 originalReleaseDate,
  //                 coverArtwork,
  //                 primaryGenre,
  //                 secondaryGenre,
  //                 hasUPC,
  //                 upcCode: hasUPC === "yes" ? upcCode : "",
  //                 localizations,
  //                 contributors,
  //               }),
  //             },
  //             url: {
  //               raw: "https://your-api-endpoint.com",
  //               protocol: "https",
  //               host: ["your-api-endpoint", "com"],
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   };

  //   try {
  //     const response = await axios.post(
  //       "/wp/wp-json/gf/v2/entries",
  //       collectionPayload,
  //       {
  //         headers: {
  //          Authorization: `Basic ${btoa("ck_23e474a3a4a15b8460b78f01bc60d565dd7f94c5:cs_84ee6ec3c485d7727560ad9103ed3311d2afb088")}`,
  //           "Content-type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("Postman API Response:", response.data);
  //   } catch (error) {
  //     console.error(
  //       "Error posting to Postman API:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  const handleSubmit = async () => {
    if (!releaseTitle.trim()) {
      toast.dark("Please enter a Release Title.", { transition: Slide });
      return;
    }
    if (!coverArtwork) {
      toast.dark("Please upload Cover Artwork.", { transition: Slide });
      return;
    }
    if (!primaryGenre) {
      toast.dark("Please select a Primary Genre.", { transition: Slide });
      return;
    }
    if (!digitalReleaseDate) {
      toast.dark("Please select a Digital Release Date.", {
        transition: Slide,
      });
      return;
    }
    // if (contributors.length === 0) {
    //   toast.dark("Please add at least one Main Primary Artist.", {transition: Slide});
    //   return;
    // }

    // ✅ Continue with form submission if all fields are valid
    const formData = new FormData();
    formData.append("releaseTitle", releaseTitle);
    formData.append("titleVersion", titleVersion);
    formData.append("digitalReleaseDate", digitalReleaseDate);
    formData.append("originalReleaseDate", originalReleaseDate);
    formData.append("primaryGenre", primaryGenre);
    formData.append("secondaryGenre", secondaryGenre);
    formData.append("hasUPC", hasUPC);
    if (coverArtwork) formData.append("coverArtwork", coverArtwork);
    if (hasUPC === "yes") formData.append("upcCode", upcCode);
    formData.append("localizations", JSON.stringify(localizations));
    formData.append("contributors", JSON.stringify(contributors));

    try {
      const response = await axios.post("/wp/wp-json/gf/v2/entries", formData, {
        headers: {
          Authorization: `Basic ${btoa(
            "ck_23e474a3a4a15b8460b78f01bc60d565dd7f94c5:cs_84ee6ec3c485d7727560ad9103ed3311d2afb088"
          )}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Release created successfully!");
      console.log("Response:", response.data);
      return true;
    } catch (error) {
      toast.dark("Error submitting form. Please try again.");
      console.error("Error submitting:", error.response?.data || error.message);
      return false;
    } finally {
      // used finally for now to navigate
      navigate("/upload-tracks");
    }
  };

  const saveContributor = () => {
    if (!artistdropDownName) return;

    const newContributor = {
      type: "Main Primary Artist",
      name: artistdropDownName,
      linkedProfiles,
    };

    setContributors([...contributors, newContributor]);
    setArtistdropDownName("");
    setLinkedProfiles({ Spotify: "", AppleMusic: "", SoundCloud: "" });
    setShowArtistModal(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width === 3000 && img.height === 3000) {
        setCoverArtwork(file);
        setFileUploaded(file);
        setFileError("");
      } else {
        setCoverArtwork(null);
        setFileError("Image must be exactly 3000px by 3000px.");
      }
      URL.revokeObjectURL(img.src);
    };
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Create A New Release</h2>

      {/* Step 1 */}
      <div className="section">
        <h3>Enter Release Details</h3>

        <div className="input-group">
          <label htmlFor="title">
            Release Title <span style={{ color: "red" }}>*</span>{" "}
          </label>
          <input
            type="text"
            id="title"
            placeholder="e.g., I got my summer"
            className="input-field"
            onChange={(e) => setReleaseTitle(e.target.value)}
            value={releaseTitle}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="titleversion">Title Version</label>
          <input
            type="text"
            id="titleversion"
            placeholder="e.g., Live, Remix, Remastered"
            className="input-field"
            onChange={(e) => setTitleVersion(e.target.value)}
            value={titleVersion}
            style={{ width: "50%" }}
          />
        </div>
        <br />

        <span></span>

        <br />
      </div>

      {/* Step 2 */}
      <div className="section upload-section">
        <h3>Upload Cover Artwork</h3>
        <div className="form-grid">
          <div
            className="upload-box"
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => e.preventDefault()} // Allow dropping
            onDragEnter={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("drag-over"); // optional hover style
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("drag-over"); // remove hover style
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("drag-over");
              const file = e.dataTransfer.files[0];
              handleFileChange({ target: { files: [file] } });
            }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/jpg, image/jfif"
              onChange={handleFileChange} // <-- use new handler
            />
            {fileUploaded ? (
              <img
                src={URL.createObjectURL(fileUploaded)}
                alt="Preview"
                className="upload-preview"
              />
            ) : (
              <div className="text">
                <p>
                  <img src={cloud} className="could-img" alt="could-image" />
                  Drag here or click to browse a file
                </p>
                <p className="file-types">
                  Supported: JPG, JPEG, PNG, JFIF (Must be exactly 3000px x
                  3000px, Max 10MB)
                </p>
                {fileError && <p style={{ color: "red" }}>{fileError}</p>}
              </div>
            )}
          </div>

          <div className="tips-box">
            <h4>Tips:</h4>
            <p>
              Please ensure your cover art is square, less than 10 MB and a
              minimum of 3000px wide (3000px width is recommended for best
              results).
            </p>
            <br />
            <h3>Your cover art cannot contain:</h3>
            <ul>
              <li>
                <img src={dot} />
                Any text other than the release title and/or artist name
              </li>
              <li>
                <img src={dot} />
                Third-party logos or trademarks without express written consent
                from the trademark holder
              </li>
              <li>
                <img src={dot} />
                Sexually explicit imagery
              </li>
              <li>
                <img src={dot} />
                Supported: JPG, JPEG, PNG, JFIF
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step 3 */}

      {/* ----------------------------------------------------------------Now---------------------------------- */}
      {/* contributors */}

      <ContributorsSection />

      {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
      {/* Step 4 */}
      <div className="section">
        <h3>Genres</h3>

        <div className="genres-grid">
          {/* Primary Genre */}
          <div>
            <label className="label-name" htmlFor="primary-genre">
              Primary Genre <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <select
              className="input-field"
              style={{ width: "100%" }}
              id="primary-genre"
              value={primaryGenre}
              onChange={(e) => {
                setPrimaryGenre(e.target.value);
                setSecondaryGenre(""); // Reset secondary genre when main changes
              }}
            >
              <option value="">Select Primary Genre</option>
              {Object.keys(genres).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Genre */}
          <div>
            <label className="label-name" htmlFor="second-genre">
              Secondary Genre <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <select
              className="input-field"
              style={{ width: "100%" }}
              id="second-genre"
              value={secondaryGenre}
              onChange={(e) => setSecondaryGenre(e.target.value)}
              disabled={!primaryGenre}
            >
              <option value="">Select Secondary Genre</option>
              {primaryGenre &&
                genres[primaryGenre]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* {step :5} */}

      <div className="section">
        <h3>Date</h3>
        <div style={{ display: "flex", gap: "30px", marginLeft: "10%" }}>
          <div className="date-box">
            <label>
              Digital Release Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              placeholder="DD/MM/YYYY"
              value={digitalReleaseDate}
              style={{ width: "300px" }}
              onChange={(e) => setDigitalReleaseDate(e.target.value)}
            />
          </div>

          <div className="date-box">
            <label>
              Original Release Date <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              placeholder="DD/MM/YYYY"
              value={originalReleaseDate}
              style={{ width: "300px" }}
              onChange={(e) => setOriginalReleaseDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* {step:6} */}
      <div className="section">
        <h3>UPC</h3>
        <div className="input-group">
          <label htmlFor="upc">
            Do you have a UPC Code? <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "30px", marginTop: "8px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="radio"
                name="upcOption"
                value="yes"
                onChange={() => setHasUPC("yes")}
                checked={hasUPC === "yes"}
              />
              <span>Yes</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="radio"
                name="upcOption"
                value="no"
                onChange={() => setHasUPC("no")}
                checked={hasUPC === "no"}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {hasUPC === "yes" && (
          <div className="input-group" style={{ marginTop: "15px" }}>
            <label htmlFor="upcCode">
              UPC Code <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="upcCode"
              placeholder="Enter Your UPC Code"
              className="input-field"
              style={{ width: "50%" }}
              value={upcCode}
              onChange={(e) => setUpcCode(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="btn-gradient"
          // onClick={() => {
          //   navigate("/upload-tracks");
          //   handleSubmit();
          // }}
          onClick={async (e) => {
            e.preventDefault();
            const isValid = await handleSubmit();
            // ✅ Only navigate if validation and submission succeeded
            if (isValid) {
              navigate("/upload-tracks");
            }
          }}
        >
          Next
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default CreateRelease;
