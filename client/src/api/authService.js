// client/src/api/authService.js
import axios from 'axios';

// ✅ Base URL for your backend auth routes
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/auth';

const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed for Google OAuth and secure cookies
});

// --- 🧩 AUTH FUNCTIONS ---

/**
 * SIGNUP — creates a new user
 * Expects: { name, email, password }
 * Returns: user object at root (with _id, email, etc.)
 */
const signup = async (data) => {
  const response = await authAPI.post('/signup', data);
  return response.data;
};

/**
 * Send OTP for signup verification (optional if backend auto-sends OTP)
 * Expects: { email }
 */
const sendOtp = async (data) => {
  const response = await authAPI.post('/send-otp', data);
  return response.data;
};

/**
 * Verify OTP and activate user account
 * Expects: { userId, otp }
 * Returns: { token, user }
 */
const verifyOtp = async (data) => {
  const response = await authAPI.post('/verify-otp', data);
  return response.data;
};

/**
 * LOGIN — authenticate user
 * Expects: { email, password }
 * Returns: { token, user }
 */
const login = async (credentials) => {
  const response = await authAPI.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

/**
 * Forgot password — send reset link
 * Expects: { email }
 */
const forgotPassword = async (data) => {
  const response = await authAPI.post('/forgot-password', data);
  return response.data;
};

/**
 * Reset password — using token from email
 * Expects: { token, password }
 */
const resetPassword = async (data) => {
  const response = await authAPI.post('/reset-password', data);
  return response.data;
};

/**
 * Logout — clears token locally
 */
const logout = () => {
  localStorage.removeItem('userToken');
};

/**
 * Google Login — redirect to backend for OAuth
 */
const googleLogin = () => {
  window.location.href = `${API_URL}/google`;
};

export default {
  signup,
  sendOtp,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
};
