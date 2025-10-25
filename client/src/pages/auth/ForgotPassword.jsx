import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../api/authService'; // Fixed service
import { InputField } from '../../components/ui/InputField'; // CRITICAL FIX: Correct component name
import { Button } from '../../components/common/Button'; // Fixed component
import { Card } from '../../components/common/Card'; // Fixed component
import { AlertBox } from '../../components/ui/AlertBox'; // Standardized Alert component
import { showToast } from '../../utils/toastNotifications'; // Standardized Toast utility

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
            await authService.forgotPassword({ email: email.trim() }); 

            const successMessage = 'Password reset link sent successfully! Please check your inbox.';
            setMessage(successMessage);
            showToast(successMessage, 'success');
            setEmail('');

        } catch (err) {
            // The service re-throws a standardized error message.
            const errorMessage = err.message || 'Failed to send reset link. Please try again.';
            setError(errorMessage);
            console.error('ForgotPassword Error:', errorMessage, err);
            // The service/apiClient might already toast the error, but we show a specific one here.
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <h2 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 text-center">
                    Forgot Password
                </h2>
                <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
                    Enter your email address and we’ll send a secure link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Display success message as a persistent info box */}
                    {message && (
                        <AlertBox 
                            type="info" 
                            message={message} 
                            className="mb-4" 
                        />
                    )}

                    {/* Display submission error */}
                    {error && (
                         <AlertBox 
                            type="error" 
                            message={error} 
                            className="mb-4" 
                        />
                    )}

                    <InputField 
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
                        loading={loading}
                        disabled={loading || !!message}
                        className="w-full mt-2"
                        variant="primary"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
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
