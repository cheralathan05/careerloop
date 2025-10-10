// client/src/components/auth/AuthForm.jsx (FINAL AND COMPLETE VERSION)

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
                // Login Logic
                await login({ email: formData.email, password: formData.password });
                navigate('/dashboard'); 
            } else {
                // 🎯 SIGNUP LOGIC WITH STATE PASSING
                // Assuming authService.signup returns data containing { user: { _id, ... }, token }
                const response = await authService.signup(formData);
                
                // Extract the user ID and email from the response data and form data, respectively
                const userId = response.user?._id || response._id; 

                if (!userId) {
                    throw new Error("Signup successful but user ID was not returned.");
                }

                // Navigate to VerifyOTP page, passing userId and email via state
                navigate('/verify-otp', { 
                    state: { 
                        userId: userId, 
                        email: formData.email 
                    } 
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Authentication failed.';
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
                    placeholder="Name"
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
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Signup')}
            </Button>
            
            {/* Forgot Password Link Addition */}
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