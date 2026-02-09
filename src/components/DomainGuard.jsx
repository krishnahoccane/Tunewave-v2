import { useEffect, useState } from "react";
import { useBranding } from "../context/BrandingContext";
import { getCurrentDomain, isOwnerOrLocalhost, isLocalAccess } from "../services/branding";

/**
 * DomainGuard - Global domain validation and redirect guard
 * 
 * Rules:
 * 1. Owner/localhost domains → Allow (skip all checks)
 * 2. Branding not found → Redirect to dashboard.tunewave.in
 * 3. SSL not active → Redirect to dashboard.tunewave.in
 * 4. Domain not active → Redirect to dashboard.tunewave.in
 * 5. All checks pass → Render children
 */
const DomainGuard = ({ children }) => {
  const { branding, loading, domain } = useBranding();
  const [isValid, setIsValid] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setChecking(false);
      setIsValid(true);
      return;
    }

    const currentDomain = getCurrentDomain();

    // Rule 1: Owner/localhost and local IP (LAN) → Skip domain validation entirely
    if (isOwnerOrLocalhost(currentDomain)) {
      if (import.meta.env.DEV && isLocalAccess(currentDomain)) {
        console.info("Local network access detected — domain validation skipped");
      }
      console.log("[DomainGuard] Owner/localhost domain detected, allowing access:", currentDomain);
      setIsValid(true);
      setChecking(false);
      return;
    }

    // Wait for branding to load
    if (loading) {
      return;
    }

    // Rule 2: Check if branding was found
    // Check for explicit error in branding response first
    if (branding && branding.error) {
      const errorMessage = String(branding.error).toLowerCase();
      if (errorMessage.includes("branding not found") || 
          errorMessage.includes("not found") ||
          errorMessage.includes("domain not found")) {
        console.error("[DomainGuard] Branding API returned error:", branding.error);
        console.error("[DomainGuard] Redirecting to dashboard.tunewave.in");
        
        window.location.replace("https://dashboard.tunewave.in/");
        return;
      }
    }

    // If branding API returned an error or branding is missing, redirect
    if (!branding || !branding.site || !branding.site.name) {
      console.error("[DomainGuard] Branding not found for domain:", currentDomain);
      console.error("[DomainGuard] Redirecting to dashboard.tunewave.in");
      
      // Use window.location.replace to prevent back navigation
      window.location.replace("https://dashboard.tunewave.in/");
      return;
    }

    // Rule 3: Check SSL status
    const isHttps = window.location.protocol === "https:";
    if (!isHttps) {
      console.error("[DomainGuard] SSL not active for domain:", currentDomain);
      console.error("[DomainGuard] Redirecting to dashboard.tunewave.in");
      
      window.location.replace("https://dashboard.tunewave.in/");
      return;
    }

    // Rule 4: Check domain status (if provided by API)
    // Check for domainStatus, sslEnabled, or isActive flags in branding response
    if (branding.domainStatus === false || 
        branding.sslEnabled === false || 
        branding.isActive === false) {
      console.error("[DomainGuard] Domain not active on server:", currentDomain);
      console.error("[DomainGuard] Redirecting to dashboard.tunewave.in");
      
      window.location.replace("https://dashboard.tunewave.in/");
      return;
    }

    // Rule 5: All checks passed
    console.log("[DomainGuard] All validation checks passed for domain:", currentDomain);
    setIsValid(true);
    setChecking(false);
  }, [branding, loading, domain]);

  // Show loading state while checking
  if (checking) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        fontFamily: "Poppins, sans-serif",
      }}>
        <div style={{
          textAlign: "center",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #e0e0e0",
            borderTop: "4px solid #1278bb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}></div>
          <p style={{ color: "#666", fontSize: "14px" }}>Validating domain...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Only render children if all checks passed
  if (!isValid) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default DomainGuard;

