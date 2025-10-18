// client/src/pages/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.forgotPassword({ email });
      setMessage('Password reset link sent to your email!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset email.';
      setError(errorMessage);
      console.error('ForgotPassword Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600 text-center">Forgot Password</h2>
        <p className="mb-6 text-center text-gray-600">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
