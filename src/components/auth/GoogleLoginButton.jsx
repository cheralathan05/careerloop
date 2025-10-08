// src/components/auth/GoogleLoginButton.jsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await googleLogin();
            navigate('/dashboard');
        } catch (err) {
            // User closed the popup or other error
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-in failed. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && (
                <p className="p-2 mb-2 text-sm text-red-700 bg-red-100 rounded-lg text-center" role="alert">
                    {error}
                </p>
            )}
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center space-x-2 border border-gray-300 bg-white text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-50 transition w-full disabled:opacity-50"
                disabled={loading}
            >
                {/* Simple SVG for Google logo */}
                <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>
                <span>{loading ? 'Signing In...' : 'Sign in with Google'}</span>
            </button>
        </>
    );
};

export default GoogleLoginButton;