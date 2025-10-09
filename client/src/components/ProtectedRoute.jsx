
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You can add a spinner or a loading component here
        return <div>Loading...</div>; 
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back there after they log in.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;