// src/components/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ('director' | 'admin' | 'owner')[];
}

const roleHierarchy: { [key: string]: number } = {
  director: 1,
  admin: 2,
  owner: 3,
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  // Teacher has no access
  if (user.role === 'teacher') {
    return <Navigate to="/login" replace />;
  }

  // Owner can access everything
  if (user.role === 'owner') {
    return <>{children}</>;
  }

  // Check role hierarchy: allowedRoles = minimum required role
  const userLevel = roleHierarchy[user.role];
  const allowed = allowedRoles.some(role => userLevel >= roleHierarchy[role]);

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
