// client/src/components/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoader from '../auth/AuthLoader'; // Component for loading state

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show a loader while checking authentication status
    if (isLoading) {
        return <AuthLoader />;
    }

    // If authenticated, render the child route components
    // Outlet is used when the component itself is a layout wrapper for nested routes
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;