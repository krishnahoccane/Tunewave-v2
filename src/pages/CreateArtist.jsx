import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/styled.css";
import axios from "axios";

function CreateArtist() {
  const navigate = useNavigate();

  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [revenueShare, setRevenueShare] = useState("10");
  const [labelId, setLabelId] = useState("");
  const [isRevenueShareEditable, setIsRevenueShareEditable] = useState(false);

  // Helper function to get userId from localStorage (for createdBy)
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
    if (!artistName.trim()) {
      toast.dark("Please enter Artist Name.", { transition: Slide });
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
    if (!country.trim()) {
      toast.dark("Please enter Country.", { transition: Slide });
      return;
    }
    if (!genre.trim()) {
      toast.dark("Please enter Genre.", { transition: Slide });
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

    // Get userId for createdBy
    const createdBy = getUserId();

    // Prepare form data according to API schema
    const formData = {
      artistID: 0,
      labelID: labelId.trim() ? parseInt(labelId.trim(), 10) : 0,
      artistName: artistName.trim(),
      email: email.trim(),
      country: country.trim(),
      genre: genre.trim(),
      revenueShare: revenueShareValue,
      createdBy: createdBy,
    };
    
    try {
      console.log("Submitting form data:", formData);
      
      const response = await axios.post("/api/Artist", formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = response.data;
      
      // Check if data was created successfully (201 Created)
      const isSuccess = response.status === 201 || 
                       (response.status >= 200 && response.status < 300) ||
                       (data.status === "success" && data.artistId);
      
      if (isSuccess) {
        toast.dark(data.message || "Artist created successfully!", { transition: Slide });
        console.log("Artist created:", data);
        
        // Navigate back to artists catalog after a short delay
        setTimeout(() => {
          navigate("/enterprise-catalog?tab=artists&section=all-artists");
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
                         (data.status === "success" && data.artistId) ||
                         (data.message && data.message.toLowerCase().includes("success"));
        
        if (isSuccess) {
          toast.dark(data.message || "Artist created successfully!", { transition: Slide });
          console.log("Artist created:", data);
          
          setTimeout(() => {
            navigate("/enterprise-catalog?tab=artists&section=all-artists");
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
      <h2 className="pages-main-title">Create Artist</h2>

      {/* Artist Details Section */}
      <div className="section">
        <h3>Enter Artist Details</h3>

        <div className="input-group">
          <label htmlFor="artistName">
            Artist Name <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="artistName"
            placeholder="e.g., John Doe"
            className="input-field input-field-half-width"
            onChange={(e) => setArtistName(e.target.value)}
            value={artistName}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">
            Email <span className="required-asterisk">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="e.g., john.doe@example.com"
            className="input-field input-field-half-width"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className="input-group">
          <label htmlFor="country">
            Country <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="country"
            placeholder="e.g., United States"
            className="input-field input-field-half-width"
            onChange={(e) => setCountry(e.target.value)}
            value={country}
          />
        </div>

        <div className="input-group">
          <label htmlFor="genre">
            Genre <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="genre"
            placeholder="e.g., Pop, Rock, Hip-Hop"
            className="input-field input-field-half-width"
            onChange={(e) => setGenre(e.target.value)}
            value={genre}
          />
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
          <label htmlFor="labelId">
            Label ID (Optional)
          </label>
          <input
            type="number"
            id="labelId"
            placeholder="e.g., 1"
            className="input-field input-field-half-width"
            onChange={(e) => setLabelId(e.target.value)}
            value={labelId}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn-cancel" onClick={() => navigate("/enterprise-catalog?tab=artists&section=all-artists")}>
          Cancel
        </button>
        <button className="btn-gradient" onClick={handleSubmit}>
          Create Artist
        </button>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

export default CreateArtist;

