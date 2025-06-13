import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedType }) => {
  const { access, type } = useSelector((state) => state.auth);

  if (!access) {
    return <Navigate to="/login" replace />;
  }

  if (allowedType && !allowedType === type) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
