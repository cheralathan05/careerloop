// src/pages/auth/AccountSettingsPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LogoutButton from '../../components/auth/LogoutButton';

const AccountSettingsPage = () => {
    const { currentUser, updateUserPassword } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await updateUserPassword(currentUser, newPassword);
            setMessage('Password successfully updated! You may need to log in again.');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                setError('Please log out and log back in, then try updating your password again (security requirement).');
            } else {
                setError('Failed to update password. Error: ' + err.message);
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold text-indigo-700">Account Settings</h1>
                <LogoutButton />
            </header>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Profile & Security</h2>
                
                <p className="mb-6 text-gray-600">**Email:** {currentUser?.email}</p>

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword}>
                    <h3 className="text-lg font-medium mb-3">Change Password</h3>
                    {message && <p className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</p>}
                    {error && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</p>}
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required 
                            className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Confirm New Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required 
                            className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <button type="submit" disabled={loading || !newPassword}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50">
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsPage;