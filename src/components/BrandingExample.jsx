/**
 * Example component demonstrating branding usage
 * This file shows how to use branding data throughout the app
 */
import React from "react";
import { useBranding } from "../context/BrandingContext";

const BrandingExample = () => {
  const { branding, loading, domain } = useBranding();

  if (loading) {
    return <div>Loading branding...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Branding Example</h2>
      
      {/* Site Information */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Site Information</h3>
        <p><strong>Name:</strong> {branding?.site?.name || "N/A"}</p>
        <p><strong>Description:</strong> {branding?.site?.description || "N/A"}</p>
        <p><strong>Domain:</strong> {domain || "N/A"}</p>
      </div>

      {/* Logo */}
      {branding?.logoUrl && (
        <div style={{ marginBottom: "20px" }}>
          <h3>Logo</h3>
          <img 
            src={branding.logoUrl} 
            alt={branding?.site?.name || "Logo"} 
            style={{ maxWidth: "200px", maxHeight: "100px" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Colors */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Theme Colors</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            backgroundColor: branding?.colors?.primary || "#1278bb",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
            Primary
          </div>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            backgroundColor: branding?.colors?.secondary || "#1a9cd8",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
            Secondary
          </div>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            backgroundColor: branding?.colors?.header || "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000"
          }}>
            Header
          </div>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            backgroundColor: branding?.colors?.sidebar || "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#000"
          }}>
            Sidebar
          </div>
          <div style={{ 
            width: "100px", 
            height: "100px", 
            backgroundColor: branding?.colors?.footer || "#2c3e50",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff"
          }}>
            Footer
          </div>
        </div>
      </div>

      {/* Using CSS Variables */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Using CSS Variables</h3>
        <button 
          style={{
            backgroundColor: "var(--brand-primary)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Primary Button
        </button>
        <button 
          style={{
            backgroundColor: "var(--brand-secondary)",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          Secondary Button
        </button>
      </div>

      {/* Footer Data */}
      {branding?.footer && (
        <div>
          <h3>Footer</h3>
          <p>{branding.footer.text || "N/A"}</p>
          {branding.footer.links && branding.footer.links.length > 0 && (
            <ul>
              {branding.footer.links.map((link, index) => (
                <li key={index}>
                  <a href={link.url || "#"}>{link.text || link.label || "Link"}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandingExample;

