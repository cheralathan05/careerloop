// client/src/components/auth/AuthForm.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import Button from '../common/Button'; 
import Input from '../common/Input'; 

const AuthForm = ({ type = 'login' }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const isLogin = type === 'login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ✅ LOGIN FLOW
        await login({ email: formData.email, password: formData.password });
        navigate('/dashboard');
      } else {
        // ✅ SIGNUP FLOW
        const signupResponse = await authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Correctly extract userId and email
        const userId = signupResponse.user?._id;
        const email = signupResponse.user?.email;
        if (!userId) throw new Error('Signup failed: No user ID returned.');

        // ✅ Send OTP after signup
        const otpResponse = await authService.sendOtp({ email });
        if (otpResponse?.message) console.log('OTP sent successfully');

        // ✅ Navigate to OTP verification page
        navigate('/verify-otp', { state: { userId, email } });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md w-full max-w-sm bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isLogin ? 'Log In' : 'Sign Up'}
      </h2>

      {!isLogin && (
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
      )}

      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        required
      />

      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
      </Button>

      {isLogin && (
        <div className="text-right mt-2">
          <Link 
            to="/forgot-password" 
            className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-150"
          >
            Forgot Password?
          </Link>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
