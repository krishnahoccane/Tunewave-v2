import { isOwnerOrLocalhost } from "../services/branding";

/**
 * Apply branding styles as CSS variables to :root
 * @param {Object} branding - Branding data object
 * @param {string} domain - Current domain (for exception handling)
 */
export const applyBrandingStyles = (branding, domain = null) => {
  if (typeof document === "undefined" || !branding) {
    return;
  }

  const root = document.documentElement;
  
  // Check if domain is owner/localhost (should use default branding)
  const isOwnerDomain = domain ? isOwnerOrLocalhost(domain) : false;
  
  // Apply color variables
  if (branding.colors && !isOwnerDomain) {
    // Use branding API colors for all non-owner domains
    root.style.setProperty("--brand-primary", branding.colors.primary || "#cebe88");
    root.style.setProperty("--brand-secondary", branding.colors.secondary || "#122b4a");
    root.style.setProperty("--brand-header", branding.colors.header || "#ffffff");
    root.style.setProperty("--brand-sidebar", branding.colors.sidebar || "#f5f5f5");
    root.style.setProperty("--brand-footer", branding.colors.footer || "#2c3e50");
    
    // Login page specific colors (primary and secondary)
    root.style.setProperty("--login-primary", branding.colors.primary || "#cebe88");
    root.style.setProperty("--login-secondary", branding.colors.secondary || "#122b4a");
  } else {
    // Use default Tunewave Music colors (for owner/localhost domain or fallback)
    // These are the canonical defaults: primary #cebe88, secondary #122b4a
    root.style.setProperty("--brand-primary", "#cebe88");
    root.style.setProperty("--brand-secondary", "#122b4a");
    root.style.setProperty("--brand-header", "#ffffff");
    root.style.setProperty("--brand-sidebar", "#f5f5f5");
    root.style.setProperty("--brand-footer", "#2c3e50");
    
    // Login page default colors (owner/localhost)
    root.style.setProperty("--login-primary", "#cebe88");
    root.style.setProperty("--login-secondary", "#122b4a");
  }
  
  console.log("[BrandingStyles] CSS variables applied:", {
    primary: root.style.getPropertyValue("--brand-primary"),
    secondary: root.style.getPropertyValue("--brand-secondary"),
    loginPrimary: root.style.getPropertyValue("--login-primary"),
    loginSecondary: root.style.getPropertyValue("--login-secondary"),
    isOwnerDomain,
  });
};

/**
 * Initialize default CSS variables (called before branding loads)
 */
export const initializeDefaultStyles = () => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  
  // Set default values if not already set
  if (!root.style.getPropertyValue("--brand-primary")) {
    root.style.setProperty("--brand-primary", "#cebe88");
    root.style.setProperty("--brand-secondary", "#122b4a");
    root.style.setProperty("--brand-header", "#ffffff");
    root.style.setProperty("--brand-sidebar", "#f5f5f5");
    root.style.setProperty("--brand-footer", "#2c3e50");
    
    // Login page default colors (owner/localhost defaults)
    root.style.setProperty("--login-primary", "#cebe88");
    root.style.setProperty("--login-secondary", "#122b4a");
  }
};
