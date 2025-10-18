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

// ✅ SIGNUP — creates user (but not verified yet)
const signup = async (data) => {
  const response = await authAPI.post('/signup', data);
  return response.data;
};

// ✅ Send OTP for signup verification
const sendOtp = async (data) => {
  const response = await authAPI.post('/send-otp', data);
  return response.data;
};

// ✅ Verify OTP and activate user
const verifyOtp = async (data) => {
  const response = await authAPI.post('/verify-otp', data);
  return response.data;
};

// ✅ Login user
const login = async (credentials) => {
  const response = await authAPI.post('/login', credentials);
  if (response.data.token) {
    localStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

// ✅ Forgot password (send reset link)
const forgotPassword = async (data) => {
  const response = await authAPI.post('/forgot-password', data);
  return response.data;
};

// ✅ Reset password (using token)
const resetPassword = async (data) => {
  const response = await authAPI.post('/reset-password', data);
  return response.data;
};

// ✅ Logout
const logout = () => {
  localStorage.removeItem('userToken');
};

// ✅ Google Login (redirect) — only for Login page
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
