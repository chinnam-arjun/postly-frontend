import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const token = useSelector((s) => s.auth.token);
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
}
