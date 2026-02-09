// import axios from "axios";
import axios from "../config/api";
// import api from "../config/api";

// const API_BASE = "/api/auth";

/**
 * Enterprises Service
 * Centralized Enterprise API calls
 * All endpoints match Swagger specification at /swagger/index.html
 */

const API_BASE = "/api/enterprises";

/**
 * Get authentication headers with Bearer token
 * @returns {Object} Headers object with Authorization and Content-Type
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Get list of enterprises with optional filters
 * Note: This endpoint may not be in Swagger but is used in the application
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (active, suspend, disable)
 * @param {string} params.search - Search term
 * @returns {Promise<Array>} Array of enterprise objects
 */
export const getEnterprises = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.status) {
    queryParams.append("status", params.status);
  }
  if (params.search) {
    queryParams.append("search", params.search);
  }
  
  const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const responseData = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  
  console.log("[EnterprisesService] API response:", responseData);
  
  // Handle different response formats
  // API might return: array directly, or object with data/enterprises/items property
  if (Array.isArray(responseData)) {
    return responseData;
  } else if (responseData && typeof responseData === 'object') {
    // Try common property names
    return responseData.data || 
           responseData.enterprises || 
           responseData.items || 
           responseData.results ||
           [];
  }
  
  // Fallback: return empty array if unexpected format
  console.warn("[EnterprisesService] Unexpected response format:", responseData);
  return [];
};

/**
 * Get enterprise by ID
 * @param {number} enterpriseId - Enterprise ID
 * @returns {Promise<Object>} Enterprise object
 */
export const getEnterpriseById = async (enterpriseId) => {
  const url = `${API_BASE}/${enterpriseId}`;
  console.log("[EnterprisesService] getEnterpriseById called with ID:", enterpriseId);
  console.log("[EnterprisesService] API_BASE:", API_BASE);
  console.log("[EnterprisesService] Relative URL:", url);
  console.log("[EnterprisesService] Axios instance baseURL:", axios.defaults?.baseURL || "not set");
  
  // Ensure baseURL is explicitly set in the request config as a fallback
  const requestConfig = {
    headers: getAuthHeaders(),
  };
  
  // If axios instance has a baseURL, ensure it's used
  if (axios.defaults?.baseURL && axios.defaults.baseURL.trim() !== "") {
    requestConfig.baseURL = axios.defaults.baseURL;
    console.log("[EnterprisesService] Explicitly setting baseURL in request:", requestConfig.baseURL);
  }
  
  const response = await axios.get(url, requestConfig);
  
  console.log("[EnterprisesService] getEnterpriseById response received");
  console.log("[EnterprisesService] ===== RAW RESPONSE FROM SERVICE =====");
  console.log("[EnterprisesService] Response type:", typeof response);
  console.log("[EnterprisesService] Response:", response);
  console.log("[EnterprisesService] Response keys:", Object.keys(response || {}));
  console.log("[EnterprisesService] Response JSON:", JSON.stringify(response, null, 2));
  console.log("[EnterprisesService] AudioMasterCode in response:", response?.AudioMasterCode, response?.audioMasterCode);
  console.log("[EnterprisesService] VideoMasterCode in response:", response?.VideoMasterCode, response?.videoMasterCode);
  console.log("[EnterprisesService] HasIsrcMasterCode in response:", response?.HasIsrcMasterCode, response?.hasIsrcMasterCode);
  
  return response;  // axios instance returns unwrapped response data
};

/**
 * Create a new enterprise
 * @param {Object|FormData} data - Enterprise data (can be FormData for file uploads)
 * @param {string} data.enterpriseName - Enterprise name (required)
 * @param {string} data.domain - Domain (optional)
 * @param {number} data.revenueSharePercent - Revenue share percentage 0-100 (optional)
 * @param {boolean} data.qcRequired - QC required flag (optional)
 * @param {string} data.ownerEmail - Owner email (optional)
 * @param {string} data.agreementStartDate - Agreement start date ISO string (optional)
 * @param {string} data.agreementEndDate - Agreement end date ISO string (optional)
 * @param {boolean} data.HasIsrcMasterCode - Has ISRC Master Code flag (optional)
 * @param {string} data.AudioMasterCode - Audio Master Code (optional, format: XX-XXX)
 * @param {string} data.VideoMasterCode - Video Master Code (optional, format: XX-XXX)
 * @param {File} data.IsrcCertificateFile - ISRC Certificate File (PDF) (optional)
 * @returns {Promise<Object>} Created enterprise object
 */
