import axios from "axios";

// Base URL for all API calls. Use env so localhost hits real backend (no 404 on localhost).
const DEFAULT_API_BASE = "https://spacestation.tunewave.in";

const getBaseURL = () => {
  const envBaseURL = import.meta.env.VITE_API_BASE_URL;
  if (envBaseURL && String(envBaseURL).trim() !== "") {
    return String(envBaseURL).trim();
  }
  return DEFAULT_API_BASE;
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to log actual request URLs and ensure baseURL is set
api.interceptors.request.use(
  (config) => {
    // Force baseURL from instance defaults - axios should merge this automatically, but we ensure it
    const instanceBaseURL = api.defaults.baseURL || baseURL;
    
    // CRITICAL: Always set baseURL on config if instance has one
    // This ensures the baseURL is used even if axios doesn't merge it automatically
    if (instanceBaseURL && instanceBaseURL.trim() !== "") {
      config.baseURL = instanceBaseURL;
    }
    
    // CRITICAL: If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      // Delete Content-Type from headers to allow browser to set it automatically with boundary
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
      console.log("[API Request] FormData detected - Content-Type header removed (browser will set with boundary)");
    }
    
    // Build full URL for logging
    const effectiveBaseURL = config.baseURL || instanceBaseURL || "";
    const fullURL = effectiveBaseURL 
      ? `${effectiveBaseURL}${config.url}` 
      : config.url;
    
    console.log("[API Request] Method:", config.method?.toUpperCase());
    console.log("[API Request] Relative URL:", config.url);
    console.log("[API Request] Instance defaults.baseURL:", api.defaults.baseURL || "not set");
    console.log("[API Request] Config baseURL (after interceptor):", config.baseURL || "not set");
    console.log("[API Request] Content-Type:", config.headers?.['Content-Type'] || config.headers?.['content-type'] || "not set (will be auto-set)");
    console.log("[API Request] Full URL that will be called:", fullURL);
    
    // Double-check: if baseURL is still not set but we have one, force it
    if (!config.baseURL && instanceBaseURL && instanceBaseURL.trim() !== "") {
      console.warn("[API Request] WARNING: baseURL was not set, forcing it now");
      config.baseURL = instanceBaseURL;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: auto unwrap response.data
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;
