import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import iIcon from "../assets/material-symbols_info-outline.png";
import cloud from "../assets/Vector@3x.png";
import dot from "../assets/Component 22.png";
import api from "../config/api";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/CreateRelease.css";
import "../styles/styled.css";

import ContributorsSection from "../components/ContributorsSection.jsx";
import * as AuthService from "../services/auth";
import { getLabelById } from "../services/labels";
import { getArtists, createArtist } from "../services/artists";
import { useRole } from "../context/RoleContext";

function CreateRelease() {
  const navigate = useNavigate();
  const { actualRole } = useRole();
  const roleLower = (actualRole || "").toLowerCase();

  const [fileUploaded, setFileUploaded] = useState(null);
  const [enterpriseId, setEnterpriseId] = useState(null);
  const [labelId, setLabelId] = useState(null);
  const [labelName, setLabelName] = useState(null);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [userEntities, setUserEntities] = useState(null);

  const [artistsList, setArtistsList] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);

  const [contributors, setContributors] = useState({
    primaryArtist: [],
    featuredArtist: [],
    producer: [],
    director: [],
    composer: [],
    lyricist: [],
  });

  // Authoritative Genre → Sub-Genre taxonomy (single source of truth)
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
      "Indie Singer-Songwriter",
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
      "Bhagawati",
      "Bhand",
      "Bhangra",
      "Bhatiali",
      "Bhavageete",
      "Bhawaiya",
      "Bhuta song",
      "Bihugeet",
      "Birha",
      "Borgeet",
      "Burrakatha",
      "Chappeli",
      "Daff",
      "Dandiya Raas",
      "Dasakathia",
      "Deijendrageeti",
      "Deknni",
      "Dhamal",
      "Gadhwali",
      "Gagor",
      "Garba",
      "Ghasiyari Geet",
      "Ghoomar",
      "Gidda",
      "Gugga",
      "Hafiz Nagma",
      "Heliam",
      "Hereileu",
      "Hori",
      "Jaanapada Geethe",
      "Jaita",
      "Jhoori",
      "Jhora",
      "Jhumur",
      "Jugni",
      "Kajari",
      "Kajari/ Kajari /Kajri",
      "Karwa Chauth Songs",
      "Khor",
      "Koligeet",
      "Kumayuni",
      "Kummi Paatu",
      "Lagna Geet /Marriage Song",
      "Lalongeeti",
      "Lavani",
      "Lokgeet",
      "Loor",
      "Maand",
      "Madiga Dappu",
      "Mando",
      "Mapilla",
      "Naatupura Paadalgal",
      "Naqual",
      "Nati",
      "Nautanki",
      "Nazrulgeeti",
      "Neuleu",
      "Nyioga",
      "Oggu Katha",
      "Paani Hari",
      "Pai Song",
      "Pandavani",
      "Pankhida",
      "Patua Sangeet",
      "Phag Dance",
      "Powada",
      "Qawwali",
      "Rabindra Sangeet",
      "Rajanikantageeti",
      "Ramprasadi",
      "Rasiya",
      "Rasiya Geet",
      "Raslila",
      "Raut Nacha",
      "Saikuthi Zai",
      "Sana Lamok",
      "Shakunakhar-Mangalgeet",
      "Shyama Sangeet",
      "Sohar",
      "Sumangali",
      "Surma",
      "Suvvi paatalu",
      "Tappa",
      "Teej songs",
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
  const [coverArtPreviewUrl, setCoverArtPreviewUrl] = useState(null); // Preview URL for display
  const [fileError, setFileError] = useState("");
  const [fileValid, setFileValid] = useState(null); // null = no file, true = valid, false = invalid

  // Step 4: Genres
  const [primaryGenre, setPrimaryGenre] = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");

  // Step 5: Dates
  const [digitalReleaseDate, setDigitalReleaseDate] = useState("");
  const [digitalReleaseDateError, setDigitalReleaseDateError] = useState("");
  const [originalReleaseDate, setOriginalReleaseDate] = useState("");

  // Minimum date = today + 2 days (local date) for both Digital and Original release
  const getMinReleaseDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    return minDate.toISOString().split("T")[0];
  };

  // Step 6: UPC — default to "No"
  const [hasUPC, setHasUPC] = useState("no"); // 'yes' or 'no'
  const [upcCode, setUpcCode] = useState("");
  const [upcCodeError, setUpcCodeError] = useState("");
  const [upcCodeSuccess, setUpcCodeSuccess] = useState(false); // show "Valid UPC code" when valid
  const [profile, setProfileModel] = useState("");

  // Genre dropdown open state (custom dropdowns)
  const [primaryGenreOpen, setPrimaryGenreOpen] = useState(false);
  const [secondaryGenreOpen, setSecondaryGenreOpen] = useState(false);

  // UPC-13 check digit validation (EAN-13 algorithm)
  const validateUPC13 = (str) => {
    const trimmed = String(str).trim();
    if (trimmed.length !== 13) return false;
    if (!/^\d{13}$/.test(trimmed)) return false;
    const digits = trimmed.split("").map(Number);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const position = i + 1; // 1-based
      sum += position % 2 === 1 ? digits[i] * 1 : digits[i] * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[12];
  };

  // Load form data from localStorage on component mount
  useEffect(() => {
    const loadFormData = () => {
      try {
        // Always try to restore form data from localStorage
        // This allows users to navigate back and see their previous input
        const savedData = localStorage.getItem("createReleaseFormData");
        if (savedData) {
          const formData = JSON.parse(savedData);
          
          console.log("Restoring form data from localStorage:", formData);
          
          // Restore form fields
          if (formData.releaseTitle !== undefined) setReleaseTitle(formData.releaseTitle);
          if (formData.titleVersion !== undefined) setTitleVersion(formData.titleVersion);
          if (formData.localizations && Array.isArray(formData.localizations)) {
            setLocalizations(formData.localizations);
          }
          if (formData.primaryGenre !== undefined) setPrimaryGenre(formData.primaryGenre);
          if (formData.secondaryGenre !== undefined) setSecondaryGenre(formData.secondaryGenre);
          if (formData.digitalReleaseDate !== undefined) setDigitalReleaseDate(formData.digitalReleaseDate);
          if (formData.originalReleaseDate !== undefined) setOriginalReleaseDate(formData.originalReleaseDate);
          if (formData.hasUPC !== undefined && formData.hasUPC !== null) setHasUPC(formData.hasUPC);
          if (formData.upcCode !== undefined) setUpcCode(formData.upcCode);
          if (formData.contributors) {
            if (Array.isArray(formData.contributors)) {
              const contributorsObj = {
                primaryArtist: [],
                featuredArtist: [],
                producer: [],
                director: [],
                composer: [],
                lyricist: [],
              };
              formData.contributors.forEach((contrib) => {
                const role = contrib.role || contrib.type || "";
                const category = role === "Main Primary Artist" ? "primaryArtist" : role === "Featured Artist" ? "featuredArtist" : role.toLowerCase();
                const entry = { artistId: contrib.artistId ?? contrib.artistID, artistName: contrib.artistName ?? contrib.name };
                if (category && contributorsObj[category]) {
                  if (category === "primaryArtist") {
                    contributorsObj[category] = [entry];
                  } else {
                    contributorsObj[category].push(entry);
                  }
                }
              });
              setContributors(contributorsObj);
            } else if (typeof formData.contributors === "object" && !Array.isArray(formData.contributors)) {
              const normalized = {
                primaryArtist: formData.contributors.primaryArtist || [],
                featuredArtist: formData.contributors.featuredArtist || [],
                producer: formData.contributors.producer || [],
                director: formData.contributors.director || [],
                composer: formData.contributors.composer || [],
                lyricist: formData.contributors.lyricist || [],
              };
              setContributors(normalized);
            }
          }
          
          // Handle cover art - restore preview URL if available
          if (formData.coverArtDataUrl) {
            console.log("Restoring cover art preview from data URL");
            // Create a blob URL from the data URL for preview
            fetch(formData.coverArtDataUrl)
              .then(res => res.blob())
              .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                setCoverArtPreviewUrl(blobUrl);
                // Create a File object from the blob for form submission
                const file = new File([blob], "cover-art.jpg", { type: blob.type || "image/jpeg" });
                setCoverArtwork(file);
                setFileValid(true);
                setFileUploaded(file);
                console.log("✅ Cover art restored successfully");
              })
              .catch(error => {
                console.warn("Failed to restore cover art:", error);
                setCoverArtPreviewUrl(null);
                setCoverArtwork(null);
                setFileValid(null);
              });
          } else if (formData.hasCoverArt) {
            console.log("Cover art was previously uploaded but data URL not found. User needs to re-upload.");
          }
          
          console.log("✅ Form data restored from localStorage");
        } else {
          console.log("No saved form data found in localStorage");
        }
      } catch (error) {
        console.warn("Failed to load form data from localStorage:", error);
      }
    };
    
    loadFormData();
  }, []);

  // Save form data to localStorage whenever form fields change
  useEffect(() => {
    const saveFormData = async () => {
      try {
        // Convert cover art file to base64 data URL for storage
        let coverArtDataUrl = null;
        if (coverArtwork instanceof File) {
          try {
            coverArtDataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(coverArtwork);
            });
          } catch (error) {
            console.warn("Failed to convert cover art to data URL:", error);
          }
        }
        
        const formDataToSave = {
          releaseTitle,
          titleVersion,
          localizations,
          primaryGenre,
          secondaryGenre,
          digitalReleaseDate,
          originalReleaseDate,
          hasUPC,
          upcCode,
          contributors: contributors || {},
          hasCoverArt: coverArtwork !== null,
          coverArtDataUrl,
        };
        
        localStorage.setItem("createReleaseFormData", JSON.stringify(formDataToSave));
        const totalContributors = Object.values(contributors).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        console.log("💾 Auto-saved form data to localStorage (contributors:", totalContributors, "cover art:", !!coverArtDataUrl, ")");
      } catch (error) {
        console.warn("Failed to save form data to localStorage:", error);
      }
    };
    
    // Debounce saves to avoid too many writes
    const timeoutId = setTimeout(saveFormData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    releaseTitle,
    titleVersion,
    JSON.stringify(localizations),
    primaryGenre,
    secondaryGenre,
    digitalReleaseDate,
    originalReleaseDate,
    hasUPC,
    upcCode,
    JSON.stringify(contributors),
    coverArtwork?.name,
    coverArtwork?.size,
  ]);

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
              try {
                const labelData = await getLabelById(selectedLabel.labelId);
                
                if (labelData?.enterpriseId) {
                  setEnterpriseId(labelData.enterpriseId);
                  console.log("Fetched enterpriseId from label details:", labelData.enterpriseId);
                }
              } catch (labelError) {
                console.warn("Could not fetch label details:", labelError);
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

      } catch (error) {
        console.error("Error fetching user entities:", error);
        toast.dark("Could not load enterprise/label information. Please ensure you're assigned to an enterprise and label.", { autoClose: 5000 });
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchUserEntities();
  }, []);

  // Fetch artists from API (single source of truth for contributors)
  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setLoadingArtists(false);
      return;
    }
    setLoadingArtists(true);
    getArtists()
      .then((list) => {
        if (!cancelled && Array.isArray(list)) setArtistsList(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error fetching artists:", err);
          toast.dark("Could not load artists.", { autoClose: 5000 });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingArtists(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Close genre dropdowns when clicking outside (each dropdown wraps trigger + menu)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inPrimary = e.target.closest(".genre-dropdown")?.querySelector("#primary-genre");
      const inSecondary = e.target.closest(".genre-dropdown")?.querySelector("#second-genre");
      if (primaryGenreOpen && !inPrimary) setPrimaryGenreOpen(false);
      if (secondaryGenreOpen && !inSecondary) setSecondaryGenreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [primaryGenreOpen, secondaryGenreOpen]);

  // Role-based primary artist: auto-fill Primary Artist for Artist/Label roles (same structure as other contributors)
  useEffect(() => {
    if (!userEntities || artistsList.length === 0) return;

    const isArtist = roleLower === "artist" || roleLower === "artistadmin" || roleLower === "artist admin";
    const isLabel = roleLower === "labeladmin" || roleLower === "labeluser" || roleLower === "label admin" || roleLower === "label user";

    if (isArtist && userEntities?.artists?.length > 0) {
      const myArtist = userEntities.artists[0];
      const artistId = myArtist.artistId ?? myArtist.artistID;
      const artistName = myArtist.artistName ?? "";
      if (artistId != null) {
        setContributors((prev) => {
          if ((prev.primaryArtist || []).length > 0) return prev;
          return { ...prev, primaryArtist: [{ artistId, artistName }] };
        });
      }
      return;
    }

    if (isLabel && labelId != null) {
      setContributors((prev) => {
        if ((prev.primaryArtist || []).length > 0) return prev;
        const labelArtists = artistsList.filter((a) => Number(a.labelId) === Number(labelId));
        const defaultArtist = labelArtists.find((a) => a.isDefault) ?? labelArtists.find((a) => (a.status || "").toLowerCase() === "active") ?? labelArtists[0];
        if (defaultArtist?.artistId == null) return prev;
        return {
          ...prev,
          primaryArtist: [{ artistId: defaultArtist.artistId, artistName: defaultArtist.artistName ?? "" }],
        };
      });
    }
  }, [userEntities, labelId, artistsList, roleLower]);

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
        toast.dark("Cover art must be 1:1 aspect ratio and at least 3000px × 3000px.", { transition: Slide });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minReleaseDate = new Date(today);
    minReleaseDate.setDate(today.getDate() + 2);
    if (new Date(digitalReleaseDate) < minReleaseDate) {
      toast.dark("Digital release date must be at least 2 days from today.", { transition: Slide });
      setDigitalReleaseDateError("Digital release date must be at least 2 days from today.");
      return false;
    }

    // Original Release Date: no validation, optional
    const primaryArtists = contributors.primaryArtist || [];
    if (primaryArtists.length < 1) {
      toast.dark("Please add at least one Primary Artist.", { transition: Slide });
      return false;
    }
    if (primaryArtists.length > 4) {
      toast.dark("You can have at most 4 Primary Artists.", { transition: Slide });
      return false;
    }

    if (hasUPC === "yes") {
      const trimmed = String(upcCode || "").trim();
      if (!trimmed) {
        toast.dark("Please enter your UPC Code.", { transition: Slide });
        setUpcCodeError("Please enter your UPC Code.");
        return false;
      }
      if (trimmed.length !== 13 || !/^\d{13}$/.test(trimmed)) {
        toast.dark("Invalid UPC code. Please check the last digit.", { transition: Slide });
        setUpcCodeError("Invalid UPC code. Please check the last digit.");
        return false;
      }
      if (!validateUPC13(trimmed)) {
        toast.dark("Invalid UPC code. Please check the last digit.", { transition: Slide });
        setUpcCodeError("Invalid UPC code. Please check the last digit.");
        return false;
      }
      setUpcCodeError("");
      setUpcCodeSuccess(true);
    } else {
      setUpcCodeError("");
      setUpcCodeSuccess(false);
    }

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

    // Build contributors array for API: [{ artistId, role }]. Primary Artist same structure as others.
    const contributorsArray = [];

    const categoryRoleMap = {
      primaryArtist: "Main Primary Artist",
      featuredArtist: "Featured Artist",
      producer: "Producer",
      director: "Director",
      composer: "Composer",
      lyricist: "Lyricist",
    };

    const hasPendingArtist = Object.keys(categoryRoleMap).some((category) =>
      (contributors[category] || []).some((c) => {
        const id = c.artistId ?? c.artistID;
        return typeof id === "string" && id.startsWith("temp-");
      })
    );
    if (hasPendingArtist) {
      toast.dark("One or more artists are still syncing. Please try again in a moment.", { transition: Slide });
      return false;
    }

    Object.keys(categoryRoleMap).forEach((category) => {
      if (contributors[category] && Array.isArray(contributors[category])) {
        contributors[category].forEach((contrib) => {
          const artistId = contrib.artistId ?? contrib.artistID ?? artistsList.find((a) => String(a.artistName).toLowerCase() === String(contrib.artistName ?? contrib.name).toLowerCase())?.artistId;
          if (artistId != null && !String(artistId).startsWith("temp-")) {
            contributorsArray.push({ artistId, role: categoryRoleMap[category] });
          }
        });
      }
    });

    const mappedContributors = contributorsArray;

    // Resolve active LabelId from user entities (required by backend; must be > 0). Priority: isDefault, then first label.
    const activeLabel =
      userEntities?.labels?.find((l) => l.isDefault === true) ||
      userEntities?.labels?.[0];
    const resolvedLabelId = activeLabel?.labelId ?? labelId;

    if (!resolvedLabelId || Number(resolvedLabelId) <= 0) {
      toast.dark("No active label found for release creation. Please ensure you're assigned to a label.", { transition: Slide });
      return false;
    }

    if (!enterpriseId) {
      toast.dark("Please ensure you're assigned to an enterprise. Contact your administrator if needed.", { transition: Slide });
      return false;
    }

    // Step-1: Create Release shell. Include LabelId (required); omit TrackIds, DistributionOption.*, Description, CoverArtUrl.
    const formData = new FormData();
    formData.append("Title", releaseTitle.trim());
    formData.append("TitleVersion", titleVersion?.trim() || "");

    formData.append("PrimaryGenre", primaryGenre);
    formData.append("SecondaryGenre", secondaryGenre || "");

    formData.append("DigitalReleaseDate", formatDateToISO(digitalReleaseDate));
    if (originalReleaseDate) {
      formData.append("OriginalReleaseDate", formatDateToISO(originalReleaseDate));
    }

    formData.append("HasUPC", hasUPC === "yes" ? "true" : "false");
    if (hasUPC === "yes" && upcCode?.trim()) {
      formData.append("UPCCode", upcCode.trim());
    }

    if (coverArtwork instanceof File) {
      formData.append("CoverArtFile", coverArtwork);
    }

    formData.append(
      "Contributors",
      JSON.stringify(
        mappedContributors.map((c) => ({
          artistId: Number(c.artistId) || c.artistId,
          role: c.role,
        }))
      )
    );

    formData.append("LabelId", String(resolvedLabelId));

    try {
      const data = await api.post("/api/releases", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Release created:", data);

      // Extract release ID (api interceptor returns response.data, so data is the body)
      const releaseId = data?.releaseId ?? data?.id ?? data?.data?.releaseId;
      
      if (!releaseId) {
        console.error("Response data:", data);
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
        mainPrimaryArtist: (contributors.primaryArtist || [])[0]?.artistName ?? "",
        labelName: labelName || "N/A",
      };
      
      console.log("Prepared releaseMetadata:", releaseMetadata);
      console.log("releaseMetadata.releaseId:", releaseMetadata.releaseId);
      
      // Save to localStorage as backup
      localStorage.setItem("releaseMetadata", JSON.stringify(releaseMetadata));
      
      // Save form data before navigating (so user can see it if they come back)
      // Convert cover art to base64 data URL
      let coverArtDataUrl = null;
      if (coverArtwork instanceof File) {
        try {
          coverArtDataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(coverArtwork);
          });
        } catch (error) {
          console.warn("Failed to convert cover art to data URL:", error);
        }
      }
      
      const formDataToSave = {
        releaseTitle,
        titleVersion,
        localizations,
        primaryGenre,
        secondaryGenre,
        digitalReleaseDate,
        originalReleaseDate,
        hasUPC,
        upcCode,
        contributors: contributors || {},
        hasCoverArt: coverArtwork !== null,
        coverArtDataUrl,
      };
      localStorage.setItem("createReleaseFormData", JSON.stringify(formDataToSave));
      const totalContributors = Object.values(contributors).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
      console.log("✅ Form data saved to localStorage before navigation (contributors:", totalContributors, "cover art:", !!coverArtDataUrl, ")");
      
      // Verify localStorage save
      const savedMetadata = JSON.parse(localStorage.getItem("releaseMetadata") || "{}");
      console.log("Saved to localStorage:", savedMetadata);
      console.log("Saved releaseId:", savedMetadata.releaseId);
      
      // Navigate with state
      navigate("/upload-tracks", { state: releaseMetadata });
      return true;
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      console.error("Error submitting:", status, errorData || error.message);

      let errorMessage = "Error submitting form. Please try again.";
      if (errorData != null) {
        if (errorData.errors && typeof errorData.errors === "object") {
          const parts = Object.entries(errorData.errors).map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(", ")}`;
          });
          errorMessage = parts.length ? parts.join("\n") : errorMessage;
        } else {
          errorMessage =
            errorData.message ??
            errorData.error ??
            errorData.title ??
            (typeof errorData === "string" ? errorData : errorMessage);
        }
      }
      if (status === 400) {
        errorMessage = `Bad request (400): ${errorMessage}`;
      } else if (error.message && !errorData) {
        errorMessage = `Network error: ${error.message}`;
      }

      toast.dark(errorMessage, { autoClose: 7000 });
      return false;
    }
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
      const { width, height } = img;
      const is1to1 = width === height;
      const minSize = 3000;
      const meetsMin = width >= minSize && height >= minSize;
      if (is1to1 && meetsMin) {
        setCoverArtwork(file);
        setFileUploaded(file);
        setFileError("");
        setFileValid(true);
      } else {
        setCoverArtwork(null);
        setFileUploaded(null);
        if (!is1to1) {
          setFileError(`Image must be 1:1 aspect ratio. Current: ${width}px × ${height}px.`);
        } else {
          setFileError(`Cover art must be at least 3000px × 3000px. Current: ${width}px × ${height}px.`);
        }
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

  const clearCoverArt = () => {
    setCoverArtwork(null);
    setFileUploaded(null);
    setCoverArtPreviewUrl(null);
    setFileError("");
    setFileValid(null);
    const input = document.getElementById("fileInput");
    if (input) input.value = "";
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
          <div className="upload-container cover-art-container">
            <div
              className={`upload-box ${fileValid === true ? "upload-success" : fileValid === false ? "upload-error" : ""}`}
              onClick={(e) => {
                if (e.target.closest(".cover-art-remove-btn")) return;
                if (!(fileUploaded || coverArtPreviewUrl)) document.getElementById("fileInput").click();
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add("drag-over");
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("drag-over");
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("drag-over");
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange({ target: { files: [file] } });
              }}
            >
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg, image/jfif"
                onChange={handleFileChange}
              />
              {(fileUploaded || coverArtPreviewUrl) ? (
                <div className="cover-art-preview-wrap">
                  <img
                    src={coverArtPreviewUrl || (fileUploaded ? URL.createObjectURL(fileUploaded) : "")}
                    alt="Cover preview"
                    className="upload-preview"
                  />
                  <button
                    type="button"
                    className="cover-art-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCoverArt();
                    }}
                    aria-label="Remove cover art"
                    title="Remove cover art"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text">
                  <p>
                    <img src={cloud} className="could-img" alt="could-image" />
                    Drag here or click to browse a file
                  </p>
                  <p className="file-types">
                    Supported: JPG, JPEG, PNG, JFIF (Max 10MB). 1:1 aspect ratio, min 3000×3000px.
                  </p>
                </div>
              )}
            </div>
            <div className={`upload-status ${fileValid === true ? "status-success" : fileValid === false ? "status-error" : "status-info"}`}>
              {fileValid === true ? (
                <p className="status-text success-text">
                  ✓ Image uploaded. 1:1 aspect ratio, at least 3000×3000px.
                </p>
              ) : fileValid === false ? (
                <p className="status-text error-text">
                  ✗ {fileError || "Cover art must be 1:1 aspect ratio and at least 3000px × 3000px."}
                </p>
              ) : (
                <p className="status-text info-text">
                  Note: 1:1 aspect ratio, minimum 3000px × 3000px
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

      <ContributorsSection
        artistsList={artistsList}
        loadingArtists={loadingArtists}
        contributors={contributors}
        onContributorsChange={setContributors}
        onRefreshArtists={() => getArtists().then((list) => Array.isArray(list) && setArtistsList(list))}
        onCreateArtist={(stageName, profileUrls = {}) => {
          const tempId = `temp-${Date.now()}`;
          const tempArtist = { artistId: tempId, artistName: stageName.trim() };
          setArtistsList((prev) => [...prev, tempArtist]);
          const payload = {
            publicProfileName: stageName.trim(),
            ...(profileUrls.soundCloudUrl && { soundCloudUrl: profileUrls.soundCloudUrl }),
            ...(profileUrls.spotifyUrl && { spotifyUrl: profileUrls.spotifyUrl }),
            ...(profileUrls.appleMusicUrl && { appleMusicUrl: profileUrls.appleMusicUrl }),
          };
          createArtist(payload)
            .then((created) => {
              const realId = created?.artistId ?? created?.artistID;
              const realName = created?.artistName ?? created?.stageName ?? stageName.trim();
              if (realId == null) return;
              setArtistsList((prev) =>
                prev.map((a) =>
                  (a.artistId === tempId || a.artistID === tempId) ? { ...a, artistId: realId, artistName: realName } : a
                )
              );
              setContributors((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((cat) => {
                  next[cat] = (next[cat] || []).map((c) =>
                    c.artistId === tempId || c.artistID === tempId
                      ? { ...c, artistId: realId, artistName: realName }
                      : c
                  );
                });
                return next;
              });
              getArtists().then((list) => Array.isArray(list) && setArtistsList(list));
            })
            .catch(() => {
              toast.dark("Artist will be synced shortly.", { transition: Slide });
            });
          return Promise.resolve(tempArtist);
        }}
      />

      {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
      {/* Step 4: Genres — custom dropdowns with max 15 visible items and scroll */}
      <div className="section">
        <h3>Genres</h3>

        <div className="genres-grid">
          {/* Primary Genre */}
          <div className="genre-dropdown">
            <label className="label-name" htmlFor="primary-genre">
              Primary Genre <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <div
              id="primary-genre"
              role="combobox"
              aria-expanded={primaryGenreOpen}
              aria-haspopup="listbox"
              className={`genre-dropdown-trigger ${!primaryGenre ? "" : ""}`}
              onClick={() => {
                setPrimaryGenreOpen((o) => !o);
                setSecondaryGenreOpen(false);
              }}
            >
              <span>{primaryGenre || "Select Primary Genre"}</span>
              <span aria-hidden>{primaryGenreOpen ? "▲" : "▼"}</span>
            </div>
            {primaryGenreOpen && (
              <div className="genre-dropdown-menu" role="listbox">
                <div
                  role="option"
                  aria-selected={!primaryGenre}
                  className={`genre-dropdown-option ${!primaryGenre ? "selected" : ""}`}
                  onClick={() => {
                    setPrimaryGenre("");
                    setSecondaryGenre("");
                    setPrimaryGenreOpen(false);
                  }}
                >
                  Select Primary Genre
                </div>
                {Object.keys(genres).map((genre) => (
                  <div
                    key={genre}
                    role="option"
                    aria-selected={primaryGenre === genre}
                    className={`genre-dropdown-option ${primaryGenre === genre ? "selected" : ""}`}
                    onClick={() => {
                      setPrimaryGenre(genre);
                      setSecondaryGenre("");
                      setPrimaryGenreOpen(false);
                    }}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Secondary Genre */}
          <div className="genre-dropdown">
            <label className="label-name" htmlFor="second-genre">
              Secondary Genre <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <div
              id="second-genre"
              role="combobox"
              aria-expanded={secondaryGenreOpen}
              aria-haspopup="listbox"
              className={`genre-dropdown-trigger ${!primaryGenre ? "disabled" : ""}`}
              onClick={() => {
                if (!primaryGenre) return;
                setSecondaryGenreOpen((o) => !o);
                setPrimaryGenreOpen(false);
              }}
            >
              <span>{secondaryGenre || "Select Secondary Genre"}</span>
              <span aria-hidden>{secondaryGenreOpen ? "▲" : "▼"}</span>
            </div>
            {secondaryGenreOpen && primaryGenre && (
              <div className="genre-dropdown-menu" role="listbox">
                <div
                  role="option"
                  aria-selected={!secondaryGenre}
                  className={`genre-dropdown-option ${!secondaryGenre ? "selected" : ""}`}
                  onClick={() => {
                    setSecondaryGenre("");
                    setSecondaryGenreOpen(false);
                  }}
                >
                  Select Secondary Genre
                </div>
                {genres[primaryGenre]?.map((sub) => (
                  <div
                    key={sub}
                    role="option"
                    aria-selected={secondaryGenre === sub}
                    className={`genre-dropdown-option ${secondaryGenre === sub ? "selected" : ""}`}
                    onClick={() => {
                      setSecondaryGenre(sub);
                      setSecondaryGenreOpen(false);
                    }}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
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
              min={getMinReleaseDate()}
              style={{ width: "300px" }}
              onChange={(e) => {
                const v = e.target.value;
                setDigitalReleaseDate(v);
                if (v) {
                  const selected = new Date(v);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const minDate = new Date(today);
                  minDate.setDate(today.getDate() + 2);
                  setDigitalReleaseDateError(selected < minDate ? "Digital release date must be at least 2 days from today." : "");
                } else {
                  setDigitalReleaseDateError("");
                }
              }}
            />
            {digitalReleaseDateError && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {digitalReleaseDateError}
              </div>
            )}
          </div>

          <div className="date-box">
            <label>Original Release Date</label>
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
                onChange={() => {
                  setHasUPC("no");
                  setUpcCodeError("");
                  setUpcCodeSuccess(false);
                }}
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
              placeholder="Enter Your UPC Code (13 digits)"
              className="input-field"
              style={{ width: "50%" }}
              value={upcCode}
              maxLength={13}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 13);
                setUpcCode(v);
                setUpcCodeError("");
                setUpcCodeSuccess(false);
              }}
              onBlur={() => {
                if (hasUPC !== "yes") return;
                const trimmed = upcCode.trim();
                if (!trimmed) {
                  setUpcCodeError("");
                  setUpcCodeSuccess(false);
                  return;
                }
                if (trimmed.length !== 13 || !/^\d{13}$/.test(trimmed)) {
                  setUpcCodeError("Invalid UPC code. Please check the last digit.");
                  setUpcCodeSuccess(false);
                  return;
                }
                if (!validateUPC13(trimmed)) {
                  setUpcCodeError("Invalid UPC code. Please check the last digit.");
                  setUpcCodeSuccess(false);
                  return;
                }
                setUpcCodeError("");
                setUpcCodeSuccess(true);
              }}
            />
            {upcCodeError && (
              <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {upcCodeError}
              </div>
            )}
            {upcCodeSuccess && !upcCodeError && (
              <div style={{ color: "var(--success, #22c55e)", fontSize: "12px", marginTop: "5px" }}>
                Valid UPC code
              </div>
            )}
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
