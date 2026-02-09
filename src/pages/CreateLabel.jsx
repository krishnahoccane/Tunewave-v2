import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import { createLabel } from "../services/labels";

function CreateLabel() {
  const navigate = useNavigate();

  // Required fields
  const [labelName, setLabelName] = useState("");
  const [revenueSharePercent, setRevenueSharePercent] = useState("80");
  const [planTypeId, setPlanTypeId] = useState(null); // null = not selected, 1 = Starter, 2 = Growth
  const [domain, setDomain] = useState("");
  const [hasIsrcMasterCode, setHasIsrcMasterCode] = useState(null); // null = not selected, true/false = selected
  const [audioMasterCode, setAudioMasterCode] = useState("");
  const [videoMasterCode, setVideoMasterCode] = useState("");
  const [isrcCertificateFile, setIsrcCertificateFile] = useState(null);
  const [agreementStartDate, setAgreementStartDate] = useState("");
  const [agreementEndDate, setAgreementEndDate] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [qcRequired, setQcRequired] = useState(null); // null = not selected, true/false = selected

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

  // Validate master code format: XX-XXX (2 letters followed by 3 alphanumeric)
  const validateMasterCode = (code) => {
    const regex = /^[A-Z]{2}-[A-Z0-9]{3}$/;
    return regex.test(code);
  };

  // Extract first alphanumeric character from Label Name
  // Ignores symbols/special characters and returns the first A-Z or 0-9 character
  const getFirstAlphanumericChar = (labelName) => {
    if (!labelName) return null;
    
    const trimmed = labelName.trim();
    // Find first alphanumeric character (A-Z, a-z, 0-9)
    const match = trimmed.match(/[A-Za-z0-9]/);
    return match ? match[0].toUpperCase() : null;
  };

  // Validate ISRC Master Code against Label Name
  // First valid alphanumeric character of Label Name must match the 3rd character of Master Code
  const validateMasterCodeAgainstLabelName = (masterCode, labelName) => {
    if (!masterCode || !labelName) return false;
    
    // Extract 3rd character from master code (format: XX-XXX, so index 3 is the first character after dash)
    // Master code format: "IN-O45" -> 3rd character (index 3) is "O"
    if (masterCode.length < 4) return false;
    const masterCodeThirdChar = masterCode.charAt(3).toUpperCase();
    if (!masterCodeThirdChar || !/[A-Z0-9]/.test(masterCodeThirdChar)) return false;
    
    // Extract first alphanumeric character from label name
    const labelNameFirstChar = getFirstAlphanumericChar(labelName);
    if (!labelNameFirstChar) return false;
    
    // Compare (case-insensitive, already converted to uppercase)
    return masterCodeThirdChar === labelNameFirstChar;
  };

  // Handle master code input change
  const handleMasterCodeChange = (value, setter) => {
    const formatted = formatMasterCode(value);
    setter(formatted);
  };

  // Auto-calculate AgreementEndDate when AgreementStartDate changes
  useEffect(() => {
    if (agreementStartDate) {
      // Parse date-only value (YYYY-MM-DD)
      const startDate = new Date(agreementStartDate + 'T00:00:00');
      if (!isNaN(startDate.getTime())) {
        // Add 182 days
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 182);
        
        // Format as date-only (YYYY-MM-DD) - no time displayed in UI
        const year = endDate.getFullYear();
        const month = String(endDate.getMonth() + 1).padStart(2, "0");
        const day = String(endDate.getDate()).padStart(2, "0");
        
        setAgreementEndDate(`${year}-${month}-${day}`);
      }
    }
  }, [agreementStartDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!labelName.trim()) {
      toast.dark("Please enter Label Name.", { transition: Slide });
      return;
    }

    if (planTypeId === null) {
      toast.dark("Please select Plan Type.", { transition: Slide });
      return;
    }

    // Domain is required only if PlanTypeId !== 1 (Starter)
    if (planTypeId !== 1 && !domain.trim()) {
      toast.dark("Domain is required for Growth plan.", { transition: Slide });
      return;
    }

    // Validate domain format (no http:// or https://)
    if (planTypeId !== 1 && domain.trim()) {
      const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
      if (!domainRegex.test(domain.trim())) {
        toast.dark("Please enter a valid domain (without http:// or https://).", { transition: Slide });
        return;
      }
    }

    // Validate revenue share
    const revenueShareValue = parseFloat(revenueSharePercent.trim());
    if (isNaN(revenueShareValue) || revenueShareValue < 0 || revenueShareValue > 100) {
      toast.dark("Please enter a valid Revenue Share (0-100).", { transition: Slide });
      return;
    }

    if (hasIsrcMasterCode === null) {
      toast.dark("Please select Has ISRC Master Code.", { transition: Slide });
      return;
    }

    if (qcRequired === null) {
      toast.dark("Please select QC Required.", { transition: Slide });
      return;
    }

    if (!ownerEmail.trim()) {
      toast.dark("Please enter Owner Email.", { transition: Slide });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail.trim())) {
      toast.dark("Please enter a valid email address.", { transition: Slide });
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

    // Validate agreement end date is at least 182 days from start date
    // Parse date-only values and set time to midnight for accurate calculation
    const startDate = new Date(agreementStartDate + 'T00:00:00');
    const endDate = new Date(agreementEndDate + 'T00:00:00');
    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 182) {
      toast.dark("Agreement End Date must be at least 182 days from Start Date.", { transition: Slide });
      return;
    }

    // When HasIsrcMasterCode === true, validate required fields
    if (hasIsrcMasterCode === true) {
      // Audio Master Code is required
      if (!audioMasterCode.trim()) {
        toast.dark("Audio Master Code is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (!validateMasterCode(audioMasterCode)) {
        toast.dark("Audio Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }
      // Validate against Label Name
      if (!validateMasterCodeAgainstLabelName(audioMasterCode, labelName)) {
        const firstChar = getFirstAlphanumericChar(labelName);
        toast.dark(`Audio Master Code's 3rd character must match the first alphanumeric character of Label Name (${firstChar || "N/A"}).`, { transition: Slide });
        return;
      }

      // Video Master Code is required
      if (!videoMasterCode.trim()) {
        toast.dark("Video Master Code is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (!validateMasterCode(videoMasterCode)) {
        toast.dark("Video Master Code must be in format: XX-XXX (2 letters followed by 3 alphanumeric characters)", { transition: Slide });
        return;
      }
      // Validate against Label Name
      if (!validateMasterCodeAgainstLabelName(videoMasterCode, labelName)) {
        const firstChar = getFirstAlphanumericChar(labelName);
        toast.dark(`Video Master Code's 3rd character must match the first alphanumeric character of Label Name (${firstChar || "N/A"}).`, { transition: Slide });
        return;
      }

      // ISRC Certificate File is required
      if (!isrcCertificateFile) {
        toast.dark("ISRC Certificate File (PDF) is required when Has ISRC Master Code is Yes.", { transition: Slide });
        return;
      }
      if (isrcCertificateFile.type !== "application/pdf") {
        toast.dark("ISRC Certificate File must be a PDF file.", { transition: Slide });
        return;
      }
    }

    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      toast.dark("Authentication required. Please login again.");
      console.warn("No JWT token found in localStorage");
      return;
    }

    // Always use FormData (multipart/form-data) to match backend contract
    console.log("[CreateLabel] Creating FormData for multipart/form-data request");
    const formData = new FormData();
    
    // Required fields - exact case-sensitive names
    formData.append("LabelName", labelName.trim());
    formData.append("RevenueSharePercent", revenueShareValue.toString());
    formData.append("PlanTypeId", planTypeId.toString());
    formData.append("HasIsrcMasterCode", hasIsrcMasterCode.toString());
    formData.append("OwnerEmail", ownerEmail.trim());
    formData.append("QCRequired", qcRequired.toString());
    
    // Format dates to ISO format with time set to 00:00:00 (midnight)
    // agreementStartDate and agreementEndDate are in YYYY-MM-DD format from date inputs
    const formattedStartDate = agreementStartDate ? `${agreementStartDate}T00:00:00` : "";
    const formattedEndDate = agreementEndDate ? `${agreementEndDate}T00:00:00` : "";
    formData.append("AgreementStartDate", formattedStartDate);
    formData.append("AgreementEndDate", formattedEndDate);

    // Domain - only append if PlanTypeId !== 1 (Starter)
    if (planTypeId !== 1 && domain.trim()) {
      formData.append("Domain", domain.trim());
    }

    // Optional master code fields - only append if HasIsrcMasterCode === true
    if (hasIsrcMasterCode === true) {
      // Remove dash for API (send as INO45, not IN-O45)
      formData.append("AudioMasterCode", audioMasterCode.replace(/-/g, ""));
      formData.append("VideoMasterCode", videoMasterCode.replace(/-/g, ""));
      
      // Certificate file
      if (isrcCertificateFile) {
        formData.append("IsrcCertificateFile", isrcCertificateFile);
        console.log("[CreateLabel] Certificate file included:", isrcCertificateFile.name);
      }
    } else {
      // Send empty strings if HasIsrcMasterCode === false
      formData.append("AudioMasterCode", "");
      formData.append("VideoMasterCode", "");
    }
    
    // Log FormData contents (excluding file binary)
    console.log("[CreateLabel] FormData entries:", 
      Array.from(formData.entries()).map(([key, value]) => [
        key, 
        value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value
      ])
    );

    try {
      console.log("[CreateLabel] Submitting request - Type: FormData (multipart/form-data)");
      console.log("[CreateLabel] Token exists:", !!token);
      
      const data = await createLabel(formData);
      
      // Check if data was created successfully
      const isSuccess = data.status === "success" || data.labelId || data.labelName;
      
      if (isSuccess) {
        toast.dark(data.message || "Label created successfully!", { transition: Slide });
        console.log("Label created:", data);
        
        // Navigate back to labels catalog after a short delay
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=labels&section=all-labels");
        }, 1500);
      } else {
        const errorMessage = 
          data.message || 
          data.error || 
          data.title ||
          data.detail ||
          (data.errors && JSON.stringify(data.errors)) ||
          "Server Error";
        
        toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000, transition: Slide });
      }
    } catch (error) {
      console.error("Error creating label:", error);
      
      // Handle error response from configured axios instance
      const errorData = error.response?.data || error.data || {};
      const status = error.response?.status || error.status;
      
      const isSuccess = (status === 201) ||
                       (errorData.status === "success" && errorData.labelId) ||
                       (errorData.message && errorData.message.toLowerCase().includes("success"));
      
      if (isSuccess) {
        toast.dark(errorData.message || "Label created successfully!", { transition: Slide });
        console.log("Label created:", errorData);
        
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=labels&section=all-labels");
        }, 1500);
      } else {
        const errorMessage = 
          errorData.message || 
          errorData.error || 
          errorData.title ||
          errorData.detail ||
          (errorData.errors && JSON.stringify(errorData.errors)) ||
          error.message ||
          `Server Error (${status || "Unknown"})`;
        
        toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000, transition: Slide });
      }
    }
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Create Label</h2>

      {/* Label Details Section */}
      <div className="section">
        <h3>Enter Label Details</h3>

        <div className="input-group">
          <label htmlFor="labelName">
            Label Name <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="labelName"
            placeholder="e.g., Sony Music"
            className="input-field input-field-half-width"
            onChange={(e) => setLabelName(e.target.value)}
            value={labelName}
          />
          {labelName.trim() && (() => {
            const firstChar = getFirstAlphanumericChar(labelName);
            return firstChar ? (
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                First alphanumeric character: <strong>{firstChar}</strong> (will be used for ISRC Master Code validation - must match 3rd character of master codes)
              </small>
            ) : (
              <small style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Warning: Label Name must contain at least one alphanumeric character (A-Z, 0-9) for ISRC Master Code validation
              </small>
            );
          })()}
        </div>

        <div className="input-group">
          <label htmlFor="planTypeId">
            Plan Type <span className="required-asterisk">*</span>
          </label>
          <div className="radio-group-container">
            <label className="radio-label">
              <input
                type="radio"
                name="planTypeId"
                value="1"
                onChange={() => setPlanTypeId(1)}
                checked={planTypeId === 1}
              />
              <span>Starter</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="planTypeId"
                value="2"
                onChange={() => setPlanTypeId(2)}
                checked={planTypeId === 2}
              />
              <span>Growth</span>
            </label>
          </div>
        </div>

        {planTypeId !== 1 && (
          <div className="input-group">
            <label htmlFor="domain">
              Domain <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="domain"
              placeholder="e.g., dashboard.brownelephant.co.in"
              className="input-field input-field-half-width"
              onChange={(e) => setDomain(e.target.value)}
              value={domain}
            />
            <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
              Enter domain without http:// or https://
            </small>
          </div>
        )}

        <div className="input-group">
          <label htmlFor="revenueSharePercent">
            Revenue Share (%) <span className="required-asterisk">*</span>
          </label>
          <input
            type="number"
            id="revenueSharePercent"
            placeholder="80"
            className="input-field input-field-half-width"
            onChange={(e) => setRevenueSharePercent(e.target.value)}
            value={revenueSharePercent}
            min="0"
            max="100"
          />
        </div>

        <div className="input-group">
          <label htmlFor="ownerEmail">
            Owner Email <span className="required-asterisk">*</span>
          </label>
          <input
            type="email"
            id="ownerEmail"
            placeholder="e.g., owner@example.com"
            className="input-field input-field-half-width"
            onChange={(e) => setOwnerEmail(e.target.value)}
            value={ownerEmail}
          />
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
                value="true"
                onChange={() => setQcRequired(true)}
                checked={qcRequired === true}
              />
              <span>Required</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="qcRequired"
                value="false"
                onChange={() => setQcRequired(false)}
                checked={qcRequired === false}
              />
              <span>Not required</span>
            </label>
          </div>
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
            min={agreementStartDate ? (() => {
              // Calculate minimum date (start date + 182 days) as date-only
              const startDate = new Date(agreementStartDate + 'T00:00:00');
              startDate.setDate(startDate.getDate() + 182);
              const year = startDate.getFullYear();
              const month = String(startDate.getMonth() + 1).padStart(2, "0");
              const day = String(startDate.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            })() : undefined}
          />
          <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
            Must be at least 182 days from Start Date (auto-calculated, but can be extended)
          </small>
        </div>

        <div className="input-group">
          <label htmlFor="hasIsrcMasterCode">
            Has ISRC Master Code <span className="required-asterisk">*</span>
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
                Audio Master Code <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="audioMasterCode"
                placeholder="e.g., IN-O45"
                className="input-field input-field-half-width"
                onChange={(e) => handleMasterCodeChange(e.target.value, setAudioMasterCode)}
                value={audioMasterCode}
                maxLength={6}
                style={{ textTransform: "uppercase" }}
                required
              />
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Format: XX-XXX (2 letters followed by 3 alphanumeric characters)
                {labelName.trim() && (() => {
                  const firstChar = getFirstAlphanumericChar(labelName);
                  return firstChar ? (
                    <span style={{ display: "block", marginTop: "4px" }}>
                      3rd character (after dash) must match first alphanumeric character of Label Name: <strong>{firstChar}</strong>
                    </span>
                  ) : null;
                })()}
              </small>
            </div>

            <div className="input-group">
              <label htmlFor="videoMasterCode">
                Video Master Code <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                id="videoMasterCode"
                placeholder="e.g., IN-O45"
                className="input-field input-field-half-width"
                onChange={(e) => handleMasterCodeChange(e.target.value, setVideoMasterCode)}
                value={videoMasterCode}
                maxLength={6}
                style={{ textTransform: "uppercase" }}
                required
              />
              <small style={{ color: "#666", fontSize: "12px", marginTop: "4px", display: "block" }}>
                Format: XX-XXX (2 letters followed by 3 alphanumeric characters)
                {labelName.trim() && (() => {
                  const firstChar = getFirstAlphanumericChar(labelName);
                  return firstChar ? (
                    <span style={{ display: "block", marginTop: "4px" }}>
                      3rd character (after dash) must match first alphanumeric character of Label Name: <strong>{firstChar}</strong>
                    </span>
                  ) : null;
                })()}
              </small>
            </div>

            <div className="input-group">
              <label htmlFor="isrcCertificateFile">
                ISRC Certificate File (PDF) <span className="required-asterisk">*</span>
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
        <button className="btn-cancel" onClick={() => navigate("/enterprise-catalog?tab=labels&section=all-labels")}>
          Cancel
        </button>
        <button className="btn-gradient" onClick={handleSubmit}>
          Create Label
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default CreateLabel;
