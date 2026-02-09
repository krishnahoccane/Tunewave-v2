import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SettingsOverview.css";

const SECTIONS = [
  {
    id: "whatsapp",
    path: "/settings/credentials/whatsapp",
    title: "WhatsApp Credentials",
    description: "App Key and Auth Key for sending WhatsApp messages (e.g. OTP).",
  },
  {
    id: "smtp",
    path: "/settings/credentials/smtp",
    title: "SMTP Credentials",
    description: "Brevo SMTP: API key, sending domain, and sender email.",
  },
];

export default function SettingsCredentialsOverview() {
  const navigate = useNavigate();

  return (
    <div className="settings-overview">
      <h2 className="settings-overview-title">Credentials</h2>
      <p className="settings-overview-subtitle">
        Configure WhatsApp and SMTP (Brevo) credentials.
      </p>
      <div className="settings-overview-cards">
        {SECTIONS.map((section) => (
          <div key={section.id} className="settings-overview-card">
            <h3 className="settings-overview-card-title">{section.title}</h3>
            <p className="settings-overview-card-desc">{section.description}</p>
            <button
              type="button"
              className="btn-gradient settings-overview-card-btn"
              onClick={() => navigate(section.path)}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
