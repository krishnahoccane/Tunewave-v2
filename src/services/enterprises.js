import axios from "axios";

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
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  
  const responseData = response.data;
  
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
  const response = await axios.get(`${API_BASE}/${enterpriseId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Create a new enterprise
 * @param {Object} data - Enterprise data
 * @param {string} data.enterpriseName - Enterprise name (required)
 * @param {string} data.domain - Domain (optional)
 * @param {number} data.revenueSharePercent - Revenue share percentage 0-100 (optional)
 * @param {boolean} data.qcRequired - QC required flag (optional)
 * @param {string} data.ownerEmail - Owner email (optional)
 * @param {string} data.agreementStartDate - Agreement start date ISO string (optional)
 * @param {string} data.agreementEndDate - Agreement end date ISO string (optional)
 * @returns {Promise<Object>} Created enterprise object
 */
export const createEnterprise = async (data) => {
  // Map common field names to API expected names
  const requestData = {
    enterpriseName: data.enterpriseName,
    domain: data.domain || null,
    revenueSharePercent: data.revenueSharePercent ?? data.revenueShare ?? null,
    qcRequired: data.qcRequired ?? false,
    ownerEmail: data.ownerEmail ?? data.email ?? null,
    agreementStartDate: data.agreementStartDate || null,
    agreementEndDate: data.agreementEndDate || null,
  };
  
  const response = await axios.post(API_BASE, requestData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing enterprise
 * @param {number} enterpriseId - Enterprise ID
 * @param {Object} data - Update data
 * @param {string} data.domain - Domain (optional)
 * @param {number} data.revenueSharePercent - Revenue share percentage 0-100 (optional)
 * @param {boolean} data.qcRequired - QC required flag (optional)
 * @param {string} data.agreementStartDate - Agreement start date ISO string (optional)
 * @param {string} data.agreementEndDate - Agreement end date ISO string (optional)
 * @returns {Promise<Object>} Updated enterprise object
 */
export const updateEnterprise = async (enterpriseId, data) => {
  const response = await axios.put(`${API_BASE}/${enterpriseId}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
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
  return response.data;
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
  return response.data;
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
  return response.data;
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
  return response.data;
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

