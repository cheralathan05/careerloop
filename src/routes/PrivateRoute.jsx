import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import PrivateRoute from "../components/auth/PrivateRoute";

const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const PhoneLoginPage = lazy(() => import("../pages/auth/PhoneLoginPage"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/phone-login" element={<PhoneLoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<h1 className="text-center p-6">404 - Page Not Found</h1>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
