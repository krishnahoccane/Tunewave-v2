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
import * as AuthService from "../services/auth";

function CreateRelease() {
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(null);
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [labelId, setLabelId] = useState(null);
  const [labelName, setLabelName] = useState(null);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [userArtists, setUserArtists] = useState([]);
  const [userEntities, setUserEntities] = useState(null);

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
  const [fileValid, setFileValid] = useState(null); // null = no file, true = valid, false = invalid

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

  // Fetch user's enterprise and label on component mount
  useEffect(() => {
    const fetchUserEntities = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setLoadingEntities(false);
          return;
        }

        const entities = await AuthService.getUserEntities();
        console.log("User entities:", entities);
        setUserEntities(entities);
        
        // Extract labelId from labels array
        if (entities?.labels && entities.labels.length > 0) {
          // Get default label first, or use the first label
          const defaultLabel = entities.labels.find((l) => l.isDefault === true);
          const selectedLabel = defaultLabel || entities.labels[0];
          
          if (selectedLabel?.labelId) {
            setLabelId(selectedLabel.labelId);
            setLabelName(selectedLabel.labelName || "N/A");
            console.log("Selected label:", selectedLabel);
            
            // Get enterpriseId from label if available
            if (selectedLabel.enterpriseId) {
              setEnterpriseId(selectedLabel.enterpriseId);
            } else {
              // If label doesn't have enterpriseId, fetch label details
              const token = localStorage.getItem("jwtToken");
              if (token) {
                try {
                  const labelResponse = await axios.get(`/api/labels/${selectedLabel.labelId}`, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  
                  if (labelResponse.data?.enterpriseId) {
                    setEnterpriseId(labelResponse.data.enterpriseId);
                    console.log("Fetched enterpriseId from label details:", labelResponse.data.enterpriseId);
                  }
                } catch (labelError) {
                  console.warn("Could not fetch label details:", labelError);
                }
              }
            }
          }
        }

        // Extract enterpriseId from enterprises array (if not already set from label)
        if (!enterpriseId && entities?.enterprises && entities.enterprises.length > 0) {
          const defaultEnterprise = entities.enterprises.find((e) => e.isDefault === true);
          const selectedEnterprise = defaultEnterprise || entities.enterprises[0];
          
          if (selectedEnterprise?.enterpriseId) {
            setEnterpriseId(selectedEnterprise.enterpriseId);
            console.log("Selected enterprise:", selectedEnterprise);
          }
        }

        // Extract artists for contributor mapping
        if (entities?.artists && entities.artists.length > 0) {
          setUserArtists(entities.artists);
          console.log("User artists:", entities.artists);
        }
      } catch (error) {
        console.error("Error fetching user entities:", error);
        toast.dark("Could not load enterprise/label information. Please ensure you're assigned to an enterprise and label.", { autoClose: 5000 });
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchUserEntities();
  }, []);

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
      return false;
    }
    if (!coverArtwork || fileValid !== true) {
      if (!coverArtwork) {
        toast.dark("Please upload Cover Artwork.", { transition: Slide });
      } else if (fileValid === false) {
        toast.dark("Please upload a valid cover art (3000px x 3000px).", { transition: Slide });
      } else {
        toast.dark("Please upload Cover Artwork.", { transition: Slide });
      }
      return false;
    }
    if (!primaryGenre) {
      toast.dark("Please select a Primary Genre.", { transition: Slide });
      return false;
    }
    if (!digitalReleaseDate) {
      toast.dark("Please select a Digital Release Date.", {
        transition: Slide,
      });
      return false;
    }
    // if (contributors.length === 0) {
    //   toast.dark("Please add at least one Main Primary Artist.", {transition: Slide});
    //   return;
    // }

    // ✅ Continue with form submission if all fields are valid
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.dark("Please login to create a release.", { transition: Slide });
      return false;
    }

    // Convert dates to ISO format
    const formatDateToISO = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString();
    };

    // Map contributors to API format - try to match with user's artists
    const mappedContributors = contributors.map((contributor) => {
      // Try to find matching artist by name
      const matchingArtist = userArtists.find(
        (artist) => artist.artistName?.toLowerCase() === contributor.name?.toLowerCase()
      );
      
      return {
        artistId: matchingArtist?.artistId || 0, // Use actual artistId if found
        role: contributor.type || "Main Primary Artist",
      };
    });

    // Validate enterpriseId and labelId
    if (!labelId) {
      toast.dark("Please ensure you're assigned to a label. Contact your administrator if needed.", { transition: Slide });
      return false;
    }

    if (!enterpriseId) {
      toast.dark("Please ensure you're assigned to an enterprise. Contact your administrator if needed.", { transition: Slide });
      return false;
    }

    // Get language from localizations if available
    const releaseLanguage = localizations.length > 0 && localizations[0].language 
      ? localizations[0].language 
      : "";

    // Get cover art URL - convert file to base64 data URL for now
    let coverArtUrlValue = "";
    if (coverArtwork) {
      // Create a data URL from the file (temporary solution)
      // In production, you'd upload to S3 first and get the URL
      coverArtUrlValue = URL.createObjectURL(coverArtwork);
      // Note: This is a blob URL. For production, upload file first and use the returned URL
    }

    // Prepare request body matching API schema
    const requestBody = {
      title: releaseTitle,
      titleVersion: titleVersion || null, // Send null instead of empty string if not provided
      enterpriseId: enterpriseId, // Required field
      labelId: labelId, // Required field
      description: "", // Not in current form
      coverArtUrl: coverArtUrlValue || null, // Cover art URL (blob URL for now)
      primaryGenre: primaryGenre,
      secondaryGenre: secondaryGenre || null, // Send null instead of empty string
      digitalReleaseDate: formatDateToISO(digitalReleaseDate),
      originalReleaseDate : formatDateToISO(originalReleaseDate),
      // originalReleaseDate: originalReleaseDate ? formatDateToISO(originalReleaseDate) : null, // Send null if not provided, don't fallback to digitalReleaseDate
      hasUPC: hasUPC === "yes",
      upcCode: hasUPC === "yes" ? upcCode : null,
      contributors: mappedContributors.length > 0 ? mappedContributors : [],
      // distributionOption is required - will be updated when stores are selected
      distributionOption: {
        distributionType: "pending", // Default value, will be updated in SelectStoresPage
        selectedStoreIds: []
      },
      trackIds: [],
      // Additional fields that might be needed
      language: releaseLanguage || null,
    };

    console.log("Request body:", requestBody);

    try {
      // Step 1: Create the release first
      const response = await axios.post("/api/releases", requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Release created:", response.data);
      console.log("Full response:", response);
      
      // Extract release ID from response - check multiple possible locations
      // API returns: { releaseId: 2042, message: "...", trackIds: null }
      const releaseId = response.data?.releaseId || 
                       response.data?.id || 
                       response.data?.data?.releaseId ||
                       response?.releaseId;
      
      console.log("Extracted releaseId:", releaseId);
      console.log("response.data.releaseId:", response.data?.releaseId);
      console.log("response.data.id:", response.data?.id);
      
      if (!releaseId) {
        console.error("Response data:", response.data);
        console.error("Full response:", response);
        toast.error("Failed to get release ID from server response. Please try again.");
        throw new Error("Release ID not found in response");
      }
      
      console.log("✅ Successfully extracted releaseId:", releaseId);

      // Cover art: Use blob URL for now
      // Note: /api/files/upload is for tracks only, not cover art
      // Cover art URL will be handled separately or uploaded via different endpoint
      const coverArtUrl = coverArtwork ? URL.createObjectURL(coverArtwork) : null;

      toast.success("Release created successfully!");
      
      // Clear old tracks from localStorage when starting a new release
      localStorage.removeItem("uploadedTracks");
      
      // Prepare release metadata for navigation
      const releaseMetadata = {
        releaseId: releaseId, // Ensure releaseId is explicitly set
        releaseTitle,
        titleVersion,
        coverArt: coverArtUrl,
        primaryGenre,
        secondaryGenre,
        digitalReleaseDate,
        originalReleaseDate,
        hasUPC,
        upcCode: hasUPC === "yes" ? upcCode : "",
        localizations,
        contributors,
        mainPrimaryArtist: contributors.length > 0 ? contributors[0].name : "",
        labelName: labelName || "N/A",
      };
      
      console.log("Prepared releaseMetadata:", releaseMetadata);
      console.log("releaseMetadata.releaseId:", releaseMetadata.releaseId);
      
      // Save to localStorage as backup
      localStorage.setItem("releaseMetadata", JSON.stringify(releaseMetadata));
      
      // Verify localStorage save
      const savedMetadata = JSON.parse(localStorage.getItem("releaseMetadata") || "{}");
      console.log("Saved to localStorage:", savedMetadata);
      console.log("Saved releaseId:", savedMetadata.releaseId);
      
      // Navigate with state
      navigate("/upload-tracks", { state: releaseMetadata });
      return true;
    } catch (error) {
      console.error("Error submitting:", error.response?.data || error.message);
      
      // Show more specific error message with validation details
      let errorMessage = "Error submitting form. Please try again.";
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for validation errors
        if (errorData.errors && typeof errorData.errors === 'object') {
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('\n');
          
          errorMessage = `Validation errors:\n${validationErrors}`;
          console.error("Validation errors:", errorData.errors);
        } else {
          errorMessage = errorData.message || 
                        errorData.error || 
                        errorData.title ||
                        (typeof errorData === 'string' ? errorData : errorMessage);
        }
      } else if (error.message) {
        errorMessage = `Network Error: ${error.message}`;
      }
      
      toast.dark(errorMessage, { autoClose: 7000 });
      return false;
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
    if (!file) {
      setFileValid(null);
      return;
    }

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width === 3000 && img.height === 3000) {
        setCoverArtwork(file);
        setFileUploaded(file);
        setFileError("");
        setFileValid(true);
      } else {
        setCoverArtwork(null);
        setFileUploaded(null);
        setFileError(`Image dimensions are ${img.width}px x ${img.height}px. Must be exactly 3000px x 3000px.`);
        setFileValid(false);
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = function () {
      setCoverArtwork(null);
      setFileUploaded(null);
      setFileError("Invalid image file. Please upload a valid image.");
      setFileValid(false);
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
          <div className="upload-container">
            <div
              className={`upload-box ${fileValid === true ? 'upload-success' : fileValid === false ? 'upload-error' : ''}`}
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
                    Supported: JPG, JPEG, PNG, JFIF (Max 10MB)
                  </p>
                </div>
              )}
            </div>
            {/* Status message below upload box */}
            <div className={`upload-status ${fileValid === true ? 'status-success' : fileValid === false ? 'status-error' : 'status-info'}`}>
              {fileValid === true ? (
                <p className="status-text success-text">
                  ✓ Image uploaded successfully! Dimensions: 3000px x 3000px
                </p>
              ) : fileValid === false ? (
                <p className="status-text error-text">
                  ✗ {fileError || "Image must be exactly 3000px x 3000px"}
                </p>
              ) : (
                <p className="status-text info-text">
                  Note: Image must be exactly 3000px x 3000px
                </p>
              )}
            </div>
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
          onClick={async (e) => {
            e.preventDefault();
            await handleSubmit();
            // Navigation is handled inside handleSubmit on success
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
