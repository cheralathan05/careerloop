// client/src/pages/auth/VerifyOTP.jsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../api/authService';
import { useAuth } from '../../context/AuthContext';
import OTPInput from '../../components/auth/OTPInput';
import Button from '../../components/common/Button';

const VerifyOTP = () => {
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // The user ID should be passed from the Signup page state (or stored temporarily)
    // For this example, we'll try to get it from location state
    const userId = location.state?.userId; 
    const email = location.state?.email || 'your email'; // Display email

    const handleOtpChange = (newOtp) => {
        setOtpCode(newOtp);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userId) {
             setError('User context lost. Please try logging in or signing up again.');
             return;
        }
        
        if (otpCode.length !== 6) {
            setError('Please enter the full 6-digit OTP.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // The service call verifies the OTP, marks user verified, and returns token/user
            const data = await authService.verifyOtp({ userId, otp: otpCode });
            
            // Manually save the token and update the context state (assuming login() handles this)
            // Since verifyOtp is the final step, we should update the auth state directly.
            localStorage.setItem('userToken', data.token); 
            // The AuthContext needs a method to set the user after verification (not just login)
            // For simplicity, we'll assume the token is valid and redirect.
            
            navigate('/dashboard', { replace: true });

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'OTP verification failed.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 border rounded-lg shadow-xl bg-white">
                <h2 className="text-3xl font-bold mb-4 text-center text-indigo-600">Verify Account</h2>
                <p className="mb-6 text-center text-gray-600">
                    A 6-digit code has been sent to **{email}**. Please enter it below.
                </p>

                <form onSubmit={handleSubmit}>
                    <OTPInput onChange={handleOtpChange} />

                    {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    
                    <Button 
                        type="submit" 
                        disabled={loading || otpCode.length !== 6} 
                        className="w-full mt-6"
                    >
                        {loading ? 'Verifying...' : 'Verify & Proceed'}
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    {/* Add logic/button to re-send OTP here */}
                    <p className="text-sm text-gray-500">Didn't receive the code? <button className="text-indigo-600 hover:underline">Resend Code</button></p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;