import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to their dashboard
  if (user) {
    switch (user?.RoleID) {
      case 1:
        return <Navigate to="/centra/dashboard" />;
      case 2:
        return <Navigate to="/harbor/dashboard" />;
      case 3:
        const isMobile = /android|iphone|ipad|mobile/i.test(navigator.userAgent);
        return <Navigate to={isMobile ? "/xyzmobile/dashboard" : "/company/dashboard"} />;
      case 4:
        return <Navigate to="/admin/dashboard" />;
      case 5:
      case 6:
        return <Navigate to="/marketplace/homepage" />;
      default:
        return <Outlet />;
    }
  }

  return <Outlet />;
};

export default AuthLayout;
