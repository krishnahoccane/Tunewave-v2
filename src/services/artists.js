import axios from "axios";
import api from "../config/api";

// const API_BASE = "/api/auth";

/**
 * Artists Service
 * Centralized Artist API calls
 */

const API_BASE = "/api/artists";

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
 * Get artist by ID
 * @param {number} artistId - Artist ID
 * @returns {Promise<Object>} Artist object
 */
export const getArtistById = async (artistId) => {
  const response = await axios.get(`${API_BASE}/${artistId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get list of artists with optional filters
 * @param {Object} params - Query parameters (optional)
 * @param {string} params.status - Filter by status
 * @param {string} params.search - Search term
 * @returns {Promise<Array>} Array of artist objects
 */
export const getArtists = async (params = {}) => {
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

/**
 * Create a new artist
 * @param {Object} artistData - Artist data
 * @returns {Promise<Object>} Created artist object
 */
export const createArtist = async (artistData) => {
  const response = await axios.post(API_BASE, artistData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing artist
 * @param {number} artistId - Artist ID
 * @param {Object} artistData - Update data
 * @returns {Promise<Object>} Updated artist object
 */
export const updateArtist = async (artistId, artistData) => {
  const response = await axios.put(`${API_BASE}/${artistId}`, artistData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Export all artist functions as default object for convenience
export default {
  getArtistById,
  getArtists,
  createArtist,
  updateArtist,
};


















