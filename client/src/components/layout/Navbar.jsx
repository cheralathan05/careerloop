// client/src/components/layout/Navbar.jsx

import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
// 🚨 NEW: Import useNavigate to force navigation if needed
import { useNavigate } from 'react-router-dom'; 


const Navbar = () => {
  // Use a stable reference for context functions if possible
  const { isAuthenticated, user, logout, refreshAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Handle Google OAuth token after redirect ---
  // Memoize the handler to ensure stability
  const handleOAuthRedirect = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 1️⃣ Save token in localStorage (Your server should ideally use HttpOnly cookies)
      localStorage.setItem('userToken', token);
      
      // 2️⃣ Refresh AuthContext to pick up new token and fetch user profile
      // We check for the function's existence just in case, though it should be provided by AuthContext
      if (refreshAuth) {
          refreshAuth();
      }

      // 3️⃣ Clean URL: Use navigate with replace: true for cleaner history state
      // This is generally better than window.history.replaceState in React Router apps.
      navigate(location.pathname, { replace: true });
      
      // 🚨 Optional: If the user wasn't already on the dashboard, navigate them there.
      // if (location.pathname !== '/dashboard') {
      //     navigate('/dashboard', { replace: true });
      // }
    }
    // Only re-run the effect if location.search or navigate changes
  }, [location.search, navigate, location.pathname, refreshAuth]);
  
  
  useEffect(() => {
      handleOAuthRedirect();
  }, [handleOAuthRedirect]);


  // --- RENDERING ---
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-wider">
          AuthFlow
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Profile Greeting */}
              <Link 
                to="/profile" 
                className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors duration-150"
              >
                Hello, {user?.name || user?.email?.split('@')[0] || 'User'}
              </Link>
              
              {/* Logout Button */}
              <Button
                onClick={logout}
                // Use the power of the enhanced Button component styles
                className="bg-red-600 hover:bg-red-700" 
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login Link */}
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium transition-colors duration-150"
              >
                Login
              </Link>
              
              {/* Sign Up Button (Primary Action) */}
              <Link to="/signup">
                <Button 
                  // Default Button styles are fine, no need to restate full classes
                  className="px-4 py-2"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;