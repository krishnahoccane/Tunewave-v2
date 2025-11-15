import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";

function CreateEnterprise() {
  const navigate = useNavigate();

  const [enterpriseName, setEnterpriseName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [revenueShare, setRevenueShare] = useState("10");
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);
  const [qcRequired, setQcRequired] = useState("");
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
      email: email.trim(),
      domain: domain.trim(),
      revenueShare: revenueShareValue,
      qcRequired: qcRequiredBool,
    //   createdBy: createdBy,
    };

    const token = localStorage.getItem("jwtToken");
    
    try {
      console.log("Submitting form data:", formData);
      
      const response = await fetch("https://spacestation.tunewave.in/api/Enterprise/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Check if response has content before parsing JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        data = { message: text || "Unexpected response format" };
      }
      
      if (response.ok) {
        toast.success("Enterprise created successfully!");
        console.log("Enterprise created:", data);
        
        // Navigate back to enterprise catalog after a short delay
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
        }, 1500);
      } else {
        const errorMessage = data.message || data.error || `Error ${response.status}: ${response.statusText}` || "Error creating enterprise. Please try again.";
        toast.dark(errorMessage);
        console.error("Error response:", data);
        console.error("Response status:", response.status);
      }
    } catch (error) {
      console.error("Fetch error details:", error);
      
      // More specific error messages
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        toast.dark("Network error: Unable to reach the server. Please check your internet connection or try again later.");
      } else if (error.name === "SyntaxError") {
        toast.dark("Error parsing server response. Please try again.");
      } else {
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
