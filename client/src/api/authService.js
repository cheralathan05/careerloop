// client/src/api/authService.js

import axios from 'axios';

// ⚠️ Security Note:
// If using HttpOnly cookies, storing the token in localStorage is optional.
// Recommended: rely on cookies for session management.

// --- ⚙️ CONFIGURATION ---

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

const authAPI = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // required for cookies
});

// --- 🛑 CENTRALIZED ERROR HANDLER ---
const handleApiError = (error, defaultMessage = 'An unknown error occurred.') => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  console.error('API Error:', errorMessage, error);
  throw new Error(errorMessage);
};

// --- 🧩 AUTH FUNCTIONS ---

// SIGNUP
export const signup = async (data) => {
  try {
    const res = await authAPI.post('/signup', data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Signup failed. Please check your credentials.');
  }
};

// SEND OTP
export const sendOtp = async (data) => {
  try {
    const res = await authAPI.post('/send-otp', data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Failed to send OTP. Please check the email.');
  }
};

// VERIFY OTP
export const verifyOtp = async (data) => {
  try {
    const res = await authAPI.post('/verify-otp', data);
    // Save token if returned
    if (res.data?.token) localStorage.setItem('userToken', res.data.token);
    return res.data;
  } catch (err) {
    handleApiError(err, 'OTP verification failed. The code may be invalid or expired.');
  }
};

// LOGIN
export const login = async (credentials) => {
  try {
    const res = await authAPI.post('/login', credentials);
    if (res.data?.token) localStorage.setItem('userToken', res.data.token);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Login failed. Invalid email or password.');
  }
};

// LOGOUT
export const logout = async () => {
  try {
    localStorage.removeItem('userToken');
    await authAPI.post('/logout'); // Clear server session/cookie
    return { success: true, message: 'Logged out successfully' };
  } catch (err) {
    console.warn('Server logout failed, client cleared state:', err.message);
    return { success: false, message: 'Logout completed locally, but server session may remain.' };
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  try {
    const res = await authAPI.post('/forgot-password', data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Failed to send password reset link.');
  }
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  try {
    const res = await authAPI.post('/reset-password', data);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Password reset failed. The link may be invalid or expired.');
  }
};

// GOOGLE LOGIN (redirect)
export const googleLogin = () => {
  window.location.href = `${BASE_URL}/api/auth/google`;
};

// --- EXPORT DEFAULT ---
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
