import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;

  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(user);
  const userRole = userData.role;


  // Give admin access to all routes
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;

  }

  return <>{children}</>;
};

export default ProtectedRoute; 