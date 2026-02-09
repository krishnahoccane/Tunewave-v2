import api from "../config/api";

/**
 * Get current user profile from API
 * GET /api/users/me
 * @returns {Promise<Object>} User profile (userID, fullName, email, mobile, countryCode, gender, dateOfBirth, role, status)
 */
export const getMe = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Authentication required");
  const response = await api.get("/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

/**
 * Update user profile
 * POST /api/users/update-profile
 * Send all fields; API marks fields as null when values are omitted.
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.mobile - combined countryCode + number (e.g. 919912399123)
 * @param {string} payload.gender
 * @param {string} payload.dateOfBirth - ISO date YYYY-MM-DDT00:00:00.000Z or empty string
 */
export const updateProfile = async (payload) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Authentication required");
  const response = await api.post("/api/users/update-profile", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

/**
 * Change user password
 * POST /api/users/change-password
 * @param {Object} payload
 * @param {string} payload.oldPassword
 * @param {string} payload.newPassword
 * @param {string} payload.confirmPassword
 */
export const changePassword = async (payload) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Authentication required");
  const response = await api.post("/api/users/change-password", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};