/**
 * Create a new enterprise
 * Always uses multipart/form-data to match backend contract (Swagger/Postman)
 * @param {FormData} formData - FormData object with enterprise fields
 * @returns {Promise<Object>} Created enterprise object
 */
export const createEnterprise = async (formData) => {
  const token = localStorage.getItem("jwtToken");
  
  if (!token) {
    throw new Error("Authentication token not found");
  }
  
  // Always expect FormData (multipart/form-data) to match backend contract
  if (!(formData instanceof FormData)) {
    console.warn("[EnterprisesService] createEnterprise: Expected FormData but received:", typeof formData);
    throw new Error("createEnterprise expects FormData object");
  }
  
  console.log("[EnterprisesService] createEnterprise: Using FormData (multipart/form-data)");
  console.log("[EnterprisesService] FormData entries:", 
    Array.from(formData.entries()).map(([key, value]) => [
      key, 
      value instanceof File ? `File: ${value.name} (${value.size} bytes, ${value.type})` : value
    ])
  );
  
  // Use multipart/form-data
  // DO NOT set Content-Type manually - let browser/axios set it with boundary
  // The interceptor will remove any default Content-Type header
  const response = await axios.post(API_BASE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Explicitly do NOT set Content-Type - let browser set it with boundary
    },
  });
  
  console.log("[EnterprisesService] createEnterprise: FormData request successful");
  return response;  // axios instance returns unwrapped response data
};

/**
 * Update an existing enterprise
 * @param {number} enterpriseId - Enterprise ID
 * @param {Object} data - Update data
 * @param {string} data.ownerEmail - Owner email (optional, note: changing email transfers admin account)
 * @param {string} data.domain - Domain (optional)
 * @param {number} data.revenueSharePercent - Revenue share percentage 0-100 (optional, note: updates from 3rd month)
 * @param {boolean} data.qcRequired - QC required flag (optional, note: changing affects pending QCs)
 * @param {string} data.agreementStartDate - Agreement start date ISO string (optional)
 * @param {string} data.agreementEndDate - Agreement end date ISO string (optional)
 * @returns {Promise<Object>} Updated enterprise object
 */
export const updateEnterprise = async (enterpriseId, data) => {
  const response = await axios.put(`${API_BASE}/${enterpriseId}`, data, {
    headers: getAuthHeaders(),
  });
  return response;  // axios instance returns unwrapped response data
};

/**
 * Change enterprise status
 * @param {number} enterpriseId - Enterprise ID
 * @param {string} status - New status (active, suspend, disable)
 * @returns {Promise<Object>} Response data
 */
export const changeEnterpriseStatus = async (enterpriseId, status) => {
  const response = await axios.post(
    `${API_BASE}/${enterpriseId}/status`,
    { status },
    {
      headers: getAuthHeaders(),
    }
  );
  return response;  // axios instance returns unwrapped response data
};

/**
 * Update enterprise status via /api/enterprises/status endpoint
 * @param {number} id - Enterprise ID
 * @param {string} status - New status (active, suspend, disable)
 * @returns {Promise<Object>} Response data
 */
export const updateEnterpriseStatus = async (id, status) => {
  const response = await axios.post(
    `${API_BASE}/${id}/status`,
    { id, status },
    {
      headers: getAuthHeaders(),
    }
  );
  return response;  // axios instance returns unwrapped response data
};

/**
 * Get labels for an enterprise
 * @param {number} enterpriseId - Enterprise ID
 * @returns {Promise<Array>} Array of label objects
 */
export const getEnterpriseLabels = async (enterpriseId) => {
  const response = await axios.get(`${API_BASE}/${enterpriseId}/labels`, {
    headers: getAuthHeaders(),
  });
  return response;  // axios instance returns unwrapped response data
};

/**
 * Transfer a label from one enterprise to another
 * @param {Object} data - Transfer data
 * @param {number} data.labelId - Label ID to transfer
 * @param {number} data.toEnterpriseId - Target enterprise ID
 * @returns {Promise<Object>} Response data
 */
export const transferLabel = async ({ labelId, toEnterpriseId }) => {
  const response = await axios.post(
    `${API_BASE}/transfer-label`,
    { labelId, toEnterpriseId },
    {
      headers: getAuthHeaders(),
    }
  );
  return response;  // axios instance returns unwrapped response data
};

// Export all enterprise functions as default object for convenience
export default {
  getEnterprises,
  getEnterpriseById,
  createEnterprise,
  updateEnterprise,
  changeEnterpriseStatus,
  updateEnterpriseStatus,
  getEnterpriseLabels,
  transferLabel,
};

