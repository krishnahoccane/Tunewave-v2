import React from "react";
import { useBranding } from "../context/BrandingContext";
import "../styles/Footer.css";

/**
 * Footer component that uses branding data
 * Displays footer text and links from branding API
 */
const Footer = () => {
  const { branding } = useBranding();

  const footerText = branding?.footer?.text || "© 2024 TuneWave. All rights reserved.";
  const footerLinks = branding?.footer?.links || [];

  return (
    <footer 
      className="app-footer"
      style={{
        backgroundColor: "var(--brand-footer, #2c3e50)",
        color: "#ffffff",
      }}
    >
      <div className="footer-content">
        <p className="footer-text">{footerText}</p>
        
        {footerLinks.length > 0 && (
          <nav className="footer-links">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.url || "#"}
                target={link.target || "_self"}
                rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                className="footer-link"
              >
                {link.text || link.label || "Link"}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
};

export default Footer;
