import api from "../config/api";

const API_BASE = "/api/artists";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getArtistById = async (artistId) => {
  return api.get(`${API_BASE}/${artistId}`, { headers: getAuthHeaders() });
};

export const getArtists = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      queryParams.append(key, params[key]);
    }
  });
  const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  return api.get(url, { headers: getAuthHeaders() });
};

export const createArtist = async (artistData) => {
  return api.post(API_BASE, artistData, { headers: getAuthHeaders() });
};

export const updateArtist = async (artistId, artistData) => {
  return api.put(`${API_BASE}/${artistId}`, artistData, { headers: getAuthHeaders() });
};

// Export all artist functions as default object for convenience
export default {
  getArtistById,
  getArtists,
  createArtist,
  updateArtist,
};


















