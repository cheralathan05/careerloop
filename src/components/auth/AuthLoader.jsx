// src/components/auth/AuthLoader.jsx

import React from 'react';

const AuthLoader = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-600 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            <p className="mt-4 text-xl font-semibold">Loading CareerLoop...</p>
            <p className="mt-2 text-sm text-indigo-200">Checking authentication status...</p>
        </div>
    );
};

export default AuthLoader;