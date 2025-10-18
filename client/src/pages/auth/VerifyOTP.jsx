// client/src/pages/auth/VerifyOTP.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/common/Button';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get userId and email passed from signup page
  const userId = location.state?.userId;
  const email = location.state?.email;

  const handleOtpChange = (value) => {
    setOtp(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('User context lost. Please sign up again.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verifyRes = await authService.verifyOtp({ userId, otp });

      // Backend returns token after successful OTP verification
      if (verifyRes.token) {
        localStorage.setItem('userToken', verifyRes.token);
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed.';
      setError(errorMessage);
      console.error('VerifyOTP Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authService.sendOtp({ email });
      alert('OTP resent successfully!');
    } catch (err) {
      console.error('Resend OTP Error:', err);
      alert('Failed to resend OTP.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">Verify Account</h2>
        <p className="mb-6 text-center text-gray-600">
          A 6-digit code was sent to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <OTPInput onChange={handleOtpChange} />

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full mt-6"
          >
            {loading ? 'Verifying...' : 'Verify & Proceed'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button onClick={handleResend} className="text-indigo-600 hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
