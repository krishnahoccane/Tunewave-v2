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
 * Upload file directly to API (not using S3 presigned URLs)
 * @param {Object} uploadData - Upload data
 * @param {number} uploadData.releaseId - Release ID (required)
 * @param {number} uploadData.trackId - Track ID (required)
 * @param {string} uploadData.fileType - File type (e.g., "Audio") (required)
 * @param {File} uploadData.file - File object to upload (required)
 * @returns {Promise<Object>} Upload response with fileId
 */
export const uploadFileDirectly = async ({ releaseId, trackId, fileType, file }) => {
  const token = localStorage.getItem("jwtToken");
  const formData = new FormData();
  formData.append('releaseId', releaseId);
  formData.append('trackId', trackId);
  formData.append('fileType', fileType);
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000, // 10 minutes timeout for large files
  });
  return response.data;
};

/**
 * Get files with optional filters
 * @param {Object} filters - Optional filters
 * @param {number} filters.releaseId - Filter by release ID
 * @param {number} filters.trackId - Filter by track ID
 * @param {string} filters.fileType - Filter by file type (e.g., "Audio")
 * @param {string} filters.status - Filter by status (e.g., "AVAILABLE", "UPLOADING")
 * @returns {Promise<Object>} Files response with totalFiles and files array
 */
export const getFiles = async (filters = {}) => {
  // Build query params - only include provided filters
  const params = new URLSearchParams();
  if (filters.releaseId !== undefined && filters.releaseId !== null) {
    params.append("releaseId", filters.releaseId);
  }
  if (filters.trackId !== undefined && filters.trackId !== null) {
    params.append("trackId", filters.trackId);
  }
  if (filters.fileType) {
    params.append("fileType", filters.fileType);
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  
  const queryString = params.toString();
  const url = queryString ? `${API_BASE}?${queryString}` : API_BASE;
  
  const response = await axios.get(url, {
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
  uploadFileDirectly,
  getFiles,
  getFileById,
  deleteFile,
};









