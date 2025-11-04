// src/utils/axiosInstance.js

import axios from 'axios';

// --- Configuration ---
// CRITICAL: The base URL must match your running backend server's URL.
// We use the full API prefix '/api' here to streamline future controller calls.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'; 
// NOTE: VITE_API_BASE_URL should be defined in your client's .env file (e.g., VITE_API_BASE_URL=http://localhost:5000/api)


// --- Create the Axios Instance ---
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Timeout requests after 10 seconds
    
    // CRITICAL FIX: This tells the browser to include cookies 
    // (including the secure 'jwt' cookie) with every request.
    withCredentials: true, 
    
    headers: {
        'Content-Type': 'application/json',
    }
});


// --- Optional: Interceptor for Centralized Error Handling ---
// This is useful for automatically logging out the user if any request fails with a 401.
axiosInstance.interceptors.response.use(
    (response) => {
        // Successful response, pass it through
        return response;
    },
    (error) => {
        // Handle global 401/403 errors (Phase 6: Auth Validation Failure)
        if (error.response && error.response.status === 401) {
            console.error('Interceptor: Received 401 Unauthorized. Session likely expired.');
            
            // NOTE: You should dispatch a logout action here if the AuthContext/hook 
            // is not already handling the state change on failed /auth/profile checks.
            // For now, we rely on the calling component/AuthContext to handle the state.
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;