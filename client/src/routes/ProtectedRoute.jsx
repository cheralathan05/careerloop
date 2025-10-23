import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLoader from '../components/loaders/AuthLoader'; // Assuming a generic AuthLoader component

/**
 * @desc Component to protect routes, ensuring the user is authenticated.
 */
export const ProtectedRoute = () => {
    const { user, isAuthReady, token } = useAuth();
    
    // Show a full-screen loader while checking the session status
    if (!isAuthReady) {
        return <AuthLoader />;
    }

    // If the user is authenticated (has user object and a token), render the child routes
    if (user && token) {
        return <Outlet />;
    }

    // Otherwise, redirect to the login page
    return <Navigate to="/login" replace />;
};