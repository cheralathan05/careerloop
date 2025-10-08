// src/pages/dashboard/DashboardHome.jsx

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import LogoutButton from '../../components/auth/LogoutButton';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { currentUser } = useAuth(); // Guaranteed to be available by DashboardAuthWrapper

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center mb-10 bg-white p-4 rounded-lg shadow">
                <h1 className="text-4xl font-extrabold text-indigo-700">CareerLoop Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <Link to="/account-settings" className="text-indigo-600 hover:text-indigo-800 transition font-medium">
                        Settings
                    </Link>
                    <LogoutButton />
                </div>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome back to CareerLoop!</h2>
                
                {currentUser && (
                    <div className="space-y-2">
                        <p className="text-lg">
                            **Email:** <span className="font-medium text-indigo-600">{currentUser.email || 'N/A'}</span>
                        </p>
                        <p className={`text-lg ${currentUser.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                            **Status:** {currentUser.emailVerified ? 'Email Verified ✅' : 'Email Not Verified ⚠️'}
                        </p>
                    </div>
                )}
                
                <p className="mt-6 text-gray-600">This area is protected. Start managing your career pipeline here.</p>
            </div>
        </div>
    );
};

export default DashboardHome;