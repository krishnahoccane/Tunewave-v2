import axios from "axios";

/**
 * Files Service
 * Centralized File Upload API calls
 */

const API_BASE = "/api/files";

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
 * Initiate file upload
 * @param {Object} uploadData - Upload initiation data
 * @param {number} uploadData.releaseId - Release ID (required)
 * @param {number} uploadData.trackId - Track ID (required)
 * @param {string} uploadData.fileType - File type (e.g., "audio", "image") (required)
 * @param {string} uploadData.fileName - File name (required)
 * @param {string} uploadData.contentType - Content type (e.g., "audio/mpeg") (required)
 * @param {number} uploadData.expectedFileSize - Expected file size in bytes (required)
 * @returns {Promise<Object>} Upload initiation response with upload URL and file ID
 */
export const initiateFileUpload = async (uploadData) => {
  const response = await axios.post(`${API_BASE}/upload`, uploadData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Complete file upload
 * @param {Object} completeData - Upload completion data
 * @param {number} completeData.fileId - File ID from upload initiation (required)
 * @param {string} completeData.checksum - File checksum (required)
 * @param {number} completeData.fileSize - Actual file size in bytes (required)
 * @param {string} completeData.cloudfrontUrl - CloudFront URL where file is stored (required)
 * @param {string} completeData.backupUrl - Backup URL (optional)
 * @returns {Promise<Object>} Upload completion response
 */
export const completeFileUpload = async (completeData) => {
  const response = await axios.post(`${API_BASE}/complete`, completeData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get file by ID
 * @param {number} fileId - File ID
 * @returns {Promise<Object>} File object
 */
export const getFileById = async (fileId) => {
  const response = await axios.get(`${API_BASE}/${fileId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Delete a file
 * @param {number} fileId - File ID
 * @returns {Promise<Object>} Response data
 */
export const deleteFile = async (fileId) => {
  const response = await axios.delete(`${API_BASE}/${fileId}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Export all file functions as default object for convenience
export default {
  initiateFileUpload,
  completeFileUpload,
  getFileById,
  deleteFile,
};




