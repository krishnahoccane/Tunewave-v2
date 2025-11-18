import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import axios from "axios";

function CreateLabel() {
  const navigate = useNavigate();

  const [labelName, setLabelName] = useState("");
  const [domain, setDomain] = useState("");
  const [planType, setPlanType] = useState("Growth");
  const [revenueShare, setRevenueShare] = useState("10");
  const [qcRequired, setQcRequired] = useState(true);
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!labelName.trim()) {
      toast.dark("Please enter Label Name.", { transition: Slide });
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

    // Prepare form data according to API schema
    // Note: enterpriseId should be determined by backend based on logged-in user's enterprise
    const formData = {
      labelName: labelName.trim(),
      domain: domain.trim(),
      planType: planType.trim(),
      qcRequired: qcRequired,
      revenueShare: revenueShareValue,
      // enterpriseId will be set by backend based on EnterpriseAdmin's enterprise
    };

    const token = localStorage.getItem("jwtToken");
    
    if (!token) {
      toast.dark("Authentication required. Please login again.");
      console.warn("No JWT token found in localStorage");
      return;
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

