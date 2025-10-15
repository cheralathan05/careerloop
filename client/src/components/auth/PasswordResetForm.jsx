import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import authService from '../../api/authService';

const PasswordResetForm = ({ type = 'forgot', token: propToken = '' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState(propToken);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isForgot = type === 'forgot';

    useEffect(() => {
        setToken(propToken);
    }, [propToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isForgot) {
                const response = await authService.forgotPassword({ email });
                setMessage(response.message || 'Password reset link sent! Check your email.');
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setLoading(false);
                    return;
                }
                const response = await authService.resetPassword({ token, newPassword: password });
                setMessage(response.message || 'Password successfully reset! You can now log in.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
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
                {loading ? 'Processing...' : isForgot ? 'Send Reset Link' : 'Change Password'}
            </Button>
        </form>
    );
};

export default PasswordResetForm;
