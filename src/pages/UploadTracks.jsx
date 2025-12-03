// hooks and libraries
import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

// css
// import "../styles/UploadTracks.css";
import "react-toastify/dist/ReactToastify.css";

// assets
import defaultCover from "../assets/coverArt.jpg";

// Services
import * as TracksService from "../services/tracks";
import * as FilesService from "../services/files";

// Global File objects storage that persists across component remounts
const globalFileObjects = new Map();

const UploadTracks = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get release metadata from location state or localStorage as fallback
  const releaseMetadataFromState = location.state || {};
  const releaseMetadataFromStorage = JSON.parse(
    localStorage.getItem("releaseMetadata") || "{}"
  );
  const releaseMetadata = Object.keys(releaseMetadataFromState).length > 0 
    ? releaseMetadataFromState 
    : releaseMetadataFromStorage;
  
  // Debug logging
  console.log("UploadTracks - releaseMetadata from state:", releaseMetadataFromState);
  console.log("UploadTracks - releaseMetadata from storage:", releaseMetadataFromStorage);
  console.log("UploadTracks - final releaseMetadata:", releaseMetadata);
  console.log("UploadTracks - releaseId:", releaseMetadata.releaseId);
  
  const [tracks, setTracks] = useState(() =>
    JSON.parse(localStorage.getItem("uploadedTracks") || "[]")
  );
  const [draggedTrackIdx, setDraggedTrackIdx] = useState(null);
  const fileInputRef = useRef(null);
  const fileObjectsRef = useRef(globalFileObjects);
  const [isProcessing, setIsProcessing] = useState(false);

  // Save tracks to local storage
  const saveTracksToStorage = (tracksArr) => {
    setTracks(tracksArr);
    localStorage.setItem("uploadedTracks", JSON.stringify(tracksArr));
  };

  // Format seconds into mm:ss
  const formatDuration = (seconds) => {
    if (typeof seconds !== "number" || !isFinite(seconds) || seconds < 0) {
      return "--:--";
    }
    const totalSeconds = Math.floor(seconds);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // Handle file upload
  const handleTrackUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFormats = ["audio/flac", "audio/wav"];
    const newTracks = [];

    files.forEach((file) => {
      if (!validFormats.includes(file.type)) {
        toast.dark(`❌ ${file.name} is not a valid format.`);
        return;
      }

      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);

      audio.onloadedmetadata = () => {
        const trackId = Date.now() + Math.random();
        const newTrack = {
          id: trackId,
          name: file.name,
          format: file.type,
          url: audioURL,
          duration: audio.duration,
          metadata: {},
          detailsCompleted: false,
        };
        
        // Store File object for later upload
        fileObjectsRef.current.set(trackId, file);
        globalFileObjects.set(trackId, file);
        
        newTracks.push(newTrack);

        if (newTracks.length === files.length) {
          const updatedTracks = [...tracks, ...newTracks];
          saveTracksToStorage(updatedTracks);
        }
      };
    });
  };

  const handleUploadSectionClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleDelete = (id) => {
    const updatedTracks = tracks.filter((track) => track.id !== id);
    saveTracksToStorage(updatedTracks);
    // Also remove File object
    fileObjectsRef.current.delete(id);
    globalFileObjects.delete(id);
  };

  const handleEditTrack = (track, idx) => {
    navigate("/track-details", {
      state: { track, trackIdx: idx },
    });
  };

  const handleDragStart = (idx) => setDraggedTrackIdx(idx);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (idx) => {
    if (draggedTrackIdx === null || draggedTrackIdx === idx) return;
    const updatedTracks = [...tracks];
    const [removed] = updatedTracks.splice(draggedTrackIdx, 1);
    updatedTracks.splice(idx, 0, removed);
    setTracks(updatedTracks);
    setDraggedTrackIdx(null);
  };

  // Proceed to next page - Create tracks and upload files via API
  const handleNextStep = async () => {
    if (tracks.length === 0) {
      toast.dark("⚠️ Please upload at least one track before continuing.");
      return;
    }

    if (tracks.some((t) => !t.detailsCompleted)) {
      toast.dark("ℹ️ Please complete track details before proceeding.");
      return;
    }

    const releaseId = releaseMetadata.releaseId;
    if (!releaseId) {
      toast.dark("⚠️ Release ID not found. Please go back and create release first.");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.dark("Please login to continue.");
      return;
    }

    setIsProcessing(true);
    toast.dark("Creating tracks and uploading files...", { autoClose: false });

    try {
      // Step 0: Get existing tracks to find next available trackNumber
      let nextTrackNumber = 1;
      try {
        // Method 1: Try to get tracks from release endpoint (includes tracks array)
        const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const releaseData = releaseResponse.data?.release || releaseResponse.data;
        
        // Check if tracks are included in release response
        let existingTracks = [];
        if (releaseData?.tracks && Array.isArray(releaseData.tracks)) {
          existingTracks = releaseData.tracks;
        } else {
          // Method 2: Fetch tracks using tracks service
          try {
            const tracksResponse = await TracksService.getTracksByReleaseId(releaseId);
            existingTracks = Array.isArray(tracksResponse) ? tracksResponse : 
                           (tracksResponse?.tracks || tracksResponse?.data || []);
          } catch (tracksError) {
            console.warn("Could not fetch tracks via service, trying trackIds:", tracksError);
            // Method 3: Fallback to fetching by trackIds
            const existingTrackIds = releaseData?.trackIds || [];
            if (existingTrackIds.length > 0) {
              const trackPromises = existingTrackIds.map(trackId =>
                TracksService.getTrackById(trackId).catch(() => null)
              );
              existingTracks = (await Promise.all(trackPromises)).filter(t => t !== null);
            }
          }
        }
        
        // Extract all trackNumbers from existing tracks
        const existingTrackNumbers = existingTracks
          .map(t => t.trackNumber)
          .filter(n => n !== undefined && n !== null && n > 0);
        
        if (existingTrackNumbers.length > 0) {
          // Find the highest trackNumber and start from next
          const maxTrackNumber = Math.max(...existingTrackNumbers);
          nextTrackNumber = maxTrackNumber + 1;
          console.log(`Found ${existingTrackNumbers.length} existing tracks. Max trackNumber: ${maxTrackNumber}, starting from: ${nextTrackNumber}`);
        } else {
          console.log("No existing tracks found, starting from trackNumber 1");
        }
      } catch (fetchError) {
        console.warn("Could not fetch existing tracks, starting from trackNumber 1:", fetchError);
      }
      
      const createdTracks = [];
      
      // Process each track
      for (let idx = 0; idx < tracks.length; idx++) {
        const track = tracks[idx];
        
        try {
          // Step 1: Create track via API
          const durationSeconds = Math.floor(track.duration || 0);
          if (!durationSeconds || durationSeconds <= 0) {
            throw new Error(`Invalid duration for track "${track.trackTitle || track.name}"`);
          }

          const assignedTrackNumber = nextTrackNumber++;
          console.log(`Assigning trackNumber ${assignedTrackNumber} to track "${track.trackTitle || track.name}"`);
          
          const trackData = {
            releaseId: releaseId,
            trackNumber: assignedTrackNumber, // Use next available trackNumber and increment
            title: track.trackTitle || track.name || `Track ${idx + 1}`,
            durationSeconds: durationSeconds,
            explicitFlag: track.explicitStatus === "Explicit" || false,
            isrc: track.isrcCode && track.isrcCode.trim() !== "" ? track.isrcCode.trim() : null,
            language: track.lyricsLanguage && track.lyricsLanguage.trim() !== "" ? track.lyricsLanguage.trim() : null,
            trackVersion: track.catalogId && track.catalogId.trim() !== "" ? track.catalogId.trim() : null,
            primaryArtistId: 0,
            audioFileId: 0,
          };

          const createdTrack = await TracksService.createTrack(trackData);
          const trackId = createdTrack.trackId || createdTrack.id;
          
          if (!trackId) {
            throw new Error(`Failed to create track ${idx + 1}: No trackId returned`);
          }

        // Step 2: Upload file if available
        let audioFileId = 0;
        const fileObject = fileObjectsRef.current.get(track.id);
        
        if (fileObject) {
          try {
            // Step 2a: Upload audio file using UploadAudio endpoint
            console.log(`[UploadTracks] Uploading audio file for track ${idx + 1}:`, {
              releaseId,
              trackId,
              fileName: fileObject.name,
              fileSize: fileObject.size,
              fileType: fileObject.type,
            });
            
            // Try UploadAudio endpoint first, fallback to direct upload if it fails
            let uploadResult;
            try {
              console.log(`[UploadTracks] Attempting UploadAudio endpoint first...`);
              uploadResult = await FilesService.uploadAudio({
                releaseId: Number(releaseId),
                trackId: Number(trackId),
                file: fileObject,
              });
              console.log(`[UploadTracks] ✅ UploadAudio endpoint succeeded`);
            } catch (uploadAudioError) {
              console.error(`[UploadTracks] ========== UPLOAD AUDIO ERROR CAUGHT ==========`);
              console.error(`[UploadTracks] UploadAudio endpoint failed:`, uploadAudioError);
              console.error(`[UploadTracks] Error type:`, typeof uploadAudioError);
              console.error(`[UploadTracks] Error status:`, uploadAudioError.status);
              console.error(`[UploadTracks] Error response status:`, uploadAudioError.response?.status);
              console.error(`[UploadTracks] Error message:`, uploadAudioError.message);
              console.error(`[UploadTracks] Error response data type:`, typeof uploadAudioError.response?.data);
              
              // Check for 405 error in multiple ways
              const status405 = uploadAudioError.status === 405 || uploadAudioError.response?.status === 405;
              const message405 = uploadAudioError.message && (
                uploadAudioError.message.includes('405') || 
                uploadAudioError.message.includes('Method Not Allowed')
              );
              const html405 = typeof uploadAudioError.response?.data === 'string' && 
                             uploadAudioError.response.data.includes('405');
              
              const is405Error = status405 || message405 || html405;
              
              console.log(`[UploadTracks] 405 Detection - status: ${status405}, message: ${message405}, html: ${html405}`);
              console.log(`[UploadTracks] Is 405 error?`, is405Error);
              
              if (is405Error) {
                console.warn(`[UploadTracks] ⚠️ UploadAudio endpoint returned 405, falling back to /api/files endpoint...`);
                
                try {
                  console.log(`[UploadTracks] Calling uploadFileDirectly with:`, {
                    releaseId: Number(releaseId),
                    trackId: Number(trackId),
                    fileType: "Audio",
                    fileName: fileObject.name,
                  });
                  
                  uploadResult = await FilesService.uploadFileDirectly({
                    releaseId: Number(releaseId),
                    trackId: Number(trackId),
                    fileType: "Audio",
                    file: fileObject,
                  });
                  
                  console.log(`[UploadTracks] ✅ Direct upload endpoint succeeded!`, uploadResult);
                } catch (directUploadError) {
                  console.error(`[UploadTracks] ❌ Direct upload endpoint also failed:`, directUploadError);
                  console.error(`[UploadTracks] Direct upload error status:`, directUploadError.response?.status);
                  throw new Error(`Both upload endpoints failed. UploadAudio (405): ${uploadAudioError.message?.substring(0, 100)}, Direct upload: ${directUploadError.message?.substring(0, 100)}`);
                }
              } else {
                // Re-throw if it's not a 405 error
                console.error(`[UploadTracks] Not a 405 error, re-throwing original error`);
                throw uploadAudioError;
              }
            }
            
            console.log(`[UploadTracks] Upload audio response for track ${idx + 1}:`, uploadResult);
            console.log(`[UploadTracks] Full upload response object:`, JSON.stringify(uploadResult, null, 2));

            // Extract fileId from response (try multiple possible field names)
            const fileId = uploadResult?.fileId || 
                          uploadResult?.id || 
                          uploadResult?.data?.fileId || 
                          uploadResult?.data?.id ||
                          uploadResult?.file?.fileId ||
                          uploadResult?.file?.id;
            
            console.log(`[UploadTracks] Extracted fileId: ${fileId} from response`);
            
            if (!fileId || fileId === 0) {
              console.error(`[UploadTracks] No fileId in upload response. Full response:`, uploadResult);
              throw new Error("File upload failed: No fileId returned");
            }

            const uploadedFileId = Number(fileId);
            console.log(`[UploadTracks] ✅ File upload succeeded! fileId: ${uploadedFileId}`);
            
            // Step 2a-2: Complete file upload to make it AVAILABLE
            try {
              console.log(`[UploadTracks] ========== COMPLETING FILE UPLOAD ==========`);
              console.log(`[UploadTracks] FileId from upload: ${uploadedFileId}`);
              console.log(`[UploadTracks] File size: ${fileObject.size} bytes`);
              
              // Get playUrl from upload response (this is the CloudFront URL)
              // Swagger shows: playUrl: "https://spacestation.tunewave.in/api/files/play/2026"
              const playUrl = uploadResult?.playUrl || uploadResult?.playurl || "";
              
              console.log(`[UploadTracks] Play URL from upload: ${playUrl}`);
              
              // Calculate checksum using Web Crypto API (SHA-256)
              let checksum = uploadResult?.checksum || "";
              if (!checksum) {
                try {
                  console.log(`[UploadTracks] Calculating checksum for file...`);
                  const arrayBuffer = await fileObject.arrayBuffer();
                  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                  const hashArray = Array.from(new Uint8Array(hashBuffer));
                  checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                  console.log(`[UploadTracks] Calculated checksum: ${checksum.substring(0, 20)}...`);
                } catch (checksumError) {
                  console.warn(`[UploadTracks] Failed to calculate checksum:`, checksumError);
                  // Use a placeholder if calculation fails
                  checksum = `placeholder-${uploadedFileId}-${Date.now()}`;
                  console.warn(`[UploadTracks] Using placeholder checksum: ${checksum}`);
                }
              }
              
              // Prepare complete data according to Swagger spec
              const completeData = {
                fileId: uploadedFileId,
                checksum: checksum,
                fileSize: Number(fileObject.size),
                cloudfrontUrl: playUrl || uploadResult?.cloudfrontUrl || "",
                backupUrl: uploadResult?.backupUrl || "",
              };
              
              console.log(`[UploadTracks] Complete request data:`, {
                ...completeData,
                checksum: checksum.substring(0, 20) + '...' // Log partial checksum
              });
              
              const completeResult = await FilesService.completeFileUpload(completeData);
              console.log(`[UploadTracks] ✅ File upload completed! Status:`, completeResult?.status);
              console.log(`[UploadTracks] Complete response:`, completeResult);
              
              // Use fileId from complete result or uploaded fileId
              audioFileId = completeResult?.fileId || completeResult?.id || uploadedFileId;
              
              console.log(`[UploadTracks] Final audioFileId after complete: ${audioFileId}`);
              
              // Verify file is AVAILABLE
              if (completeResult?.status === "AVAILABLE") {
                console.log(`[UploadTracks] ✅ File is now AVAILABLE and ready to use!`);
              } else {
                console.warn(`[UploadTracks] ⚠️ File status: ${completeResult?.status || 'unknown'}`);
              }
            } catch (completeError) {
              console.error(`[UploadTracks] ⚠️ Failed to complete file upload:`, completeError);
              console.error(`[UploadTracks] Complete error status:`, completeError.response?.status);
              console.error(`[UploadTracks] Complete error response:`, completeError.response?.data);
              
              // If complete fails, still use the fileId from upload (file is uploaded, just not finalized)
              audioFileId = uploadedFileId;
              console.warn(`[UploadTracks] Using fileId from upload (${uploadedFileId}) even though complete failed`);
              console.warn(`[UploadTracks] File is uploaded but may not be AVAILABLE yet`);
            }
          } catch (uploadError) {
            // This catch block handles FILE UPLOAD errors only
            console.error(`[UploadTracks] ========== FILE UPLOAD ERROR FOR TRACK ${idx + 1} ==========`);
            console.error(`[UploadTracks] This error is from FILE UPLOAD, not track update`);
            console.error(`[UploadTracks] Track name:`, track.trackTitle || track.name);
            console.error(`[UploadTracks] Track ID:`, track.id);
            console.error(`[UploadTracks] Created trackId:`, trackId);
            console.error(`[UploadTracks] Release ID:`, releaseId);
            console.error(`[UploadTracks] File name:`, fileObject?.name);
            console.error(`[UploadTracks] File size:`, fileObject?.size);
            console.error(`[UploadTracks] File type:`, fileObject?.type);
            console.error(`[UploadTracks] ========== ERROR OBJECT ==========`);
            console.error(`[UploadTracks] Error:`, uploadError);
            console.error(`[UploadTracks] Error message:`, uploadError.message);
            console.error(`[UploadTracks] Error status:`, uploadError.status || uploadError.response?.status);
            console.error(`[UploadTracks] Error statusText:`, uploadError.statusText || uploadError.response?.statusText);
            console.error(`[UploadTracks] Error code:`, uploadError.code);
            
            // Log full response if available
            if (uploadError.response) {
              console.error(`[UploadTracks] ========== FULL ERROR RESPONSE ==========`);
              console.error(`[UploadTracks] Response status:`, uploadError.response.status);
              console.error(`[UploadTracks] Response statusText:`, uploadError.response.statusText);
              console.error(`[UploadTracks] Response headers:`, uploadError.response.headers);
              console.error(`[UploadTracks] Response data:`, uploadError.response.data);
              try {
                console.error(`[UploadTracks] Response data (JSON):`, JSON.stringify(uploadError.response.data, null, 2));
              } catch (e) {
                console.error(`[UploadTracks] Could not stringify response data`);
              }
            }
            
            // Log responseData if available (from enhanced error)
            if (uploadError.responseData) {
              console.error(`[UploadTracks] ResponseData:`, uploadError.responseData);
            }
            
            console.error(`[UploadTracks] Request URL:`, uploadError.config?.url || uploadError.response?.config?.url);
            console.error(`[UploadTracks] Request method:`, uploadError.config?.method || uploadError.response?.config?.method);
            
            // Extract detailed error message
            const errorMsg = uploadError.responseData?.message || 
                           uploadError.responseData?.error || 
                           uploadError.responseData?.errorMessage ||
                           uploadError.responseData?.title ||
                           (typeof uploadError.responseData === 'string' ? uploadError.responseData : null) ||
                           uploadError.response?.data?.message ||
                           uploadError.response?.data?.error ||
                           (typeof uploadError.response?.data === 'string' ? uploadError.response?.data : null) ||
                           uploadError.message || 
                           "Unknown error";
            
            console.error(`[UploadTracks] Extracted error message:`, errorMsg);
            
            // Create user-friendly error message
            const userFriendlyError = uploadError.status === 500 
              ? `Backend server error (500): ${errorMsg || 'No error message from server'}. Please check backend logs for details.`
              : `Failed to upload audio file for "${track.trackTitle || track.name}": ${errorMsg}`;
            
            throw new Error(userFriendlyError);
          }
        }

        // Step 2b: Verify track has audioFileId linked
        // The backend should auto-link the file when uploading via /api/files/UploadAudio with trackId
        // So we don't need to update the track - just fetch it to verify the link
        if (audioFileId && audioFileId > 0) {
          try {
            console.log(`[UploadTracks] Fetching track ${trackId} to verify audioFileId is linked...`);
            const fetchedTrack = await TracksService.getTrackById(trackId);
            const backendAudioFileId = fetchedTrack?.audioFileId || fetchedTrack?.data?.audioFileId;
            console.log(`[UploadTracks] Backend track audioFileId: ${backendAudioFileId}`);
            
            if (backendAudioFileId && backendAudioFileId > 0) {
              audioFileId = backendAudioFileId;
              console.log(`[UploadTracks] ✅ Backend auto-linked audioFileId: ${audioFileId}`);
            } else {
              // Backend didn't auto-link, but file is uploaded
              // The fileId is still valid, backend might link it later or via different mechanism
              console.warn(`[UploadTracks] ⚠️ Backend track does not have audioFileId set yet. File ID: ${audioFileId}, Track ID: ${trackId}`);
              console.warn(`[UploadTracks] File is uploaded successfully. Backend may link it via a different process.`);
            }
          } catch (fetchError) {
            console.error(`[UploadTracks] Failed to fetch track:`, fetchError);
            console.warn(`[UploadTracks] Using fileId from upload (${audioFileId}) but cannot verify link to track`);
          }
        }

          // Ensure audioFileId is set correctly
          const finalAudioFileId = audioFileId && audioFileId > 0 ? audioFileId : 0;
          
          createdTracks.push({
            ...track,
            trackId: trackId,
            audioFileId: finalAudioFileId,
          });
          
          console.log(`[UploadTracks] Track ${idx + 1} processed: trackId=${trackId}, audioFileId=${finalAudioFileId}`);
          
          // Summary log
          if (finalAudioFileId > 0) {
            console.log(`[UploadTracks] ✅ Track ${idx + 1} ("${track.trackTitle || track.name}"): File uploaded successfully (fileId: ${finalAudioFileId})`);
          } else {
            console.warn(`[UploadTracks] ⚠️ Track ${idx + 1} ("${track.trackTitle || track.name}"): No audio file uploaded`);
          }
        } catch (trackError) {
          console.error(`[UploadTracks] ❌ Error processing track ${idx + 1}:`, trackError);
          const errorMsg = trackError.response?.data?.message || trackError.message || "Unknown error";
          throw new Error(`Failed to process track "${track.trackTitle || track.name}": ${errorMsg}`);
        }
      }

      // Step 3: Summary before updating release
      console.log(`[UploadTracks] ========== UPLOAD SUMMARY ==========`);
      console.log(`[UploadTracks] Total tracks processed: ${createdTracks.length}`);
      const tracksWithFiles = createdTracks.filter(t => t.audioFileId > 0).length;
      console.log(`[UploadTracks] Tracks with uploaded files: ${tracksWithFiles}`);
      console.log(`[UploadTracks] Tracks without files: ${createdTracks.length - tracksWithFiles}`);
      createdTracks.forEach((t, idx) => {
        console.log(`[UploadTracks]   Track ${idx + 1}: trackId=${t.trackId}, audioFileId=${t.audioFileId || 'NONE'}`);
      });

      // Step 3: Update release with trackIds
      const trackIds = createdTracks.map(t => t.trackId).filter(id => id);
      if (trackIds.length > 0) {
        const token = localStorage.getItem("jwtToken");
        await axios.post(`/api/releases/${releaseId}`, {
          trackIds: trackIds,
        }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.dismiss();
      toast.success("✅ Tracks created and files uploaded successfully!", { autoClose: 3000 });
      
      localStorage.setItem("uploadedTracks", JSON.stringify(createdTracks));
    navigate("/select-stores", {
        state: { ...releaseMetadata, tracks: createdTracks },
      });
    } catch (error) {
      console.error("Error creating tracks:", error);
      toast.dismiss();
      toast.dark(`Error: ${error.message || "Failed to create tracks"}. Please try again.`, { autoClose: 5000 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Upload Tracks</h2>
      <div className="upload-layout">
        {/* LEFT SIDE — PREVIEW SECTION */}
        <div className="preview-section">
          <div className="preview-content">
            {/* Cover Art */}
            <div className="cover-art-container">
              <img
                src={releaseMetadata.coverArt || defaultCover}
                alt="Cover Art"
                className="cover-art-image"
              />
            </div>
            {/* Album Info */}
            <div className="preview-info">
              <div className="preview-item">
                <p>
                  <strong>Album Name</strong>
                </p>
                <p>{releaseMetadata.title || "Tunewave"}</p>
              </div>
              <div className="preview-item">
                <p>
                  <strong>Main Primary Artist</strong>
                </p>
                <p>{releaseMetadata.mainPrimaryArtist || "Tunewave"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — UPLOAD SECTION */}
        <div
          className="upload-box"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.add("drag-over");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove("drag-over");
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove("drag-over");
            const files = Array.from(e.dataTransfer.files);
            const validFiles = files.filter((file) =>
              [".flac", ".wav"].some((ext) =>
                file.name.toLowerCase().endsWith(ext)
              )
            );
            if (validFiles.length > 0) {
              handleTrackUpload({ target: { files: validFiles } });
            } else {
              toast.dark("Only FLAC and WAV files are allowed.");
            }
          }}
        >
          <div className="upload-section-wrapper">
            <div
              className="upload-section"
              onClick={handleUploadSectionClick}
              style={{ cursor: "pointer" }}
            >
              <div className="upload-area">
                <p className="upload-subtitle">Format: FLAC or WAV</p>
                <p className="upload-requirements">
                  Requirements: Minimum 16 bit, 44.1 KHz, stereo <br />
                  Recommended 24 bits, 48KHz or 24 bits, 96KHz
                </p>
                <p className="drag-drop-hint">or drag & drop files here</p>
              </div>
              <input
                type="file"
                accept=".flac,.wav"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleTrackUpload}
              />
            </div>
            {tracks.length > 0 && (
              <div className="uploaded-tracks-list">
                {tracks.map((track, idx) => (
                  <div
                    key={track.id}
                    className="track-card"
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(idx)}
                    style={{
                      opacity: draggedTrackIdx === idx ? 0.5 : 1,
                      cursor: "move",
                    }}
                  >
                    <div className="track-info" style={{ textAlign: "center" }}>
                      <strong>Track {idx + 1}</strong>
                      <p>{track.name}</p>
                    </div>
                    <div className="track-controls">
                      <audio controls src={track.url}></audio>
                      <span className="duration">
                        {formatDuration(track.duration)}
                      </span>
                      <button
                        className={`edit-btn ${
                          !track.detailsCompleted ? "incomplete" : ""
                        }`}
                        onClick={() => handleEditTrack(track, idx)}
                      >
                        Edit {!track.detailsCompleted && "⚠️"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(track.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
          />
        </div>
      </div>
      <div className="btn-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate("/create-release")}
        >
          Back
        </button>
        <button
          className="btn-gradient"
          disabled={
            isProcessing ||
            tracks.length === 0 || 
            tracks.some((t) => !t.detailsCompleted)
          }
          onClick={handleNextStep}
          style={{
            cursor:
              isProcessing ||
              tracks.length === 0 || 
              tracks.some((t) => !t.detailsCompleted)
                ? "not-allowed"
                : "pointer",
            opacity:
              isProcessing ||
              tracks.length === 0 || 
              tracks.some((t) => !t.detailsCompleted)
                ? 0.6
                : 1,
          }}
        >
          {isProcessing ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default UploadTracks;
