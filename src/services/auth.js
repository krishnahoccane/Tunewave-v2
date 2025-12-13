import api from "../config/api";

const API_BASE = "/api/auth";

export const checkEmail = (email) =>
  api.get(`${API_BASE}/check-email`, {
    params: { email },
  });

export const login = ({ email, password }) =>
  api.post(`${API_BASE}/login`, { email, password });

export const verifyToken = (token) =>
  api.get(`${API_BASE}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserEntities = () => {
  const token = localStorage.getItem("jwtToken");
  return api.get("/api/users/entities", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const forgetPassword = ({ email }) =>
  api.post(`${API_BASE}/forgetpassword`, { email });

export const resendOtp = ({ email, key }) =>
  api.post(`${API_BASE}/forgetpassword/resendcode`, { email, key });

export const validateOtp = ({ email, code, key }) =>
  api.post(`${API_BASE}/forgetpassword/codevalidate`, { email, code, key });

export const resetPassword = ({
  email,
  newPassword,
  confirmPassword,
  key,
}) =>
  api.post(`${API_BASE}/forgetpassword/password`, {
    email,
    newPassword,
    confirmPassword,
    key,
  });
