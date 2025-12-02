import axios from "axios";

/**
 * Tracks Service
 * Centralized Track API calls
 */

const API_BASE = "/api/tracks";

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
 * Create a new track
 * @param {Object} trackData - Track data
 * @param {number} trackData.releaseId - Release ID (required)
 * @param {number} trackData.trackNumber - Track number (required)
 * @param {string} trackData.title - Track title (required)
 * @param {number} trackData.durationSeconds - Duration in seconds (required)
 * @param {boolean} trackData.explicitFlag - Explicit flag (optional)
 * @param {string} trackData.isrc - ISRC code (optional)
 * @param {string} trackData.language - Language code (optional)
 * @param {string} trackData.trackVersion - Track version (optional)
 * @param {number} trackData.primaryArtistId - Primary artist ID (optional)
 * @param {number} trackData.audioFileId - Audio file ID (optional)
 * @returns {Promise<Object>} Created track object
 */
export const createTrack = async (trackData) => {
  const response = await axios.post(API_BASE, trackData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get track by ID
 * @param {number} trackId - Track ID
 * @returns {Promise<Object>} Track object
 */
export const getTrackById = async (trackId) => {
  const response = await axios.get(`${API_BASE}/${trackId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Update an existing track
 * @param {number} trackId - Track ID
 * @param {Object} trackData - Update data
 * @returns {Promise<Object>} Updated track object
 */
export const updateTrack = async (trackId, trackData) => {
  const response = await axios.put(`${API_BASE}/${trackId}`, trackData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Delete a track
 * @param {number} trackId - Track ID
 * @returns {Promise<Object>} Response data
 */
export const deleteTrack = async (trackId) => {
  const response = await axios.delete(`${API_BASE}/${trackId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get tracks for a release
 * @param {number} releaseId - Release ID
 * @returns {Promise<Array>} Array of track objects
 */
export const getTracksByReleaseId = async (releaseId) => {
  const response = await axios.get(`${API_BASE}?releaseId=${releaseId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Export all track functions as default object for convenience
export default {
  createTrack,
  getTrackById,
  updateTrack,
  deleteTrack,
  getTracksByReleaseId,
};









