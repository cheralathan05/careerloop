// client/src/components/layout/Navbar.jsx

import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // 🚨 NEW: Added motion for animations
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';


const Navbar = () => {
  const { isAuthenticated, user, logout, refreshAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Handle Google OAuth token after redirect ---
  const handleOAuthRedirect = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 1️⃣ Save token and immediately refresh context
      localStorage.setItem('userToken', token);
      
      if (refreshAuth) {
          refreshAuth();
      }

      // 2️⃣ Clean URL: Removes the exposed token from the URL history
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname, refreshAuth]);
  
  
  useEffect(() => {
      handleOAuthRedirect();
  }, [handleOAuthRedirect]);


  // --- RENDERING ---
  return (
    <motion.nav 
      className="bg-gray-900 border-b border-blue-800 shadow-xl shadow-cyan-900/10 sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand: Neo-Futuristic Gradient */}
        <Link to="/" className="text-3xl font-black tracking-wider">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            CareerLoop.AI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Profile Greeting */}
              <Link 
                to="/dashboard" 
                className="text-gray-400 hover:text-cyan-400 font-semibold transition-colors duration-200 text-lg"
              >
                <span className="text-purple-400 mr-1">Console Access:</span> {user?.name || user?.email?.split('@')[0] || 'User'}
              </Link>
              
              {/* Logout Button: Emergency Red (High Contrast) */}
              <Button
                onClick={logout}
                className="bg-red-700 hover:bg-red-800 text-white font-medium px-4 py-2 rounded-lg 
                          border border-red-600 shadow-md shadow-red-900/50" 
              >
                Terminate Session
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Login Link */}
              <Link
                to="/login"
                className="text-gray-400 hover:text-cyan-400 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              
              {/* Sign Up Button (Primary Action - Gradient) */}
              <Link to="/signup">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 
                              text-white font-semibold px-4 py-2 rounded-lg shadow-md shadow-purple-500/30"
                >
                  Initialize User
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;