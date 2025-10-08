// src/components/auth/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Protects routes, redirecting unauthenticated users to the login page.
 * Uses the <Outlet /> component from React Router to render child routes.
 */
const PrivateRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        // Render a full-page loader while the auth state is being checked
        return <div className="min-h-screen flex items-center justify-center text-xl">Loading User Data...</div>; 
    }

    // If a user is logged in, render the child route
    return currentUser ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;