import axios from 'axios';
import { showToast } from '../utils/toastNotifications';

// Use environment variable for the API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Inject JWT token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
    response => {
        // Server's response should contain { success: true, data: ... }
        return response.data;
    },
    error => {
        const status = error.response ? error.response.status : null;
        const serverMessage = error.response?.data?.message;
        const message = serverMessage || error.message;

        if (status === 401 || status === 403) {
            // Force logout on session expiration/invalid token
            showToast('Session expired. Please log in again.', 'error');
            localStorage.removeItem('token');
            // NOTE: Global state should detect the token removal and redirect to /login
        }
        
        // Show the specific API error to the user
        showToast(message, 'error');
        
        return Promise.reject(error.response?.data || { message: 'Network error' });
    }
);

export default apiClient;