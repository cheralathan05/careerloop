// client/src/pages/auth/DashboardAfterLogin.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Navbar from '../../components/layout/Navbar'; // Assuming import structure

const DashboardAfterLogin = () => {
    const { user, logout } = useAuth();
    
    return (
        <>
            <Navbar /> {/* Use Navbar component */}
            <div className="container mx-auto p-4 mt-8">
                <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard, {user?.name || user?.email}!</h1>
                <p className="mb-6">This is a protected route, visible only to authenticated users.</p>
                
                <Button onClick={logout} className="bg-red-500 hover:bg-red-600">
                    Logout
                </Button>
                
                {/* Display user details for verification */}
                <div className="mt-8 p-4 bg-gray-100 rounded">
                    <h3 className="text-xl font-semibold mb-2">User Details:</h3>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(user, null, 2)}</pre>
                </div>
            </div>
        </>
    );
};

export default DashboardAfterLogin;