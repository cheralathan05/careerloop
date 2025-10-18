// client/src/pages/auth/DashboardAfterLogin.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Navbar from '../../components/layout/Navbar';

const DashboardAfterLogin = () => {
    const { user, logout } = useAuth();
    
    return (
        <>
            <Navbar />

            <main className="container mx-auto p-6 mt-8">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                    Welcome, {user?.name || user?.email}!
                </h1>

                <p className="mb-6 text-gray-600">
                    You are now logged in. This is a protected route accessible only to authenticated users.
                </p>

                <Button onClick={logout} className="bg-red-500 hover:bg-red-600 mb-6">
                    Logout
                </Button>

                <section className="mt-6 p-4 bg-gray-50 rounded-md shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">User Details:</h2>
                    <pre className="whitespace-pre-wrap text-gray-700">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </section>
            </main>
        </>
    );
};

export default DashboardAfterLogin;
