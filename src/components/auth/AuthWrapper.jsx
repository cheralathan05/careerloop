import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (requireAuth && !user) return <Navigate to="/login" replace />;
  if (!requireAuth && user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AuthWrapper;
