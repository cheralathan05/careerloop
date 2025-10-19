// client/src/components/auth/GoogleLoginButton.jsx

import React from 'react';
import authService from '../../api/authService';

// --- Google Icon SVG for professional look ---
const GoogleIcon = () => (
    <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        className="h-5 w-5"
    >
        <path fill="#4285F4" d="M24 5c6.627 0 11.964 2.872 15.003 7.828l-4.524 3.513c-2.433-2.613-5.71-4.341-10.479-4.341-8.527 0-14.864 7.234-14.864 16s6.337 16 14.864 16c4.604 0 7.892-1.637 10.388-4.184l4.524 3.513c-3.04 4.956-8.376 7.828-15.003 7.828-11.045 0-20-8.955-20-20s8.955-20 20-20z" clipRule="evenodd" fillRule="evenodd"/>
        <path fill="#34A853" d="M11 28l-4.524 3.513C9.036 36.128 15.373 43 24 43s14.964-7.872 17.003-12.828l-4.524-3.513c-2.496 2.547-5.784 4.184-10.388 4.184-8.527 0-14.864-7.234-14.864-16s6.337-16 14.864-16c4.769 0 8.046 1.728 10.479 4.341l4.524-3.513C35.964 7.872 30.627 5 24 5c-11.045 0-20 8.955-20 20s8.955 20 20 20z"/>
    </svg>
);
// --- End Icon ---

const GoogleLoginButton = () => {
    
    const handleGoogleLogin = () => {
        // This function is only executed ON CLICK
        authService.googleLogin(); // Redirects to backend Google OAuth route
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            // Enhanced styling to match standard Google button appearance
            className="w-full mt-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition duration-150 ease-in-out shadow-sm"
            aria-label="Continue with Google"
        >
            <GoogleIcon />
            <span className="font-medium">Continue with Google</span>
        </button>
    );
};

// ❌ CRITICAL FIX: Removed the line below which was causing an immediate redirect:
// authService.googleLogin(); 

export default GoogleLoginButton;