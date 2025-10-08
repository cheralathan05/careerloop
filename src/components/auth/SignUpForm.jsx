// src/components/auth/SignUpForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
// import { validateEmail, validatePassword } from '../../utils/validators'; // Assumed

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp, sendVerificationEmail } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        // TODO: Add full validation from utils/validators.js here

        try {
            const userCredential = await signUp(email, password);
            
            // Send email verification link immediately after signup
            if (userCredential.user) {
                await sendVerificationEmail(userCredential.user);
                alert('Success! Check your email to verify your account before logging in.');
            }

            navigate('/auth/login'); // Redirect to login page
        } catch (err) {
            // Firebase error codes
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h2>
            
            {error && (
                <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </p>
            )}

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email-signup"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                    placeholder="career@loop.com"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password-signup"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Must be 6+ characters"
                    required
                />
            </div>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm-password">Confirm Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                    placeholder="********"
                    required
                />
            </div>

            <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition w-full"
                disabled={loading}
            >
                {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    );
};

export default SignUpForm;