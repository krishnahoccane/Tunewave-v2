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
  // Try POST first (as used in QCDetailPage), fallback to PUT if needed
  try {
    console.log(`[TracksService] Calling POST ${API_BASE}/${trackId} with data:`, trackData);
    const response = await axios.post(`${API_BASE}/${trackId}`, trackData, {
      headers: getAuthHeaders(),
    });
    console.log(`[TracksService] POST ${API_BASE}/${trackId} response status: ${response.status}`);
    return response.data;
  } catch (postError) {
    // If POST fails with 405, try PUT
    if (postError.response?.status === 405) {
      console.warn(`[TracksService] POST failed with 405, trying PUT instead...`);
      console.log(`[TracksService] Calling PUT ${API_BASE}/${trackId} with data:`, trackData);
      const response = await axios.put(`${API_BASE}/${trackId}`, trackData, {
        headers: getAuthHeaders(),
      });
      console.log(`[TracksService] PUT ${API_BASE}/${trackId} response status: ${response.status}`);
      return response.data;
    }
    // Re-throw if not a 405 error
    throw postError;
  }
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
  // Use GET /api/releases/{releaseId} which includes tracks in the response
  const response = await axios.get(`/api/releases/${releaseId}`, {
    headers: getAuthHeaders(),
  });
  
  const releaseData = response.data?.release || response.data;
  
  // Extract tracks from release response
  // Handle null tracks explicitly - API returns null, not empty array
  let tracks = (releaseData?.tracks === null || releaseData?.tracks === undefined)
    ? []
    : (Array.isArray(releaseData.tracks) ? releaseData.tracks : []);
  
  // If tracks not in release, try fetching by trackIds
  if (tracks.length === 0 && releaseData?.trackIds && Array.isArray(releaseData.trackIds) && releaseData.trackIds.length > 0) {
    console.log(`[TracksService] Tracks not in release response, fetching by trackIds:`, releaseData.trackIds);
    const trackPromises = releaseData.trackIds.map(trackId =>
      getTrackById(trackId).catch(() => null)
    );
    tracks = (await Promise.all(trackPromises)).filter(t => t !== null);
  }
  
  return tracks;
};

// Export all track functions as default object for convenience
export default {
  createTrack,
  getTrackById,
  updateTrack,
  deleteTrack,
  getTracksByReleaseId,
};










