// src/components/auth/LogoutButton.jsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = "text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded transition" }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        if (!window.confirm("Are you sure you want to log out?")) {
            return;
        }

        setLoading(true);
        try {
            await logout();
            navigate('/auth/login'); // Redirect to login after successful logout
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Failed to log out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`font-semibold ${className} disabled:opacity-50`}
            disabled={loading}
        >
            {loading ? 'Logging Out...' : 'Log Out'}
        </button>
    );
};

export default LogoutButton;