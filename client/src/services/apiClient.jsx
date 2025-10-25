import axios from 'axios';
// This assumes you have a utility file at this path. We'll verify this later.
import { showToast } from '../utils/toastNotifications'; 

// --- ⚙️ CONFIGURATION ---

// Use environment variable for the API base URL (standardized in .env.local)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Optional: Include credentials for session cookies if used alongside token
    // withCredentials: true,
});

// --- 🛡️ Request Interceptor: Inject JWT token ---
apiClient.interceptors.request.use(config => {
    // FIX: Changed 'token' to 'accessToken' for consistency with authService.js
    const token = localStorage.getItem('accessToken'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// --- 🚨 Response Interceptor: Handle Global Errors (401, 403) ---
apiClient.interceptors.response.use(
    response => {
        // Return only the data payload for cleaner service calls
        return response.data;
    },
    error => {
        const status = error.response ? error.response.status : null;
        const serverMessage = error.response?.data?.message;
        const message = serverMessage || error.message;

        if (status === 401 || status === 403) {
            // Force client-side logout on session expiration/invalid token
            showToast('Session expired. Please log in again.', 'error');
            
            // FIX: Changed 'token' to 'accessToken' for consistency
            localStorage.removeItem('accessToken'); 
            
            // Optional: Redirect to login page immediately (better handled in AuthContext/Router)
            // window.location.href = '/login'; 
        }
        
        // Show the specific API error to the user if it's not a 401/403 (or if the status isn't handled)
        if (status !== 401 && status !== 403) {
             showToast(message, 'error');
        } else if (status === 401 || status === 403) {
            // Suppress the redundant error toast if we already showed the "Session expired" message
        }

        // Reject with the error data from the server or a generic message
        return Promise.reject(error.response?.data || { message: 'Network error' });
    }
);

export default apiClient;
