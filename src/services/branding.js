import api from "../config/api";

const API_BASE = "/api/branding";

/**
 * Normalize domain name
 * - Convert to lowercase
 * - Remove leading "www."
 * @param {string} hostname - The hostname from window.location.hostname
 * @returns {string} Normalized domain name
 */
export const normalizeDomain = (hostname) => {
  if (!hostname || typeof hostname !== "string") {
    return "";
  }
  
  let normalized = hostname.toLowerCase().trim();
  
  // Remove leading "www."
  if (normalized.startsWith("www.")) {
    normalized = normalized.substring(4);
  }
  
  return normalized;
};

/**
 * Get current domain from window.location
 * @returns {string} Normalized domain name
 */
export const getCurrentDomain = () => {
  if (typeof window === "undefined") {
    return "";
  }
  
  return normalizeDomain(window.location.hostname);
};

/**
 * Detect local / IP-based access (localhost + LAN IPs).
 * When true, domain validation and branding API are skipped.
 * @param {string} hostname - The hostname (e.g. from window.location.hostname or normalized)
 * @returns {boolean} True if access is from localhost or private IP
 */
export const isLocalAccess = (hostname) => {
  if (!hostname) return false;
  const h = typeof hostname === "string" ? hostname.toLowerCase().trim() : "";
  if (!h) return false;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "::1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(h) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)
  );
};

/**
 * Check if domain is owner or localhost (should use default branding, skip validation)
 * Includes: orbit.tunewave.in and all isLocalAccess() hostnames (localhost, LAN IPs).
 * @param {string} domain - Normalized domain name
 * @returns {boolean} True if domain is owner or local/IP access
 */
export const isOwnerOrLocalhost = (domain) => {
  if (!domain) return false;
  return domain === "orbit.tunewave.in" || isLocalAccess(domain);
};

/**
 * Check if domain is specifically orbit.tunewave.in (owner/control domain)
 * @param {string} domain - Normalized domain name
 * @returns {boolean} True if domain is orbit.tunewave.in
 */
export const isOrbitDomain = (domain) => {
  if (!domain) return false;
  return domain === "orbit.tunewave.in";
};

/**
 * Get branding data from localStorage
 * @param {string} domain - Domain name (normalized)
 * @returns {Object|null} Cached branding data or null
 */
