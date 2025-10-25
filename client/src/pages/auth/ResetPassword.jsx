import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../api/authService'; // CRITICAL FIX: Import standardized service
import { AlertBox } from '../../components/ui/AlertBox'; // CRITICAL FIX: Import standardized UI
import { InputField } from '../../components/ui/InputField'; // CRITICAL FIX: Correct component name

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, duration: 0.8 }
    }
};

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
            setError('Invalid or missing token. Please request a new access link.');
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setError('Cannot submit: Token is missing.');
            return;
        }
        if (password.length < 8) {
            setError('New password requires minimum 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Input mismatch: Passwords do not align.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            // CRITICAL FIX: Use the fixed authService for API call consistency
            const response = await authService.resetPassword({ token, newPassword: password });

            const successMessage = response.message || 'Password reset successful. Access credential updated.';
            setMessage(successMessage);
            sessionStorage.removeItem('resetToken'); // clear token after success

            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            // Error handling relies on the fixed service/apiClient structure
            const errorMessage = err.message || 'Access key validation failed. Please re-check the link.';
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        // Dark background to match Neo-Futuristic theme
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
            <motion.div
                className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl shadow-purple-900/50 border border-blue-700"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center mb-6 
                                 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    Update Access Credential
                </h2>
                
                {/* Message/Error Boxes (CRITICAL FIX: Using standardized AlertBox) */}
                {error && <AlertBox type="error" message={error} className="mb-4" />}
                {message && <AlertBox type="success" message={message} className="mb-4" />}

                {token ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Field (CRITICAL FIX: Using standardized InputField) */}
                        <InputField
                            type="password"
                            label="New Password (Min 8 chars):"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            name="password"
                            disabled={loading || !!message}
                        />
                        
                        {/* Confirm Password Field (CRITICAL FIX: Using standardized InputField) */}
                        <InputField
                            type="password"
                            label="Confirm New Password:"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            name="confirmPassword"
                            disabled={loading || !!message}
                        />
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !!message}
                            className="w-full p-3 font-semibold text-white rounded-lg 
                                         bg-gradient-to-r from-purple-500 to-cyan-500 
                                         hover:from-purple-400 hover:to-cyan-400 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing Update...' : 'RESET CREDENTIAL'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center p-4 text-gray-400">
                        <p className="font-mono">Awaiting valid access key...</p>
                        <Link to="/forgot-password" className="text-purple-400 hover:text-cyan-400 mt-2 block">
                            Request New Access Link
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;
