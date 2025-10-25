import React from 'react';
import { Link } from 'react-router-dom';
// CRITICAL FIX: The path must include the 'components' folder to resolve correctly from src/pages
import { Button } from '../components/common/Button'; 

const NotFound = () => {
    // Dark mode styling is handled by global CSS classes and context
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-4 text-center text-gray-900 dark:text-gray-100 flex-grow">
            
            {/* 🚨 Polished Styling for the 404 number */}
            <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                System Log: Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                Oops! The requested trajectory node does not exist. It may have been moved or the access key (URL) is incorrect.
            </p>
            
            {/* Go to Homepage Button */}
            <Link to="/">
                <Button className="px-8 py-3 text-lg shadow-lg" variant="primary">
                    ← Back to Home Console
                </Button>
            </Link>
            
            {/* Optional: Add a link to the login/dashboard based on auth state */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Or navigate to your <Link to="/dashboard" className="text-indigo-600 dark:text-indigo-400 hover:underline">Dashboard Hub</Link>.
            </p>
        </div>
    );
};

export default NotFound;
