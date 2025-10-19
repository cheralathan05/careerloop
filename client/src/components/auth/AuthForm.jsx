// client/src/components/auth/AuthForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService'; // Use the enhanced service from the previous step
import Button from '../common/Button';
import Input from '../common/Input';

const AuthForm = ({ type = 'login' }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    // Only include name initially for signup clarity
    ...(type === 'signup' && { name: '' }) 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Destructure the login function from context
  const { login: contextLogin } = useAuth(); 
  const navigate = useNavigate();
  const isLogin = type === 'login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error message on user input
    if (error) setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // 🔑 ENHANCED LOGIN FLOW
        // Note: The contextLogin function should call authService.login and handle token/state setting.
        const { email, password } = formData;
        await contextLogin({ email, password }); 
        
        // If contextLogin succeeds, navigate to the dashboard
        navigate('/dashboard');

      } else {
        // 🧩 SIGNUP FLOW
        // Only pass required fields to the service
        const { name, email, password } = formData;
        const signupRes = await authService.signup({ name, email, password });
        console.log('Signup Response:', signupRes);

        // ✅ Robust Data Extraction (Good practice here!)
        const userId = signupRes?._id || signupRes?.user?._id || signupRes?.userId;
        const userEmail = signupRes?.email || signupRes?.user?.email || formData.email;

        if (!userId) {
            // Throw a custom error if the backend response is unexpected
            throw new Error('Signup was successful, but the user ID was not returned for OTP verification.');
        }

        // OTP is assumed to be sent by the server upon successful signup
        navigate('/verify-otp', { state: { userId, email: userEmail } });
      }
    } catch (err) {
      // 🛑 Centralized and Robust Error Handling
      // 1. Check for axios response structure
      const apiErrorMessage = err.response?.data?.message; 
      // 2. Fallback to the error object message (for service-level or custom errors)
      const genericErrorMessage = err.message;
      
      const errorMessage = apiErrorMessage || genericErrorMessage || 'An unexpected authentication error occurred.';
      
      setError(errorMessage);
      console.error('AuthForm Error:', errorMessage, err);

    } finally {
      setLoading(false);
    }
  };

  // --- RENDERING ---

  return (
    <form className="p-6 border rounded-lg shadow-md w-full max-w-sm bg-white" onSubmit={handleSubmit}>
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

      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
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