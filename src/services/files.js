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
 * Initiate file uploa
 * 
 * 
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
 * Upload audio file using the UploadAudio endpoint
 * @param {Object} uploadData - Upload data
 * @param {number} uploadData.releaseId - Release ID (required)
 * @param {number} uploadData.trackId - Track ID (required)
 * @param {File} uploadData.file - File object to upload (required)
 * @returns {Promise<Object>} Upload response with fileId and other details
 */
export const uploadAudio = async ({ releaseId, trackId, file }) => {
  const token = localStorage.getItem("jwtToken");
  
  // Validate inputs
  if (!releaseId || releaseId === 0) {
    throw new Error("releaseId is required and must be greater than 0");
  }
  if (!trackId || trackId === 0) {
    throw new Error("trackId is required and must be greater than 0");
  }
  if (!file) {
    throw new Error("file is required");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  // Log FormData contents (for debugging)
  console.log(`[FilesService] FormData entries:`);
  for (let pair of formData.entries()) {
    console.log(`[FilesService]   ${pair[0]}:`, pair[1]);
  }
  
  // Try different endpoint variations - backend might be case-sensitive or have routing issues
  // Swagger shows: POST /api/files/UploadAudio
  const endpointVariations = [
    `${API_BASE}/UploadAudio`,  // Exact from Swagger (capital U, capital A)
    `${API_BASE}/uploadAudio`,  // camelCase
    `${API_BASE}/upload-audio`, // kebab-case
  ];
  
  // Use the first one (exact from Swagger)
  const baseUrl = endpointVariations[0];
  const url = `${baseUrl}?releaseId=${releaseId}&trackId=${trackId}`;
  
  console.log(`[FilesService] ========== UPLOAD AUDIO REQUEST ==========`);
  console.log(`[FilesService] API_BASE:`, API_BASE);
  console.log(`[FilesService] Endpoint:`, baseUrl);
  console.log(`[FilesService] Full URL:`, url);
  console.log(`[FilesService] Method: POST`);
  console.log(`[FilesService] Query params:`, { releaseId, trackId });
  console.log(`[FilesService] Will try alternatives if 405:`, endpointVariations.slice(1));
  console.log(`[FilesService] File details:`, {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });
  console.log(`[FilesService] Token present:`, !!token);
  console.log(`[FilesService] Token length:`, token ? token.length : 0);
  
  // Try each endpoint variation until one works
  let lastError = null;
  for (let i = 0; i < endpointVariations.length; i++) {
    const currentEndpoint = endpointVariations[i];
    const currentUrl = `${currentEndpoint}?releaseId=${releaseId}&trackId=${trackId}`;
    
    try {
      console.log(`[FilesService] Attempt ${i + 1}/${endpointVariations.length}: ${currentEndpoint}`);
      
      const response = await axios.post(currentUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 10 minutes timeout for large files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            if (percentCompleted % 25 === 0) { // Log every 25%
              console.log(`[FilesService] Upload progress for ${file.name}: ${percentCompleted}%`);
            }
          }
        },
      });
      
      // Success
      console.log(`[FilesService] ✅ Upload successful with endpoint: ${currentEndpoint}`);
      console.log(`[FilesService] POST ${currentUrl} response status: ${response.status}`);
      console.log(`[FilesService] POST ${currentUrl} response headers:`, response.headers);
      console.log(`[FilesService] POST ${currentUrl} response data:`, response.data);
      console.log(`[FilesService] Full response object:`, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        config: {
          url: response.config.url,
          method: response.config.method,
          headers: response.config.headers,
        },
      });
      
      return response.data;
      
    } catch (error) {
      lastError = error;
      
      // If 405 error and more endpoints to try, continue
      if (error.response?.status === 405 && i < endpointVariations.length - 1) {
        console.warn(`[FilesService] Endpoint ${currentEndpoint} returned 405, trying next variation...`);
        continue;
      }
      
      // If not 405 or last endpoint, break and handle error
      break;
    }
  }
  
  // Handle error after trying all endpoints
  if (lastError) {
    const error = lastError;
    console.error(`[FilesService] ========== ALL ENDPOINT VARIATIONS FAILED ==========`);
    console.error(`[FilesService] Tried endpoints:`, endpointVariations);
    console.error(`[FilesService] Last attempted URL:`, error.config?.url || url);
    console.error(`[FilesService] Error:`, error);
    console.error(`[FilesService] Error message:`, error.message);
    console.error(`[FilesService] Error code:`, error.code);
    
    // Special handling for 405 errors
    if (error.response?.status === 405) {
      console.error(`[FilesService] ========== 405 ERROR DETAILS ==========`);
      console.error(`[FilesService] All endpoint variations returned 405 (Method Not Allowed)`);
      console.error(`[FilesService] This suggests the backend route is not configured correctly`);
      console.error(`[FilesService] Response is HTML (not JSON), meaning request hit web server, not API`);
      console.error(`[FilesService] Check backend routing configuration for: ${endpointVariations.join(', ')}`);
      
      // Try to extract any useful info from HTML response
      if (typeof error.response?.data === 'string' && error.response.data.includes('405')) {
        console.error(`[FilesService] Backend returned HTML error page (IIS/web server)`);
        console.error(`[FilesService] This means the route doesn't exist or isn't configured`);
      }
      
      // Create enhanced error with status code for fallback detection
      const enhancedError = new Error(`405 Method Not Allowed: UploadAudio endpoint not found`);
      enhancedError.status = 405;
      enhancedError.response = error.response;
      enhancedError.responseData = error.response?.data;
      throw enhancedError;
    }
    
    if (error.response) {
      // Server responded with error status
      console.error(`[FilesService] ========== BACKEND ERROR RESPONSE ==========`);
      console.error(`[FilesService] Status Code:`, error.response.status);
      console.error(`[FilesService] Status Text:`, error.response.statusText);
      console.error(`[FilesService] Response Headers:`, error.response.headers);
      console.error(`[FilesService] Response Data (raw):`, error.response.data);
      console.error(`[FilesService] Response Data (type):`, typeof error.response.data);
      
      // Try to stringify the response data
      try {
        console.error(`[FilesService] Response Data (JSON):`, JSON.stringify(error.response.data, null, 2));
      } catch (e) {
        console.error(`[FilesService] Could not stringify response data:`, e);
      }
      
      // Log all possible error fields
      if (error.response.data) {
        console.error(`[FilesService] Error data properties:`, Object.keys(error.response.data));
        console.error(`[FilesService] Error data.message:`, error.response.data.message);
        console.error(`[FilesService] Error data.error:`, error.response.data.error);
        console.error(`[FilesService] Error data.errorMessage:`, error.response.data.errorMessage);
        console.error(`[FilesService] Error data.title:`, error.response.data.title);
        console.error(`[FilesService] Error data.trace:`, error.response.data.trace);
        console.error(`[FilesService] Error data.stackTrace:`, error.response.data.stackTrace);
      }
      
      // Extract error message from response
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.errorMessage ||
                          error.response.data?.title ||
                          (typeof error.response.data === 'string' ? error.response.data : null) ||
                          error.message ||
                          `Server error: ${error.response.status} ${error.response.statusText}`;
      
      console.error(`[FilesService] Final extracted error message:`, errorMessage);
      
      // Create a more informative error
      const enhancedError = new Error(errorMessage);
      enhancedError.status = error.response.status;
      enhancedError.statusText = error.response.statusText;
      enhancedError.responseData = error.response.data;
      enhancedError.response = error.response; // Include full response for debugging
      
      // Ensure status is accessible for fallback detection
      if (error.response.status === 405) {
        enhancedError.status = 405;
      }
      
      throw enhancedError;
    } else if (error.request) {
      // Request was made but no response received
      console.error(`[FilesService] No response received. Request details:`, {
        url: error.config?.url,
        method: error.config?.method,
      });
      throw new Error(`Network error: No response from server. Please check your connection.`);
    } else {
      // Error setting up request
      console.error(`[FilesService] Request setup error:`, error.message);
      throw error;
    }
  }
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
  uploadAudio,
  getFiles,
  getFileById,
  deleteFile,
};









