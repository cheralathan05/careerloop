// src/hooks/useAuth.jsx (FINAL, SECURE VERSION)

import { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
// Assuming authService contains: login(credentials), register(data), logout() (POST /auth/logout)
import authService from '../api/authService'; 
import { showToast } from '../utils/toastNotifications';

/**
 * Custom hook to manage all authentication-related actions and state.
 * This hook connects the API service layer (authService) to the global state (AuthContext).
 */
const useAuth = () => {
    // CRITICAL: The consumer must always rely on the context for state
    const context = useContext(AuthContext);

    // --- Core Logic Functions (APIs) ---

    // Login (Phase 2)
    const login = useCallback(async (credentials) => {
        context.setLoading(true); // Assuming context provides setLoading
        context.setError(null);
        try {
            // CRITICAL FIX: The backend sets the HTTP-only cookie.
            // This API call just sends credentials and receives user data + sets the cookie.
            const response = await authService.login(credentials); 
            
            // Phase 6: Run the full status check to update global state based on the new cookie
            const authResult = await context.checkAuthStatus();
            
            if (authResult.success) {
                // The context's saveAuthData is called internally by checkAuthStatus 
                // OR it can be called here directly with the user data:
                // context.saveAuthData(response.data); 
                showToast('Login successful!', 'success');
                return authResult.user; 
            } else {
                throw new Error('Server validation failed after successful login call.');
            }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed.';
            context.setError(msg);
            showToast(msg, 'error');
            throw err;
        } finally {
            context.setLoading(false);
        }
    }, [context]);

    // Logout (Phase 6)
    const logout = useCallback(async () => {
        context.setLoading(true);
        try {
            // CRITICAL FIX: Call the server-side logout function (POST /auth/logout)
            // The backend clears the HTTP-only cookie here.
            await authService.logout(); 
            showToast('Logged out successfully.', 'info');
        } catch (err) {
            // We ignore server-side errors on logout and prioritize client state reset
            console.warn("Logout server call failed (session may already be cleared):", err.message);
        } finally {
            // CRITICAL FIX: Clear client state (user=null, isAuthenticated=false)
            context.logout(); 
            context.setLoading(false);
        }
    }, [context]);
    
    // --- Hook Return Value ---

    // CRITICAL FIX: The hook should only return the context value, 
    // overriding the login/logout placeholders with the real logic.
    if (!context) {
        // This should not happen if App.jsx is structured correctly
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return { 
        ...context, // user, isAuthenticated, loading, checkAuthStatus, saveAuthData, setError
        login,      // Override login placeholder
        logout,     // Override logout placeholder
        // Note: register, forgotPassword, etc., should be added here
        register: authService.register,
        forgotPassword: authService.forgotPassword,
        resetPassword: authService.resetPassword,
        sendOtp: authService.sendOtp,
        verifyOtp: authService.verifyOtp,
    };
};

export default useAuth;