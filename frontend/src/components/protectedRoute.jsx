// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore.js';

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token); // Or check state.user
  const location = useLocation(); // Get the current location

  if (!token) {
    // If not authenticated, redirect to the /login page
    // Pass the current location in state so we can redirect back after login
    // (though we won't implement the "redirect back" logic in LoginPage for this tutorial)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child route content
  return <Outlet />;
}

export default ProtectedRoute;
