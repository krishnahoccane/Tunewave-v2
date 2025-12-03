import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFiles, getFileById } from "../services/files";
import "../styles/styled.css";
import "../styles/Home.css";
import previewImg from "../assets/lsi.jpeg";

/**
 * QCDetailPage Component
 * 
 * Flow:
 * 1. On load: Fetches release details from GET /api/releases/{releaseId}
 * 2. Fetches all tracks from GET /api/tracks?releaseId={releaseId} (with fallbacks)
 * 3. Populates editable form with release data
 * 4. User can edit fields and change cover art
 * 5. On Approve/Reject/Submit:
 *    - Merges form data with existing release data (prevents null fields)
 *    - Updates release via POST /api/releases/{releaseId}
 *    - Performs QC action via POST /api/qc/queue/{role}/{releaseId}/{action}
 */
export default function QCDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { actualRole } = useRole();
  
  // Get track data from location state (passed from QC table row click)
  const trackData = location.state?.trackData || {};
  const releaseId = location.state?.releaseId || trackData.releaseId || trackData.id;
  
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupAction, setPopupAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(""); // Notes/reason for approve/reject

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("jwtToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Get QC API endpoint base for actions (approve/reject) - different from queue endpoint
  const getQCActionEndpoint = () => {
    if (actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin") {
      return "/api/qc/tunewave";
    } else if (actualRole === "EnterpriseAdmin" || actualRole?.toLowerCase() === "enterpriseadmin") {
      return "/api/qc/enterprise";
    } else if (actualRole === "LabelAdmin" || actualRole?.toLowerCase() === "labeladmin") {
      return "/api/qc/label";
    }
    return "/api/qc/label"; // Default fallback
  };
  
  // Initialize form data
  const initializeFormData = (data) => ({
    title: data?.title || "Happy Days",
    artist: data?.artist || "Micky J Meyer",
    label: data?.label || "Vivo",
    language: data?.language || "English",
    primaryGenre: data?.primaryGenre || "Alternative/Experimental",
    secondaryGenre: data?.secondaryGenre || "Experimental",
    explicitLyrics: data?.explicitLyrics || "Yes",
    digitalReleaseDate: data?.digitalReleaseDate || "15/02/2025",
    originalReleaseDate: data?.originalReleaseDate || "15/02/2025",
    isrcCode: data?.isrcCode || "AA18079998989",
    upcCode: data?.upcCode || "AA18079998989",
    stores: data?.stores || [],
  });

  // Editable form state
  const [formData, setFormData] = useState(() => initializeFormData(trackData));
  const [originalReleaseData, setOriginalReleaseData] = useState(null); // Store original data for merging
  const [tracks, setTracks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const [coverArtwork, setCoverArtwork] = useState(null);
  const [coverPreview, setCoverPreview] = useState(trackData?.coverImage || previewImg);
  const [status, setStatus] = useState(trackData?.status || "Pending");

  // Audio player state (similar to Home.jsx)
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Track edited fields for update functionality
  const [editedFields, setEditedFields] = useState(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [editedStores, setEditedStores] = useState(null);
  const [editedTracks, setEditedTracks] = useState([]);

  // Fetch release details and tracks by releaseId
  useEffect(() => {
    const fetchReleaseData = async () => {
      if (!releaseId) {
        console.warn("No releaseId provided");
        setFetchingData(false);
        return;
      }

      try {
        setFetchingData(true);
        console.log(`Fetching release details for releaseId: ${releaseId}`);
        
        // Fetch release details
        const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
          headers: getAuthHeaders(),
        });
        
        const responseData = releaseResponse.data || {};
        console.log("Release API response:", responseData);
        
        // Handle API response structure: { release: {...}, contributors: [...], tracks: [...] }
        const releaseData = responseData.release || responseData;
        // Handle null contributors/tracks explicitly - API returns null, not empty array
        const contributorsData = (responseData.contributors === null || responseData.contributors === undefined) 
          ? [] 
          : (Array.isArray(responseData.contributors) ? responseData.contributors : []);
        const tracksData = (responseData.tracks === null || responseData.tracks === undefined)
          ? []
          : (Array.isArray(responseData.tracks) ? responseData.tracks : []);
        
        console.log("Release data:", releaseData);
        console.log("Contributors:", contributorsData);
        console.log("Tracks:", tracksData);
        
        // Store original data for merging later (include full response structure)
        setOriginalReleaseData({
          ...releaseData,
          contributors: contributorsData,
          tracks: tracksData,
        });
        
        // Get main artist from contributors and fetch artist details if needed
        let artistName = "N/A";
        if (contributorsData && contributorsData.length > 0) {
          const mainArtist = contributorsData.find(c => c.role === "Main Primary Artist" || !c.role) || contributorsData[0];
          
          if (mainArtist) {
            // If artistName is not in contributor, fetch from artist API using artistId
            if (mainArtist.artistName) {
              artistName = mainArtist.artistName;
            } else if (mainArtist.name) {
              artistName = mainArtist.name;
            } else if (mainArtist.artistId && mainArtist.artistId > 0) {
              // Fetch artist details using artistId
              try {
                const artistResponse = await axios.get(`/api/artists/${mainArtist.artistId}`, {
                  headers: getAuthHeaders(),
                });
                const artistData = artistResponse.data || {};
                artistName = artistData.artistName || artistData.name || "N/A";
                console.log("Fetched artist name:", artistName);
              } catch (artistError) {
                console.warn("Could not fetch artist details:", artistError);
                artistName = "N/A";
              }
            }
          }
        }

        // Fetch label details if labelId is available
        let labelName = releaseData.labelName || releaseData.label || "N/A";
        if (releaseData.labelId && releaseData.labelId > 0 && !labelName) {
          try {
            const labelResponse = await axios.get(`/api/labels/${releaseData.labelId}`, {
              headers: getAuthHeaders(),
            });
            const labelData = labelResponse.data || {};
            labelName = labelData.labelName || labelData.name || "N/A";
            console.log("Fetched label name:", labelName);
          } catch (labelError) {
            console.warn("Could not fetch label details:", labelError);
          }
        }

        // Fetch cover art file details if coverArtUrl is a fileId or if we need to get file details
        let coverArtUrl = releaseData.coverArtUrl;
        if (releaseData.coverArtFileId && releaseData.coverArtFileId > 0) {
          try {
            const coverFileResponse = await getFileById(releaseData.coverArtFileId);
            if (coverFileResponse?.cloudfrontUrl) {
              coverArtUrl = coverFileResponse.cloudfrontUrl;
              console.log("Fetched cover art URL from file:", coverArtUrl);
            }
          } catch (coverFileError) {
            console.warn("Could not fetch cover art file:", coverFileError);
          }
        }

        // Fetch distribution stores details if storeIds are available
        let storesList = releaseData.distributionOption?.selectedStoreIds || releaseData.stores || releaseData.distributionStores || [];
        if (storesList.length > 0 && typeof storesList[0] === 'number') {
          // If stores are IDs, try to fetch store names (if endpoint exists)
          try {
            // Try to fetch store details - adjust endpoint if different
            const storePromises = storesList.map(storeId => 
              axios.get(`/api/stores/${storeId}`, {
                headers: getAuthHeaders(),
              }).catch(() => null)
            );
            const storeResponses = await Promise.all(storePromises);
            const storeNames = storeResponses
              .filter(res => res && res.data)
              .map(res => res.data.name || res.data.storeName || String(res.data.id));
            
            if (storeNames.length > 0) {
              storesList = storeNames;
              console.log("Fetched store names:", storeNames);
            }
          } catch (storeError) {
            console.warn("Could not fetch store details:", storeError);
            // Keep original storeIds if fetch fails
          }
        }
        
        // Update form data with fetched release data
        const updatedFormData = {
          title: releaseData.title || formData.title,
          artist: artistName,
          label: labelName,
          language: releaseData.language || formData.language,
          primaryGenre: releaseData.primaryGenre || formData.primaryGenre,
          secondaryGenre: releaseData.secondaryGenre || formData.secondaryGenre,
          explicitLyrics: releaseData.isExplicit || releaseData.explicitLyrics ? "Yes" : "No",
          digitalReleaseDate: releaseData.digitalReleaseDate || releaseData.releaseDate || formData.digitalReleaseDate,
          originalReleaseDate: releaseData.originalReleaseDate || formData.originalReleaseDate,
          isrcCode: releaseData.isrcCode || formData.isrcCode,
          upcCode: releaseData.upcCode || formData.upcCode,
          stores: storesList,
        };
        
        setFormData(updatedFormData);
        setStatus(releaseData.status || "Pending");
        
        // Set cover image - use fetched coverArtUrl or fallback
        if (coverArtUrl && coverArtUrl !== "null" && coverArtUrl.trim() !== "") {
          setCoverPreview(coverArtUrl);
        } else if (releaseData.coverImage && releaseData.coverImage !== "null" && releaseData.coverImage.trim() !== "") {
          setCoverPreview(releaseData.coverImage);
        } else {
          // Use default image if no cover art URL
          setCoverPreview(previewImg);
        }
        
        // Store original stores for comparison
        setEditedStores(null);
        setEditedFields(new Set()); // Reset edited fields on new data load
        setHasChanges(false);
        
        // Fetch tracks from /api/files endpoint first (primary source)
        // Files endpoint provides trackId, trackTitle, trackNumber, cloudfrontUrl, status
        let filesData = [];
        try {
          const filesResponse = await getFiles({ releaseId: releaseId, fileType: "Audio" });
          if (filesResponse?.files && Array.isArray(filesResponse.files)) {
            filesData = filesResponse.files;
            console.log(`Fetched ${filesData.length} audio files from /api/files for releaseId ${releaseId}:`, filesData);
          }
        } catch (filesError) {
          console.warn(`Failed to fetch files for releaseId ${releaseId}:`, filesError);
        }
        
        // Use tracks from API response if available, otherwise fetch separately
        // Also check trackIds in releaseData as a fallback
        const hasTracksInResponse = tracksData.length > 0;
        const hasTrackIds = releaseData.trackIds && Array.isArray(releaseData.trackIds) && releaseData.trackIds.length > 0;
        
        console.log("Tracks check:", {
          filesDataLength: filesData.length,
          tracksDataLength: tracksData.length,
          trackIds: releaseData.trackIds,
          hasTracksInResponse,
          hasTrackIds
        });
        
        // If we have files data, use it as the primary source for tracks
        if (filesData.length > 0) {
          console.log("Using files data as primary source for tracks:", filesData.length);
          // Group files by trackId (in case there are multiple files per track)
          const filesByTrackId = {};
          filesData.forEach(file => {
            const trackId = file.trackId;
            if (!filesByTrackId[trackId]) {
              filesByTrackId[trackId] = [];
            }
            filesByTrackId[trackId].push(file);
          });
          
          // Map files to tracks and fetch full track details
          const mappedTracksPromises = Object.keys(filesByTrackId).map(async (trackIdStr, index) => {
            const trackId = parseInt(trackIdStr);
            const trackFiles = filesByTrackId[trackId];
            
            // Get the best file (prefer AVAILABLE status with non-null cloudfrontUrl)
            // Filter out null/empty cloudfrontUrls - API returns actual null, not string "null"
            const hasValidCloudfrontUrl = (f) => f.cloudfrontUrl !== null && f.cloudfrontUrl !== undefined && f.cloudfrontUrl !== "" && f.cloudfrontUrl !== "null";
            
            const bestFile = trackFiles.find(f => f.status === "AVAILABLE" && hasValidCloudfrontUrl(f)) || 
                            trackFiles.find(f => hasValidCloudfrontUrl(f)) || 
                            trackFiles.find(f => f.status === "AVAILABLE") ||
                            trackFiles[0];
            
            console.log(`Track ${trackId} - Best file selected:`, {
              fileId: bestFile?.fileId,
              status: bestFile?.status,
              cloudfrontUrl: bestFile?.cloudfrontUrl,
              cloudfrontUrlType: typeof bestFile?.cloudfrontUrl,
              allFiles: trackFiles.map(f => ({ 
                fileId: f.fileId, 
                status: f.status, 
                cloudfrontUrl: f.cloudfrontUrl,
                cloudfrontUrlType: typeof f.cloudfrontUrl,
                hasValidUrl: hasValidCloudfrontUrl(f)
              }))
            });
            
            // Get audioUrl from bestFile, handling null properly
            let audioUrl = "";
            if (bestFile && hasValidCloudfrontUrl(bestFile)) {
              audioUrl = bestFile.cloudfrontUrl;
              console.log(`Using cloudfrontUrl from bestFile for track ${trackId}:`, audioUrl);
            } else if (bestFile?.fileId) {
              // If cloudfrontUrl is null, try fetching file status from /api/files/status/{fileId}
              try {
                console.log(`cloudfrontUrl is null for fileId ${bestFile.fileId}, fetching status...`);
                const fileStatusResponse = await axios.get(`/api/files/status/${bestFile.fileId}`, {
                  headers: getAuthHeaders(),
                });
                if (fileStatusResponse?.data?.cloudfrontUrl && hasValidCloudfrontUrl({ cloudfrontUrl: fileStatusResponse.data.cloudfrontUrl })) {
                  audioUrl = fileStatusResponse.data.cloudfrontUrl;
                  console.log(`Fetched cloudfrontUrl from /api/files/status/${bestFile.fileId}:`, audioUrl);
                  // Update bestFile with the fetched cloudfrontUrl
                  bestFile.cloudfrontUrl = audioUrl;
                } else {
                  console.warn(`File status endpoint returned null cloudfrontUrl for fileId ${bestFile.fileId}`);
                }
              } catch (statusError) {
                console.warn(`Failed to fetch file status for fileId ${bestFile.fileId}:`, statusError);
              }
            }
            
            // Fetch full track details from /api/tracks/{trackId}
            let trackDetails = null;
            try {
              const trackResponse = await axios.get(`/api/tracks/${trackId}`, {
                headers: getAuthHeaders(),
              });
              trackDetails = trackResponse.data;
              console.log(`Fetched track details for trackId ${trackId}:`, trackDetails);
            } catch (trackError) {
              console.warn(`Failed to fetch track details for trackId ${trackId}:`, trackError);
            }
            
            // Combine file data with track details
            const durationSeconds = trackDetails?.durationSeconds || bestFile?.durationSeconds || 0;
            
            // Log final audio URL for debugging
            console.log(`Track ${trackId} final audioUrl:`, {
              trackId: trackId,
              audioUrl: audioUrl,
              hasAudioUrl: !!audioUrl && audioUrl !== "null" && audioUrl.trim() !== "",
              fileId: bestFile?.fileId,
              fileStatus: bestFile?.status
            });
            
            return {
              id: trackId,
              trackId: trackId,
              audioFileId: trackDetails?.audioFileId || bestFile?.fileId || 0,
              fileId: bestFile?.fileId,
              title: trackDetails?.title || bestFile?.trackTitle || `Track ${index + 1}`,
              audioUrl: audioUrl && audioUrl !== "null" ? audioUrl : "", // Ensure null becomes empty string
              fileDetails: bestFile,
              duration: durationSeconds 
                ? `${Math.floor(durationSeconds / 60)}:${String(Math.floor(durationSeconds % 60)).padStart(2, "0")}`
                : "00:00",
              durationSeconds: durationSeconds,
              isrc: trackDetails?.isrc || "",
              trackNumber: trackDetails?.trackNumber || bestFile?.trackNumber || index + 1,
              language: trackDetails?.language || "",
              trackVersion: trackDetails?.trackVersion || "",
              isExplicit: trackDetails?.isExplicit || trackDetails?.explicitFlag || false,
              isInstrumental: trackDetails?.isInstrumental || false,
              status: bestFile?.status || "UNKNOWN",
              ...trackDetails, // Include all other track fields
            };
          });
          
          const mappedTracks = await Promise.all(mappedTracksPromises);
          // Sort by trackNumber
          mappedTracks.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
          console.log(`Mapped ${mappedTracks.length} tracks from files data:`, mappedTracks);
          setTracks(mappedTracks);
        } else if (hasTracksInResponse) {
          console.log("Tracks found in API response:", tracksData.length);
          // Map tracks and fetch audio files
          // According to API: GET /api/releases/{releaseId} returns tracks with audioFileId, fileId, and audioUrl (CloudFront URL)
          const mappedTracksPromises = tracksData.map(async (track, index) => {
            const trackId = track.trackId || track.id || index + 1;
            let audioFileId = track.audioFileId;
            const durationSeconds = track.durationSeconds || track.duration;
            
            // If audioFileId is not in the track data, fetch full track details from /api/tracks/{trackId}
            // Also check if audioFileId is an empty object {} which should be treated as undefined
            // Note: audioFileId = 0 is valid (means no file attached), so we only fetch if it's undefined/null/empty object
            if ((audioFileId === undefined || audioFileId === null || (typeof audioFileId === 'object' && Object.keys(audioFileId).length === 0)) && trackId) {
              try {
                const fullTrackResponse = await axios.get(`/api/tracks/${trackId}`, {
                  headers: getAuthHeaders(),
                });
                const fetchedAudioFileId = fullTrackResponse?.data?.audioFileId;
                // Accept any number (including 0) - 0 means no file attached, which is valid
                if (fetchedAudioFileId !== undefined && fetchedAudioFileId !== null && typeof fetchedAudioFileId === 'number') {
                  audioFileId = fetchedAudioFileId;
                  console.log(`Fetched audioFileId ${audioFileId} for track ${trackId} from /api/tracks/${trackId}`);
                  // Merge full track data with existing track data
                  Object.assign(track, fullTrackResponse.data);
                }
              } catch (trackError) {
                console.warn(`Failed to fetch full track details for trackId ${trackId}:`, trackError);
              }
            }
            
            // Fetch audio file for this track
            // According to API structure: tracks from GET /api/releases/{releaseId} have audioUrl (CloudFront URL) directly
            let audioUrl = track.audioUrl || track.audioFileUrl || track.fileUrl || track.audioFile?.url || "";
            let fileDetails = null;
            
            // If audioUrl is already in track data (from GET /api/releases/{releaseId}), use it
            if (audioUrl && audioUrl !== "null" && audioUrl.trim() !== "") {
              console.log(`Using audioUrl from track data for track ${trackId}:`, audioUrl);
            } else {
              // If audioUrl is null/missing, try to fetch it
              // This happens when audioFileId = 0/null or file doesn't have cloudfrontUrl
              try {
                // First, try to fetch by audioFileId if available (more direct)
                if (audioFileId && typeof audioFileId === 'number' && audioFileId > 0) {
                  try {
                    fileDetails = await getFileById(audioFileId);
                    if (fileDetails?.cloudfrontUrl) {
                      audioUrl = fileDetails.cloudfrontUrl;
                      console.log(`Found audio URL for track ${trackId} via audioFileId ${audioFileId}:`, audioUrl);
                    }
                  } catch (fileIdError) {
                    console.warn(`Failed to fetch file by audioFileId ${audioFileId}:`, fileIdError);
                  }
                }
                
                // If still no URL, try using fileId from track (if available)
                if (!audioUrl && track.fileId && typeof track.fileId === 'number' && track.fileId > 0) {
                  try {
                    fileDetails = await getFileById(track.fileId);
                    if (fileDetails?.cloudfrontUrl) {
                      audioUrl = fileDetails.cloudfrontUrl;
                      console.log(`Found audio URL for track ${trackId} via fileId ${track.fileId}:`, audioUrl);
                    }
                  } catch (fileIdError) {
                    console.warn(`Failed to fetch file by fileId ${track.fileId}:`, fileIdError);
                  }
                }
                
                // If no URL found yet, try fetching by trackId as fallback
                if (!audioUrl) {
                  const filesResponse = await getFiles({ trackId: trackId, fileType: "Audio", status: "AVAILABLE" });
                  if (filesResponse?.files && filesResponse.files.length > 0) {
                    // Get the first available audio file's cloudfrontUrl
                    const audioFile = filesResponse.files.find(f => f.status === "AVAILABLE" && f.cloudfrontUrl) || filesResponse.files[0];
                    if (audioFile?.cloudfrontUrl) {
                      audioUrl = audioFile.cloudfrontUrl;
                      fileDetails = audioFile;
                      console.log(`Found audio URL for track ${trackId} via trackId query:`, audioUrl);
                    }
                  }
                }
              } catch (fileError) {
                console.warn(`Failed to fetch audio file for track ${trackId}:`, fileError);
              }
            }
            
            return {
              id: trackId,
              trackId: trackId,
              audioFileId: audioFileId,
              title: track.title || `Track ${index + 1}`,
              audioUrl: audioUrl,
              fileDetails: fileDetails, // Include file details if fetched
              duration: durationSeconds 
                ? `${Math.floor(durationSeconds / 60)}:${String(Math.floor(durationSeconds % 60)).padStart(2, "0")}`
                : track.duration || "00:00",
              durationSeconds: durationSeconds,
              isrc: track.isrc || track.isrcCode || "",
              trackNumber: track.trackNumber || index + 1,
              language: track.language || "",
              trackVersion: track.trackVersion || "",
              isExplicit: track.isExplicit || track.explicitFlag || false,
              isInstrumental: track.isInstrumental || false,
              ...track, // Include all other track fields
            };
          });
          
          const mappedTracks = await Promise.all(mappedTracksPromises);
          console.log(`Mapped ${mappedTracks.length} tracks with audio URLs:`, mappedTracks);
          setTracks(mappedTracks);
        } else {
          // Fetch tracks separately if not in response
          console.log(`Fetching tracks separately for releaseId: ${releaseId}`);
          
          // Try different endpoints for fetching tracks
          let fetchedTracksData = [];
          let tracksFetched = false;
          
          // First, try fetching by trackIds if available
          if (hasTrackIds) {
            try {
              console.log(`Fetching tracks by trackIds:`, releaseData.trackIds);
              const trackPromises = releaseData.trackIds.map(trackId => 
                axios.get(`/api/tracks/${trackId}`, {
                  headers: getAuthHeaders(),
                }).catch(err => {
                  console.warn(`Failed to fetch track ${trackId}:`, err);
                  return null;
                })
              );
              
              const trackResponses = await Promise.all(trackPromises);
              fetchedTracksData = trackResponses
                .filter(res => res && res.data)
                .map(res => res.data);
              
              if (fetchedTracksData.length > 0) {
                tracksFetched = true;
                console.log(`Fetched ${fetchedTracksData.length} tracks by trackIds`);
              }
            } catch (trackIdsError) {
              console.warn("Failed to fetch tracks by IDs:", trackIdsError);
            }
          }
          
          // If trackIds didn't work, try endpoint: /api/releases/{releaseId}/tracks
          if (!tracksFetched) {
            try {
              console.log(`Trying /api/releases/${releaseId}/tracks`);
              const tracksResponse = await axios.get(`/api/releases/${releaseId}/tracks`, {
                headers: getAuthHeaders(),
              });
              
              console.log("Tracks response:", tracksResponse.data);
              
              // Handle different response formats
              if (Array.isArray(tracksResponse.data)) {
                fetchedTracksData = tracksResponse.data;
              } else if (tracksResponse.data?.data && Array.isArray(tracksResponse.data.data)) {
                fetchedTracksData = tracksResponse.data.data;
              } else if (tracksResponse.data?.tracks && Array.isArray(tracksResponse.data.tracks)) {
                fetchedTracksData = tracksResponse.data.tracks;
              }
              
              if (fetchedTracksData.length > 0) {
                tracksFetched = true;
                console.log(`Fetched ${fetchedTracksData.length} tracks from /api/releases/{id}/tracks`);
              }
            } catch (firstError) {
              console.warn("Tracks endpoint /api/releases/{id}/tracks failed:", {
                status: firstError.response?.status,
                message: firstError.message,
              });
            }
          }
          
          if (tracksFetched && fetchedTracksData.length > 0) {
            // Map tracks and fetch audio files
            // According to API: GET /api/releases/{releaseId} returns tracks with audioFileId, fileId, and audioUrl (CloudFront URL)
            const mappedTracksPromises = fetchedTracksData.map(async (track, index) => {
            const trackId = track.trackId || track.id || index + 1;
            let audioFileId = track.audioFileId;
            const durationSeconds = track.durationSeconds || track.duration;
            
            // If audioFileId is not in the track data, fetch full track details
            // Also check if audioFileId is an empty object {} which should be treated as undefined
            // Note: audioFileId = 0 is valid (means no file attached), so we only fetch if it's undefined/null/empty object
            if ((audioFileId === undefined || audioFileId === null || (typeof audioFileId === 'object' && Object.keys(audioFileId).length === 0)) && trackId) {
              try {
                const fullTrackResponse = await axios.get(`/api/tracks/${trackId}`, {
                  headers: getAuthHeaders(),
                });
                const fetchedAudioFileId = fullTrackResponse?.data?.audioFileId;
                // Accept any number (including 0) - 0 means no file attached, which is valid
                if (fetchedAudioFileId !== undefined && fetchedAudioFileId !== null && typeof fetchedAudioFileId === 'number') {
                  audioFileId = fetchedAudioFileId;
                  console.log(`Fetched audioFileId ${audioFileId} for track ${trackId}`);
                  // Merge full track data with existing track data
                  Object.assign(track, fullTrackResponse.data);
                }
              } catch (trackError) {
                console.warn(`Failed to fetch full track details for trackId ${trackId}:`, trackError);
              }
            }
            
            // Fetch audio file for this track
            // According to API structure: tracks from GET /api/releases/{releaseId} have audioUrl (CloudFront URL) directly
            let audioUrl = track.audioUrl || track.audioFileUrl || track.fileUrl || track.audioFile?.url || "";
            let fileDetails = null;
            
            // If audioUrl is already in track data (from GET /api/releases/{releaseId}), use it
            // According to API: tracks have audioUrl (CloudFront URL) directly if file is attached
            if (audioUrl && audioUrl !== "null" && audioUrl.trim() !== "") {
              console.log(`Using audioUrl from track data for track ${trackId}:`, audioUrl);
            } else {
              // If audioUrl is null/missing, try to fetch it
              // This happens when audioFileId = 0/null (no file attached) or file doesn't have cloudfrontUrl
              // Note: audioFileId = 0 means no file attached, so don't try to fetch by audioFileId if it's 0
              try {
                // First, try to fetch by audioFileId if available and > 0 (0 means no file attached)
                if (audioFileId && typeof audioFileId === 'number' && audioFileId > 0) {
                  try {
                    fileDetails = await getFileById(audioFileId);
                    if (fileDetails?.cloudfrontUrl) {
                      audioUrl = fileDetails.cloudfrontUrl;
                      console.log(`Found audio URL for track ${trackId} via audioFileId ${audioFileId}:`, audioUrl);
                    }
                  } catch (fileIdError) {
                    console.warn(`Failed to fetch file by audioFileId ${audioFileId}:`, fileIdError);
                  }
                }
                
                // If still no URL, try using fileId from track (if available and > 0)
                if (!audioUrl && track.fileId && typeof track.fileId === 'number' && track.fileId > 0) {
                  try {
                    fileDetails = await getFileById(track.fileId);
                    if (fileDetails?.cloudfrontUrl) {
                      audioUrl = fileDetails.cloudfrontUrl;
                      console.log(`Found audio URL for track ${trackId} via fileId ${track.fileId}:`, audioUrl);
                    }
                  } catch (fileIdError) {
                    console.warn(`Failed to fetch file by fileId ${track.fileId}:`, fileIdError);
                  }
                }
                
                // If no URL found yet, try fetching by trackId as fallback
                if (!audioUrl) {
                  const filesResponse = await getFiles({ trackId: trackId, fileType: "Audio", status: "AVAILABLE" });
                  if (filesResponse?.files && filesResponse.files.length > 0) {
                    // Get the first available audio file's cloudfrontUrl
                    const audioFile = filesResponse.files.find(f => f.status === "AVAILABLE" && f.cloudfrontUrl) || filesResponse.files[0];
                    if (audioFile?.cloudfrontUrl) {
                      audioUrl = audioFile.cloudfrontUrl;
                      fileDetails = audioFile;
                      console.log(`Found audio URL for track ${trackId} via trackId query:`, audioUrl);
                    }
                  }
                }
                
                // If still no audioUrl, log that track has no audio file attached
                if (!audioUrl) {
                  console.log(`Track ${trackId} has no audio file attached (audioFileId: ${audioFileId})`);
                }
              } catch (fileError) {
                console.warn(`Failed to fetch audio file for track ${trackId}:`, fileError);
              }
            }
            
            return {
              id: trackId,
              trackId: trackId,
              audioFileId: audioFileId,
              title: track.title || `Track ${index + 1}`,
              audioUrl: audioUrl,
              fileDetails: fileDetails, // Include file details if fetched
              duration: durationSeconds 
                ? `${Math.floor(durationSeconds / 60)}:${String(Math.floor(durationSeconds % 60)).padStart(2, "0")}`
                : track.duration || "00:00",
              durationSeconds: durationSeconds,
              isrc: track.isrc || track.isrcCode || "",
              trackNumber: track.trackNumber || index + 1,
              language: track.language || "",
              trackVersion: track.trackVersion || "",
              isExplicit: track.isExplicit || track.explicitFlag || false,
              isInstrumental: track.isInstrumental || false,
              ...track, // Include all other track fields
            };
          });
          
            const mappedTracks = await Promise.all(mappedTracksPromises);
            console.log(`Mapped ${mappedTracks.length} tracks with audio URLs:`, mappedTracks);
            setTracks(mappedTracks);
          } else {
            // No tracks found - set empty array
            console.log("No tracks found for this release");
            setTracks([]);
          }
        }
        
        // Set publishers if available
        if (releaseData.publishers) {
          setPublishers(Array.isArray(releaseData.publishers) ? releaseData.publishers : []);
        } else {
          setPublishers([]);
        }
        
      } catch (error) {
        console.error("Error fetching release data:", error);
        toast.error("Failed to load release details. Using default data.");
        // Keep default tracks if fetch fails
        setTracks([
          {
            id: 1,
            title: "Track 1",
            audioUrl: "",
            duration: "00:00",
          },
        ]);
      } finally {
        setFetchingData(false);
      }
    };

    fetchReleaseData();
  }, [releaseId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Track that this field was edited
    setEditedFields((prev) => new Set(prev).add(field));
    setHasChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
      if (img.width === 3000 && img.height === 3000) {
        setCoverArtwork(file);
        setCoverPreview(URL.createObjectURL(file));
        // Track that cover art was edited
        setEditedFields((prev) => new Set(prev).add("coverArt"));
        setHasChanges(true);
        toast.dark("Cover art uploaded successfully! Click Update to save.", {
          position: "bottom-center",
          autoClose: 3000,
        });
      } else {
        toast.dark(`Image must be exactly 3000px by 3000px. Current size: ${img.width}x${img.height}px`, {
          position: "bottom-center",
          autoClose: 5000,
        });
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = function () {
      toast.dark("Failed to load image. Please try a different file.", {
        position: "bottom-center",
        autoClose: 3000,
      });
      URL.revokeObjectURL(img.src);
    };
  };

  // Audio player functions (similar to Home.jsx)
  const handlePlay = (track) => {
    if (!track.audioUrl) {
      toast.error("No audio file available for this track");
      return;
    }

    // If clicking the same track again → toggle play/pause
    if (currentTrack?.trackId === track.trackId) {
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
    const newAudio = new Audio(track.audioUrl);

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
        toast.error("Failed to play audio. Please check the file URL.");
        setIsPlaying(false);
      });

    // Save references in state
    setAudio(newAudio);
    setCurrentTrack(track);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

  const handleAction = (action) => {
    const actionMessages = {
      approve: "approve this release?",
      reject: "reject this release?",
      submit: "submit this release?",
      finalSubmit: "final submit this release?",
    };

    // For approve and reject, require notes/reason
    if (action === "approve" || action === "reject") {
      setPopupMessage(`Please provide a reason to ${action} this release:`);
      setNotes(""); // Reset notes
    } else {
      setPopupMessage(`Are you sure you want to ${actionMessages[action]}?`);
      setNotes(""); // Clear notes for submit actions
    }
    
    setPopupAction(action);
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    // Validate notes for approve/reject actions
    if ((popupAction === "approve" || popupAction === "reject") && !notes.trim()) {
      toast.error("Please provide a reason/notes to proceed");
      return;
    }

    try {
      setLoading(true);
      
      // Perform QC action only (no updates here - updates are handled by handleUpdate)
      // Use the correct endpoint format: /api/qc/{role}/{releaseId}/approve
      const baseEndpoint = getQCActionEndpoint();
      let actionEndpoint = "";
      
      // Build the correct endpoint based on action
      if (popupAction === "approve") {
        actionEndpoint = `${baseEndpoint}/${releaseId}/approve`;
      } else if (popupAction === "reject") {
        actionEndpoint = `${baseEndpoint}/${releaseId}/reject`;
      } else if (popupAction === "submit") {
        actionEndpoint = `${baseEndpoint}/${releaseId}/submit`;
      } else if (popupAction === "finalSubmit") {
        // For SuperAdmin final submit, might use same endpoint or different
        actionEndpoint = `${baseEndpoint}/${releaseId}/approve`; // Using approve for final submit
      }

      console.log(`Performing QC action: ${popupAction} on release ${releaseId}`);
      console.log(`Action endpoint: ${actionEndpoint}`);
      
      // Make QC action API call with correct payload format
      // API expects: { "notes": "string" }
      // For approve/reject, notes are required (already validated)
      // For submit actions, use notes if provided, otherwise use default
      const payloadNotes = notes.trim() || `Release ${popupAction === "finalSubmit" ? "final submitted" : popupAction + "ted"}`;
      
      const response = await axios.post(actionEndpoint, {
        notes: payloadNotes,
      }, {
        headers: getAuthHeaders(),
      });
      
      console.log("QC action successful:", response.data);

      // Update status based on action
      if (popupAction === "approve") {
        setStatus("Approved");
        toast.success("Release approved successfully!");
      } else if (popupAction === "reject") {
        setStatus("Rejected");
        toast.success("Release rejected successfully!");
      } else if (popupAction === "submit") {
        setStatus("Submitted");
        toast.success("Release submitted successfully!");
      } else if (popupAction === "finalSubmit") {
        setStatus("Final Submitted");
        toast.success("Release final submitted successfully!");
      }

      setShowPopup(false);
      setPopupAction(null);
      
      // Navigate back to QC table after a delay
      setTimeout(() => {
        navigate("/enterprise-catalog?tab=qc&section=pending");
      }, 1500);
    } catch (error) {
      console.error("Error performing action:", error);
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        action: popupAction,
        releaseId: releaseId,
      });
      
      // Provide more specific error messages
      let errorMessage = `Failed to ${popupAction} release.`;
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 404) {
          errorMessage = `QC endpoint not found. Please check if the release ID (${releaseId}) is correct.`;
        } else if (status === 401 || status === 403) {
          errorMessage = "Unauthorized. Please login again.";
        } else if (status === 400) {
          errorMessage = errorData?.message || errorData?.error || "Invalid request. Please check your data.";
        } else if (status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = errorData?.message || errorData?.error || error.response.statusText || errorMessage;
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
      });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPopupAction(null);
    setNotes(""); // Clear notes when canceling
  };

  // Handle Update - Update only edited fields, preserve all previous data
  const handleUpdate = async () => {
    if (!releaseId) {
      toast.dark("Release ID not found.");
      return;
    }

    if (!hasChanges) {
      toast.dark("No changes to update.");
      return;
    }

    try {
      setLoading(true);

      // Check if we need to update release or tracks
      const hasReleaseChanges = editedFields.size > 0 || editedStores !== null || coverArtwork !== null;
      const hasTrackChanges = editedTracks.length > 0;

      if (!hasReleaseChanges && !hasTrackChanges) {
        toast.dark("No changes to update.");
        setLoading(false);
        return;
      }

      // Fetch current release data to preserve all fields
      let currentReleaseData = originalReleaseData;
      if (!currentReleaseData) {
        try {
          const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
            headers: getAuthHeaders(),
          });
          currentReleaseData = releaseResponse.data?.release || releaseResponse.data || {};
        } catch (error) {
          console.error("Failed to fetch release data:", error);
          toast.dark("Failed to fetch release data. Please try again.");
          setLoading(false);
          return;
        }
      }

      // Update release if there are release changes
      if (hasReleaseChanges) {
        // Start with original release data to preserve all fields
        // Exclude fields that shouldn't be sent in update (tracks, createdAt, contributors unless edited, etc.)
        const {
          tracks,
          createdAt,
          updatedAt,
          status,
          contributors, // Exclude contributors - only include if artist was edited
          ...releaseDataToUpdate
        } = currentReleaseData;
        
        const updatePayload = {
          ...releaseDataToUpdate,
          releaseId: releaseId,
        };

        // Only include contributors if artist field was edited
        // This prevents backend from trying to delete/recreate contributors when only other fields change
        if (editedFields.has("artist")) {
          // Update contributors array while preserving structure
          let contributorsToUpdate = [];
          if (currentReleaseData.contributors && Array.isArray(currentReleaseData.contributors) && currentReleaseData.contributors.length > 0) {
            contributorsToUpdate = currentReleaseData.contributors.map((contrib, idx) => {
              if (idx === 0) {
                return { 
                  ...contrib, 
                  artistName: formData.artist,
                  role: contrib.role || "Main Primary Artist" // Ensure role is never null
                };
              }
              return {
                ...contrib,
                role: contrib.role || "Main Primary Artist" // Ensure role is never null
              };
            });
          } else {
            contributorsToUpdate = [{ 
              artistId: 0, 
              role: "Main Primary Artist", // Use valid role instead of null
              artistName: formData.artist 
            }];
          }
          updatePayload.contributors = contributorsToUpdate;
        }

        // Update only fields that were edited, preserving all other fields
        if (editedFields.has("title")) {
          updatePayload.title = formData.title;
        }
        if (editedFields.has("label")) {
          updatePayload.labelName = formData.label;
        }
        if (editedFields.has("language")) {
          updatePayload.language = formData.language;
        }
        if (editedFields.has("primaryGenre")) {
          updatePayload.primaryGenre = formData.primaryGenre;
        }
        if (editedFields.has("secondaryGenre")) {
          updatePayload.secondaryGenre = formData.secondaryGenre;
        }
        if (editedFields.has("explicitLyrics")) {
          updatePayload.isExplicit = formData.explicitLyrics === "Yes";
        }
        if (editedFields.has("digitalReleaseDate")) {
          updatePayload.digitalReleaseDate = formData.digitalReleaseDate;
        }
        if (editedFields.has("originalReleaseDate")) {
          updatePayload.originalReleaseDate = formData.originalReleaseDate;
        }
        if (editedFields.has("upcCode")) {
          updatePayload.upcCode = formData.upcCode;
        }
        if (editedFields.has("coverArt") && coverArtwork) {
          // Send cover art blob URL in update payload (same as CreateRelease does)
          // The backend should accept blob URLs for cover art updates
          const coverArtBlobUrl = URL.createObjectURL(coverArtwork);
          updatePayload.coverArtUrl = coverArtBlobUrl;
          console.log(`[QCDetailPage] ✅ Cover art updated. Blob URL: ${coverArtBlobUrl.substring(0, 50)}...`);
        }

        // Update distribution stores if edited, preserving existing distributionOption structure
        if (editedStores !== null) {
          updatePayload.distributionOption = {
            ...(currentReleaseData.distributionOption || {}),
            selectedStoreIds: editedStores,
            distributionType: currentReleaseData.distributionOption?.distributionType || "pending",
          };
        }

        // Update release via POST /api/releases/{releaseId}
        // Same update logic works for all roles: SuperAdmin, EnterpriseAdmin, and LabelAdmin
        try {
          console.log(`[QCDetailPage] Updating release ${releaseId} for role: ${actualRole}...`);
          console.log(`[QCDetailPage] Update payload keys:`, Object.keys(updatePayload));
          console.log(`[QCDetailPage] Update payload (excluding large fields):`, {
            ...updatePayload,
            contributors: updatePayload.contributors?.length || 0,
            trackIds: updatePayload.trackIds?.length || 0,
            coverArtUrl: updatePayload.coverArtUrl ? 'present' : 'not present',
          });
          
          const updateResponse = await axios.post(`/api/releases/${releaseId}`, updatePayload, {
            headers: getAuthHeaders(),
          });
          console.log(`[QCDetailPage] ✅ Release updated successfully for ${actualRole}:`, updateResponse.data);
        } catch (updateError) {
          console.error(`[QCDetailPage] ❌ Release update failed:`, updateError);
          console.error(`[QCDetailPage] Error status:`, updateError.response?.status);
          console.error(`[QCDetailPage] Error response:`, updateError.response?.data);
          console.error(`[QCDetailPage] Request payload keys:`, Object.keys(updatePayload));
          
          const errorMessage =
            updateError.response?.data?.message ||
            updateError.response?.data?.error ||
            updateError.response?.data?.title ||
            (updateError.response?.data?.errors ? JSON.stringify(updateError.response.data.errors) : null) ||
            "Failed to update release. Please check console for details.";
          toast.dark(errorMessage, { autoClose: 6000 });
          setLoading(false);
          return;
        }
      }

      // Update tracks if any were edited
      if (hasTrackChanges) {
        for (const editedTrack of editedTracks) {
          if (editedTrack.trackId) {
            try {
              // Fetch current track data to preserve all fields
              const currentTrackResponse = await axios.get(`/api/tracks/${editedTrack.trackId}`, {
                headers: getAuthHeaders(),
              });
              const currentTrackData = currentTrackResponse.data || {};

              // Merge edited fields with current track data
              const trackUpdatePayload = {
                ...currentTrackData,
                ...editedTrack,
                trackId: editedTrack.trackId,
              };

              // Try POST first, fallback to PUT if needed
              try {
                console.log(`[QCDetailPage] Updating track ${editedTrack.trackId} via POST...`);
                await axios.post(`/api/tracks/${editedTrack.trackId}`, trackUpdatePayload, {
                  headers: getAuthHeaders(),
                });
                console.log(`[QCDetailPage] ✅ Track ${editedTrack.trackId} updated successfully via POST`);
              } catch (postError) {
                if (postError.response?.status === 405) {
                  console.warn(`[QCDetailPage] POST failed with 405, trying PUT...`);
                  await axios.put(`/api/tracks/${editedTrack.trackId}`, trackUpdatePayload, {
                    headers: getAuthHeaders(),
                  });
                  console.log(`[QCDetailPage] ✅ Track ${editedTrack.trackId} updated successfully via PUT`);
                } else {
                  throw postError;
                }
              }
            } catch (trackError) {
              console.error(`[QCDetailPage] ❌ Failed to update track ${editedTrack.trackId}:`, trackError);
              console.error(`[QCDetailPage] Error status:`, trackError.response?.status);
              console.error(`[QCDetailPage] Error response:`, trackError.response?.data);
              const errorMsg = trackError.response?.data?.message || 
                              trackError.response?.data?.error || 
                              `Failed to update track ${editedTrack.trackId}`;
              toast.dark(errorMsg, { autoClose: 5000 });
            }
          }
        }
      }

      // Refresh original data after successful update
      try {
        const refreshResponse = await axios.get(`/api/releases/${releaseId}`, {
          headers: getAuthHeaders(),
        });
        const refreshedData = refreshResponse.data?.release || refreshResponse.data || {};
        setOriginalReleaseData(refreshedData);

        // Update form data with refreshed data
        const refreshedFormData = {
          title: refreshedData.title || formData.title,
          artist: refreshedData.contributors?.[0]?.artistName || formData.artist,
          label: refreshedData.labelName || refreshedData.label || formData.label,
          language: refreshedData.language || formData.language,
          primaryGenre: refreshedData.primaryGenre || formData.primaryGenre,
          secondaryGenre: refreshedData.secondaryGenre || formData.secondaryGenre,
          explicitLyrics: refreshedData.isExplicit ? "Yes" : "No",
          digitalReleaseDate: refreshedData.digitalReleaseDate || formData.digitalReleaseDate,
          originalReleaseDate: refreshedData.originalReleaseDate || formData.originalReleaseDate,
          upcCode: refreshedData.upcCode || formData.upcCode,
          stores: refreshedData.distributionOption?.selectedStoreIds || formData.stores || [],
        };
        setFormData(refreshedFormData);
      } catch (refreshError) {
        console.warn("Failed to refresh data after update:", refreshError);
      }

      // Reset edited fields
      setEditedFields(new Set());
      setEditedTracks([]);
      setEditedStores(null);
      setHasChanges(false);
      setCoverArtwork(null);

      toast.dark("Update successful!");
    } catch (error) {
      console.error("Error updating:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update. Please try again.";
      toast.dark(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Determine which buttons to show based on role
  const getActionButtons = () => {
    // Show Update button ONLY if there are changes
    const updateButton = hasChanges ? (
      <button
        className="btn-gradient"
        onClick={handleUpdate}
        disabled={loading}
        style={{ marginRight: "10px" }}
      >
        Update
      </button>
    ) : null;

    if (actualRole === "LabelAdmin" || actualRole?.toLowerCase() === "labeladmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
          {updateButton}
          <button
            className="btn-capsule btn-reject"
            onClick={() => handleAction("reject")}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="btn-capsule btn-approve"
            onClick={() => handleAction("approve")}
            disabled={loading}
          >
            Approve
          </button>
        </>
      );
    } else if (actualRole === "EnterpriseAdmin" || actualRole?.toLowerCase() === "enterpriseadmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
          {updateButton}
          <button
            className="btn-capsule btn-reject"
            onClick={() => handleAction("reject")}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="btn-capsule btn-approve"
            onClick={() => handleAction("approve")}
            disabled={loading}
          >
            Approve
          </button>
        </>
      );
    } else if (actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
          {updateButton}
          <button
            className="btn-capsule btn-reject"
            onClick={() => handleAction("reject")}
            disabled={loading}
          >
            Reject
          </button>
          <button
            className="btn-capsule btn-approve"
            onClick={() => handleAction("approve")}
            disabled={loading}
          >
            Approve
          </button>
          <button 
            className="btn-gradient" 
            onClick={() => handleAction("finalSubmit")}
            disabled={loading}
          >
            Final Submit
          </button>
        </>
      );
    }
    return (
      <>
        <button className="btn-cancel" onClick={() => navigate(-1)}>
          Back
        </button>
        {updateButton}
      </>
    );
  };

  return (
    <div className="pages-layout-container">
      {/* ===== Page Title ===== */}
      <h2 className="pages-main-title">
        QC Review
        <span className={`status-bar status ${status.toLowerCase().replace(/\s+/g, "-")}`}>
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
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Artist</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.artist}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Label</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.label}
                  onChange={(e) => handleInputChange("label", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
            </div>

            {/* --- Tracks Section --- */}
            <div className="tracks-section section-container">
              {fetchingData ? (
                <div style={{ padding: "20px", textAlign: "center" }}>Loading tracks...</div>
              ) : tracks.length > 0 ? (
                tracks.map((track) => (
                  <div className="track-card" key={track.id}>
                    <div className="metadata-row">
                      <span className="meta-label">{track.trackNumber || track.id}</span>
                      <span className="meta-value">{track.title}</span>
                    </div>
                    <div className="duration-player-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span>{track.duration}</span>
                      {track.audioUrl ? (
                        <button
                          className="btn-gradient"
                          onClick={() => handlePlay(track)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "14px",
                            minWidth: "60px",
                          }}
                        >
                          {currentTrack?.trackId === track.trackId && isPlaying ? "⏸" : "▶"}
                        </button>
                      ) : (
                        <span style={{ color: "#999", fontSize: "14px" }}>No audio available</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>
                  No tracks available for this release
                </div>
              )}
            </div>

            {/* --- Metadata Section --- */}
            <div className="metadata-container section-container">
              <div className="metadata-row">
                <span className="meta-label">Language</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Primary Genre</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.primaryGenre}
                  onChange={(e) => handleInputChange("primaryGenre", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Secondary Genre</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.secondaryGenre}
                  onChange={(e) => handleInputChange("secondaryGenre", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Explicit Lyrics</span>
                <select
                  className="meta-value editable-input"
                  value={formData.explicitLyrics}
                  onChange={(e) => handleInputChange("explicitLyrics", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {/* --- Release Dates & Codes --- */}
            <div className="metadata-codes-container section-container">
              <div className="metadata-row">
                <span className="meta-label">Digital Release Date</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.digitalReleaseDate}
                  onChange={(e) => handleInputChange("digitalReleaseDate", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Original Release Date</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.originalReleaseDate}
                  onChange={(e) => handleInputChange("originalReleaseDate", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">ISRC Code</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.isrcCode}
                  onChange={(e) => handleInputChange("isrcCode", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">UPC Code</span>
                <input
                  type="text"
                  className="meta-value editable-input"
                  value={formData.upcCode}
                  onChange={(e) => handleInputChange("upcCode", e.target.value)}
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
              <div className="metadata-row">
                <span className="meta-label">Stores</span>
                <span className="meta-value">
                  {formData.stores.length > 0
                    ? formData.stores.join(", ")
                    : "No stores selected"}
                </span>
              </div>
            </div>
            <div className="metadata-copyright section-container">
              {publishers.length > 0 ? (
                publishers.map((pub, index) => (
                  <div className="metadata-row" key={pub.id || index}>
                    <span className="meta-label">{pub.symbol || "℗"}</span>
                    <span className="meta-value">{pub.name || pub.publisherName || "N/A"}</span>
                  </div>
                ))
              ) : (
                <div className="metadata-row">
                  <span className="meta-label">℗</span>
                  <span className="meta-value">No publishers listed</span>
                </div>
              )}
            </div>
          </div>

          {/* ===== Right Column: Cover Image with Upload ===== */}
          <div className="prev-right-column">
            <div style={{ position: "relative" }}>
              <img
                src={coverPreview}
                alt="Cover"
                className="prev-cover-image"
                style={{ cursor: "pointer" }}
                onClick={() => document.getElementById("coverArtInput").click()}
              />
              <input
                type="file"
                id="coverArtInput"
                style={{ display: "none" }}
                accept="image/png, image/jpeg, image/jpg, image/jfif"
                onChange={handleFileChange}
              />
              <button
                onClick={() => document.getElementById("coverArtInput").click()}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "#6c5ce7",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Change Cover Art
              </button>
            </div>
          </div>
        </div>

        {/* ===== Action Buttons ===== */}
        <div className="form-actions">{getActionButtons()}</div>
      </div>

      {/* ===== Confirmation Popup ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Confirm Action</h4>
            <p>{popupMessage}</p>
            
            {/* Show notes textarea for approve/reject actions */}
            {(popupAction === "approve" || popupAction === "reject") && (
              <div style={{ marginTop: "15px", marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Reason / Notes <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Please provide a reason to ${popupAction} this release...`}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  required
                />
              </div>
            )}
            
            <div className="form-actions">
              <button 
                className="btn-gradient" 
                onClick={handleConfirm}
                disabled={(popupAction === "approve" || popupAction === "reject") && !notes.trim()}
                style={{
                  opacity: (popupAction === "approve" || popupAction === "reject") && !notes.trim() ? 0.5 : 1,
                  cursor: (popupAction === "approve" || popupAction === "reject") && !notes.trim() ? "not-allowed" : "pointer",
                }}
              >
                Yes, Confirm
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
                  src={coverPreview || previewImg}
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
                <div className="music-track-subtitle">{formData.artist || "N/A"}</div>
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

      {/* Toast Container for notifications */}
      <ToastContainer position="bottom-center" autoClose={3000} theme="dark" />
    </div>
  );
}

