// client/src/components/auth/GoogleButton.jsx

import React from 'react';
import Button from '../common/Button';

// Get backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const GoogleButton = () => {

    const handleGoogleLogin = () => {
        // Redirect the user to the backend's Google OAuth initiation route
        // The backend handles the handshake and redirects back to the client upon success/failure.
        window.location.href = `${BACKEND_URL}/api/auth/google`;
    };

    return (
        <Button 
            onClick={handleGoogleLogin} 
            className="w-full mt-3 bg-red-600 hover:bg-red-700 flex items-center justify-center space-x-2"
        >
            {/* You should replace this with a proper Google icon */}
            <span className="text-lg">G</span> 
            <span>Continue with Google</span>
        </Button>
    );
};

export default GoogleButton;