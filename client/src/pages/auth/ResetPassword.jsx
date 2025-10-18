// client/src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import authService from '../../api/authService';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // --- Extract token from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    if (!resetToken) {
      setError('Reset token is missing. Please check your link.');
    } else {
      setToken(resetToken);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is missing. Cannot reset password.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword({ token, newPassword: password });
      setSuccess(res.message || 'Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Reset password failed.';
      setError(errorMessage);
      console.error('ResetPassword Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">
          Reset Password
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
          />

          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}

          <Button
            type="submit"
            disabled={loading || !token}
            className="w-full mt-4"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
