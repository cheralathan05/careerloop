// client/src/components/auth/GoogleButton.jsx

import React from 'react';
import Button from '../common/Button';

// Get backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const GoogleButton = () => {

    const handleGoogleLogin = () => {
        // Redirect user to backend's Google OAuth initiation route
        window.location.href = `${BACKEND_URL}/api/auth/google`;
    };

    return (
        <Button 
            type="button"
            onClick={handleGoogleLogin} 
            className="w-full mt-3 bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
        >
            {/* Simple Google "G" icon placeholder; replace with proper icon if desired */}
            <span className="text-lg font-bold text-white">G</span> 
            <span className="text-white font-medium">Continue with Google</span>
        </Button>
    );
};

export default GoogleButton;
