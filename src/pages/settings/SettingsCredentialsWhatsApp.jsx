import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBranding } from "../../context/BrandingContext";
import api from "../../config/api";
import "../../styles/SettingsProfile.css";

export default function SettingsCredentialsWhatsApp() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const brandingId = branding?.brandingId ?? null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ appKey: "", authKey: "" });
  const [showAuthKey, setShowAuthKey] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (brandingId == null) {
      setLoading(false);
      setForm({ appKey: "", authKey: "" });
      return;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get("/api/whatsapp", {
        params: { brandingId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (!cancelled && data) {
          setForm({
            appKey: data.appKey ?? "",
            authKey: data.authKey ?? "",
          });
        }
      })
      .catch(() => {
        if (!cancelled) setForm({ appKey: "", authKey: "" });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brandingId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (brandingId == null) {
      toast.dark("Branding not available on this domain.", { transition: Slide });
      return;
    }
    if (!form.appKey.trim()) {
      toast.dark("App Key is required.", { transition: Slide });
      return;
    }
    if (!form.authKey.trim()) {
      toast.dark("Auth Key is required.", { transition: Slide });
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("jwtToken");
    api
      .post(
        "/api/whatsapp",
        { brandingId, appKey: form.appKey.trim(), authKey: form.authKey.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("WhatsApp credentials saved.", { transition: Slide });
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

  if (brandingId == null) {
    return (
      <div className="settings-profile">
        <h2 className="settings-profile-title">WhatsApp Credentials</h2>
        <div className="settings-profile-section">
          <p className="settings-profile-loading">
            WhatsApp credentials are managed per tenant. Branding is not available on this domain.
          </p>
          <div className="settings-profile-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate("/settings/credentials")}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-profile">
      <h2 className="settings-profile-title">WhatsApp Credentials</h2>
      <form onSubmit={handleSubmit} className="settings-profile-section">
        <div className="settings-profile-fields">
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">
              App Key <span className="required-asterisk">*</span>
            </span>
            <input
              type="text"
              value={form.appKey}
              onChange={(e) => setForm((f) => ({ ...f, appKey: e.target.value }))}
              className="settings-profile-input"
              placeholder="App Key"
              autoComplete="off"
              disabled={saving}
            />
          </div>
          <div className="settings-profile-field">
            <span className="settings-profile-field-label">
              Auth Key <span className="required-asterisk">*</span>
            </span>
            <input
              type={showAuthKey ? "text" : "password"}
              value={form.authKey}
              onChange={(e) => setForm((f) => ({ ...f, authKey: e.target.value }))}
              className="settings-profile-input"
              placeholder="Auth Key"
              autoComplete="off"
              disabled={saving}
            />
            <label className="settings-profile-mask-toggle">
              <input
                type="checkbox"
                checked={showAuthKey}
                onChange={(e) => setShowAuthKey(e.target.checked)}
              />
              Show Auth Key
            </label>
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

