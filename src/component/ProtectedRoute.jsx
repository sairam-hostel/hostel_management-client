import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/', allowedRole, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to the dashboard corresponding to their actual role to prevent access
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'student') return <Navigate to="/student" replace />;
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
