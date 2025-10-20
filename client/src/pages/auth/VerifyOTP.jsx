// client/src/pages/auth/VerifyOTP.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Added motion for entrance animation
import authService from '../../api/authService';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RESEND_COOLDOWN_SECONDS = 60;

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

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // Access email passed via navigation state from signup
  const email = location.state?.email;

  // Cooldown timer logic
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle missing email context
  useEffect(() => {
    if (!email) {
      setError('Missing account context. Redirecting to signup...');
      // Navigate back after a delay if context is missing
      const timer = setTimeout(() => navigate('/signup', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [email, navigate]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setError('');
  };

  // --- Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || otp.length !== 6) return setError('Input validation failed. Enter 6 digits.');

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const verifyRes = await authService.verifyOtp({ email, otp });

      if (verifyRes.token) {
        // Save token for AuthContext to pick up
        localStorage.setItem('userToken', verifyRes.token);
      }

      setMessage('Verification successful! Accessing Dashboard...');
      // Navigate to the start of the personalized process (Step 5)
      setTimeout(() => navigate('/dashboard-before-login', { replace: true }), 1500); 

    } catch (err) {
      setError(err.message || 'Verification Failed. Check the access key.');
    } finally {
      setLoading(false);
    }
  };

  // --- Resend Logic ---
  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.sendOtp({ email });
      setMessage('New Access Key initiated. Check your inbox.');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || 'Failed to resend Access Key. System error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dark, Neo-Futuristic background
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl shadow-purple-900/50 border border-blue-700"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center 
                      bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Validate Access Key
        </h2>
        
        <p className="mb-6 text-center text-gray-400">
          Input the 6-digit **Access Key** sent to{' '}
          <strong className="text-cyan-400 font-mono">{email || '[CONTEXT_ERROR]'}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message (Neon Green) */}
          {message && (
            <div className="bg-green-900/40 border border-green-600 text-green-400 px-4 py-2 rounded text-sm text-center font-mono">
              {message}
            </div>
          )}
          {/* Error Message (Neon Red/Orange) */}
          {error && (
            <div className="bg-red-900/40 border border-red-600 text-red-400 px-4 py-2 rounded text-sm text-center font-mono">
              ERROR: {error}
            </div>
          )}

          <OTPInput onChange={handleOtpChange} className="bg-gray-700 border-blue-600 focus:border-cyan-400" />

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50"
          >
            {loading ? 'Processing Key...' : 'Verify & Launch Console'}
          </Button>
        </form>

        {/* Resend Link / Cooldown Status */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Key not received?{' '}
          {resendCooldown > 0 ? (
            <span className="text-gray-600 font-mono ml-1">Key Resend Cooldown: {resendCooldown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading || !email}
              className="text-purple-400 hover:text-cyan-400 disabled:text-gray-600 font-medium ml-1 transition-colors"
            >
              **RE-INITIATE ACCESS KEY**
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;