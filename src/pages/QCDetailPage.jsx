import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/styled.css";
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
        
        const releaseData = releaseResponse.data || {};
        console.log("Release data fetched:", releaseData);
        
        // Store original data for merging later
        setOriginalReleaseData(releaseData);
        
        // Update form data with fetched release data
        const updatedFormData = {
          title: releaseData.title || formData.title,
          artist: releaseData.artistName || releaseData.artist || formData.artist,
          label: releaseData.labelName || releaseData.label || formData.label,
          language: releaseData.language || formData.language,
          primaryGenre: releaseData.primaryGenre || formData.primaryGenre,
          secondaryGenre: releaseData.secondaryGenre || formData.secondaryGenre,
          explicitLyrics: releaseData.explicitLyrics ? "Yes" : "No",
          digitalReleaseDate: releaseData.digitalReleaseDate || releaseData.releaseDate || formData.digitalReleaseDate,
          originalReleaseDate: releaseData.originalReleaseDate || formData.originalReleaseDate,
          isrcCode: releaseData.isrcCode || formData.isrcCode,
          upcCode: releaseData.upcCode || formData.upcCode,
          stores: releaseData.stores || releaseData.distributionStores || formData.stores,
        };
        
        setFormData(updatedFormData);
        setStatus(releaseData.status || "Pending");
        
        // Set cover image
        if (releaseData.coverArtUrl || releaseData.coverImage) {
          setCoverPreview(releaseData.coverArtUrl || releaseData.coverImage);
        }
        
        // Fetch tracks for this release
        console.log(`Fetching tracks for releaseId: ${releaseId}`);
        try {
          let tracksData = [];
          
          // First, check if tracks are included in release data
          if (releaseData.tracks && Array.isArray(releaseData.tracks) && releaseData.tracks.length > 0) {
            console.log("Tracks found in release data");
            tracksData = releaseData.tracks;
          } else {
            // Try fetching tracks from dedicated endpoint
            try {
              console.log(`Trying /api/tracks?releaseId=${releaseId}`);
              const tracksResponse = await axios.get(`/api/tracks?releaseId=${releaseId}`, {
                headers: getAuthHeaders(),
              });
              
              console.log("Tracks response:", tracksResponse.data);
              
              // Handle different response formats
              if (Array.isArray(tracksResponse.data)) {
                tracksData = tracksResponse.data;
              } else if (tracksResponse.data?.data && Array.isArray(tracksResponse.data.data)) {
                tracksData = tracksResponse.data.data;
              } else if (tracksResponse.data?.tracks && Array.isArray(tracksResponse.data.tracks)) {
                tracksData = tracksResponse.data.tracks;
              } else if (tracksResponse.data?.items && Array.isArray(tracksResponse.data.items)) {
                tracksData = tracksResponse.data.items;
              }
              
              console.log(`Found ${tracksData.length} tracks`);
            } catch (firstError) {
              console.warn("First tracks endpoint failed:", {
                status: firstError.response?.status,
                message: firstError.message,
                data: firstError.response?.data,
              });
              
              // Try alternative endpoint
              try {
                console.log(`Trying /api/releases/${releaseId}/tracks`);
                const altTracksResponse = await axios.get(`/api/releases/${releaseId}/tracks`, {
                  headers: getAuthHeaders(),
                });
                
                if (Array.isArray(altTracksResponse.data)) {
                  tracksData = altTracksResponse.data;
                } else if (altTracksResponse.data?.data) {
                  tracksData = altTracksResponse.data.data;
                } else if (altTracksResponse.data?.tracks) {
                  tracksData = altTracksResponse.data.tracks;
                }
                
                console.log(`Found ${tracksData.length} tracks from alternative endpoint`);
              } catch (secondError) {
                console.warn("Alternative tracks endpoint also failed:", {
                  status: secondError.response?.status,
                  message: secondError.message,
                });
                tracksData = [];
              }
            }
          }
          
          // Map tracks to playable format
          const mappedTracks = tracksData.map((track, index) => {
            const trackId = track.trackId || track.id || index + 1;
            const audioUrl = track.audioFileUrl || track.audioUrl || track.fileUrl || track.audioFile?.url || "";
            const durationSeconds = track.durationSeconds || track.duration;
            
            return {
              id: trackId,
              trackId: trackId,
              title: track.title || `Track ${index + 1}`,
              audioUrl: audioUrl,
              duration: durationSeconds 
                ? `${Math.floor(durationSeconds / 60)}:${String(Math.floor(durationSeconds % 60)).padStart(2, "0")}`
                : track.duration || "00:00",
              durationSeconds: durationSeconds,
              isrc: track.isrc || track.isrcCode || "",
              trackNumber: track.trackNumber || track.trackNumber || index + 1,
              ...track, // Include all other track fields
            };
          });
          
          console.log(`Mapped ${mappedTracks.length} tracks:`, mappedTracks);
          setTracks(mappedTracks);
        } catch (trackError) {
          console.error("Error fetching tracks:", trackError);
          console.error("Track error details:", {
            message: trackError.message,
            response: trackError.response?.data,
            status: trackError.response?.status,
            url: trackError.config?.url,
          });
          // Don't show error toast for tracks, just set empty array
          setTracks([]);
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
      } else {
        alert("Image must be exactly 3000px by 3000px.");
      }
      URL.revokeObjectURL(img.src);
    };
  };

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
      
      // Try to update release details if we have form data changes (optional - don't block on failure)
      if (originalReleaseData || formData.title) {
        try {
          let currentReleaseData = originalReleaseData;
          
          if (!currentReleaseData) {
            try {
              const releaseResponse = await axios.get(`/api/releases/${releaseId}`, {
                headers: getAuthHeaders(),
              });
              currentReleaseData = releaseResponse.data || {};
            } catch (error) {
              console.warn("Could not fetch release data for update, proceeding with QC action only");
              currentReleaseData = {};
            }
          }
          
          // Merge form data with existing release data (preserve all fields)
          const mergedReleaseData = {
            ...currentReleaseData,
            releaseId: releaseId,
            title: formData.title || currentReleaseData.title,
            artistName: formData.artist || currentReleaseData.artistName,
            labelName: formData.label || currentReleaseData.labelName,
            language: formData.language || currentReleaseData.language,
            primaryGenre: formData.primaryGenre || currentReleaseData.primaryGenre,
            secondaryGenre: formData.secondaryGenre || currentReleaseData.secondaryGenre,
            explicitLyrics: formData.explicitLyrics === "Yes",
            digitalReleaseDate: formData.digitalReleaseDate || currentReleaseData.digitalReleaseDate,
            originalReleaseDate: formData.originalReleaseDate || currentReleaseData.originalReleaseDate,
            isrcCode: formData.isrcCode || currentReleaseData.isrcCode,
            upcCode: formData.upcCode || currentReleaseData.upcCode,
            stores: Array.isArray(formData.stores) && formData.stores.length > 0 
              ? formData.stores 
              : currentReleaseData.stores || [],
          };
          
          // Handle cover art upload if changed
          if (coverArtwork) {
            mergedReleaseData.coverArt = coverArtwork;
          }
          
          // Update release via POST /api/releases/{releaseId} (optional - don't block on failure)
          try {
            await axios.post(`/api/releases/${releaseId}`, mergedReleaseData, {
              headers: getAuthHeaders(),
            });
            console.log("Release updated successfully");
          } catch (updateError) {
            console.warn("Release update failed, but continuing with QC action:", updateError);
            // Don't show error - just continue with QC action
          }
        } catch (updateError) {
          console.warn("Could not update release, proceeding with QC action only");
        }
      }
      
      // Perform QC action (this is the main action - should work even if details didn't load)
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

  // Determine which buttons to show based on role
  const getActionButtons = () => {
    if (actualRole === "LabelAdmin" || actualRole?.toLowerCase() === "labeladmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
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
            onClick={() => handleAction("submit")}
            disabled={loading}
          >
            Submit
          </button>
        </>
      );
    } else if (actualRole === "EnterpriseAdmin" || actualRole?.toLowerCase() === "enterpriseadmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
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
            onClick={() => handleAction("submit")}
            disabled={loading}
          >
            Submit
          </button>
        </>
      );
    } else if (actualRole === "SuperAdmin" || actualRole?.toLowerCase() === "superadmin") {
      return (
        <>
          <button className="btn-cancel" onClick={() => navigate(-1)}>
            Back
          </button>
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
      <button className="btn-cancel" onClick={() => navigate(-1)}>
        Back
      </button>
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
                    <div className="duration-player-row">
                      <span>{track.duration}</span>
                      {track.audioUrl ? (
                        <audio controls style={{ width: "260px", height: "40px" }}>
                          <source src={track.audioUrl} type="audio/mpeg" />
                          <source src={track.audioUrl} type="audio/wav" />
                          <source src={track.audioUrl} type="audio/flac" />
                          Your browser does not support the audio element.
                        </audio>
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
    </div>
  );
}

