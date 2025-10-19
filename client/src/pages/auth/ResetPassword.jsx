// client/src/pages/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError('Invalid or missing token. Please request a new password reset link.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Cannot submit: Token is missing.');
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

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/reset-password',
        { token, newPassword: password } // backend expects token + newPassword
      );

      setMessage(data.message || 'Password reset successful!');
      setLoading(false);
      sessionStorage.removeItem('resetToken'); // clear token after success

      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      {token ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#666' }}>Please use the link sent to your email.</p>
      )}
    </div>
  );
};

export default ResetPassword;
