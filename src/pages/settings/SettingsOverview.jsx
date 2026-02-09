import React from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import "../../styles/SettingsOverview.css";

const SECTIONS = [
  {
    id: "profile",
    path: "/settings/profile",
    title: "Profile",
    description: "Manage your personal details and view your associations.",
    show: true,
  },
  {
    id: "password",
    path: "/settings/password",
    title: "Password",
    description: "Change your account password.",
    show: true,
  },
  {
    id: "branding",
    path: "/settings/branding",
    title: "Branding",
    description: "Manage branding and appearance settings.",
    show: true,
    hideForArtist: true,
  },
  {
    id: "credentials",
    path: "/settings/credentials",
    title: "Credentials",
    description: "WhatsApp and SMTP (Brevo) configuration.",
    show: true,
    hideForArtist: true,
  },
];

export default function SettingsOverview() {
  const navigate = useNavigate();
  const { actualRole } = useRole();
  const roleLower = actualRole?.toLowerCase() || "";
  const isArtist = roleLower === "artist" || roleLower === "artistadmin" || roleLower === "artist admin";

  const sections = SECTIONS.filter(
    (s) => s.show && !(s.hideForArtist && isArtist)
  );

  return (
    <div className="settings-overview">
      <h2 className="settings-overview-title">Settings Overview</h2>
      <p className="settings-overview-subtitle">
        Choose a section below to update your account settings.
      </p>
      <div className="settings-overview-cards">
        {sections.map((section) => (
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
