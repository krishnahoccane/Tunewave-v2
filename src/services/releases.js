import axios from "axios";

/**
 * Releases Service
 * Centralized Release API calls
 */

const API_BASE = "/api/releases";

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
 * Create a new release
 * @param {Object} releaseData - Release data
 * @param {number} releaseData.labelId - Label ID (required)
 * @param {string} releaseData.title - Release title (required)
 * @param {string} releaseData.titleVersion - Title version (optional)
 * @param {string} releaseData.description - Description (optional)
 * @param {string} releaseData.coverArtUrl - Cover art URL (optional)
 * @param {string} releaseData.primaryGenre - Primary genre (required)
 * @param {string} releaseData.secondaryGenre - Secondary genre (optional)
 * @param {string} releaseData.digitalReleaseDate - Digital release date ISO string (required)
 * @param {string} releaseData.originalReleaseDate - Original release date ISO string (optional)
 * @param {boolean} releaseData.hasUPC - Has UPC flag (optional)
 * @param {string} releaseData.upcCode - UPC code (optional)
 * @param {Array} releaseData.contributors - Contributors array (optional)
 * @param {Array} releaseData.localizations - Localizations array (optional)
 * @param {Object} releaseData.distributionOption - Distribution option (optional)
 * @param {Array} releaseData.tracks - Tracks array (optional)
 * @returns {Promise<Object>} Created release object
 */
export const createRelease = async (releaseData) => {
  const response = await axios.post(API_BASE, releaseData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get release by ID
 * @param {number} releaseId - Release ID
 * @returns {Promise<Object>} Release object
 */
export const getReleaseById = async (releaseId) => {
  const response = await axios.get(`${API_BASE}/${releaseId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing release
 * @param {number} releaseId - Release ID
 * @param {Object} releaseData - Update data
 * @returns {Promise<Object>} Updated release object
 */
export const updateRelease = async (releaseId, releaseData) => {
  // Use POST instead of PUT (as PUT was returning 405 error)
  const response = await axios.post(`${API_BASE}/${releaseId}`, releaseData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Delete a release
 * @param {number} releaseId - Release ID
 * @returns {Promise<Object>} Response data
 */
export const deleteRelease = async (releaseId) => {
  const response = await axios.delete(`${API_BASE}/${releaseId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get list of releases
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Array>} Array of release objects
 */
export const getReleases = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  
  const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Export all release functions as default object for convenience
export default {
  createRelease,
  getReleaseById,
  updateRelease,
  deleteRelease,
  getReleases,
};