export const getCachedBranding = (domain) => {
  if (typeof window === "undefined" || !domain) {
    return null;
  }
  
  try {
    const cacheKey = `branding_${domain}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cache is still valid (optional: add expiry check here)
      return parsed;
    }
  } catch (error) {
    console.warn("[BrandingService] Error reading cache:", error);
  }
  
  return null;
};

/**
 * Cache branding data in localStorage
 * @param {string} domain - Domain name (normalized)
 * @param {Object} brandingData - Branding data to cache
 */
export const cacheBranding = (domain, brandingData) => {
  if (typeof window === "undefined" || !domain || !brandingData) {
    return;
  }
  
  try {
    const cacheKey = `branding_${domain}`;
    localStorage.setItem(cacheKey, JSON.stringify(brandingData));
  } catch (error) {
    console.warn("[BrandingService] Error caching branding:", error);
  }
};

/**
 * Default TuneWave branding for owner/localhost domains
 * These are the canonical defaults for the owner environment
 */
export const getDefaultBranding = () => ({
  site: {
    name: "Tunewave Music",
    description: "Music Distribution Platform",
  },
  colors: {
    primary: "#cebe88",
    secondary: "#122b4a",
    header: "#ffffff",
    sidebar: "#f5f5f5",
    footer: "#2c3e50",
  },
  logoUrl: null, // Use default logo
  footer: {
    text: "© 2024 Tunewave Music. All rights reserved.",
    links: [],
  },
});

/**
 * Fetch branding data from API
 * @param {string} domainName - Normalized domain name
 * @returns {Promise<Object>} Branding data
 */
export const fetchBranding = async (domainName) => {
  if (!domainName) {
    console.warn("[BrandingService] No domain provided, using default branding");
    return getDefaultBranding();
  }

  try {
    // Check cache first
    const cached = getCachedBranding(domainName);
    if (cached) {
      console.log("[BrandingService] Using cached branding for domain:", domainName);
      return cached;
    }

    // Fetch from API
    console.log("[BrandingService] Fetching branding for domain:", domainName);
    const response = await api.get(API_BASE, {
      params: {
        domainName: domainName,
      },
    });

    // Handle API response - log for debugging
    console.log("[BrandingService] API response received:", response);
    console.log("[BrandingService] Response type:", typeof response);
    
    // Check for explicit error response
    if (response && response.error) {
      const errorMessage = response.error.toLowerCase();
      if (errorMessage.includes("branding not found") || 
          errorMessage.includes("not found") ||
          errorMessage.includes("domain not found")) {
        console.error("[BrandingService] Branding not found for domain:", domainName);
        // Return error object to trigger redirect in DomainGuard
        return {
          error: "Branding not found for this domain",
          domain: domainName,
        };
      }
    }
    
    // Normalize site name across tenant types (Label / Enterprise) using the SAME branding API
    const defaultBranding = getDefaultBranding();
    const resolvedSiteName = (() => {
      const candidates = [
        response?.site?.name,
        response?.siteName,
        response?.enterpriseName,
        response?.labelName,
        response?.name,
      ];

      for (const c of candidates) {
        if (typeof c === "string" && c.trim() !== "") return c.trim();
      }
      return "";
    })();

    // Accept response if it contains any usable branding fields (including brandingId / name-only responses)
    const hasUsableBranding =
      !!response &&
      (resolvedSiteName ||
        response.site ||
        response.colors ||
        response.logoUrl ||
        response.footer ||
        response.brandingId);

    if (hasUsableBranding) {
      // Use API response as-is, only merge defaults for missing top-level properties
      // This ensures API values (like site.name) are preserved exactly as returned
      const brandingData = {
        // If API provides site, use it (may be partial like { name: "krishna" })
        // Merge with defaults only to ensure structure, but API values take precedence
        site: response.site 
          ? { 
              name: response.site.name || resolvedSiteName || defaultBranding.site.name,
              description: response.site.description || defaultBranding.site.description,
            }
          : {
              name: resolvedSiteName || defaultBranding.site.name,
              description: defaultBranding.site.description,
            },
        colors: response.colors 
          ? { ...defaultBranding.colors, ...response.colors }
          : defaultBranding.colors,
        logoUrl: response.logoUrl || null,
        footer: response.footer 
          ? { ...defaultBranding.footer, ...response.footer }
          : defaultBranding.footer,
        // Include brandingId from API (critical for tenant isolation)
        brandingId: response.brandingId || null,
        // Include domain status flags if provided by API
        domainStatus: response.domainStatus,
        sslEnabled: response.sslEnabled,
        isActive: response.isActive,
      };
      
      console.log("[BrandingService] Processed branding data:", brandingData);
      console.log("[BrandingService] Site name from processed data:", brandingData.site?.name);
      console.log("[BrandingService] Domain status:", {
        domainStatus: brandingData.domainStatus,
        sslEnabled: brandingData.sslEnabled,
        isActive: brandingData.isActive,
      });
      
      // Cache the response
      cacheBranding(domainName, brandingData);
      return brandingData;
    } else {
      // Invalid response - return error to trigger redirect
      console.error("[BrandingService] Invalid API response for domain:", domainName);
      console.error("[BrandingService] Response was:", response);
      return {
        error: "Branding not found for this domain",
        domain: domainName,
      };
    }
  } catch (error) {
    console.error("[BrandingService] Error fetching branding:", error);
    
    // If 404 or no tenant found, return error to trigger redirect
    if (error.response?.status === 404 || error.response?.status === 400) {
      console.error("[BrandingService] Branding not found (404/400) for domain:", domainName);
      return {
        error: "Branding not found for this domain",
        domain: domainName,
      };
    }
    
    // For other errors, try cache as fallback
    const cached = getCachedBranding(domainName);
    if (cached && cached.site && cached.site.name) {
      console.log("[BrandingService] API failed, using cached branding");
      return cached;
    }
    
    // Final fallback: return error to trigger redirect
    console.error("[BrandingService] No valid branding found, returning error");
    return {
      error: "Branding not found for this domain",
      domain: domainName,
    };
  }
};

/**
 * Get domain name for a specific brandingId
 * Used to redirect users to their correct tenant domain
 * @param {number} brandingId - The branding ID
 * @returns {Promise<Object>} Domain information { brandingId, domainName }
 */
export const getDomainByBrandingId = async (brandingId) => {
  if (!brandingId) {
    throw new Error("brandingId is required");
  }

  try {
    console.log("[BrandingService] Fetching domain for brandingId:", brandingId);
    const response = await api.get(`${API_BASE}/${brandingId}/domain`);
    
    console.log("[BrandingService] Domain resolver response:", response);
    
    if (response && response.domainName) {
      return {
        brandingId: response.brandingId || brandingId,
        domainName: response.domainName,
      };
    } else {
      throw new Error("Invalid response from domain resolver API");
    }
  } catch (error) {
    console.error("[BrandingService] Error fetching domain for brandingId:", brandingId, error);
    throw error;
  }
};

