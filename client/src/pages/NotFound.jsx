// client/src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    // Ensure the container fills available space, assuming it's used within a layout component
    <div className="flex flex-col items-center justify-center flex-grow bg-white p-4 text-center">
      
      {/* 🚨 Polished Styling for the 404 number */}
      <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 mb-2">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Oops! The page you were looking for doesn't exist. It might have been moved or the link is incorrect.
      </p>
      
      {/* Go to Homepage Button */}
      <Link to="/">
        <Button className="px-8 py-3 text-lg shadow-lg">
          ← Back to Home
        </Button>
      </Link>
      
      {/* Optional: Add a link to the login/dashboard based on auth state */}
      <p className="text-sm text-gray-500 mt-4">
        Or try navigating to your <Link to="/dashboard" className="text-indigo-600 hover:underline">Dashboard</Link>.
      </p>
    </div>
  );
};

export default NotFound;