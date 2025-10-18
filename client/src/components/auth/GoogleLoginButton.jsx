// client/src/components/auth/GoogleLoginButton.jsx

import React from 'react';
import authService from '../../api/authService';

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        authService.googleLogin(); // Redirects to backend Google OAuth route
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
        >
            {/* Optional: Replace with Google icon */}
            <span className="text-lg font-bold">G</span>
            <span className="font-medium">Continue with Google</span>
        </button>
    );
};

export default GoogleLoginButton;
