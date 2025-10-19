// client/src/pages/auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword({ email: email.trim() });

      setMessage(
        response?.message || 'Password reset link sent successfully! Please check your inbox.'
      );
      setEmail('');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
      console.error('ForgotPassword Error:', errorMessage, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600 text-center">
          Forgot Password
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Enter your email address and we’ll send a secure link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm break-words"
              role="status"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm break-words"
              role="alert"
            >
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., your.email@example.com"
            required
            autoFocus
            disabled={loading || !!message}
          />

          <Button
            type="submit"
            disabled={loading || !!message}
            className="w-full mt-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
            onClick={() => navigate('/login')}
          >
            ← Back to Login
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
