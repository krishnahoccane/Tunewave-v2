import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import axios from "axios";
import * as EnterprisesService from "../services/enterprises";

function CreateLabel() {
  const navigate = useNavigate();

  const [labelName, setLabelName] = useState("");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [domain, setDomain] = useState("");
  const [planType, setPlanType] = useState("Growth");
  const [revenueShare, setRevenueShare] = useState("10");
  const [qcRequired, setQcRequired] = useState(true);
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);
  
  // Enterprises dropdown
  const [enterprises, setEnterprises] = useState([]);
  const [loadingEnterprises, setLoadingEnterprises] = useState(false);
  
  // ISRC Master Code fields
  const [hasIsrcMasterCode, setHasIsrcMasterCode] = useState("");
  const [isrcAudioUrl, setIsrcAudioUrl] = useState("");
  const [isrcVideoUrl, setIsrcVideoUrl] = useState("");
  const [isrcCertificateFile, setIsrcCertificateFile] = useState(null);

  // Fetch enterprises on component mount
  useEffect(() => {
    const fetchEnterprises = async () => {
      setLoadingEnterprises(true);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.warn("No JWT token found");
          setLoadingEnterprises(false);
          return;
        }

        // Get all enterprises (no status filter)
        const responseData = await EnterprisesService.getEnterprises();
        
        console.log("Enterprises API response:", responseData);
        
        // Handle different response formats
        let enterprisesData = [];
        
        if (Array.isArray(responseData)) {
          enterprisesData = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
          enterprisesData = responseData.data;
        } else if (responseData && responseData.enterprises && Array.isArray(responseData.enterprises)) {
          enterprisesData = responseData.enterprises;
        } else if (responseData && typeof responseData === 'object') {
          // Try to find array in response
          const keys = Object.keys(responseData);
          const arrayKey = keys.find(key => Array.isArray(responseData[key]));
          if (arrayKey) {
            enterprisesData = responseData[arrayKey];
          }
        }
        
        if (enterprisesData.length > 0) {
          // Map to ensure we have the right structure
          const mappedEnterprises = enterprisesData.map((enterprise) => ({
            id: enterprise.enterpriseId || enterprise.id,
            enterpriseId: enterprise.enterpriseId || enterprise.id,
            enterpriseName: enterprise.enterpriseName || enterprise.name || enterprise.enterprise,
            name: enterprise.enterpriseName || enterprise.name || enterprise.enterprise,
            ...enterprise
          }));
          
          setEnterprises(mappedEnterprises);
          console.log("✅ Loaded enterprises:", mappedEnterprises.length, mappedEnterprises);
        } else {
          console.warn("No enterprises found in response. Response data:", responseData);
          toast.dark("No enterprises found. You can enter Enterprise ID manually.", { 
            transition: Slide,
            autoClose: 3000 
          });
          setEnterprises([]);
        }
      } catch (error) {
        console.error("Error fetching enterprises:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            error.message || 
                            "Failed to load enterprises";
        
        toast.dark(`Failed to load enterprises: ${errorMessage}. You can still enter Enterprise ID manually.`, { 
          transition: Slide,
          autoClose: 5000 
        });
        setEnterprises([]);
      } finally {
        setLoadingEnterprises(false);
      }
    };

    fetchEnterprises();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labelName.trim()) {
      toast.dark("Please enter Label Name.", { transition: Slide });
      return;
    }
    if (!enterpriseId.trim()) {
      toast.dark("Please select an Enterprise.", { transition: Slide });
      return;
    }
    if (!domain.trim()) {
      toast.dark("Please enter Domain.", { transition: Slide });
      return;
    }
    if (!planType.trim()) {
      toast.dark("Please select Plan Type.", { transition: Slide });
      return;
    }
    
    // Validate revenue share
    const revenueShareToParse = revenueShare.trim() || "10";
    const revenueShareValue = parseFloat(revenueShareToParse.replace(/%/g, "").trim());
    if (isNaN(revenueShareValue) || revenueShareValue < 0 || revenueShareValue > 100) {
      toast.dark("Please enter a valid Revenue Share (0-100).", { transition: Slide });
      return;
    }

    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      toast.dark("Authentication required. Please login again.");
      console.warn("No JWT token found in localStorage");
      return;
    }

    // Prepare form data according to API schema
    const formData = {
      labelName: labelName.trim(),
      domain: domain.trim(),
      planType: planType.trim(),
      qcRequired: qcRequired,
      revenueShare: revenueShareValue,
    };

    // Add enterpriseId if provided (for testing)
    if (enterpriseId.trim()) {
      const enterpriseIdNum = parseInt(enterpriseId.trim(), 10);
      if (!isNaN(enterpriseIdNum)) {
        formData.enterpriseID = enterpriseIdNum;
      }
    }

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
    
    try {
      console.log("Submitting form data:", formData);
      
      const response = await axios.post("/api/labels", formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = response.data;
      
      // Check if data was created successfully (201 Created)
      const isSuccess = response.status === 201 || 
                       (response.status >= 200 && response.status < 300) ||
                       (data.status === "success" && data.labelId);
      
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
          `Server Error (${response.status})`;
        
        toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000, transition: Slide });
      }
    } catch (error) {
      console.error("Axios error details:", error);
      
      if (error.response) {
        const data = error.response.data;
        const status = error.response.status;
        
        const isSuccess = (status === 201) ||
                         (data.status === "success" && data.labelId) ||
                         (data.message && data.message.toLowerCase().includes("success"));
        
        if (isSuccess) {
          toast.dark(data.message || "Label created successfully!", { transition: Slide });
          console.log("Label created:", data);
          
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
            `Server Error (${status})`;
          
          toast.dark(`Backend Error: ${errorMessage}`, { autoClose: 5000, transition: Slide });
        }
      } else if (error.request) {
        toast.dark("Network error: Unable to reach the server. Please check your internet connection or try again later.");
      } else {
        toast.dark(`Error: ${error.message || "Network error. Please check your connection and try again."}`);
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
        </div>

        <div className="input-group">
          <label htmlFor="enterpriseId">
            Enterprise <span className="required-asterisk">*</span>
          </label>
          {loadingEnterprises ? (
            <select
              id="enterpriseId"
              className="input-field input-field-half-width"
              disabled
            >
              <option>Loading enterprises...</option>
            </select>
          ) : enterprises.length > 0 ? (
            <select
              id="enterpriseId"
              className="input-field input-field-half-width"
              onChange={(e) => setEnterpriseId(e.target.value)}
              value={enterpriseId}
            >
              <option value="">Select an Enterprise</option>
              {enterprises.map((enterprise) => (
                <option key={enterprise.enterpriseId || enterprise.id} value={enterprise.enterpriseId || enterprise.id}>
                  {enterprise.enterpriseName || enterprise.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              id="enterpriseId"
              placeholder="Enter Enterprise ID"
              className="input-field input-field-half-width"
              onChange={(e) => setEnterpriseId(e.target.value)}
              value={enterpriseId}
            />
          )}
        </div>

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
        </div>

        <div className="input-group">
          <label htmlFor="planType">
            Plan Type <span className="required-asterisk">*</span>
          </label>
          <select
            id="planType"
            className="input-field input-field-half-width"
            onChange={(e) => setPlanType(e.target.value)}
            value={planType}
          >
            <option value="Growth">Growth</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="revenueShare">
            Revenue Share (%) <span className="required-asterisk">*</span>
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

