// client/src/App.jsx

import React from 'react';
// Correct import structure for React Router v6
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

// --- Context & Layout ---
import { AuthProvider } from './context/AuthContext.jsx'; // Context Provider
import Navbar from './components/layout/Navbar.jsx';       // Global Navigation
import Footer from './components/layout/Footer.jsx';       // Global Footer
import ProtectedRoute from './components/routes/ProtectedRoute.jsx'; // Security Wrapper

// --- Public Pages ---
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import VerifyOTP from './pages/auth/VerifyOTP.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import DashboardBeforeLogin from './pages/auth/DashboardBeforeLogin.jsx'; // Landing Page
import DashboardAfterLogin from './pages/auth/DashboardAfterLogin.jsx';   // Private Dashboard

// --- Utility Pages ---
import NotFound from './pages/NotFound.jsx';

const App = () => {
  return (
    // 1. Wrap the entire app in AuthProvider to give context access to all components
    <AuthProvider>
      {/* 2. Router enables navigation */}
      <Router>
        {/* 3. Outer div for Sticky Footer Layout */}
        <div className="flex flex-col min-h-screen">
          
          <Navbar />

          {/* 4. Main content area takes remaining vertical space (flex-grow) */}
          <main className="flex-grow">
            <Routes>
              
              {/* --- 🔑 Public Authentication Routes (Accessible to all) --- */}
              <Route path="/" element={<DashboardBeforeLogin />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* --- 🔒 Protected Routes (Requires Authentication) --- */}
              {/* Use <Route element={<ProtectedRoute />} to wrap private routes */}
              <Route element={<ProtectedRoute />}>
                {/* Nested routes are rendered inside the <Outlet /> of ProtectedRoute */}
                <Route path="/dashboard" element={<DashboardAfterLogin />} />
                {/* Add other protected routes here:
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                */}
              </Route>

              {/* 5. 404 Catch-All Route (Must be the last route) */}
              <Route path="*" element={<NotFound />} />
              
            </Routes>
          </main>

          <Footer />
          
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;