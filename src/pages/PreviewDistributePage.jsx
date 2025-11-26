import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../styles/PreviewDistributePage.css";
import previewImg from "../assets/lsi.jpeg";
import "../styles/styled.css";
import "../styles/Home.css";

export default function PreviewDistributePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const releaseData = location.state || {};
  const stores = releaseData.stores || releaseData.selectedStores || [];
  const success = releaseData.success || false;
  const successMessage = releaseData.message || "Release created successfully!";
  const tracksFromState = releaseData.tracks || [];
  const releaseId = releaseData.releaseId || parseInt(localStorage.getItem("currentReleaseId"), 10);
  
  const [showPopup, setShowPopup] = useState(false);
  const [fetchedReleaseData, setFetchedReleaseData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Music player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Cover image upload state
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Helper function to format date
  const formatDateDisplay = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Fetch release data from API if releaseId is available and data is missing
  useEffect(() => {
    const fetchReleaseData = async () => {
      if (releaseId && (!releaseData.title || !releaseData.primaryGenre)) {
        setLoading(true);
        try {
          const { getReleaseById } = await import("../services/releases");
          const fetchedData = await getReleaseById(releaseId);
          setFetchedReleaseData(fetchedData);
          console.log("✅ Fetched release data from API:", fetchedData);
        } catch (error) {
          console.error("Error fetching release data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReleaseData();
  }, [releaseId, releaseData.title, releaseData.primaryGenre]);

  // Merge release data: state > fetched > defaults
  const mergedReleaseData = { ...fetchedReleaseData, ...releaseData };
  
  // Extract release metadata with defaults
  const releaseTitle = mergedReleaseData.title || mergedReleaseData.releaseTitle || "Happy Days";
  const releaseArtist = mergedReleaseData.artist || mergedReleaseData.artistName || mergedReleaseData.contributors?.[0]?.artistName || "Micky J Meyer";
  const releaseLabel = mergedReleaseData.label || mergedReleaseData.labelName || "Vivo";
  const primaryGenre = mergedReleaseData.primaryGenre || "Alternative/Experimental";
  const secondaryGenre = mergedReleaseData.secondaryGenre || "Experimental";
  const digitalReleaseDate = formatDateDisplay(mergedReleaseData.digitalReleaseDate) || "15/02/2025";
  const originalReleaseDate = formatDateDisplay(mergedReleaseData.originalReleaseDate) || "15/02/2025";
  const upcCode = mergedReleaseData.upcCode || "AA18079998989";
  const language = mergedReleaseData.language || "English";
  const explicitLyrics = mergedReleaseData.explicitFlag !== undefined ? (mergedReleaseData.explicitFlag ? "Yes" : "No") : "Yes";

  // Debug: Log received data
  console.log("PreviewDistributePage - Location state:", location.state);
  console.log("PreviewDistributePage - Merged release data:", mergedReleaseData);
  console.log("PreviewDistributePage - Stores:", stores);
  console.log("PreviewDistributePage - Tracks:", tracksFromState);
  console.log("PreviewDistributePage - Release ID:", releaseId);

  // Show success message on mount if redirected from successful submission
  useEffect(() => {
    if (success) {
      toast.success(successMessage, {
        transition: Slide,
        autoClose: 5000,
        position: "top-center",
      });
    }
  }, [success, successMessage]);

  // Format time helper
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle track play
  const handlePlay = (track) => {
    // Get audio URL from track
    const audioUrl = track.url || track.audioUrl || (track.file ? URL.createObjectURL(track.file) : null);
    
    if (!audioUrl) {
      toast.error("Audio file not available for this track", { transition: Slide });
      return;
    }

    // If clicking the same track again → toggle play/pause
    if (currentTrack?.trackId === track.trackId || currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
      return;
    }

    // Stop and cleanup previous audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }

    // Create new audio instance
    const newAudio = new Audio(audioUrl);

    // Event listeners for metadata and progress
    newAudio.addEventListener("loadedmetadata", () => {
      setDuration(newAudio.duration);
    });

    newAudio.addEventListener("timeupdate", () => {
      setCurrentTime(newAudio.currentTime);
    });

    // When song ends, reset player state
    newAudio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    // Start playback
    newAudio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Audio play failed:", err);
        toast.error("Failed to play audio. Please check the file.", { transition: Slide });
        setIsPlaying(false);
      });

    // Save references in state
    setAudio(newAudio);
    setCurrentTrack({
      ...track,
      title: track.trackTitle || track.title || track.name,
      img: coverImagePreview || mergedReleaseData?.coverArtUrl || mergedReleaseData?.coverArt || previewImg,
      album: releaseTitle,
      artist: releaseArtist,
    });
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      }
    };
  }, [audio]);

  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file", { transition: Slide });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB", { transition: Slide });
        return;
      }

      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Cover image uploaded successfully!", { transition: Slide });
    }
  };

  const handleFinalSubmit = () => setShowPopup(true);
  const handleConfirm = () => {
    setShowPopup(false);
    navigate("/dashboard");
  };
  const handleCancel = () => setShowPopup(false);

  // Use tracks from state if available, otherwise use default
  const displayTracks = tracksFromState.length > 0 ? tracksFromState : [
    {
      id: 1,
      title: "Happy Days - Micky J Meyer",
      audioUrl: "/tracks/track1.mp3",
      duration: "05:51",
    },
    {
      id: 2,
      title: "Happy Days - Micky J Meyer",
      audioUrl: "/tracks/track2.mp3",
      duration: "03:58",
    },
  ];

  const publishers = [
    { id: 1, name: "XYZ Records", symbol: "℗" },
    { id: 2, name: "ABC Music Publishing", symbol: "©" },
  ];

  const [status, setStatus] = useState("Pending");

  return (
    <>
      <ToastContainer />
      <div className="pages-layout-container">
      {/* ===== Page Title ===== */}
      <h2 className="pages-main-title">
        Preview & Distribute
        <span className={`status-bar status ${status.toLowerCase()}`}>
          {" "}
          {status}
        </span>
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
                <span className="meta-value">{releaseTitle}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Artist</span>
                <span className="meta-value">{releaseArtist}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Label</span>
                <span className="meta-value">{releaseLabel}</span>
              </div>
            </div>

            {/* --- Tracks Section --- */}
            <div className="tracks-section section-container">
              {/* <h3>Tracks</h3> */}
              {displayTracks.length > 0 ? (
                displayTracks.map((track, index) => (
                  <div className="track-card" key={track.trackId || track.id || index}>
                    <div className="metadata-row">
                      <span className="meta-label">{track.trackNumber || track.trackNumber || index + 1}</span>
                      <span className="meta-value">{track.trackTitle || track.title || track.name || "Untitled Track"}</span>
                    </div>
                    <div className="duration-player-row">
                      <span>
                        {track.durationSeconds 
                          ? `${Math.floor(track.durationSeconds / 60)}:${String(track.durationSeconds % 60).padStart(2, '0')}`
                          : track.duration || "--:--"}
                      </span>
                      {track.audioUrl && (
                        <audio controls>
                          <source src={track.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="metadata-row">
                  <span className="meta-value">No tracks available</span>
                </div>
              )}
            </div>

            {/* --- Metadata Section --- */}
            <div className="metadata-container section-container">
              {/* <h3>Metadata</h3> */}
              <div className="metadata-row">
                <span className="meta-label">Language</span>
                <span className="meta-value">{language}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Primary Genre</span>
                <span className="meta-value">{primaryGenre}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Secondary Genre</span>
                <span className="meta-value">{secondaryGenre || "N/A"}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Explicit Lyrics</span>
                <span className="meta-value">{explicitLyrics}</span>
              </div>
            </div>

            {/* --- Release Dates & Codes --- */}
            <div className="metadata-codes-container section-container">
              {/* <h3>Release Dates & Codes</h3> */}
              <div className="metadata-row">
                <span className="meta-label">Digital Release Date</span>
                <span className="meta-value">{digitalReleaseDate}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Original Release Date</span>
                <span className="meta-value">{originalReleaseDate}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">ISRC Code</span>
                <span className="meta-value">
                  {tracksFromState.length > 0 && tracksFromState[0]?.isrcCode 
                    ? tracksFromState[0].isrcCode 
                    : "AA18079998989"}
                </span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">UPC Code</span>
                <span className="meta-value">{upcCode || "N/A"}</span>
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
            <img 
              src={mergedReleaseData?.coverArtUrl || mergedReleaseData?.coverArt || releaseData.coverArtUrl || releaseData.coverArt || previewImg} 
              alt="Cover" 
              className="prev-cover-image" 
              onError={(e) => {
                e.target.src = previewImg; // Fallback to default image on error
              }}
            />
          </div>
        </div>

        {/* ===== Action Buttons ===== */}
        <div className="form-actions">
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn-gradient" onClick={handleFinalSubmit}>
            Final Submit
          </button>
        </div>
      </div>

      {/* ===== Confirmation Popup ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Confirm Submission</h4>
            <p>
              Are you sure? you want to submit your release for distribution?
            </p>
            <div className="form-actions">
              <button className="btn-gradient" onClick={handleConfirm}>
                Yes, Submit
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
