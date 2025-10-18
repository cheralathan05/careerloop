// client/src/components/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoader from '../auth/AuthLoader'; // Component to show loading spinner

/**
 * ProtectedRoute wrapper component
 * Wraps routes that require authentication.
 * If the user is not authenticated, redirects to /login.
 * If auth status is loading, shows a loader.
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loader while checking auth status
    if (isLoading) return <AuthLoader />;

    // If authenticated, render nested routes
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
