// src/pages/dashboard/DashboardAuthWrapper.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLoader from '../../components/auth/AuthLoader';

/**
 * Wraps all dashboard routes to ensure only authenticated users have access.
 * If not authenticated, redirects to the login page.
 */
const DashboardAuthWrapper = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <AuthLoader />;
    }

    if (!currentUser) {
        return <Navigate to="/auth/login" replace />;
    }
    
    // Optional: Force unverified users to the verification page
    if (currentUser && !currentUser.emailVerified) {
        // If they are logged in but unverified, send them here (unless they are logging in via phone/google without an email)
        if (currentUser.email) {
            return <Navigate to="/auth/verify-email" replace />;
        }
    }
    
    return <Outlet />;
};

export default DashboardAuthWrapper;