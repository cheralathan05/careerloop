// src/App.jsx (Finalized Router)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth Components & Pages
import AuthWrapper from './components/auth/AuthWrapper';
import DashboardAuthWrapper from './pages/dashboard/DashboardAuthWrapper'; // Protected group wrapper
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PhoneLoginPage from './pages/auth/PhoneLoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import AccountSettingsPage from './pages/auth/AccountSettingsPage';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';

const App = () => {
    return (
        <Router>
            {/* AuthProvider wraps the whole app to manage user state */}
            <AuthProvider>
                <Routes>
                    
                    {/* 1. Root Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* 2. AUTHENTICATION ROUTES (Only accessible when NOT logged in, via AuthWrapper) */}
                    <Route element={<AuthWrapper />}>
                        <Route path="/auth/login" element={<LoginPage />} />
                        <Route path="/auth/signup" element={<SignUpPage />} />
                        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/auth/phone-login" element={<PhoneLoginPage />} />
                    </Route>

                    {/* 3. VERIFICATION PAGE (Special case: Logged in but needs action) */}
                    {/* This page logic is self-contained to redirect verified users */}
                    <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
                    
                    {/* 4. PROTECTED DASHBOARD ROUTES (Only accessible when LOGGED IN, via DashboardAuthWrapper) */}
                    <Route element={<DashboardAuthWrapper />}>
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/account-settings" element={<AccountSettingsPage />} />
                        {/* Add more protected routes here */}
                    </Route>

                    {/* 5. 404 CATCH-ALL */}
                    <Route path="*" element={<div className="text-center p-20">404 | Not Found</div>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;