import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import * as EnterprisesService from "../services/enterprises";
import { useRole } from "../context/RoleContext";
import api from "../config/api";
function EditEnterprise() {
  const navigate = useNavigate();
  const { enterpriseId } = useParams();
  const { actualRole } = useRole();
  const [loading, setLoading] = useState(true);

  // Form state
  const [enterpriseName, setEnterpriseName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [revenueShare, setRevenueShare] = useState("10");
  const [originalRevenueShare, setOriginalRevenueShare] = useState("");
  const [qcRequired, setQcRequired] = useState("");
  const [originalQcRequired, setOriginalQcRequired] = useState("");
  const [hasIsrcMasterCode, setHasIsrcMasterCode] = useState(false);
  const [audioMasterCode, setAudioMasterCode] = useState("");
  const [videoMasterCode, setVideoMasterCode] = useState("");
  const [isrcCertificateUrl, setIsrcCertificateUrl] = useState("");
  const [agreementStartDate, setAgreementStartDate] = useState("");
  const [agreementEndDate, setAgreementEndDate] = useState("");
  const [status, setStatus] = useState("");

  // Format master code: insert "-" after first 2 letters and convert to uppercase
  const formatMasterCode = (value) => {
    if (!value) return "";
    // Remove any existing dashes and convert to uppercase
    let formatted = value.replace(/-/g, "").toUpperCase();
    
    // Insert dash after first 2 characters if we have at least 2 characters
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + "-" + formatted.slice(2);
    }
    
    return formatted;
  };

  // Check if user is SuperAdmin
  useEffect(() => {
    if (actualRole !== "SuperAdmin") {
      toast.dark("Access denied. Only Super Admin can edit enterprises.", { transition: Slide });
      navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
    }
  }, [actualRole, navigate]);

  // Fetch enterprise data
  useEffect(() => {
    const fetchEnterprise = async () => {
      if (!enterpriseId) {
        toast.dark("Enterprise ID is required.", { transition: Slide });
        navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
        return;
      }

      if (actualRole !== "SuperAdmin") {
        return; // Don't fetch if not SuperAdmin
      }

      try {
        setLoading(true);
        console.log("[EditEnterprise] Fetching enterprise with ID:", enterpriseId);
        const data = await EnterprisesService.getEnterpriseById(parseInt(enterpriseId, 10));
        
        // Log 1: Full raw API response immediately after API call
        console.log("[EditEnterprise] ===== FULL RAW API RESPONSE =====");
        console.log("[EditEnterprise] Complete response object:", data);
        console.log("[EditEnterprise] Response type:", typeof data);
        console.log("[EditEnterprise] Response keys:", Object.keys(data || {}));
        console.log("[EditEnterprise] Response JSON:", JSON.stringify(data, null, 2));
        
        // Log specific fields we're looking for
        console.log("[EditEnterprise] ===== FIELD INSPECTION =====");
        console.log("[EditEnterprise] data.AudioMasterCode:", data.AudioMasterCode, "Type:", typeof data.AudioMasterCode);
        console.log("[EditEnterprise] data.audioMasterCode:", data.audioMasterCode, "Type:", typeof data.audioMasterCode);
        console.log("[EditEnterprise] data.VideoMasterCode:", data.VideoMasterCode, "Type:", typeof data.VideoMasterCode);
        console.log("[EditEnterprise] data.videoMasterCode:", data.videoMasterCode, "Type:", typeof data.videoMasterCode);
        console.log("[EditEnterprise] data.HasIsrcMasterCode:", data.HasIsrcMasterCode, "Type:", typeof data.HasIsrcMasterCode);
        console.log("[EditEnterprise] data.hasIsrcMasterCode:", data.hasIsrcMasterCode, "Type:", typeof data.hasIsrcMasterCode);
        console.log("[EditEnterprise] Owner object:", data.owner);
        console.log("[EditEnterprise] Owner email:", data.owner?.email);
        
        // Set form values from API response
        setEnterpriseName(data.enterpriseName || "");
        // Email is nested in owner object: data.owner.email
        const emailValue = data.owner?.email || data.ownerEmail || data.email || "";
        console.log("[EditEnterprise] Extracted email value:", emailValue);
        setEmail(emailValue);
        setOriginalEmail(emailValue);
        setDomain(data.domain || "");
        setRevenueShare(data.revenueSharePercent?.toString() || data.revenueShare?.toString() || "10");
        setOriginalRevenueShare(data.revenueSharePercent?.toString() || data.revenueShare?.toString() || "10");
        setQcRequired(data.qcRequired ? "Required" : "Not required");
        setOriginalQcRequired(data.qcRequired ? "Required" : "Not required");
        // Log 2: Before setting state - verify all fields are present
        console.log("[EditEnterprise] ===== BEFORE SETTING STATE =====");
        const stateFields = {
          AudioMasterCode: data.AudioMasterCode,
          audioMasterCode: data.audioMasterCode,
          VideoMasterCode: data.VideoMasterCode,
          videoMasterCode: data.videoMasterCode,
          HasIsrcMasterCode: data.HasIsrcMasterCode,
          hasIsrcMasterCode: data.hasIsrcMasterCode,
        };
        console.log("[EditEnterprise] All master code fields from API:", stateFields);
        
        // Ensure proper boolean conversion for hasIsrcMasterCode
        // Try multiple possible field names
        const hasIsrcValue = 
          data.HasIsrcMasterCode === true || 
          data.HasIsrcMasterCode === "true" || 
          data.hasIsrcMasterCode === true || 
          data.hasIsrcMasterCode === "true";
        setHasIsrcMasterCode(hasIsrcValue);
        console.log("[EditEnterprise] HasIsrcMasterCode - HasIsrcMasterCode:", data.HasIsrcMasterCode, "hasIsrcMasterCode:", data.hasIsrcMasterCode, "Converted to:", hasIsrcValue);
        
        // Map Audio Master Code - check for null/undefined, not falsy values
        // Try both camelCase and PascalCase
        const rawAudioCode = data.AudioMasterCode != null ? data.AudioMasterCode : (data.audioMasterCode != null ? data.audioMasterCode : null);
        const audioCode = rawAudioCode != null && rawAudioCode !== "" 
          ? formatMasterCode(String(rawAudioCode)) 
          : "";
        setAudioMasterCode(audioCode);
        console.log("[EditEnterprise] AudioMasterCode - Raw (PascalCase):", data.AudioMasterCode, "Raw (camelCase):", data.audioMasterCode, "Selected:", rawAudioCode, "Formatted:", audioCode);
        
        // Map Video Master Code - check for null/undefined, not falsy values
        // Try both camelCase and PascalCase
        const rawVideoCode = data.VideoMasterCode != null ? data.VideoMasterCode : (data.videoMasterCode != null ? data.videoMasterCode : null);
        const videoCode = rawVideoCode != null && rawVideoCode !== "" 
          ? formatMasterCode(String(rawVideoCode)) 
          : "";
        setVideoMasterCode(videoCode);
        console.log("[EditEnterprise] VideoMasterCode - Raw (PascalCase):", data.VideoMasterCode, "Raw (camelCase):", data.videoMasterCode, "Selected:", rawVideoCode, "Formatted:", videoCode);
        
        // Map ISRC Certificate URL - prepend base URL if it's a relative path
        const rawCertificateUrl = data.isrcCertificateUrl || data.IsrcCertificateUrl || "";
        let fullCertificateUrl = "";
        if (rawCertificateUrl) {
          // Check if it's already a full URL (starts with http:// or https://)
          if (rawCertificateUrl.startsWith("http://") || rawCertificateUrl.startsWith("https://")) {
            fullCertificateUrl = rawCertificateUrl;
          } else {
            // It's a relative path, prepend the API base URL
            const baseURL = api.defaults?.baseURL || api._baseURL || "";
            fullCertificateUrl = baseURL ? `${baseURL}${rawCertificateUrl.startsWith("/") ? "" : "/"}${rawCertificateUrl}` : rawCertificateUrl;
          }
        }
        setIsrcCertificateUrl(fullCertificateUrl);
        console.log("[EditEnterprise] Certificate URL raw:", rawCertificateUrl, "Full:", fullCertificateUrl);
        setAgreementStartDate(data.agreementStartDate || "");
        setAgreementEndDate(data.agreementEndDate || "");
        setStatus(data.status || "");
      } catch (error) {
        console.error("[EditEnterprise] Error fetching enterprise:", error);
        console.error("[EditEnterprise] Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        toast.dark("Failed to load enterprise details.", { transition: Slide });
        navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprise();
  }, [enterpriseId, navigate, actualRole]);

  // Log state changes to track data flow
  useEffect(() => {
    console.log("[EditEnterprise] ===== STATE VALUES CHANGED =====");
    console.log("[EditEnterprise] audioMasterCode state:", audioMasterCode);
    console.log("[EditEnterprise] videoMasterCode state:", videoMasterCode);
    console.log("[EditEnterprise] hasIsrcMasterCode state:", hasIsrcMasterCode);
  }, [audioMasterCode, videoMasterCode, hasIsrcMasterCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email if changed
    if (email.trim() !== originalEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.dark("Please enter a valid email address.", { transition: Slide });
        return;
      }
    }

    // Validate revenue share
    const revenueShareToParse = revenueShare.trim() || "10";
    const revenueShareValue = parseFloat(revenueShareToParse.replace(/%/g, "").trim());
    if (isNaN(revenueShareValue) || revenueShareValue < 0 || revenueShareValue > 100) {
      toast.dark("Please enter a valid Revenue Share (0-100).", { transition: Slide });
      return;
    }

    // Check if anything changed
    const emailChanged = email.trim() !== originalEmail;
    const revenueShareChanged = revenueShareValue.toString() !== originalRevenueShare;
    const qcRequiredChanged = qcRequired !== originalQcRequired;

    if (!emailChanged && !revenueShareChanged && !qcRequiredChanged) {
      toast.dark("No changes detected.", { transition: Slide });
      return;
    }

    // Show confirmation for email change
    if (emailChanged) {
      const confirmed = window.confirm(
        "Warning: Changing the email will transfer the admin email account to the new email address with all associated data. Do you want to continue?"
      );
      if (!confirmed) {
        return;
      }
    }

    // Show confirmation for revenue share change
    if (revenueShareChanged) {
      const confirmed = window.confirm(
        "Note: The new revenue share will be updated from the 3rd month from today. Do you want to continue?"
      );
      if (!confirmed) {
        return;
      }
    }

    // Show confirmation for QC Required change
    if (qcRequiredChanged) {
      let message = "";
      if (qcRequired === "Required" && originalQcRequired === "Not required") {
        message = "Note: Changing QC Required from False to True means only new releases will be added to QC. Do you want to continue?";
      } else if (qcRequired === "Not required" && originalQcRequired === "Required") {
        message = "Warning: Changing QC Required from True to False will approve all pending QCs and send them to distribution. Do you want to continue?";
      }
      
      if (message) {
        const confirmed = window.confirm(message);
        if (!confirmed) {
          return;
        }
      }
    }

    try {
      // Prepare update data - only send changed fields
      const updateData = {};
      
      if (emailChanged) {
        updateData.ownerEmail = email.trim();
      }
      
      if (revenueShareChanged) {
        updateData.revenueSharePercent = revenueShareValue;
      }
      
      if (qcRequiredChanged) {
        updateData.qcRequired = qcRequired === "Required";
      }

      const data = await EnterprisesService.updateEnterprise(parseInt(enterpriseId, 10), updateData);

      toast.success("Enterprise updated successfully!", { transition: Slide });
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises", {
          replace: false,
          state: { refresh: true, timestamp: Date.now() }
        });
      }, 1500);
    } catch (error) {
      console.error("Error updating enterprise:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.title ||
        error.message ||
        "Failed to update enterprise";
      
      toast.dark(`Error: ${errorMessage}`, { autoClose: 5000, transition: Slide });
    }
  };

  if (loading) {
    return (
      <div className="pages-layout-container">
        <div className="loading-container">Loading enterprise details...</div>
        <ToastContainer position="bottom-center" autoClose={3000} />
      </div>
    );
  }

  if (actualRole !== "SuperAdmin") {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">View/Edit Enterprise</h2>

      {/* Enterprise Details Section */}
      <div className="section">
        <h3>Enterprise Details</h3>

        <div className="input-group">
          <label htmlFor="enterpriseName">
            Enterprise Name
          </label>
          <input
            type="text"
            id="enterpriseName"
            className="input-field input-field-half-width"
            value={enterpriseName}
            readOnly
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
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
          {email.trim() !== originalEmail && (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffc107",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#856404"
            }}>
              <strong>Note:</strong> If email is changed, the admin email account will be transferred to the new email account with all the data.
            </div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="domain">
            Domain
          </label>
          <input
            type="text"
            id="domain"
            className="input-field input-field-half-width"
            value={domain}
            readOnly
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="revenueShare">
            Revenue Share <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="revenueShare"
            placeholder="10"
            className="input-field input-field-half-width"
            onChange={(e) => setRevenueShare(e.target.value)}
            value={revenueShare}
          />
          {revenueShare.trim() !== originalRevenueShare && (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              backgroundColor: "#d1ecf1", 
              border: "1px solid #bee5eb",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#0c5460"
            }}>
              <strong>Note:</strong> New revenue share will be updated from the 3rd month from today.
            </div>
          )}
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
          {qcRequired !== originalQcRequired && (
            <div style={{ 
              marginTop: "8px", 
              padding: "8px", 
              backgroundColor: qcRequired === "Not required" ? "#f8d7da" : "#d1ecf1", 
              border: `1px solid ${qcRequired === "Not required" ? "#f5c6cb" : "#bee5eb"}`,
              borderRadius: "4px",
              fontSize: "12px",
              color: qcRequired === "Not required" ? "#721c24" : "#0c5460"
            }}>
              {qcRequired === "Not required" && originalQcRequired === "Required" ? (
                <>
                  <strong>Warning:</strong> Changing QC Required from True to False will approve all pending QCs and send them to distribution.
                </>
              ) : (
                <>
                  <strong>Note:</strong> Changing QC Required from False to True means only new releases will be added to QC.
                </>
              )}
            </div>
          )}
        </div>

        {/* Show "Has ISRC Master Code" field only when false */}
        {hasIsrcMasterCode === false && (
          <div className="input-group">
            <label htmlFor="hasIsrcMasterCode">
              Has ISRC Master Code
            </label>
            <input
              type="text"
              id="hasIsrcMasterCode"
              className="input-field input-field-half-width"
              value="No"
              readOnly
              style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            />
          </div>
        )}

        {/* Show certificate actions and master codes only when true */}
        {hasIsrcMasterCode === true && (
          <>
            {/* Certificate Action Buttons */}
            {isrcCertificateUrl && (
              <div className="input-group">
                <label>ISRC Certificate</label>
                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button
                    type="button"
                    className="btn-gradient"
                    onClick={() => window.open(isrcCertificateUrl, "_blank")}
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn-gradient"
                    onClick={() => {
                      const printWindow = window.open(isrcCertificateUrl, "_blank");
                      if (printWindow) {
                        printWindow.onload = () => {
                          setTimeout(() => {
                            printWindow.print();
                          }, 250);
                        };
                      }
                    }}
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    className="btn-gradient"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = isrcCertificateUrl;
                      link.download = `ISRC_Certificate_${enterpriseName || "Enterprise"}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    style={{ padding: "8px 16px", fontSize: "14px" }}
                  >
                    Download
                  </button>
                </div>
              </div>
            )}

            {/* Master Codes - aligned with other form fields */}
            {(() => {
              // Log 3: Before rendering - confirm the exact object shape being read
              console.log("[EditEnterprise] ===== BEFORE RENDERING =====");
              console.log("[EditEnterprise] State values - audioMasterCode:", audioMasterCode, "Type:", typeof audioMasterCode);
              console.log("[EditEnterprise] State values - videoMasterCode:", videoMasterCode, "Type:", typeof videoMasterCode);
              console.log("[EditEnterprise] State values - hasIsrcMasterCode:", hasIsrcMasterCode, "Type:", typeof hasIsrcMasterCode);
              console.log("[EditEnterprise] audioMasterCode != null:", audioMasterCode != null);
              console.log("[EditEnterprise] audioMasterCode !== '':", audioMasterCode !== "");
              console.log("[EditEnterprise] videoMasterCode != null:", videoMasterCode != null);
              console.log("[EditEnterprise] videoMasterCode !== '':", videoMasterCode !== "");
              return null;
            })()}
            
            <div className="input-group">
              <label htmlFor="audioMasterCode">
                Audio Master Code
              </label>
              <input
                type="text"
                id="audioMasterCode"
                className="input-field input-field-half-width"
                value={audioMasterCode != null && audioMasterCode !== "" ? audioMasterCode : "N/A"}
                readOnly
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="videoMasterCode">
                Video Master Code
              </label>
              <input
                type="text"
                id="videoMasterCode"
                className="input-field input-field-half-width"
                value={videoMasterCode != null && videoMasterCode !== "" ? videoMasterCode : "N/A"}
                readOnly
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>
          </>
        )}

        <div className="input-group">
          <label htmlFor="agreementStartDate">
            Agreement Start Date
          </label>
          <input
            type="text"
            id="agreementStartDate"
            className="input-field input-field-half-width"
            value={agreementStartDate ? new Date(agreementStartDate).toLocaleDateString() : "N/A"}
            readOnly
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="agreementEndDate">
            Agreement End Date
          </label>
          <input
            type="text"
            id="agreementEndDate"
            className="input-field input-field-half-width"
            value={agreementEndDate ? new Date(agreementEndDate).toLocaleDateString() : "N/A"}
            readOnly
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="status">
            Status
          </label>
          <input
            type="text"
            id="status"
            className="input-field input-field-half-width"
            value={status || "N/A"}
            readOnly
            style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-cancel" onClick={() => navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises")}>
          Cancel
        </button>
        <button className="btn-gradient" onClick={handleSubmit}>
          Update Enterprise
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default EditEnterprise;

