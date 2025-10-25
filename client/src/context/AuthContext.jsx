import React, { createContext, useState, useEffect } from 'react';

// Define the shape of the Context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {}, // Defined in useAuth, placeholder here
  logout: () => {}, // Defined in useAuth, placeholder here
  setError: () => {},
  saveAuthData: () => {}, // Helper to update context state
});

/**
 * Provides the authentication context to the entire application.
 * Note: Actual logic (API calls) is implemented in useAuth.js.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial check when the app loads
  useEffect(() => {
    // FIX 1: Use the standardized token key 'accessToken'
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      // Try to load user from local storage; otherwise, set a basic structure
      try {
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Placeholder/minimal user data if only token exists
            setUser({ id: 'guest', name: 'Authenticated User', role: 'User' });
        }
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        // Clear corrupt data
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    
    // Auth check complete
    setLoading(false); 
    
    // NOTE: For production, you should make a server call here (/auth/me) 
    // to validate the token and get fresh user data.
  }, []); // Run only once on mount

  // Helper function used by useAuth after successful API interaction
  const saveAuthData = (token, userData) => {
    // FIX 2: Use the standardized token key 'accessToken'
    localStorage.setItem('accessToken', token); 
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  };

  // Local client-side logout (full server logout handled in useAuth/authService)
  const clientLogout = () => {
    // FIX 3: Use the standardized token key 'accessToken'
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };
  
  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    setError,
    saveAuthData,
    // The actual login/logout logic placeholders point to the clientLogout function 
    // for immediate state clearing, but the true login/logout should come from useAuth.
    // We pass clientLogout as a default safe function.
    login: saveAuthData, // Placeholder for useAuth to override
    logout: clientLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
