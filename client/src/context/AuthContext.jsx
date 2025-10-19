// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../api/authService';
import { jwtDecode } from 'jwt-decode'; // 🚨 NEW: Ensure correct modern import for jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to clear local storage and state
  const clearAuth = useCallback(() => {
    localStorage.removeItem('userToken');
    setUser(null);
    setIsLoading(false);
  }, []);

  // --- Load user from token (Security Check Added) ---
  const loadUserFromToken = useCallback(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      clearAuth();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      
      // 🚨 ENHANCEMENT: JWT Expiry Check
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decoded.exp < currentTime) {
        console.warn('Token expired. Clearing authentication.');
        clearAuth();
        return;
      }
      
      // If token is valid and not expired, set the user state
      setUser({
        _id: decoded.id,
        token,
        name: decoded.name || decoded.userName || 'User', // Robust name fallback
        email: decoded.email,
      });

    } catch (err) {
      console.warn('Token is invalid or corrupted. Clearing authentication.', err);
      clearAuth();
    }
    
    // Set loading false after processing token
    setIsLoading(false); 
  }, [clearAuth]);

  // Initial load
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  // --- Login ---
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // 1. Call service (which stores the token in localStorage)
      const data = await authService.login(credentials);
      
      // 🚨 ENHANCEMENT: Instead of manually setting state, 
      // rely on the loadUserFromToken function to read the newly saved token.
      // This centralizes state logic and ensures consistency with the expiry check.
      loadUserFromToken(); 
      
      return data;
    } catch (err) {
      // Ensure the token is cleared if the service somehow left a bad one
      clearAuth(); 
      throw err; // Re-throw the error for the component to handle
    } finally {
        setIsLoading(false);
    }
  };

  // --- Logout ---
  const logout = async () => {
    // 🚨 ENHANCEMENT: Call the server's logout endpoint (to clear HttpOnly cookies/sessions)
    try {
        await authService.logout();
    } catch (e) {
        // Log warning, but still clear client-side state
        console.warn('Server-side logout failed, clearing client state anyway.', e);
    }
    clearAuth();
  };

  // --- Utility Functions (Correctly delegated) ---
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    // Provide a stable function reference for refreshing token/state (used in Navbar for OAuth)
    refreshAuth: loadUserFromToken, 
    
    // Direct delegation of other auth functions (highly efficient)
    signup: authService.signup,
    sendOtp: authService.sendOtp,
    verifyOtp: authService.verifyOtp,
    forgotPassword: authService.forgotPassword,
    resetPassword: authService.resetPassword,
    googleLogin: authService.googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Custom Hook ---
export const useAuth = () => useContext(AuthContext);