import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar          from './components/Navbar';
import ProtectedRoute  from './components/ProtectedRoute';

import Login           from './pages/Login';
import Register        from './pages/Register';
import Home            from './pages/Home';
import OrderPizza      from './pages/OrderPizza';
import BuildUrPizza    from './pages/BuildUrPizza';
import ShoppingCartPage from './pages/ShoppingCart';

/*
 * App sets up the AuthProvider (so all components can access login state)
 * and defines all routes.
 *
 * Route structure:
 *   /login      - Public. Redirects to / if already logged in.
 *   /register   - Public.
 *   /           - Protected. Home page.
 *   /order      - Protected. Order pizza from menu.
 *   /build      - Protected. Build custom pizza.
 *   /cart       - Protected. Shopping cart.
 *   *           - Catch-all redirect to /.
 *
 * ProtectedRoute checks isLoggedIn from AuthContext.
 * If user is not logged in, they are redirected to /login.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>

          {/* Public routes - no login required */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes - login required */}
          <Route path="/" element={
            <ProtectedRoute><Home /></ProtectedRoute>
          } />

          <Route path="/order" element={
            <ProtectedRoute><OrderPizza /></ProtectedRoute>
          } />

          <Route path="/build" element={
            <ProtectedRoute><BuildUrPizza /></ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute><ShoppingCartPage /></ProtectedRoute>
          } />

          {/* Redirect any unknown URL to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
