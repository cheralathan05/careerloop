import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Assuming this hook exists
import AuthLoader from '../components/auth/AuthLoader'; // Full-screen loading component

/**
 * @desc Component to protect routes, ensuring the user is authenticated.
 * If the user is not authenticated, they are redirected to the login page.
 */
export const ProtectedRoute = () => {
    const { user, isAuthReady, token } = useAuth();
    
    // 1. Show a full-screen loader while checking the session status
    if (!isAuthReady) {
        return <AuthLoader />;
    }

    // 2. If the user is authenticated (has user object and a token), render the child routes
    if (user && token) {
        return <Outlet />;
    }

    // 3. Otherwise, redirect to the login page
    // The replace prop ensures the current (protected) page isn't added to history.
    return <Navigate to="/login" replace />;
};