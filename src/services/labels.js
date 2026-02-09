// import axios from "axios";
import axios from "../config/api";
// import api from "../config/api";

// const API_BASE = "/api/auth";

/**
 * Labels Service
 * Centralized Label API calls
 * All endpoints match Swagger specification at /swagger/index.html
 */

const API_BASE = "/api/labels";

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
 * Get list of labels with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (active, suspend, disable)
 * @param {string} params.search - Search term
 * @returns {Promise<Array>} Array of label objects or object with { total, labels }
 */
export const getLabels = async (params = {}) => {
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
  
  console.log("[LabelsService] API response:", responseData);
  
  // Handle different response formats
  // API might return: array directly, or object with data/labels/items property
  if (Array.isArray(responseData)) {
    return responseData;
  } else if (responseData && typeof responseData === 'object') {
    // Try common property names
    return responseData.labels || 
           responseData.data || 
           responseData.items || 
           responseData.results ||
           [];
  }
  
  // Fallback: return empty array if unexpected format
  console.warn("[LabelsService] Unexpected response format:", responseData);
  return [];
};

/**
 * Get label by ID
 * @param {number} labelId - Label ID
 * @returns {Promise<Object>} Label object
 */
export const getLabelById = async (labelId) => {
  const response = await axios.get(`${API_BASE}/${labelId}`, {
    headers: getAuthHeaders(),
  });
  return response;  // axios instance returns unwrapped response data
};

/**
 * Create a new label
 * Always uses multipart/form-data to match backend contract (Swagger/Postman)
 * @param {FormData} formData - FormData object with label fields
 * @returns {Promise<Object>} Created label object
 */
export const createLabel = async (formData) => {
  const token = localStorage.getItem("jwtToken");
  
  if (!token) {
    throw new Error("Authentication token not found");
  }
  
  // Always expect FormData (multipart/form-data) to match backend contract
  if (!(formData instanceof FormData)) {
    console.warn("[LabelsService] createLabel: Expected FormData but received:", typeof formData);
    throw new Error("createLabel expects FormData object");
  }
  
  console.log("[LabelsService] createLabel: Using FormData (multipart/form-data)");
  console.log("[LabelsService] FormData entries:", 
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
  
  console.log("[LabelsService] createLabel: FormData request successful");
  return response;  // axios instance returns unwrapped response data
};

/**
 * Update an existing label
 * @param {number} labelId - Label ID
 * @param {Object} data - Update data
 * @param {string} data.domain - Domain (optional)
 * @param {string} data.planType - Plan type (optional)
 * @param {number} data.revenueShare - Revenue share percentage 0-100 (optional)
 * @param {boolean} data.qcRequired - QC required flag (optional)
 * @returns {Promise<Object>} Updated label object
 */
export const updateLabel = async (labelId, data) => {
  const response = await axios.put(`${API_BASE}/${labelId}`, data, {
    headers: getAuthHeaders(),
  });
  return response;  // axios instance returns unwrapped response data
};

/**
 * Change label status
 * @param {number} labelId - Label ID
 * @param {string} status - New status (active, suspend, disable)
 * @returns {Promise<Object>} Response data
 */
export const changeLabelStatus = async (labelId, status) => {
  const response = await axios.post(
    `${API_BASE}/${labelId}/status`,
    { status },
    {
      headers: getAuthHeaders(),
    }
  );
  return response;  // axios instance returns unwrapped response data
};

// Export all label functions as default object for convenience
export default {
  getLabels,
  getLabelById,
  createLabel,
  updateLabel,
  changeLabelStatus,
};

