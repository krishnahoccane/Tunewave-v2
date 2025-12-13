import axios from "axios";
import api from "../config/api";

// const API_BASE = "/api/auth";

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
 * Get list of releases with optional filters
 * @param {Object} params - Query parameters (optional)
 * @param {number} params.LabelId - Filter by label ID
 * @param {number} params.EnterpriseId - Filter by enterprise ID
 * @param {number} params.ArtistId - Filter by artist ID
 * @param {string} params.Status - Filter by status
 * @param {string} params.Q - Search query
 * @param {string} params.From - From date (ISO string)
 * @param {string} params.To - To date (ISO string)
 * @returns {Promise<Array>} Array of release objects
 */
export const getReleases = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      queryParams.append(key, params[key]);
    }
  });
  
  const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  
  console.log(`[ReleasesService] GET ${url}`);
  
  const response = await axios.get(url, {
    headers: getAuthHeaders(),
  });
  
  console.log(`[ReleasesService] Response status:`, response.status);
  console.log(`[ReleasesService] Response data:`, response.data);
  
  // Handle different response formats
  const responseData = response.data;
  if (Array.isArray(responseData)) {
    console.log(`[ReleasesService] Returning array of ${responseData.length} releases`);
    return responseData;
  } else if (responseData && typeof responseData === 'object') {
    const releases = responseData.data || 
           responseData.releases || 
           responseData.items || 
           responseData.results ||
           [];
    console.log(`[ReleasesService] Extracted ${releases.length} releases from object`);
    return releases;
  }
  
  console.log(`[ReleasesService] No releases found, returning empty array`);
  return [];
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
  
  const responseData = response.data;
  // Handle different response formats
  return responseData.release || responseData;
};

/**
 * Create a new release
 * @param {Object} releaseData - Release data
 * @returns {Promise<Object>} Created release object
 */
export const createRelease = async (releaseData) => {
  const response = await axios.post(API_BASE, releaseData, {
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
  const response = await axios.post(`${API_BASE}/${releaseId}`, releaseData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get releases for a specific artist
 * @param {number} artistId - Artist ID
 * @param {Object} additionalParams - Additional query parameters (optional)
 * @returns {Promise<Array>} Array of release objects
 */
export const getReleasesByArtistId = async (artistId, additionalParams = {}) => {
  // Use ArtistId (capital A) as per API documentation
  return getReleases({
    ArtistId: artistId,
    ...additionalParams,
  });
};

// Export all release functions as default object for convenience
export default {
  getReleases,
  getReleaseById,
  createRelease,
  updateRelease,
  getReleasesByArtistId,
};
