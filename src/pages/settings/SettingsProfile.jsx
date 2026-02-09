import React, { useEffect, useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as UsersService from "../../services/users";
import "../../styles/SettingsProfile.css";

export default function SettingsProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    UsersService.getMe()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to load profile.";
        if (!cancelled) setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="settings-profile">
        <p className="settings-profile-loading">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-profile">
        <p className="settings-profile-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="settings-profile">
      <h2 className="settings-profile-title">Profile</h2>

      <div className="settings-profile-section">
        <h3 className="settings-profile-section-title">Personal details</h3>
        <div className="settings-profile-fields">
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Full Name</span>
            <span className="settings-profile-field-value">{profile?.fullName || "—"}</span>
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Email</span>
            <span className="settings-profile-field-value">{profile?.email || "—"}</span>
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Mobile</span>
            <span className="settings-profile-field-value">{profile?.mobile ? `+${String(profile.mobile).replace(/\D/g, "")}` : "—"}</span>
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Role</span>
            <span className="settings-profile-field-value">{profile?.role || "—"}</span>
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Status</span>
            <span className="settings-profile-field-value">{profile?.status || "—"}</span>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn-gradient"
            onClick={() => toast.dark("Profile editing is not enabled on this build.", { transition: Slide })}
          >
            Update Profile
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}

