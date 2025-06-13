import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const access = useSelector((state) => state.auth.access);
  return access ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
