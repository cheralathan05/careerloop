// client/src/components/auth/PasswordResetForm.jsx

import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import authService from '../../api/authService'; // Assuming you add forgot/reset methods here

const PasswordResetForm = ({ type = 'forgot' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState(''); // Used for ResetPassword type
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isForgot = type === 'forgot';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isForgot) {
                // Logic for initiating the forgot password email
                // Assumes authService.forgotPassword(email) sends a reset link
                const response = await authService.forgotPassword({ email });
                setMessage(response.message || 'Password reset link sent! Check your email.');

            } else {
                // Logic for resetting the password after clicking the email link
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setLoading(false);
                    return;
                }
                
                // Assuming token is extracted from URL in ResetPassword.jsx parent component
                const response = await authService.resetPassword({ token, newPassword: password });
                setMessage(response.message || 'Password successfully reset! You can now log in.');
                // Optional: Redirect to login page
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md w-full max-w-sm bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
                {isForgot ? 'Forgot Password' : 'Reset Password'}
            </h2>

            {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {isForgot ? (
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            ) : (
                <>
                    {/* Assuming token is handled by parent, otherwise include a hidden input */}
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                    />
                </>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading ? 'Processing...' : (isForgot ? 'Send Reset Link' : 'Change Password')}
            </Button>
        </form>
    );
};

export default PasswordResetForm;