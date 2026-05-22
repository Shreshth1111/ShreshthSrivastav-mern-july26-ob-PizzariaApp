import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * ProtectedRoute wraps pages that require the user to be logged in.
 * If the user is not authenticated, they are redirected to /login.
 *
 * Usage in App.js:
 *   <Route path="/order" element={<ProtectedRoute><OrderPizza /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
