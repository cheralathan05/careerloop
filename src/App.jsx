import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import PhoneLoginPage from "./pages/auth/PhoneLoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

import DashboardHome from "./pages/dashboard/DashboardHome";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/phonelogin" element={<PhoneLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardHome />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
