import axios from "axios";

/**
 * Auth Service
 * Centralized authentication API calls
 * All endpoints match Swagger specification at /swagger/index.html
 */

const API_BASE = "/api/auth";

/**
 * Check if email exists in the system
 * @param {string} email - Email address to check
 * @returns {Promise<Object>} Response data with exists, display_name fields
 */
export const checkEmail = async (email) => {
  const response = await axios.get(`${API_BASE}/check-email`, {
    params: { email },
  });
  return response.data;
};

/**
 * Login user with email and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response data with token, fullName, role fields
 */
export const login = async ({ email, password }) => {
  const response = await axios.post(
    `${API_BASE}/login`,
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

/**
 * Verify JWT token validity
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} Response data with message and user info
 */
export const verifyToken = async (token) => {
  const response = await axios.get(`${API_BASE}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Initiate password reset flow - sends OTP to email
 * @param {Object} data - Password reset request data
 * @param {string} data.email - User email address
 * @returns {Promise<Object>} Response data with key, success, message, next_resend_wait_seconds
 */
export const forgetPassword = async ({ email }) => {
  const response = await axios.post(
    `${API_BASE}/forgetpassword`,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Resend OTP code for password reset
 * @param {Object} data - Resend OTP request data
 * @param {string} data.email - User email address
 * @param {string} data.key - Reset key from forgetPassword response
 * @returns {Promise<Object>} Response data with key, success, message, next_resend_wait_seconds
 */
export const resendOtp = async ({ email, key }) => {
  const response = await axios.post(
    `${API_BASE}/forgetpassword/resendcode`,
    { email, key },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Validate OTP code for password reset
 * @param {Object} data - OTP validation request data
 * @param {string} data.email - User email address
 * @param {string} data.code - OTP code entered by user
 * @param {string} data.key - Reset key from forgetPassword response
 * @returns {Promise<Object>} Response data with key, success, message
 */
export const validateOtp = async ({ email, code, key }) => {
  const response = await axios.post(
    `${API_BASE}/forgetpassword/codevalidate`,
    { email, code, key },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Reset password with new password
 * @param {Object} data - Password reset request data
 * @param {string} data.email - User email address
 * @param {string} data.newPassword - New password (min 8 characters)
 * @param {string} data.confirmPassword - Confirm new password (min 8 characters)
 * @param {string} data.key - Reset key from validateOtp response
 * @returns {Promise<Object>} Response data with success, message
 */
export const resetPassword = async ({
  email,
  newPassword,
  confirmPassword,
  key,
}) => {
  const response = await axios.post(
    `${API_BASE}/forgetpassword/password`,
    { email, newPassword, confirmPassword, key },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Export all auth functions as default object for convenience
export default {
  checkEmail,
  login,
  verifyToken,
  forgetPassword,
  resendOtp,
  validateOtp,
  resetPassword,
};

