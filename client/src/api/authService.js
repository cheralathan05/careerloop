import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const signup = (name, email, password) => {
    return axios.post(`${API_URL}/signup`, { name, email, password });
};

const verifyOtp = (userId, otp) => {
    return axios.post(`${API_URL}/verify-otp`, { userId, otp });
};

const login = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

const forgotPassword = (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

const resetPassword = (token, password) => {
    return axios.post(`${API_URL}/reset-password/${token}`, { password });
};


const authService = {
    signup,
    verifyOtp,
    login,
    forgotPassword,
    resetPassword,
};

export default authService;