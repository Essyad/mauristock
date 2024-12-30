import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const ProtectedRoute = () => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default ProtectedRoute; 