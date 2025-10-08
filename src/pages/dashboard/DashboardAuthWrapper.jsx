import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLoader from "../../components/auth/AuthLoader";

const DashboardAuthWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // renders nested dashboard routes
};

export default DashboardAuthWrapper;
