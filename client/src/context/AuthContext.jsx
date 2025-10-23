import React, { createContext, useState, useEffect } from 'react';
// import apiClient from '../services/apiClient'; // Used in useAuth, not here

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  setError: () => {},
  saveAuthData: () => {},
});

/**
 * Provides the authentication context to the entire application.
 * Note: The actual logic (login/logout) is usually implemented in useAuth.js
 * to keep this file clean.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial check when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd validate the token against the server here
      setIsAuthenticated(true);
      // Mock user data until /auth/me call is implemented
      setUser({ name: 'Placeholder', role: 'User' });
    }
    setLoading(false);
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    // These functions are typically defined in useAuth, but passed via context here
    login: () => console.warn("Login function must be implemented in useAuth and passed here."),
    logout: () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    },
    setError,
    saveAuthData: (token, userData) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// You would wrap your main.jsx <App /> component with <AuthProvider>