import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const ProtectedRoutes = () => {
  const { currentUser } = useSelector((state) => state.login);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
