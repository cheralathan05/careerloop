// client/src/api/authService.js
import axios from "axios";

// --- ⚙️ CONFIGURATION ---

// Uses .env variable; falls back to localhost if not set
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;

// Axios instance
const authAPI = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // required for cookies (CORS)
});

// --- 🛡️ Attach Token Automatically ---
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 🧩 Centralized Error Handler ---
const handleApiError = (error, defaultMessage = "An unknown error occurred.") => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  console.error("API Error:", errorMessage);
  throw new Error(errorMessage);
};

// --- 🔐 AUTH FUNCTIONS ---

// SIGNUP
export const signup = async (data) => {
  try {
    const res = await authAPI.post("/signup", data);
    return res.data;
  } catch (err) {
    handleApiError(err, "Signup failed. Please check your details.");
  }
};

// SEND OTP
export const sendOtp = async (data) => {
  try {
    const res = await authAPI.post("/send-otp", data);
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to send OTP. Please verify your email.");
  }
};

// VERIFY OTP
export const verifyOtp = async (data) => {
  try {
    const res = await authAPI.post("/verify-otp", data);
    if (res.data?.token) localStorage.setItem("userToken", res.data.token);
    return res.data;
  } catch (err) {
    handleApiError(err, "OTP verification failed. Code may be invalid or expired.");
  }
};

// LOGIN
export const login = async (credentials) => {
  try {
    const res = await authAPI.post("/login", credentials);
    if (res.data?.token) localStorage.setItem("userToken", res.data.token);
    return res.data;
  } catch (err) {
    handleApiError(err, "Login failed. Invalid email or password.");
  }
};

// LOGOUT
export const logout = async () => {
  try {
    await authAPI.post("/logout");
    localStorage.removeItem("userToken");
    return { success: true, message: "Logged out successfully." };
  } catch (err) {
    console.warn("Server logout failed, client state cleared:", err.message);
    localStorage.removeItem("userToken");
    return { success: false, message: "Logged out locally; server session may persist." };
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  try {
    const res = await authAPI.post("/forgot-password", data);
    return res.data;
  } catch (err) {
    handleApiError(err, "Failed to send password reset link.");
  }
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  try {
    const res = await authAPI.post("/reset-password", data);
    return res.data;
  } catch (err) {
    handleApiError(err, "Password reset failed. Link may be invalid or expired.");
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
