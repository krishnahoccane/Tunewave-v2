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
  const [phone, setPhone] = useState("");
  const [domain, setDomain] = useState("");
  const [revenueShare, setRevenueShare] = useState("10");
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);
  const [qcRequired, setQcRequired] = useState("");
  const [agreementStartDate, setAgreementStartDate] = useState(""); // date (YYYY-MM-DD)
  const [agreementEndDate, setAgreementEndDate] = useState(""); // date (YYYY-MM-DD)
  const [hasIsrcMasterCode, setHasIsrcMasterCode] = useState(null); // null = not selected (required), true/false = selected
  const [audioMasterCode, setAudioMasterCode] = useState("");
  const [videoMasterCode, setVideoMasterCode] = useState("");
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

  // Format master code: insert "-" after first 2 letters and convert to uppercase
  const formatMasterCode = (value) => {
    // Remove any existing dashes and convert to uppercase
    let formatted = value.replace(/-/g, "").toUpperCase();
    
    // Insert dash after first 2 characters if we have at least 2 characters
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + "-" + formatted.slice(2);
    }
    
    // Limit to 6 characters (2 letters + dash + 3 alphanumeric)
    if (formatted.length > 6) {
      formatted = formatted.slice(0, 6);
    }
    
    return formatted;
  };

  // Validate master code format: ^[A-Z]{2}[A-Z0-9]{3}$ (with optional dash)
  const validateMasterCode = (code) => {
    if (!code) return true; // Optional field
    const cleaned = code.replace(/-/g, "");
    const regex = /^[A-Z]{2}[A-Z0-9]{3}$/;
    return regex.test(cleaned);
  };

  // Handle master code input change with auto-formatting
  const handleMasterCodeChange = (value, setter) => {
    const formatted = formatMasterCode(value);
    setter(formatted);
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
    if (!phone.trim()) {
      toast.dark("Please enter Phone.", { transition: Slide });
      return;
    }
    // Numeric-friendly validation (allow +, digits, spaces, parentheses, hyphens)
    const phoneTrimmed = phone.trim();
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phoneTrimmed)) {
      toast.dark("Please enter a valid phone number.", { transition: Slide });
      return;
    }
    if (!agreementStartDate) {
      toast.dark("Please select Agreement Start Date.", { transition: Slide });
      return;
    }
    if (!agreementEndDate) {
      toast.dark("Please select Agreement End Date.", { transition: Slide });
      return;
    }

    // Date-only validation and UTC-midnight ISO conversion (no local offset)
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateOnlyRegex.test(agreementStartDate) || !dateOnlyRegex.test(agreementEndDate)) {
      toast.dark("Please select valid Agreement Start/End Date values.", { transition: Slide });
      return;
    }

    // Ensure end date is >= start date (date-only comparison; YYYY-MM-DD is lexicographically sortable)
    if (agreementEndDate < agreementStartDate) {
      toast.dark("Agreement End Date must be on or after Agreement Start Date.", { transition: Slide });
      return;
    }

    // Force time to 00:00:00.000Z and keep it in UTC (no local time offsets)
    const agreementStartIso = `${agreementStartDate}T00:00:00.000Z`;
    const agreementEndIso = `${agreementEndDate}T00:00:00.000Z`;
    if (!qcRequired) {
      toast.dark("Please select QC Required.", { transition: Slide });
      return;
    }

    // Validate Has ISRC Master Code (required field)
    if (hasIsrcMasterCode === null) {
      toast.dark("Please select Has ISRC Master Code.", { transition: Slide });
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

    // When HasIsrcMasterCode === true, validate required fields
    if (hasIsrcMasterCode === true) {
      // Audio Master Code is required when HasIsrcMasterCode === true
      if (!audioMasterCode.trim()) {
        toast.dark("Audio Master Code is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (!validateMasterCode(audioMasterCode)) {
        toast.dark("Audio Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }

      // Video Master Code is required when HasIsrcMasterCode === true
      if (!videoMasterCode.trim()) {
        toast.dark("Video Master Code is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (!validateMasterCode(videoMasterCode)) {
        toast.dark("Video Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }

      // ISRC Certificate File is required when HasIsrcMasterCode === true
      if (!isrcCertificateFile) {
        toast.dark("ISRC Certificate File (PDF) is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (isrcCertificateFile.type !== "application/pdf") {
        toast.dark("ISRC Certificate File must be a PDF file.", { transition: Slide });
        return;
      }
    } else {
      // When HasIsrcMasterCode === false, validate master codes only if provided (optional)
      if (audioMasterCode.trim() && !validateMasterCode(audioMasterCode)) {
        toast.dark("Audio Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }
      if (videoMasterCode.trim() && !validateMasterCode(videoMasterCode)) {
        toast.dark("Video Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }

      // Validate file type if file is selected (optional when HasIsrcMasterCode === false)
      if (isrcCertificateFile && isrcCertificateFile.type !== "application/pdf") {
        toast.dark("ISRC Certificate File must be a PDF file.", { transition: Slide });
        return;
      }
    }

    // Get userId for createdBy
    const createdBy = getUserId();

    // Always use FormData (multipart/form-data) to match backend contract
    // Map fields with exact case-sensitive names as specified in Swagger/Postman
    console.log("[CreateEnterprise] Creating FormData for multipart/form-data request");
    const formData = new FormData();
    
    // Required fields - exact case-sensitive names
    formData.append("EnterpriseName", enterpriseName.trim());
    formData.append("OwnerEmail", email.trim());
    formData.append("Phone", phoneTrimmed);
    formData.append("Domain", domain.trim());
    formData.append("RevenueShare", revenueShareValue.toString());
    formData.append("QCRequired", qcRequiredBool.toString());
    formData.append("AgreementStartDate", agreementStartIso);
    formData.append("AgreementEndDate", agreementEndIso);
    formData.append("HasIsrcMasterCode", hasIsrcMasterCode.toString());
    
    // Optional master code fields - send empty string if not applicable
    formData.append("AudioMasterCode", audioMasterCode.trim() ? audioMasterCode.replace(/-/g, "") : "");
    formData.append("VideoMasterCode", videoMasterCode.trim() ? videoMasterCode.replace(/-/g, "") : "");
    
    // Optional certificate file - only append if provided
    if (isrcCertificateFile) {
      formData.append("IsrcCertificateFile", isrcCertificateFile);
      console.log("[CreateEnterprise] Certificate file included:", isrcCertificateFile.name);
    } else {
      console.log("[CreateEnterprise] Certificate file not provided (optional - submission allowed)");
    }
    
    // Log FormData contents (excluding file binary)
    console.log("[CreateEnterprise] FormData entries:", 
      Array.from(formData.entries()).map(([key, value]) => [
        key, 
        value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value
      ])
    );

    const token = localStorage.getItem("jwtToken");
    
    // Diagnostic: Check if token exists
    if (!token) {
      toast.dark("Authentication required. Please login again.");
      console.warn("[CreateEnterprise] No JWT token found in localStorage");
      return;
    }
    
    try {
      console.log("[CreateEnterprise] Submitting request - Type: FormData (multipart/form-data)");
      console.log("[CreateEnterprise] Token exists:", !!token);
      
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
          <label htmlFor="phone">
            Phone <span className="required-asterisk">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="e.g., +91 98765 43210"
            className="input-field input-field-half-width"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="agreementStartDate">
            Agreement Start Date <span className="required-asterisk">*</span>
          </label>
          <input
            type="date"
            id="agreementStartDate"
            className="input-field input-field-half-width"
            onChange={(e) => setAgreementStartDate(e.target.value)}
            value={agreementStartDate}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="agreementEndDate">
            Agreement End Date <span className="required-asterisk">*</span>
          </label>
          <input
            type="date"
            id="agreementEndDate"
            className="input-field input-field-half-width"
            onChange={(e) => setAgreementEndDate(e.target.value)}
            value={agreementEndDate}
            required
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

        <div className="input-group">
          <label htmlFor="hasIsrcMasterCode">
            Has ISRC Master Code <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <div className="radio-group-container">
            <label className="radio-label">
              <input
                type="radio"
                name="hasIsrcMasterCode"
                value="true"
                onChange={() => setHasIsrcMasterCode(true)}
                checked={hasIsrcMasterCode === true}
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasIsrcMasterCode"
                value="false"
                onChange={() => setHasIsrcMasterCode(false)}
                checked={hasIsrcMasterCode === false}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {hasIsrcMasterCode === true && (
          <>
            <div className="input-group">
              <label htmlFor="audioMasterCode">
                Audio Master Code <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                id="audioMasterCode"
                placeholder="e.g., US-123"
                className="input-field input-field-half-width"
                onChange={(e) => handleMasterCodeChange(e.target.value, setAudioMasterCode)}
                value={audioMasterCode}
                maxLength={6}
                style={{ textTransform: "uppercase" }}
                required
              />
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Format: XX-XXX (2 letters followed by 3 alphanumeric characters)
              </small>
            </div>

            <div className="input-group">
              <label htmlFor="videoMasterCode">
                Video Master Code <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="text"
                id="videoMasterCode"
                placeholder="e.g., US-456"
                className="input-field input-field-half-width"
                onChange={(e) => handleMasterCodeChange(e.target.value, setVideoMasterCode)}
                value={videoMasterCode}
                maxLength={6}
                style={{ textTransform: "uppercase" }}
                required
              />
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Format: XX-XXX (2 letters followed by 3 alphanumeric characters)
              </small>
            </div>

            <div className="input-group">
              <label htmlFor="isrcCertificateFile">
                ISRC Certificate File (PDF) <span style={{ color: "#e74c3c" }}>*</span>
              </label>
              <input
                type="file"
                id="isrcCertificateFile"
                accept=".pdf,application/pdf"
                className="input-field input-field-half-width"
                required={hasIsrcMasterCode === true}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.type !== "application/pdf") {
                      toast.dark("Please select a PDF file.", { transition: Slide });
                      e.target.value = ""; // Clear the input
                      return;
                    }
                    setIsrcCertificateFile(file);
                  } else {
                    setIsrcCertificateFile(null);
                  }
                }}
              />
              {isrcCertificateFile && (
                <small style={{ color: "#28a745", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  ✓ Selected: {isrcCertificateFile.name}
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
