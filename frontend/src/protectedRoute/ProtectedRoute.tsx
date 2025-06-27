import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Use Navigate for redirect
import { useSelector } from 'react-redux';

function ProtectedRoute() {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
   
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
