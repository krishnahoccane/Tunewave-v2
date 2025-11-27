import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import axios from "axios";
import * as EnterprisesService from "../services/enterprises";

function CreateEnterprise() {
  const navigate = useNavigate();

  const [enterpriseName, setEnterpriseName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [revenueShare, setRevenueShare] = useState("10");
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);
  const [qcRequired, setQcRequired] = useState("");
  
  // ISRC Master Code fields
  const [hasIsrcMasterCode, setHasIsrcMasterCode] = useState("");
  const [isrcAudioUrl, setIsrcAudioUrl] = useState("");
  const [isrcVideoUrl, setIsrcVideoUrl] = useState("");
  const [isrcCertificateFile, setIsrcCertificateFile] = useState(null);
  // Helper function to get userId from localStorage (might be base64 encoded)
  const getUserId = () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return 0;
    
    try {
      // Try to decode base64 first
      const decoded = atob(storedUserId);
      const userId = parseInt(decoded, 10);
      return isNaN(userId) ? 0 : userId;
    } catch {
      // If not base64, try parsing directly
      const userId = parseInt(storedUserId, 10);
      return isNaN(userId) ? 0 : userId;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!enterpriseName.trim()) {
      toast.dark("Please enter Enterprise Name.", { transition: Slide });
      return;
    }
    if (!email.trim()) {
      toast.dark("Please enter Email.", { transition: Slide });
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.dark("Please enter a valid email address.", { transition: Slide });
      return;
    }
    if (!domain.trim()) {
      toast.dark("Please enter Domain.", { transition: Slide });
      return;
    }
    if (!qcRequired) {
      toast.dark("Please select QC Required.", { transition: Slide });
      return;
    }

    // Parse revenueShare: remove % and convert to number, default to 10 if empty
    const revenueShareToParse = revenueShare.trim() || "10";
    const revenueShareValue = parseFloat(revenueShareToParse.replace(/%/g, "").trim());
    if (isNaN(revenueShareValue)) {
      toast.dark("Please enter a valid Revenue Share number.", { transition: Slide });
      return;
    }

    // Convert qcRequired to boolean
    const qcRequiredBool = qcRequired === "Required";

    // Get userId for createdBy
    const createdBy = getUserId();

    // Prepare form data according to API schema
    const formData = {
      enterpriseName: enterpriseName.trim(),
      ownerEmail: email.trim(), // Map email to ownerEmail for API
      domain: domain.trim(),
      revenueSharePercent: revenueShareValue, // Map revenueShare to revenueSharePercent
      qcRequired: qcRequiredBool,
    };

    // Handle ISRC Master Code fields
    if (hasIsrcMasterCode === "Yes") {
      // If Yes, include ISRC URLs (null if empty)
      formData.hasIsrcMasterCode = true;
      formData.isrcAudioUrl = isrcAudioUrl.trim() || null;
      formData.isrcVideoUrl = isrcVideoUrl.trim() || null;
      formData.isrcCertificateFile = isrcCertificateFile;
      formData.isrcCertificateUrl = null; // Will be set after file upload
    } else {
      // If No, set all ISRC fields to null
      formData.hasIsrcMasterCode = false;
      formData.isrcAudioUrl = null;
      formData.isrcVideoUrl = null;
      formData.isrcCertificateUrl = null;
    }

    const token = localStorage.getItem("jwtToken");
    
    // Diagnostic: Check if token exists
    if (!token) {
      toast.dark("Authentication required. Please login again.");
      console.warn("No JWT token found in localStorage");
      return;
    }
    
    try {
      console.log("Submitting form data:", formData);
      console.log("Token exists:", !!token);
      
      const data = await EnterprisesService.createEnterprise(formData);

      console.log("Response data:", data);
      
      // Check if data was created successfully
      const isSuccess = data && (data.id || data.enterpriseId || data.enterpriseName || data.success === true);
      
      if (isSuccess) {
        toast.success("Enterprise created successfully!");
        console.log("Enterprise created:", data);
        
        // Navigate back to enterprise catalog after a short delay
        // Use replace: false and add timestamp to force refresh
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises", { 
            replace: false,
            state: { refresh: true, timestamp: Date.now() }
          });
        }, 1500);
      } else {
        // Backend error - show detailed error message
        console.error("Backend Error Response:", data);
        
        // Extract error message from various possible response formats
        const errorMessage = 
          data.message || 
          data.error || 
          data.title ||
          data.detail ||
          (data.errors && JSON.stringify(data.errors)) ||
          "Failed to create enterprise";
        
        toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000 });
      }
    } catch (error) {
      console.error("Axios error details:", error);
      
      // Handle axios errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const data = error.response.data;
        const status = error.response.status;
        
        const errorMessage = 
          error.response.data?.message || 
          error.response.data?.error || 
          error.response.data?.title ||
          error.response.data?.detail ||
          (error.response.data?.errors && JSON.stringify(error.response.data.errors)) ||
          `Server Error (${error.response.status})`;
        
        toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000 });
      } else if (error.request) {
        // The request was made but no response was received
        toast.dark("Network error: Unable to reach the server. Please check your internet connection or try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.dark(`Error: ${error.message || "Network error. Please check your connection and try again."}`);
      }
    }
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Create Enterprise</h2>

      {/* Enterprise Details Section */}
      <div className="section">
        <h3>Enter Enterprise Details</h3>

        <div className="input-group">
          <label htmlFor="enterpriseName">
            Enterprise Name <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="enterpriseName"
            placeholder="e.g., Acme Corporation"
            className="input-field input-field-half-width"
            onChange={(e) => setEnterpriseName(e.target.value)}
            value={enterpriseName}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">
            Email <span className="required-asterisk">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="e.g., contact@acme.com"
            className="input-field input-field-half-width"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="input-group">
          <label htmlFor="domain">
            Domain <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="domain"
            placeholder="e.g., acme.com"
            className="input-field input-field-half-width"
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
          />
        </div>

        <div className="input-group">
          <label htmlFor="revenueShare">
            Revenue Share <span className="required-asterisk">*</span>
          </label>
          <div className="revenue-share-wrapper">
            <input
              type="text"
              id="revenueShare"
              placeholder="10"
              className={`input-field revenue-share-input ${isRevenueShareEditable ? "editable" : "readonly"}`}
              onChange={(e) => setRevenueShare(e.target.value)}
              value={revenueShare}
              readOnly={!isRevenueShareEditable}
            />
            {!isRevenueShareEditable ? (
              <button
                type="button"
                onClick={() => setIsRevenueShareEditable(true)}
                className="btn-gradient revenue-share-btn"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsRevenueShareEditable(false);
                  // Reset to default if empty
                  if (!revenueShare.trim()) {
                    setRevenueShare("10");
                  }
                }}
                className="btn-gradient revenue-share-btn"
              >
                Save
              </button>
            )}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="qcRequired">
            QC Required <span className="required-asterisk">*</span>
          </label>
          <div className="radio-group-container">
            <label className="radio-label">
              <input
                type="radio"
                name="qcRequired"
                value="Required"
                onChange={() => setQcRequired("Required")}
                checked={qcRequired === "Required"}
              />
              <span>Required</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="qcRequired"
                value="Not required"
                onChange={() => setQcRequired("Not required")}
                checked={qcRequired === "Not required"}
              />
              <span>Not required</span>
            </label>
          </div>
        </div>
      </div>

      {/* ISRC Master Code Section */}
      <div className="section">
        <h3>ISRC Master Code</h3>

        <div className="input-group">
          <label htmlFor="hasIsrcMasterCode">
            Do you have ISRC Master Code? <span className="required-asterisk">*</span>
          </label>
          <div className="radio-group-container">
            <label className="radio-label">
              <input
                type="radio"
                name="hasIsrcMasterCode"
                value="Yes"
                onChange={() => setHasIsrcMasterCode("Yes")}
                checked={hasIsrcMasterCode === "Yes"}
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasIsrcMasterCode"
                value="No"
                onChange={() => {
                  setHasIsrcMasterCode("No");
                  // Clear ISRC fields when No is selected
                  setIsrcAudioUrl("");
                  setIsrcVideoUrl("");
                  setIsrcCertificateFile(null);
                }}
                checked={hasIsrcMasterCode === "No"}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {hasIsrcMasterCode === "Yes" && (
          <>
            <div className="input-group">
              <label htmlFor="isrcAudioUrl">
                Audio Master Code
              </label>
              <input
                type="text"
                id="isrcAudioUrl"
                placeholder="e.g., US-ABC-12-34567"
                className="input-field input-field-half-width"
                onChange={(e) => setIsrcAudioUrl(e.target.value)}
                value={isrcAudioUrl}
              />
            </div>

            <div className="input-group">
              <label htmlFor="isrcVideoUrl">
                Video Master Code
              </label>
              <input
                type="text"
                id="isrcVideoUrl"
                placeholder="e.g., US-XYZ-98-76543"
                className="input-field input-field-half-width"
                onChange={(e) => setIsrcVideoUrl(e.target.value)}
                value={isrcVideoUrl}
              />
            </div>

            <div className="input-group">
              <label htmlFor="isrcCertificateFile">
                ISRC Certificate PDF
              </label>
              <small style={{ display: "block", marginTop: "5px", color: "#666", marginBottom: "5px" }}>
                Upload a PDF file:
              </small>
              <input
                type="file"
                id="isrcCertificateFile"
                accept=".pdf"
                className="input-field input-field-half-width"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.type !== "application/pdf") {
                      toast.dark("Please select a PDF file.", { transition: Slide });
                      return;
                    }
                    setIsrcCertificateFile(file);
                    toast.dark("PDF file selected.", { transition: Slide });
                  }
                }}
              />
              {isrcCertificateFile && (
                <small style={{ display: "block", marginTop: "5px", color: "#28a745" }}>
                  Selected: {isrcCertificateFile.name}
                </small>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-cancel" onClick={() => navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises")}>
          Cancel
        </button>
        <button className="btn-gradient" onClick={handleSubmit}>
          Create Enterprise
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default CreateEnterprise;
