import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLoader from "./AuthLoader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
