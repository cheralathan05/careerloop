// client/src/hooks/useAuth.js

import { useAuth as contextUseAuth } from '../context/AuthContext';

/**
 * Custom hook to access authentication state and methods.
 * Must be used within an <AuthProvider>.
 * Provides type-safe access to AuthContext data.
 */
const useAuth = () => {
  // Use the context-specific hook to retrieve the value
  const context = contextUseAuth();

  // 🚨 CRITICAL Safety Check (Already correctly implemented)
  if (!context) {
    // This provides a clear, actionable error message if the hook is used incorrectly
    throw new Error('The useAuth hook must be used within an AuthProvider. Please wrap your application entry point with <AuthProvider>.');
  }

  // Return the context value (which includes user, isAuthenticated, login, logout, etc.)
  return context;
};

export default useAuth;