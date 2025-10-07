// src/routes/AppRouter.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import AuthWrapper from "../components/auth/AuthWrapper";

// Lazy load pages
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const PhoneLoginPage = lazy(() => import("../pages/auth/PhoneLoginPage"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh"
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <AuthWrapper requireAuth={true}>
                <Dashboard />
              </AuthWrapper>
            }
          />

          {/* Catch-all 404 */}
          <Route
            path="*"
            element={<h1 className="text-center p-6">404 - Page Not Found</h1>}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
