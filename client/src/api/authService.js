import axios from 'axios';

// Base URL pointing to backend auth routes
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/auth';

const authAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for cookies / OAuth
});

// --- Auth Functions ---
const signup = async (userData) => {
    const response = await authAPI.post('/signup', userData);
    return response.data;
};

const login = async (credentials) => {
    const response = await authAPI.post('/login', credentials);
    if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('userToken');
};

const sendOtp = async (data) => {
    const response = await authAPI.post('/send-otp', data);
    return response.data;
};

const verifyOtp = async (data) => {
    const response = await authAPI.post('/verify-otp', data);
    return response.data;
};

const forgotPassword = async (data) => {
    const response = await authAPI.post('/forgot-password', data);
    return response.data;
};

const resetPassword = async (data) => {
    const response = await authAPI.post('/reset-password', data);
    return response.data;
};

// Google OAuth: frontend simply redirects to backend route
const googleLogin = () => {
    window.location.href = `${API_URL}/google`;
};

export default {
    signup,
    login,
    logout,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
    googleLogin,
};
