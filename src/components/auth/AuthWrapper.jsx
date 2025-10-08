// src/components/auth/AuthWrapper.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLoader from './AuthLoader';

/**
 * Ensures that only UNauthenticated users can access the route.
 * Redirects authenticated users to the dashboard.
 */
const AuthWrapper = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    // If the user is logged in, redirect them away from auth pages
    return currentUser ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthWrapper;