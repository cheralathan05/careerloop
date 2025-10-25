import React from 'react';
import authService from '../../api/authService'; // Fixed service
// Note: We avoid importing the generic Button component here to keep styling atomic.

// ✅ Google SVG Icon (Perfectly implemented)
const GoogleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5 flex-shrink-0"
    >
        <path fill="#4285F4" d="M24 5c6.627 0 11.964 2.872 15.003 7.828l-4.524 3.513c-2.433-2.613-5.71-4.341-10.479-4.341-8.527 0-14.864 7.234-14.864 16s6.337 16 14.864 16c4.604 0 7.892-1.637 10.388-4.184l4.524 3.513C35.964 40.956 30.627 43.828 24 43.828 12.955 43.828 4 34.873 4 23.828S12.955 3.828 24 3.828z"/>
        <path fill="#34A853" d="M11 28l-4.524 3.513C9.036 36.128 15.373 43 24 43s14.964-7.872 17.003-12.828l-4.524-3.513c-2.496 2.547-5.784 4.184-10.388 4.184-8.527 0-14.864-7.234-14.864-16s6.337-16 14.864-16c4.769 0 8.046 1.728 10.479 4.341l4.524-3.513C35.964 7.872 30.627 5 24 5c-11.045 0-20 8.955-20 20s8.955 20 20 20z"/>
    </svg>
);

// FIX: Renamed component to GoogleButton to match import in Login.jsx
const GoogleButton = () => {
    const handleGoogleLogin = () => {
        try {
            // This triggers your fixed backend OAuth endpoint via redirection
            authService.googleLogin();
        } catch (error) {
            console.error('Google login error:', error);
            // Fallback for user feedback if redirection fails instantly
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            // Applying the dark theme styles directly here
            className="w-full mt-3 bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-150 ease-in-out shadow-lg text-lg font-medium"
            aria-label="Continue with Google"
        >
            <GoogleIcon />
            <span className="font-medium">CONTINUE WITH GOOGLE</span>
        </button>
    );
};

export default GoogleButton;