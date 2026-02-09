import React from "react";
import "../../styles/SettingsProfile.css";

export default function SettingsBranding() {
  return (
    <div className="settings-profile">
      <h2 className="settings-profile-title">Branding</h2>
      <div className="settings-profile-section">
        <p className="settings-overview-card-desc">
          Branding and appearance are managed per domain. Changes are applied based on your current domain.
        </p>
      </div>
    </div>
  );
}
