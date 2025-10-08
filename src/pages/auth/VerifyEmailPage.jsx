// src/pages/auth/VerifyEmailPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage = () => {
    const { currentUser, sendVerificationEmail } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check auth status periodically to see if user has verified
    useEffect(() => {
        const interval = setInterval(async () => {
            if (currentUser) {
                // Force refresh of the token and user object
                await currentUser.reload();
                if (currentUser.emailVerified) {
                    clearInterval(interval);
                    navigate('/dashboard', { replace: true });
                }
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [currentUser, navigate]);

    const handleResend = async () => {
        if (!currentUser) return;

        setLoading(true);
        setError('');
        setMessage('');

        try {
            await sendVerificationEmail(currentUser);
            setMessage('Verification email sent! Check your spam folder if you don\'t see it.');
        } catch (err) {
            setError('Failed to resend verification email. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <p>Please log in to check your verification status.</p>;
    }

    if (currentUser.emailVerified) {
        navigate('/dashboard', { replace: true });
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-md text-center">
                <h2 className="text-3xl font-bold text-yellow-600 mb-4">Action Required!</h2>
                <p className="text-gray-700 mb-6">
                    We sent a verification link to **{currentUser.email}**. Please check your inbox and click the link to activate your account.
                </p>
                
                {message && <p className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</p>}
                {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</p>}
                
                <button
                    onClick={handleResend}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition w-full"
                    disabled={loading}
                >
                    {loading ? 'Resending...' : 'Resend Verification Email'}
                </button>
                
                <p className="mt-4 text-sm text-gray-500">
                    *We automatically check for verification every 5 seconds.*
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;