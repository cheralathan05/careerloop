// client/src/components/layout/Navbar.jsx

import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import authService from '../../api/authService';

const Navbar = () => {
    const { isAuthenticated, user, logout, login } = useAuth();
    const location = useLocation();

    // Handler for Google OAuth Token Redirection
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // 1. Save the token received from the backend redirect
            localStorage.setItem('userToken', token);
            
            // 2. Refresh the auth state (e.g., call a 'checkAuth' function or manually set user info)
            // A common method is to make a quick /api/auth/profile call to get user details.
            // For simplicity here, we'll rely on the next page load to pick up the token.
            
            // 3. Clear the URL parameters
            window.history.replaceState(null, null, location.pathname);

            // In a real app, you'd trigger a login/state update here.
            // Since we set the token, the useAuth useEffect on the next page load should handle it.
            // For immediate context update, you might need a dedicated `checkAuthStatus` function in AuthContext.
        }
    }, [location.search, login]);


    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-600">
                    AuthFlow
                </Link>
                
                <div className="space-x-4 flex items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-700">Hello, {user?.name || 'User'}</span>
                            <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                                Login
                            </Link>
                            <Link to="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;