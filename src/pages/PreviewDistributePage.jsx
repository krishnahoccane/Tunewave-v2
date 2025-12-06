import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../styles/PreviewDistributePage.css";
import previewImg from "../assets/lsi.jpeg";
import "../styles/styled.css";
import "../styles/Home.css";
import { getFiles, getFileById, getFilePlayUrl } from "../services/files";

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
  
  // Initialize tracks - prioritize localStorage tracks (they have blob URLs) over state tracks
  const [tracks, setTracks] = useState(() => {
    try {
      const uploadedTracksFromStorage = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
      if (uploadedTracksFromStorage.length > 0) {
        console.log(`[PreviewDistributePage] Initializing with ${uploadedTracksFromStorage.length} tracks from localStorage`);
        return uploadedTracksFromStorage;
      }
    } catch (error) {
      console.warn("[PreviewDistributePage] Failed to load tracks from localStorage on init:", error);
    }
    return mergedReleaseData.tracks || [];
  });
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

  // Fetch audio files for tracks on mount and when tracks/releaseId changes
  useEffect(() => {
    const fetchAudioFiles = async () => {
      // First, check if current tracks already have blob URLs (from initialization)
      const hasBlobUrls = tracks.some(t => (t.url && t.url.startsWith('blob:')) || (t.audioUrl && t.audioUrl.startsWith('blob:')));
      if (hasBlobUrls) {
        console.log(`[PreviewDistributePage] Tracks already have blob URLs, ensuring audioUrl is set`);
        // Ensure audioUrl is set for all tracks with blob URLs
        const updatedTracks = tracks.map(track => ({
          ...track,
          audioUrl: track.audioUrl || track.url,
          url: track.url || track.audioUrl,
        }));
        setTracks(updatedTracks);
        return; // Use existing blob URLs, don't fetch from API
      }
      
      // Try to load tracks from localStorage and match with current tracks
      try {
        const uploadedTracksFromStorage = JSON.parse(localStorage.getItem("uploadedTracks") || "[]");
        if (uploadedTracksFromStorage.length > 0) {
          console.log(`[PreviewDistributePage] Found ${uploadedTracksFromStorage.length} tracks in localStorage, trying to match`);
          
          // Match tracks by name, trackTitle, trackId, or id
          const tracksWithBlobUrls = tracks.map((track) => {
            const matchingStorageTrack = uploadedTracksFromStorage.find(
              (st) => (st.name && track.name && st.name === track.name) || 
                      (st.trackTitle && track.trackTitle && st.trackTitle === track.trackTitle) ||
                      (st.trackId && (st.trackId === (track.trackId || track.id))) ||
                      (st.id && (st.id === (track.id || track.trackId)))
            );
            
            if (matchingStorageTrack && matchingStorageTrack.url && matchingStorageTrack.url.startsWith('blob:')) {
              console.log(`[PreviewDistributePage] Matched and restoring blob URL for track: ${track.trackTitle || track.name || track.id}`);
              return {
                ...track,
                url: matchingStorageTrack.url,
                audioUrl: matchingStorageTrack.url,
                duration: matchingStorageTrack.duration || track.duration,
              };
            }
            // If track already has a blob URL, keep it
            if (track.url && track.url.startsWith('blob:')) {
              return {
                ...track,
                audioUrl: track.url,
              };
            }
            return track;
          });
          
          const hasAnyBlobUrls = tracksWithBlobUrls.some(t => (t.url && t.url.startsWith('blob:')) || (t.audioUrl && t.audioUrl.startsWith('blob:')));
          if (hasAnyBlobUrls) {
            console.log(`[PreviewDistributePage] Using tracks with blob URLs from localStorage`);
            setTracks(tracksWithBlobUrls);
            return; // Use localStorage tracks, don't fetch from API
          }
        }
      } catch (storageError) {
        console.warn("[PreviewDistributePage] Failed to load tracks from localStorage:", storageError);
      }
      
      if (!releaseId) {
        console.log("[PreviewDistributePage] No releaseId, skipping audio fetch");
        return;
      }
      
      if (tracks.length === 0) {
        console.log("[PreviewDistributePage] No tracks, skipping audio fetch");
        return;
      }

      console.log(`[PreviewDistributePage] Fetching audio files for ${tracks.length} tracks, releaseId: ${releaseId}`);
      console.log(`[PreviewDistributePage] Current tracks:`, tracks);

      try {
        // Fetch all audio files for this release
        const filesResponse = await getFiles({ releaseId: releaseId, fileType: "Audio" });
        const audioFiles = filesResponse?.files || [];
        
        console.log(`[PreviewDistributePage] Fetched ${audioFiles.length} audio files for release ${releaseId}:`, audioFiles);

        if (audioFiles.length === 0) {
          console.log("[PreviewDistributePage] No audio files found for this release");
          // Still update tracks to ensure they have proper structure
          const updatedTracks = tracks.map(track => ({
            ...track,
            audioUrl: track.audioUrl || track.url || "",
            url: track.url || track.audioUrl || "",
          }));
          setTracks(updatedTracks);
          return;
        }

        // Map audio files by trackId
        const filesByTrackId = {};
        audioFiles.forEach(file => {
          const trackId = file.trackId;
          if (trackId) {
            if (!filesByTrackId[trackId]) {
              filesByTrackId[trackId] = [];
            }
            filesByTrackId[trackId].push(file);
          }
        });

        console.log(`[PreviewDistributePage] Files mapped by trackId:`, filesByTrackId);

        // Update tracks with audio URLs
        const updatedTracks = await Promise.all(tracks.map(async (track, idx) => {
          const trackId = track.trackId || track.id;
          
          console.log(`[PreviewDistributePage] Processing track ${idx + 1}:`, {
            trackId,
            trackTitle: track.trackTitle || track.name,
            hasUrl: !!(track.url || track.audioUrl),
            existingUrl: track.url || track.audioUrl,
          });

          if (!trackId) {
            console.warn(`[PreviewDistributePage] Track ${idx + 1} has no trackId`);
            // If no trackId but has blob URL, use it as fallback
            if (track.url && track.url.startsWith('blob:')) {
              console.log(`[PreviewDistributePage] Track ${idx + 1} has no trackId, using blob URL:`, track.url);
              return {
                ...track,
                audioUrl: track.url,
                url: track.url,
              };
            }
            return {
              ...track,
              audioUrl: track.audioUrl || track.url || "",
              url: track.url || track.audioUrl || "",
            };
          }

          // Always check for API files first (prefer API URLs over blob URLs)
          const trackFiles = filesByTrackId[trackId] || [];
          console.log(`[PreviewDistributePage] Found ${trackFiles.length} files for trackId ${trackId}`);
          
          // If no API files available, use blob URL if it exists
          if (trackFiles.length === 0) {
            if (track.url && (track.url.startsWith('blob:') || track.url.startsWith('http'))) {
              console.log(`[PreviewDistributePage] Track ${idx + 1} has no API files, using blob URL:`, track.url);
              return {
                ...track,
                audioUrl: track.url,
                url: track.url,
              };
            }
          }

          // Get the best file (prefer AVAILABLE status)
          const bestFile = trackFiles.find(f => f.status === "AVAILABLE") || trackFiles[0];

          let audioUrl = "";
          
          // Priority 1: Use cloudfrontUrl if available (no auth needed, works directly in audio element)
          const hasValidCloudfrontUrl = (f) => f.cloudfrontUrl !== null && f.cloudfrontUrl !== undefined && f.cloudfrontUrl !== "" && f.cloudfrontUrl !== "null";
          
          if (bestFile && hasValidCloudfrontUrl(bestFile)) {
            audioUrl = bestFile.cloudfrontUrl;
            console.log(`[PreviewDistributePage] Using cloudfrontUrl from bestFile for trackId ${trackId}:`, audioUrl);
          } else if (bestFile?.fileId) {
            // Try fetching file status to get cloudfrontUrl
            try {
              console.log(`[PreviewDistributePage] Fetching file status for fileId ${bestFile.fileId}`);
              const fileStatus = await getFileById(bestFile.fileId);
              if (fileStatus?.cloudfrontUrl && fileStatus.cloudfrontUrl !== "null" && fileStatus.cloudfrontUrl !== null) {
                audioUrl = fileStatus.cloudfrontUrl;
                console.log(`[PreviewDistributePage] Got cloudfrontUrl from file status:`, audioUrl);
              }
            } catch (statusError) {
              console.warn(`[PreviewDistributePage] Failed to fetch file status for fileId ${bestFile.fileId}:`, statusError);
            }
          }
          
          // Priority 2: Use /api/files/play/{fileId} only if cloudfrontUrl not available
          // Note: This endpoint requires auth, so we'll use previous method (cloudfrontUrl/blob) instead
          // Only use play endpoint if no other URL is available
          if (!audioUrl) {
            const fileId = bestFile?.fileId || track.audioFileId;
            if (fileId && fileId > 0) {
              // Try to fetch file details to get cloudfrontUrl
              try {
                const fileDetails = await getFileById(fileId);
                if (fileDetails?.cloudfrontUrl && fileDetails.cloudfrontUrl !== "null" && fileDetails.cloudfrontUrl !== null) {
                  audioUrl = fileDetails.cloudfrontUrl;
                  console.log(`[PreviewDistributePage] Got cloudfrontUrl from file details for fileId ${fileId}:`, audioUrl);
                } else {
                  // If no cloudfrontUrl, use play endpoint (will require auth handling)
                  audioUrl = getFilePlayUrl(fileId);
                  console.log(`[PreviewDistributePage] Using /api/files/play/${fileId} (requires auth):`, audioUrl);
                }
              } catch (fileError) {
                console.warn(`[PreviewDistributePage] Failed to fetch file details for fileId ${fileId}:`, fileError);
                // Fallback to play endpoint
                audioUrl = getFilePlayUrl(fileId);
                console.log(`[PreviewDistributePage] Using /api/files/play/${fileId} as fallback:`, audioUrl);
              }
            }
            
            // Also try to use playUrl if available
            if (!audioUrl && bestFile?.playUrl) {
              audioUrl = bestFile.playUrl;
              console.log(`[PreviewDistributePage] Using playUrl for trackId ${trackId}:`, audioUrl);
            }
          }

          // Final fallback: Use blob URL if no API URL available
          const finalUrl = audioUrl || (track.url && track.url.startsWith('blob:') ? track.url : "") || track.audioUrl || "";
          console.log(`[PreviewDistributePage] Final URL for track ${idx + 1} (trackId ${trackId}):`, finalUrl, `(Play API: ${!!audioUrl && audioUrl.includes('/play/')}, Blob: ${track.url?.startsWith('blob:')})`);

          return {
            ...track,
            url: finalUrl,
            audioUrl: finalUrl,
            audioFileId: bestFile?.fileId || track.audioFileId,
          };
        }));

        setTracks(updatedTracks);
        console.log("[PreviewDistributePage] Updated tracks with audio URLs:", updatedTracks);
      } catch (error) {
        console.error("[PreviewDistributePage] Error fetching audio files:", error);
        // Don't show error toast - tracks might not have audio files yet
      }
    };

    fetchAudioFiles();
  }, [releaseId, tracks.length]); // Run when releaseId or tracks count changes

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
        
        // Clear all create release form data from localStorage after successful QC submission
        try {
          localStorage.removeItem("createReleaseFormData");
          localStorage.removeItem("releaseMetadata");
          localStorage.removeItem("selectStoresFormData");
          localStorage.removeItem("uploadedTracks");
          
          // Clear track details data (if stored with pattern trackDetails_*)
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith("trackDetails_")) {
              localStorage.removeItem(key);
            }
          });
          
          console.log(`[PreviewDistributePage] ✅ Cleared all create release form data from localStorage`);
        } catch (error) {
          console.warn(`[PreviewDistributePage] Failed to clear localStorage:`, error);
        }
        
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
                    <div className="duration-player-row" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span>{formatDuration(track.duration)}</span>
                      {(track.audioUrl || track.url) && (
                        <>
                          {/* Simple audio controls like UploadTracks */}
                          <audio 
                            key={`audio-${track.id || track.trackId}-${track.audioUrl || track.url}`}
                            controls 
                            src={track.audioUrl || track.url || ""}
                            preload="metadata"
                            crossOrigin="anonymous"
                            style={{ maxWidth: "200px", height: "32px" }}
                            onPlay={(e) => {
                              const audioEl = e.target;
                              // Update state when audio plays
                              const trackData = {
                                title: track.trackTitle || track.name || "Track",
                                album: releaseTitle || "Release",
                                artist: mainPrimaryArtist || "Artist",
                                audio: track.audioUrl || track.url,
                                id: track.id || track.trackId,
                              };
                              setCurrentTrack(trackData);
                              setIsPlaying(true);
                              // Update duration if available
                              if (audioEl.duration && isFinite(audioEl.duration) && audioEl.duration > 0) {
                                setDuration(audioEl.duration);
                                // Update track duration in state
                                setTracks(prevTracks => {
                                  const updated = [...prevTracks];
                                  if (updated[index] && (!updated[index].duration || updated[index].duration === 0)) {
                                    updated[index] = {
                                      ...updated[index],
                                      duration: audioEl.duration,
                                    };
                                  }
                                  return updated;
                                });
                              }
                            }}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => {
                              setIsPlaying(false);
                              setCurrentTime(0);
                            }}
                            onTimeUpdate={(e) => {
                              const audioEl = e.target;
                              if (audioEl.currentTime && isFinite(audioEl.currentTime)) {
                                setCurrentTime(audioEl.currentTime);
                              }
                              if (audioEl.duration && isFinite(audioEl.duration) && audioEl.duration > 0) {
                                setDuration(audioEl.duration);
                              }
                            }}
                            onLoadedMetadata={(e) => {
                              const audioEl = e.target;
                              console.log(`[PreviewDistributePage] Audio metadata loaded for track ${index + 1}:`, {
                                duration: audioEl.duration,
                                src: audioEl.src,
                                readyState: audioEl.readyState,
                                trackId: track.id || track.trackId,
                              });
                              if (audioEl.duration && isFinite(audioEl.duration) && audioEl.duration > 0) {
                                setDuration(audioEl.duration);
                                // Update track duration in state
                                setTracks(prevTracks => {
                                  const updated = [...prevTracks];
                                  if (updated[index]) {
                                    updated[index] = {
                                      ...updated[index],
                                      duration: audioEl.duration,
                                    };
                                  }
                                  return updated;
                                });
                              } else {
                                console.warn(`[PreviewDistributePage] Invalid duration for track ${index + 1}:`, audioEl.duration);
                              }
                            }}
                            onError={(e) => {
                              console.error(`[PreviewDistributePage] Audio error for track ${index + 1}:`, {
                                error: e.target.error,
                                errorCode: e.target.error?.code,
                                errorMessage: e.target.error?.message,
                                src: e.target.src,
                                track: track,
                              });
                              toast.dark(`Failed to load audio for "${track.trackTitle || track.name || `Track ${index + 1}`}". Check console for details.`);
                            }}
                          />
                          {/* Custom play button (alternative) */}
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
                        </>
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
