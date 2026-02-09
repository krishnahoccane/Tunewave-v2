import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/api";
import "../../styles/SettingsProfile.css";

const API_CREDENTIALS_SMTP = "/api/users/credentials/smtp";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SettingsCredentialsSMTP() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    apiKey: "",
    sendingDomain: "",
    senderEmail: "",
  });
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get(API_CREDENTIALS_SMTP, { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        if (!cancelled && data)
          setForm({
            apiKey: data.apiKey ?? "",
            sendingDomain: data.sendingDomain ?? "",
            senderEmail: data.senderEmail ?? "",
          });
      })
      .catch(() => {
        if (!cancelled) setForm({ apiKey: "", sendingDomain: "", senderEmail: "" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.apiKey.trim()) {
      toast.dark("SMTP API Key is required.", { transition: Slide });
      return;
    }
    if (!form.sendingDomain.trim()) {
      toast.dark("Sending Domain is required.", { transition: Slide });
      return;
    }
    if (!form.senderEmail.trim()) {
      toast.dark("Sender Email is required.", { transition: Slide });
      return;
    }
    if (!EMAIL_REGEX.test(form.senderEmail.trim())) {
      toast.dark("Please enter a valid sender email address.", { transition: Slide });
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("jwtToken");
    const payload = {
      apiKey: form.apiKey.trim(),
      sendingDomain: form.sendingDomain.trim(),
      senderEmail: form.senderEmail.trim(),
    };
    api
      .put(API_CREDENTIALS_SMTP, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("SMTP credentials saved.", { transition: Slide });
      })
      .catch((err) => {
        toast.dark(err?.response?.data?.message || err?.message || "Failed to save.", { transition: Slide });
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="settings-profile">
        <p className="settings-profile-loading">Loading…</p>
      </div>
    );
  }

  return (
    <div className="settings-profile">
      <h2 className="settings-profile-title">Brevo SMTP Credentials</h2>
      <p className="settings-overview-card-desc" style={{ marginBottom: 16 }}>
        Configure Brevo SMTP for sending emails.
      </p>
      <form onSubmit={handleSubmit} className="settings-profile-section">
        <div className="settings-profile-fields">
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">SMTP API Key <span className="required-asterisk">*</span></span>
            <input
              type={showApiKey ? "text" : "password"}
              value={form.apiKey}
              onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
              className="settings-profile-input"
              placeholder="API Key"
              autoComplete="off"
            />
            <label className="settings-profile-mask-toggle">
              <input
                type="checkbox"
                checked={showApiKey}
                onChange={(e) => setShowApiKey(e.target.checked)}
              />
              Show API Key
            </label>
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Sending Domain <span className="required-asterisk">*</span></span>
            <input
              type="text"
              value={form.sendingDomain}
              onChange={(e) => setForm((f) => ({ ...f, sendingDomain: e.target.value }))}
              className="settings-profile-input"
              placeholder="e.g. mail.example.com"
              autoComplete="off"
            />
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">Sender Email <span className="required-asterisk">*</span></span>
            <input
              type="email"
              value={form.senderEmail}
              onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
              className="settings-profile-input"
              placeholder="noreply@example.com"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="settings-profile-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/settings/credentials")}>
            Cancel
          </button>
          <button type="submit" className="btn-gradient" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
}
