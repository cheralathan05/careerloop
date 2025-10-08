import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLoader from "./AuthLoader";

const AuthWrapper = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (requireAuth && !user) return <Navigate to="/login" replace />;
  if (!requireAuth && user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AuthWrapper;
