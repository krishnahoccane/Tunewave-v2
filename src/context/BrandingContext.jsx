import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentDomain, fetchBranding, getDefaultBranding, isOwnerOrLocalhost, isLocalAccess } from "../services/branding";
import { applyBrandingStyles } from "../utils/brandingStyles";

const BrandingContext = createContext();

/**
 * BrandingProvider - Provides branding data to the entire app
 * Loads branding on mount based on current domain
 */
export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(() => {
    // Initialize with default branding to prevent flash of unstyled content
    return getDefaultBranding();
  });
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    // Guard against SSR/build-time execution
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const loadBranding = async () => {
      try {
        setLoading(true);
        
        // Get current domain
        const currentDomain = getCurrentDomain();
        setDomain(currentDomain);
        
        if (!currentDomain) {
          console.warn("[BrandingContext] No domain detected, using default branding");
          const defaultBranding = getDefaultBranding();
          setBranding(defaultBranding);
          applyBrandingStyles(defaultBranding, "");
          setLoading(false);
          return;
        }

        // Exception: Owner/localhost and local IP (LAN) use default branding WITHOUT API call
        // Do NOT fetch from API, use default branding
        if (isOwnerOrLocalhost(currentDomain)) {
          if (import.meta.env.DEV && isLocalAccess(currentDomain)) {
            console.info("Local network access detected — domain validation skipped");
          }
          console.log("[BrandingContext] Owner/localhost domain detected:", currentDomain, "using default Tunewave Music branding");
          const defaultBranding = getDefaultBranding();
          setBranding(defaultBranding);
          applyBrandingStyles(defaultBranding, currentDomain);
          setLoading(false);
          return;
        }

        // Fetch branding for all other domains
        const brandingData = await fetchBranding(currentDomain);
        
        // Log branding data for debugging
        console.log("[BrandingContext] Branding data received:", brandingData);
        console.log("[BrandingContext] Site name:", brandingData?.site?.name);
        
        // Check if branding contains error (will be handled by DomainGuard)
        if (brandingData && brandingData.error) {
          console.error("[BrandingContext] Branding error detected:", brandingData.error);
          // Still set branding state so DomainGuard can check it
          setBranding(brandingData);
        } else {
          // Set branding state
          setBranding(brandingData);
          
          // Apply CSS variables (pass domain for exception handling)
          applyBrandingStyles(brandingData, currentDomain);
        }
        
        console.log("[BrandingContext] Branding loaded for domain:", currentDomain, "Site name:", brandingData?.site?.name);
      } catch (error) {
        console.error("[BrandingContext] Error loading branding:", error);
        // If error occurs, return error object for DomainGuard to handle
        setBranding({
          error: "Branding not found for this domain",
          domain: currentDomain,
        });
      } finally {
        setLoading(false);
      }
    };

    loadBranding();
  }, []); // Only run once on mount

  // Reload branding (useful for testing or manual refresh)
  const reloadBranding = async () => {
    if (typeof window === "undefined") return;
    
    try {
      setLoading(true);
      const currentDomain = getCurrentDomain();
      
      // Exception: Owner/localhost domains use default branding
      if (isOwnerOrLocalhost(currentDomain)) {
        const defaultBranding = getDefaultBranding();
        setBranding(defaultBranding);
        applyBrandingStyles(defaultBranding, currentDomain);
        setDomain(currentDomain);
        return;
      }
      
      const brandingData = await fetchBranding(currentDomain);
      setBranding(brandingData);
      applyBrandingStyles(brandingData, currentDomain);
      setDomain(currentDomain);
    } catch (error) {
      console.error("[BrandingContext] Error reloading branding:", error);
      const defaultBranding = getDefaultBranding();
      setBranding(defaultBranding);
      const currentDomain = getCurrentDomain();
      applyBrandingStyles(defaultBranding, currentDomain);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, domain, reloadBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

/**
 * Hook to use branding context
 * @returns {Object} { branding, loading, domain, reloadBranding }
 */
export const useBranding = () => {
  const context = useContext(BrandingContext);
  
  if (!context) {
    console.warn("[useBranding] BrandingContext not found. Make sure BrandingProvider wraps your app.");
    // Return default branding as fallback
    return {
      branding: getDefaultBranding(),
      loading: false,
      domain: "",
      reloadBranding: () => {},
    };
  }
  
  return context;
};

