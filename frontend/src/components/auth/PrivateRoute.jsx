// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Unauthorized from "../../pages/auth/Unauthorized";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isLogged, role, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  // Debugging: Log auth state and requiredRole
  console.log("[PrivateRoute] isLogged:", isLogged, "role:", role, "requiredRole:", requiredRole);

  // Wait for auth check
  if (!initialized) {
    return <div className="w-full flex justify-center items-center py-20 text-lg">Checking authentication...</div>;
  }

  // If not logged in, redirect to login page
  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but lacks proper role, show Unauthorized
  if (
    requiredRole &&
    ((Array.isArray(requiredRole) && !requiredRole.includes(role)) ||
      (!Array.isArray(requiredRole) && role !== requiredRole))
  ) {
    return <Unauthorized />;
  }

  // If authenticated & authorized, render child components
  return children;
};

export default PrivateRoute;
