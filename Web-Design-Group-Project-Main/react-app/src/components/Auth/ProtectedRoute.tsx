import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userRole = user.role.toLowerCase();
  const required = requiredRole.toLowerCase();

  // Give admin access to all routes
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // For non-admin users, check if they have the required role
  if (userRole !== required) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 