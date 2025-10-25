import axios from "axios";

// --- ⚙️ CONFIGURATION ---

// Use the standardized VITE_API_BASE_URL (which includes /api)
// Fallback is also updated to include /api for consistency.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// All Auth endpoints will be relative to /auth
const API_URL = `${API_BASE}/auth`; 

// Axios instance
const authAPI = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // required for cookies (CORS)
});

// --- 🛡️ Attach Token Automatically (Interceptor) ---
authAPI.interceptors.request.use((config) => {
  // Use 'accessToken' as a more industry-standard key than 'userToken'
  const token = localStorage.getItem("accessToken"); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 🧩 Centralized Error Handler (Enhanced) ---
const handleApiError = (error, defaultMessage = "An unknown error occurred.") => {
  // Extract specific message from backend response or fall back to generic message
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  console.error("Auth API Error:", errorMessage, error); // Log the full error object for debugging
  
  // Throw the error so the calling function (e.g., inside a hook/context) can catch it
  // We throw a more specific Error instance for easier differentiation, but a standard Error works too.
  throw new Error(errorMessage);
};

// --- 🔐 AUTH FUNCTIONS ---

// SIGNUP
export const signup = async (data) => {
  try {
    const res = await authAPI.post("/signup", data);
    return res.data;
  } catch (err) {
    // Re-throw the handled error
    throw handleApiError(err, "Signup failed. Please check your details.");
  }
};

// SEND OTP
export const sendOtp = async (data) => {
  try {
    const res = await authAPI.post("/send-otp", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to send OTP. Please verify your email.");
  }
};

// VERIFY OTP
export const verifyOtp = async (data) => {
  try {
    const res = await authAPI.post("/verify-otp", data);
    // Use the standardized key 'accessToken'
    if (res.data?.token) localStorage.setItem("accessToken", res.data.token); 
    return res.data;
  } catch (err) {
    throw handleApiError(err, "OTP verification failed. Code may be invalid or expired.");
  }
};

// LOGIN
export const login = async (credentials) => {
  try {
    const res = await authAPI.post("/login", credentials);
    // Use the standardized key 'accessToken'
    if (res.data?.token) localStorage.setItem("accessToken", res.data.token); 
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Login failed. Invalid email or password.");
  }
};

// LOGOUT
export const logout = async () => {
  try {
    // Attempt server-side logout first
    await authAPI.post("/logout"); 
    localStorage.removeItem("accessToken"); // Clear client token
    return { success: true, message: "Logged out successfully." };
  } catch (err) {
    // If server logout fails (e.g., token expired, server down), log a warning and clear client state anyway
    console.warn("Server logout failed, clearing client state:", err.message);
    localStorage.removeItem("accessToken");
    return { success: true, message: "Logged out locally." }; // We return true to proceed with UI change
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (data) => {
  try {
    const res = await authAPI.post("/forgot-password", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to send password reset link.");
  }
};

// RESET PASSWORD
export const resetPassword = async (data) => {
  try {
    const res = await authAPI.post("/reset-password", data);
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Password reset failed. Link may be invalid or expired.");
  }
};

// GOOGLE LOGIN (redirect)
export const googleLogin = () => {
  // Use the correct API_BASE path for the redirect
  window.location.href = `${API_BASE}/auth/google`;
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

