import { useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/apiClient';

/**
 * Custom hook to manage all authentication-related actions and state.
 * Assumes authService handles API calls to /api/auth/login, /api/auth/register, etc.
 */
const useAuth = () => {
  // Use a global context for state if available, otherwise mock the core state
  const context = useContext(AuthContext);
  
  // Use internal state if context is not fully implemented yet
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to save token and user data upon successful authentication
  const saveAuthData = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
  }, []);

  // Use useEffect to check token on mount
  useEffect(() => {
    // In a production app, you'd call an endpoint like /api/auth/me here
    // to validate the token and fetch fresh user data.
    if (isAuthenticated && !user) {
        // Mock user data if token exists but user state is empty
        setUser({ name: 'Authenticated User', email: 'user@careerloop.com' });
    }
  }, [isAuthenticated, user]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // Use authService (which uses apiClient) to communicate with server/routes/authRoutes.js
      // NOTE: Assuming the response contains { token: 'jwt-token', user: { ... } }
      const response = await apiClient.post('/auth/login', credentials);
      saveAuthData(response.token, response.user);
      return response.user;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveAuthData]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    // Optionally call apiClient.post('/auth/logout') to invalidate server session
    setError(null);
  }, []);

  // If AuthContext is defined, return the context value. Otherwise, return local state/functions.
  if (context) {
      return context;
  }

  return { user, isAuthenticated, loading, error, login, logout, saveAuthData, setError };
};

export default useAuth;