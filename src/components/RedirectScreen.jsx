import React from "react";
import "../styles/RedirectScreen.css";

/**
 * RedirectScreen - Full-page transition screen shown during domain redirect
 * Displays for 3 seconds before redirecting user to their tenant domain
 */
export default function RedirectScreen({ domainName, email }) {
  return (
    <div className="redirect-screen">
      <div className="redirect-screen-content">
        <div className="redirect-loader">
          <div className="redirect-spinner"></div>
        </div>
        <p className="redirect-message">
          Please wait, while we are redirecting you to <span className="redirect-domain">{domainName}</span>
        </p>
      </div>
    </div>
  );
}
