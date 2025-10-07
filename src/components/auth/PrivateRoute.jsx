import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-6">Loading auth...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
