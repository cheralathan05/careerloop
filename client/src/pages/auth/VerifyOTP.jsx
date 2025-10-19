// client/src/pages/auth/VerifyOTP.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RESEND_COOLDOWN_SECONDS = 60;

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle missing email
  useEffect(() => {
    if (!email) {
      setError('Missing account information. Please restart the sign-up process.');
    }
  }, [email]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Account context missing. Please restart signup.');
    if (otp.length !== 6) return setError('Please enter the full 6-digit OTP.');

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // ✅ Send email and otp (not userId)
      const verifyRes = await authService.verifyOtp({ email, otp });

      if (verifyRes.token) {
        localStorage.setItem('userToken', verifyRes.token);
      }

      setMessage('Verification successful!');
      navigate('/dashboard', { replace: true });

    } catch (err) {
      setError(err.message || 'OTP verification failed. Check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.sendOtp({ email });
      setMessage('New OTP sent successfully! Check your inbox.');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">Verify Account</h2>
        
        <p className="mb-6 text-center text-gray-600">
          A 6-digit code was sent to{' '}
          <strong className="text-indigo-600">{email || 'your registered email'}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
              {error}
            </div>
          )}

          <OTPInput onChange={handleOtpChange} />

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full mt-6"
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Didn't receive the code?{' '}
          {resendCooldown > 0 ? (
            <span className="text-gray-400 font-medium ml-1">Resend available in {resendCooldown}s</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading || !email}
              className="text-indigo-600 hover:underline disabled:text-gray-400 ml-1"
            >
              Resend Code
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyOTP;
