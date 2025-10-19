// client/src/components/auth/PasswordResetForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import authService from '../../api/authService';

const PasswordResetForm = ({ type = 'forgot', token: propToken = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(propToken);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isForgot = type === 'forgot';
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract token from URL if in reset mode
  useEffect(() => {
    if (propToken) {
      setToken(propToken);
      return;
    }

    if (!isForgot) {
      const params = new URLSearchParams(location.search);
      const urlToken = params.get('token');
      setToken(urlToken);

      if (!urlToken) {
        setError('Password reset link is missing or invalid.');
      }
    }
  }, [propToken, isForgot, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isForgot) {
        // 📨 Forgot Password Flow
        if (!email.trim()) {
          setError('Please enter your email.');
          return;
        }

        const response = await authService.forgotPassword({ email });
        setMessage(
          response.message ||
            'Password reset link sent! Check your email inbox.'
        );
        setEmail('');
      } else {
        // 🔐 Reset Password Flow
        if (!token) {
          setError(
            'Reset token is missing or expired. Please request a new password link.'
          );
          return;
        }

        if (!password || !confirmPassword) {
          setError('Please fill in both password fields.');
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const response = await authService.resetPassword({
          token,
          newPassword: password,
        });

        setMessage(
          response.message ||
            'Password reset successful! Redirecting to login...'
        );
        setPassword('');
        setConfirmPassword('');

        // Redirect after short delay
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        'Operation failed. Please try again.';
      setError(errMsg);
      console.error('PasswordResetForm Error:', errMsg, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg shadow-xl w-full max-w-sm bg-white mx-auto my-10"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">
        {isForgot ? 'Forgot Password' : 'Reset Password'}
      </h2>

      {/* ✅ Success Message */}
      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm break-words"
          role="alert"
        >
          {message}
        </div>
      )}

      {/* ⚠️ Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm break-words"
          role="alert"
        >
          {error}
        </div>
      )}

      {isForgot ? (
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoFocus
          disabled={loading}
          className="mb-4"
        />
      ) : token ? (
        <>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password (min 8 chars)"
            required
            autoFocus
            disabled={loading}
            className="mb-4"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            required
            disabled={loading}
            className="mb-4"
          />
        </>
      ) : (
        <p className="text-center text-gray-500">
          Please use the full link sent to your email to reset your password.
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || (!isForgot && !token)}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-300"
      >
        {loading
          ? 'Processing...'
          : isForgot
          ? 'Send Reset Link'
          : 'Change Password'}
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          ← Back to Login
        </button>
      </div>
    </form>
  );
};

export default PasswordResetForm;
