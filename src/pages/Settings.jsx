import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Edit2, X, XCircle } from "lucide-react";
// import "../styles/Settings.css";
// import "../styles/styled.css";
import {
  ToastContainer,
  toast,
  Slide,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

const Settings = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(
    user?.profileImage ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face&auto=format"
  );

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Prashanth",
    lastName: user?.lastName || "Varma",
    email: user?.email || "prashanthmusic@gmail.com",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");
  const fileInputRef = useRef(null);

  // Greeting + Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();
      if (hrs < 12) setGreeting("Good Morning");
      else if (hrs < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear error when typing
  };

  const handleSaveChanges = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "Please fill in first name";
    // toast.dark("Please fill in first name");
    if (!formData.lastName.trim())
      newErrors.lastName = "Please fill in last name";
    // toast.dark("Please fill in last name");
    if (!formData.email.trim()) newErrors.email = "Please fill in email";
    // toast.dark("Please fill in email");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Update parent user state
    setUser((prev) => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      profileImage,
    }));
  };

  const handleUpdatePassword = () => {
    let newErrors = {};

    if (!formData.oldPassword)
      newErrors.oldPassword = "Please enter old password";
    if (!formData.newPassword)
      newErrors.newPassword = "Please enter new password";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm new password";

    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Update the actual password (demo only)
    setUser((prev) => ({ ...prev, password: formData.newPassword }));

    // Clear password fields
    setFormData((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="pages-layout-container">
     
      <h2 className="pages-main-title">Settings</h2>

      <div className="user-profile-section">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <button className="edit-profile-btn" onClick={triggerFileInput}>
            <Edit2 size={16} color="white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
        <h3 className="profile-name">{formData.firstName}</h3>
      </div>

      <div className="form-section ">
        <div className="form-row section">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="form-input"
            />
            {errors.firstName && (
              <span className="error-text">{errors.firstName}</span>
            )}
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="form-input"
            />
            {errors.lastName && (
              <span className="error-text">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="form-group section">
          <label>E-Mail</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="form-input"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="password-section section ">
          <h3>Change Password</h3>

          <div className="form-group ">
            <div className="floating-label">
              <input
                type={showOldPassword ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange("oldPassword", e.target.value)
                }
                placeholder="Enter old password"
                id="oldPassword"
              />
              <label htmlFor="oldPassword">Enter old password</label>
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="password-toggle "
              >
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.oldPassword && (
              <span className="error-text">{errors.oldPassword}</span>
            )}
          </div>

          <div className="form-group">
            <div className="floating-label ">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                placeholder="Enter new password"
                id="newPassword"
              />
              <label htmlFor="newPassword">Enter new password</label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="password-toggle"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="error-text">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <div className="floating-label">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm new password"
                id="confirmPassword"
              />
              <label htmlFor="confirmPassword">Confirm new password</label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleUpdatePassword}
            className="btn-gradient"
          >
            Update Password
          </button>
        </div>

        <div className="form-actions">
          <button className="btn-cancel" onClick={() => navigate("/")}>
            close
          </button>
          <button onClick={handleSaveChanges} className="btn-gradient">
            Save Changes
          </button>
        </div>
      </div>
      {/* </div> */}

       <ToastContainer
                position="bottom-center"
                limit={1}
                autoClose={3000}
                hideProgressBar={false}
              />
    </div>
  );
};

export default Settings;
