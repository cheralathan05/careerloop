// client/src/api/authService.js

import axios from 'axios';

// Set the base URL for the backend API
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/auth';

// --- General API Utility ---
const authAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Auth Functions ---

/**
 * Handles user sign up.
 * @param {object} userData - { name, email, password }
 */
const signup = async (userData) => {
    const response = await authAPI.post('/signup', userData);
    // On successful signup, the backend usually returns a user object and a token
    return response.data;
};

/**
 * Handles user login.
 * @param {object} credentials - { email, password }
 */
const login = async (credentials) => {
    const response = await authAPI.post('/login', credentials);
    // Store token in localStorage or secure cookie upon successful login
    if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
    }
    return response.data;
};

/**
 * Sends OTP for verification (e.g., after signup or for password reset).
 * @param {object} data - { email }
 */
const sendOtp = async (data) => {
    const response = await authAPI.post('/send-otp', data);
    return response.data;
};

/**
 * Verifies the OTP.
 * @param {object} data - { email, otp }
 */
const verifyOtp = async (data) => {
    const response = await authAPI.post('/verify-otp', data);
    // Can update stored token/user data if this is the final step
    return response.data;
};

/**
 * Logs out the user by removing the token.
 */
const logout = () => {
    localStorage.removeItem('userToken');
    // Optional: Make a backend call to invalidate session/token if necessary
};


const authService = {
    signup,
    login,
    sendOtp,
    verifyOtp,
    logout,
    // Add functions for googleLogin, forgotPassword, resetPassword, etc.
};

export default authService;