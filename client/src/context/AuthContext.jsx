// src/context/AuthContext.jsx (FINAL, SECURE VERSION)

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance.js'; // Assuming you have an Axios instance configured for cookie sending

// Define the shape of the Context
export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    loading: true,
    checkAuthStatus: async () => {}, // New function to validate token/cookie (Phase 6)
    login: async () => {},           // Actual login logic (will be implemented in useAuth)
    logout: async () => {},          // Actual logout logic (will be implemented in useAuth)
    setError: () => {},
    saveAuthData: () => {},          // Helper to update context state after successful backend call
});

/**
 * Provides the authentication context to the entire application.
 */
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Phase 6 Logic: Backend Call to Validate Cookie ---
    const checkAuthStatus = useCallback(async () => {
        try {
            // CRITICAL: Call the protected route. If the browser sends the valid 
            // HTTP-only 'jwt' cookie, the backend will return the user profile.
            const response = await axiosInstance.get('/auth/profile'); 
            
            if (response.status === 200 && response.data) {
                const userData = response.data;
                // Update state based on fresh data from the server
                setIsAuthenticated(true);
                setUser(userData);
                // The backend ensures 'onboardingComplete' status is returned here, 
                // critical for client-side routing.
                return { success: true, user: userData };
            }
        } catch (err) {
            // Catches 401 Unauthorized (invalid/expired cookie)
            console.log("Auth check failed or cookie expired. User is logged out.");
            // We don't need to manually clear the cookie; the backend/browser handles it.
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
        return { success: false };
    }, []);

    // --- Initial check when the app loads (Phase 0) ---
    useEffect(() => {
        // Run the validation check immediately
        checkAuthStatus();
        
        // NOTE: The actual login/logout/setError functions will be passed 
        // to the context value but their implementation is typically handled 
        // in the `useAuth` hook which is not yet provided.
    }, [checkAuthStatus]); 

    // Helper function used after a successful login/signup/reset 
    // (backend just set the cookie, now update client state)
    const saveAuthData = (userData) => {
        // Since the token is in the cookie, we only save the user data to state.
        setIsAuthenticated(true);
        setUser(userData);
        setError(null);
        // Optional: save minimal user data to localStorage if needed for display while loading
        // localStorage.setItem('user', JSON.stringify(userData)); 
    };

    // Local client-side logout helper
    const clientLogout = () => {
        // Note: The actual API call to clear the server-side session/cookie 
        // must be done in the hook (useAuth)
        setIsAuthenticated(false);
        setUser(null);
        // Optionally clear localStorage user data if it was used for caching
        localStorage.removeItem('user'); 
        setError(null);
    };
    
    const value = {
        isAuthenticated,
        user,
        loading,
        error,
        setError,
        checkAuthStatus, // Export for use in the main App logic/redirects
        saveAuthData, 
        login: async () => {}, // Placeholder for useAuth to implement
        logout: clientLogout, // Placeholder for useAuth to implement the API call
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};