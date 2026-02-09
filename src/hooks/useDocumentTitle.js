import { useEffect } from "react";
import { useBranding } from "../context/BrandingContext";
import { getCurrentDomain, isOwnerOrLocalhost } from "../services/branding";

/**
 * Hook to dynamically update document title based on branding
 * - Owner/localhost → "Tunewave Music"
 * - Other domains → branding.site.name or "Login"
 */
export const useDocumentTitle = () => {
  const { branding, loading } = useBranding();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Get current domain
    const currentDomain = getCurrentDomain();

    // Exception: Owner/localhost always shows "Tunewave Music"
    if (isOwnerOrLocalhost(currentDomain)) {
      document.title = "Tunewave Music";
      return;
    }

    // If branding is still loading, use safe fallback
    if (loading) {
      document.title = "Login";
      return;
    }

    // Use branding site name if available
    const siteName = branding?.site?.name;
    if (siteName && typeof siteName === "string" && siteName.trim() !== "") {
      document.title = siteName.trim();
    } else {
      // Final fallback
      document.title = "Login";
    }
  }, [branding, loading]);
};

