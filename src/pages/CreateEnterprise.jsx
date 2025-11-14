import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";

function CreateEnterprise() {
  const navigate = useNavigate();

  const [enterpriseId, setEnterpriseId] = useState("");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [domain, setDomain] = useState("");
  const [revenueShare, setRevenueShare] = useState("");
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
    if (!enterpriseId.trim()) {
      toast.dark("Please enter Enterprise ID.", { transition: Slide });
      return;
    }
    if (!enterpriseName.trim()) {
      toast.dark("Please enter Enterprise Name.", { transition: Slide });
      return;
    }
    if (!domain.trim()) {
      toast.dark("Please enter Domain.", { transition: Slide });
      return;
    }
    if (!revenueShare.trim()) {
      toast.dark("Please enter Revenue Share.", { transition: Slide });
      return;
    }
    if (!qcRequired) {
      toast.dark("Please select QC Required.", { transition: Slide });
      return;
    }

    // Parse revenueShare: remove % and convert to number
    const revenueShareValue = parseFloat(revenueShare.replace(/%/g, "").trim());
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
      enterpriseID: 0, // API expects number, set to 0 for new entries
      enterpriseName: enterpriseName.trim(),
      domain: domain.trim(),
      revenueShare: revenueShareValue,
      qcRequired: qcRequiredBool,
      createdBy: createdBy,
    };

    const token = localStorage.getItem("jwtToken");
    
    try {
      const response = await fetch("https://spacestation.tunewave.in/api/Enterprise/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Enterprise created successfully!");
        console.log("Enterprise created:", data);
        
        // Navigate back to enterprise catalog after a short delay
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=enterprises&section=all-enterprises");
        }, 1500);
      } else {
        toast.dark(data.message || "Error creating enterprise. Please try again.");
        console.error("Error response:", data);
      }
    } catch (error) {
      toast.dark("Network error. Please check your connection and try again.");
      console.error("Error submitting:", error);
    }
  };

  return (
    <div className="pages-layout-container">
      <h2 className="pages-main-title">Create Enterprise</h2>

      {/* Enterprise Details Section */}
      <div className="section">
        <h3>Enter Enterprise Details</h3>

        <div className="input-group">
          <label htmlFor="enterpriseId">
            Enterprise ID <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="enterpriseId"
            placeholder="e.g., ENT001"
            className="input-field"
            onChange={(e) => setEnterpriseId(e.target.value)}
            value={enterpriseId}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="enterpriseName">
            Enterprise Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="enterpriseName"
            placeholder="e.g., Acme Corporation"
            className="input-field"
            onChange={(e) => setEnterpriseName(e.target.value)}
            value={enterpriseName}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="domain">
            Domain <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="domain"
            placeholder="e.g., acme.com"
            className="input-field"
            onChange={(e) => setDomain(e.target.value)}
            value={domain}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="revenueShare">
            Revenue Share <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            id="revenueShare"
            placeholder="e.g., 70%"
            className="input-field"
            onChange={(e) => setRevenueShare(e.target.value)}
            value={revenueShare}
            style={{ width: "50%" }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="qcRequired">
            QC Required <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "30px", marginTop: "8px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="radio"
                name="qcRequired"
                value="Required"
                onChange={() => setQcRequired("Required")}
                checked={qcRequired === "Required"}
              />
              <span>Required</span>
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
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
