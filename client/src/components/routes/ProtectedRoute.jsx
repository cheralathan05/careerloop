// client/src/components/routes/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // 🚨 NEW: Import useLocation
import { useAuth } from '../../context/AuthContext';
import AuthLoader from '../auth/AuthLoader';

/**
 * ProtectedRoute
 * Wraps routes that require authentication.
 * - Shows a loading spinner while auth state is being determined.
 * - Redirects to /login if the user is not authenticated.
 * - Renders child routes (via <Outlet />) if authenticated.
 * * NOTE: This component is a wrapper and does not take 'children' as a prop
 * when used with modern React Router (v6+).
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation(); // To get the current path

    // 1️⃣ Show loader while checking auth status
    if (isLoading) {
        // You can optionally return the AuthLoader from a dedicated component wrapping the app too
        return <AuthLoader />;
    }

    // 2️⃣ If authenticated, render nested routes
    if (isAuthenticated) {
        return <Outlet />;
    }

    // 3️⃣ Not authenticated → redirect to login
    // ENHANCEMENT: Pass the current location state to the login route. 
    // This allows the login form to redirect the user back to where they came from (e.g., /dashboard)
    return (
        <Navigate 
            to="/login" 
            replace 
            state={{ from: location }} // Pass state to preserve intended destination
        />
    );
};

export default ProtectedRoute;