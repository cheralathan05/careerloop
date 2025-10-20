// client/src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, duration: 0.8 }
  }
};

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/auth/reset-password'; // Define API URL

  // 🔑 Extract token from URL or sessionStorage
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token');
    const storedToken = sessionStorage.getItem('resetToken');

    if (urlToken) {
      setToken(urlToken);
      sessionStorage.setItem('resetToken', urlToken); // persist token
    } else if (storedToken) {
      setToken(storedToken);
    } else {
      setError('Invalid or missing token. Please request a new access link.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Cannot submit: Token is missing.');
      return;
    }
    if (password.length < 8) {
      setError('New password requires minimum 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Input mismatch: Passwords do not align.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(API_URL, { token, newPassword: password });

      setMessage(data.message || 'Password reset successful. Access credential updated.');
      sessionStorage.removeItem('resetToken'); // clear token after success

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Access key validation failed. Please re-check the link.');
      setLoading(false);
    }
  };

  return (
    // Dark background to match Neo-Futuristic theme
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl shadow-purple-900/50 border border-blue-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center mb-6 
                      bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Update Access Credential
        </h2>
        
        {/* Message/Error Boxes */}
        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-400 px-4 py-2 rounded text-sm text-center font-mono mb-4">
            ERROR: {error}
          </div>
        )}
        {message && (
          <div className="bg-green-900/40 border border-green-600 text-green-400 px-4 py-2 rounded text-sm text-center font-mono mb-4">
            {message}
          </div>
        )}

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-1">New Password (Min 8 chars):</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-1">Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 font-semibold text-white rounded-lg 
                        bg-gradient-to-r from-purple-500 to-cyan-500 
                        hover:from-purple-400 hover:to-cyan-400 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing Update...' : 'RESET CREDENTIAL'}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 text-gray-400">
            <p className="font-mono">Awaiting valid access key...</p>
            <Link to="/forgot-password" className="text-purple-400 hover:text-cyan-400 mt-2 block">
              Request New Access Link
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;