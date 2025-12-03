import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../styles/PreviewDistributePage.css";
import previewImg from "../assets/lsi.jpeg";
import "../styles/styled.css";
import "../styles/Home.css";
import { getFiles, getFileById } from "../services/files";

export default function PreviewDistributePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const releaseData = location.state || {};
  
  // Get release metadata from localStorage as fallback
  const releaseMetadataFromStorage = JSON.parse(
    localStorage.getItem("releaseMetadata") || "{}"
  );
  
  // Merge state data with localStorage fallback
  const mergedReleaseData = {
    ...releaseMetadataFromStorage,
    ...releaseData,
  };
  
  // Extract data from merged state
  const stores = mergedReleaseData.selectedStores || mergedReleaseData.stores || [];
  const [tracks, setTracks] = useState(mergedReleaseData.tracks || []);
  const releaseTitle = mergedReleaseData.releaseTitle || mergedReleaseData.title || "N/A";
  const titleVersion = mergedReleaseData.titleVersion || "";
  const coverArt = mergedReleaseData.coverArt || previewImg;
  const primaryGenre = mergedReleaseData.primaryGenre || "N/A";
  const secondaryGenre = mergedReleaseData.secondaryGenre || "N/A";
  const digitalReleaseDate = mergedReleaseData.digitalReleaseDate || "N/A";
  const originalReleaseDate = mergedReleaseData.originalReleaseDate || "N/A";
  const upcCode = mergedReleaseData.upcCode || (mergedReleaseData.hasUPC === "yes" ? mergedReleaseData.upcCode : "N/A");
  const contributors = mergedReleaseData.contributors || [];
  const localizations = mergedReleaseData.localizations || [];
  const labelName = mergedReleaseData.labelName || mergedReleaseData.label || "N/A";
  
  // Get main primary artist from contributors
  const mainPrimaryArtist = useMemo(() => {
    if (contributors.length > 0) {
      const mainArtist = contributors.find(c => c.type === "Main Primary Artist");
      return mainArtist ? mainArtist.name : contributors[0].name;
    }
    return releaseData.mainPrimaryArtist || "N/A";
  }, [contributors, releaseData.mainPrimaryArtist]);
  
  // Get language from first track or localizations
  const language = useMemo(() => {
    if (tracks.length > 0 && tracks[0].lyricsLanguage) {
      return tracks[0].lyricsLanguage;
    }
    if (localizations.length > 0 && localizations[0].language) {
      return localizations[0].language;
    }
    return "English";
  }, [tracks, localizations]);
  
  // Get explicit status from tracks
  const explicitStatus = useMemo(() => {
    if (tracks.length > 0) {
      // Check if track has lyrics language option
      const firstTrack = tracks[0];
      if (firstTrack.lyricsLanguageOption === "Instrumental") {
        return "N/A (Instrumental)";
      }
      if (firstTrack.explicitStatus) {
        return firstTrack.explicitStatus === "Explicit" ? "Yes" : 
               firstTrack.explicitStatus === "Not Explicit" ? "No" : 
               firstTrack.explicitStatus;
      }
    }
    return "No";
  }, [tracks]);
  
  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };
  
  // Format duration from seconds to mm:ss
  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || !isFinite(seconds) || seconds < 0) {
      return "--:--";
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };
  
  // Get ISRC codes from tracks
  const getISRCCodes = () => {
    return tracks
      .filter(t => t.isrcCode && t.isrcCode.trim() !== "")
      .map(t => t.isrcCode)
      .join(", ") || "N/A";
  };
  
  // Publishers - placeholder for now, can be enhanced later
  const publishers = [
    // { id: 1, name: "XYZ Records", symbol: "℗" },
    // { id: 2, name: "ABC Music Publishing", symbol: "©" },
  ];

  const [showPopup, setShowPopup] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get releaseId from releaseData
  const releaseId = releaseData.releaseId || releaseData.id;

  // Get auth headers helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch audio files for tracks on mount
  useEffect(() => {
    const fetchAudioFiles = async () => {
      if (!releaseId || tracks.length === 0) return;

      try {
        // Fetch all audio files for this release
        const filesResponse = await getFiles({ releaseId: releaseId, fileType: "Audio" });
        const audioFiles = filesResponse?.files || [];
        
        console.log(`Fetched ${audioFiles.length} audio files for release ${releaseId}:`, audioFiles);

        if (audioFiles.length === 0) {
          console.log("No audio files found for this release");
          return;
        }

        // Map audio files by trackId
        const filesByTrackId = {};
        audioFiles.forEach(file => {
          const trackId = file.trackId;
          if (!filesByTrackId[trackId]) {
            filesByTrackId[trackId] = [];
          }
          filesByTrackId[trackId].push(file);
        });

        // Update tracks with audio URLs
        const updatedTracks = await Promise.all(tracks.map(async (track) => {
          const trackId = track.trackId || track.id;
          if (!trackId) return track;

          const trackFiles = filesByTrackId[trackId] || [];
          // Get the best file (prefer AVAILABLE status with non-null cloudfrontUrl)
          const hasValidCloudfrontUrl = (f) => f.cloudfrontUrl !== null && f.cloudfrontUrl !== undefined && f.cloudfrontUrl !== "" && f.cloudfrontUrl !== "null";
          
          const bestFile = trackFiles.find(f => f.status === "AVAILABLE" && hasValidCloudfrontUrl(f)) || 
                          trackFiles.find(f => hasValidCloudfrontUrl(f)) || 
                          trackFiles.find(f => f.status === "AVAILABLE") ||
                          trackFiles[0];

          let audioUrl = "";
          if (bestFile && hasValidCloudfrontUrl(bestFile)) {
            audioUrl = bestFile.cloudfrontUrl;
          } else if (bestFile?.fileId) {
            // If cloudfrontUrl is null, try fetching file status
            try {
              const fileStatus = await getFileById(bestFile.fileId);
              if (fileStatus?.cloudfrontUrl && fileStatus.cloudfrontUrl !== "null" && fileStatus.cloudfrontUrl !== null) {
                audioUrl = fileStatus.cloudfrontUrl;
              }
            } catch (statusError) {
              console.warn(`Failed to fetch file status for fileId ${bestFile.fileId}:`, statusError);
            }
          }

          return {
            ...track,
            url: audioUrl || track.url, // Use fetched URL or keep existing
            audioUrl: audioUrl,
            audioFileId: bestFile?.fileId || track.audioFileId,
          };
        }));

        setTracks(updatedTracks);
        console.log("Updated tracks with audio URLs:", updatedTracks);
      } catch (error) {
        console.error("Error fetching audio files:", error);
        // Don't show error toast - tracks might not have audio files yet
      }
    };

    fetchAudioFiles();
  }, [releaseId]); // Only run when releaseId changes

  // Audio player state (similar to Home.jsx)
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time for audio player (similar to Home.jsx)
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Audio player functions (similar to Home.jsx)
  const handlePlay = (track) => {
    // Use audioUrl if available, otherwise fall back to url
    const audioUrl = track.audioUrl || track.url;
    if (!audioUrl || audioUrl === "null" || audioUrl.trim() === "") {
      toast.dark("No audio file available for this track");
      return;
    }

    // Prepare track data with title, album, artist structure (like Home.jsx)
    const trackData = {
      title: track.trackTitle || track.name || "Track",
      album: releaseTitle || "Release",
      artist: mainPrimaryArtist || "Artist",
      audio: audioUrl, // Use audioUrl (from files API) or fall back to url
      id: track.id || track.trackId,
    };

    // If clicking the same track again → toggle play/pause
    if (currentTrack?.id === trackData.id) {
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
    const newAudio = new Audio(trackData.audio);

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
        setIsPlaying(false);
      });

    // Save references in state
    setAudio(newAudio);
    setCurrentTrack(trackData);
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

  const handleFinalSubmit = () => {
    if (!releaseId) {
      toast.dark("Release ID not found. Please go back and create release first.");
      return;
    }
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    if (!releaseId) {
      toast.dark("Release ID not found. Please go back and create release first.");
      setShowPopup(false);
      return;
    }

    setIsSubmitting(true);
    
    // Validate that all tracks have audio files attached before submitting
    try {
      // Fetch release details to get trackIds
      const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
        headers: getAuthHeaders(),
      });
      
      const releaseData = releaseResponse.data?.release || releaseResponse.data;
      const trackIds = releaseData?.trackIds || [];
      
      if (trackIds.length === 0) {
        toast.dark("Cannot submit: Release has no tracks. Please add tracks first.", { autoClose: 5000 });
        setShowPopup(false);
        setIsSubmitting(false);
        return;
      }
      
      // Check each track to see if it has an audio file attached
      const tracksWithoutAudio = [];
      for (const trackId of trackIds) {
        try {
          const trackResponse = await axios.get(`/api/tracks/${trackId}`, {
            headers: getAuthHeaders(),
          });
          
          const trackData = trackResponse.data;
          const audioFileId = trackData?.audioFileId;
          
          // Check if audioFileId is valid (not 0, null, undefined, or empty object)
          if (!audioFileId || 
              audioFileId === 0 || 
              (typeof audioFileId === 'object' && Object.keys(audioFileId).length === 0)) {
            tracksWithoutAudio.push({
              trackId: trackId,
              title: trackData?.title || `Track ${trackId}`,
            });
          }
        } catch (trackError) {
          console.warn(`Failed to fetch track ${trackId}:`, trackError);
          tracksWithoutAudio.push({
            trackId: trackId,
            title: `Track ${trackId}`,
          });
        }
      }
      
      if (tracksWithoutAudio.length > 0) {
        const trackTitles = tracksWithoutAudio.map(t => t.title).join(", ");
        toast.dark(
          `Cannot submit: ${tracksWithoutAudio.length} track(s) are missing audio files: ${trackTitles}. Please upload audio files for all tracks before submitting.`,
          { autoClose: 8000 }
        );
        setShowPopup(false);
        setIsSubmitting(false);
        return;
      }
    } catch (validationError) {
      console.error("Error validating tracks:", validationError);
      // Continue with submission if validation fails (backend will catch it)
      toast.dark("Warning: Could not validate tracks. Proceeding with submission...", { autoClose: 3000 });
    }

    // Proceed with submission if validation passes
    try {
      console.log(`[PreviewDistributePage] Submitting release ${releaseId} for QC...`);
      const response = await axios.post(
        `/api/releases/${releaseId}/submit`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      console.log(`[PreviewDistributePage] Submit response:`, response.data);
      console.log(`[PreviewDistributePage] Response status:`, response.status);

      if (response.status === 200) {
        const successMessage = response.data?.message || "Release submitted for QC successfully";
        console.log(`[PreviewDistributePage] ✅ Release submitted successfully. Message: ${successMessage}`);
        console.log(`[PreviewDistributePage] Release should now be in label QC queue at /api/qc/queue/label`);
        
        toast.dark(successMessage);
        setStatus("Submitted");
        setShowPopup(false);
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error(`[PreviewDistributePage] ❌ Error submitting release:`, error);
      console.error(`[PreviewDistributePage] Error status:`, error.response?.status);
      console.error(`[PreviewDistributePage] Error response:`, error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to submit release. Please try again.";
      toast.dark(errorMessage, { autoClose: 5000 });
      setShowPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setShowPopup(false);

  return (
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
                <span className="meta-value">
                  {releaseTitle}{titleVersion ? ` (${titleVersion})` : ""}
                </span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Artist</span>
                <span className="meta-value">{mainPrimaryArtist}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Label</span>
                <span className="meta-value">{labelName}</span>
              </div>
            </div>

            {/* --- Tracks Section --- */}
            <div className="tracks-section section-container">
              {/* <h3>Tracks</h3> */}
              {tracks.length > 0 ? (
                tracks.map((track, index) => (
                  <div className="track-card" key={track.id || index}>
                    <div className="metadata-row">
                      <span className="meta-label">{index + 1}</span>
                      <span className="meta-value">
                        {track.trackTitle || track.name || `Track ${index + 1}`}
                        {track.catalogId ? ` (${track.catalogId})` : ""}
                      </span>
                    </div>
                    <div className="duration-player-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>{formatDuration(track.duration)}</span>
                      {(track.audioUrl || track.url) && (
                        <button
                          className="btn-gradient"
                          onClick={() => handlePlay(track)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "14px",
                            minWidth: "60px",
                          }}
                        >
                          {currentTrack?.id === (track.id || track.trackId) && isPlaying ? "⏸" : "▶"}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="track-card">
                  <div className="metadata-row">
                    <span className="meta-value">No tracks available</span>
                  </div>
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
                <span className="meta-value">{secondaryGenre}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Explicit Lyrics</span>
                <span className="meta-value">{explicitStatus}</span>
              </div>
            </div>

            {/* --- Release Dates & Codes --- */}
            <div className="metadata-codes-container section-container">
              {/* <h3>Release Dates & Codes</h3> */}
              <div className="metadata-row">
                <span className="meta-label">Digital Release Date</span>
                <span className="meta-value">{formatDate(digitalReleaseDate)}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">Original Release Date</span>
                <span className="meta-value">{formatDate(originalReleaseDate)}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">ISRC Code</span>
                <span className="meta-value">{getISRCCodes()}</span>
              </div>
              <div className="metadata-row">
                <span className="meta-label">UPC Code</span>
                <span className="meta-value">{upcCode}</span>
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
              {publishers.length > 0 ? (
                publishers.map((pub) => (
                  <div className="metadata-row" key={pub.id}>
                    <span className="meta-label">{pub.symbol}</span>
                    <span className="meta-value">{pub.name}</span>
                  </div>
                ))
              ) : (
                <div className="metadata-row">
                  <span className="meta-value">No publishers specified</span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Right Column: Cover Image ===== */}
          <div className="prev-right-column">
            <img src={coverArt} alt="Cover" className="prev-cover-image" />
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

      {/* Music Player (similar to Home.jsx) */}
      {currentTrack && (
        <div className="music-player">
          <div className="player-content">
            {/* Left: Album Art */}
            <div className="player-left">
              <div className="album-art-wrapper">
                <img
                  src={coverArt || previewImg}
                  alt={currentTrack.title}
                  className="player-img"
                />
                <button
                  className="img-play-btn"
                  onClick={() => {
                    if (isPlaying) audio.pause();
                    else audio.play();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              </div>
            </div>

            {/* Middle: Progress + Track Info */}
            <div className="player-middle">
              <div className="player-progress-container">
                <span className="time">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = e.target.value;
                    audio.currentTime = newTime;
                    setCurrentTime(newTime);
                  }}
                  className="progress-bar"
                  style={{ "--progress": `${(currentTime / duration) * 100}%` }}
                />
                <span className="time">{formatTime(duration)}</span>
              </div>

              <div className="track-info">
                <div className="music-track-title">{currentTrack.title}</div>
                <div className="music-track-subtitle">{currentTrack.album}</div>
                <div className="music-track-title">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Right: Volume + Close */}
            <button
              className="mute-btn"
              onClick={() => {
                if (audio) audio.muted = !audio.muted;
                setIsPlaying((prev) => prev);
              }}
            >
              {audio?.muted ? "🔇" : "🔊"}
            </button>
            <div className="player-right">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audio?.volume || 1}
                onChange={(e) => {
                  audio.volume = e.target.value;
                }}
                className="volume-bar"
              />

              <button
                className="close-play"
                onClick={() => {
                  audio.pause();
                  audio.currentTime = 0;
                  setAudio(null);
                  setCurrentTrack(null);
                  setIsPlaying(false);
                  setCurrentTime(0);
                  setDuration(0);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
      />
    </div>
  );
}
