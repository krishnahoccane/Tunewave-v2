import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as UsersService from "../../services/users";
import "../../styles/Settings.css";

const MIN_PASSWORD_LENGTH = 8;

function validate(formData) {
  const err = {};
  if (!formData.oldPassword || !formData.oldPassword.trim()) {
    err.oldPassword = "Please enter current password.";
  }
  if (!formData.newPassword || !formData.newPassword.trim()) {
    err.newPassword = "Please enter new password.";
  } else {
    if (formData.newPassword.trim().length < MIN_PASSWORD_LENGTH) {
      err.newPassword = "Password must be at least 8 characters long.";
    } else if (formData.newPassword.trim() !== formData.newPassword) {
      err.newPassword = "Password must not contain leading or trailing spaces.";
    }
  }
  if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
    err.confirmPassword = "Please re-enter new password.";
  } else if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
    err.confirmPassword = "Passwords do not match.";
  }
  return err;
}

export default function SettingsPassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleUpdatePassword = async () => {
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await UsersService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toast.success("Password updated successfully.", { transition: Slide });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message;
      toast.dark(message || "Unable to update password. Please try again.", { transition: Slide });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="settings-password">
      <h2 className="settings-profile-title">Password</h2>
      <div className="settings-profile-section">
        <h3 className="settings-profile-section-title">Change Password</h3>
        <div className="form-group">
          <div className="floating-label">
            <input
              type={showOldPassword ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(e) => handleInputChange("oldPassword", e.target.value)}
              placeholder="Enter current password"
              id="oldPassword"
              autoComplete="current-password"
              disabled={submitting}
            />
            <label htmlFor="oldPassword">Current Password</label>
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="password-toggle"
              aria-label={showOldPassword ? "Hide password" : "Show password"}
            >
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.oldPassword && <span className="error-text">{errors.oldPassword}</span>}
        </div>
        <div className="form-group">
          <div className="floating-label">
            <input
              type={showNewPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Enter new password"
              id="newPassword"
              autoComplete="new-password"
              disabled={submitting}
            />
            <label htmlFor="newPassword">New Password</label>
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="password-toggle"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
        </div>
        <div className="form-group">
          <div className="floating-label">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Re-enter new password"
              id="confirmPassword"
              autoComplete="new-password"
              disabled={submitting}
            />
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>
        <button
          type="button"
          onClick={handleUpdatePassword}
          className="btn-gradient"
          disabled={submitting}
        >
          {submitting ? "Updating…" : "Update Password"}
        </button>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}
