import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/*
 * Navbar renders differently based on auth state:
 *   - Not logged in : shows Login and Register links
 *   - Logged in     : shows Order Pizza, Build Ur Pizza, Cart, user name, Logout
 *
 * "Build Ur Pizza" is only clickable if hasOrdered is true.
 * If the user has not yet added a pizza to cart, the link is disabled
 * and shows a tooltip explaining why.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, hasOrdered, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* Helper to add active class to current route link */
  const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

  return (
    <nav className="pizzeria-navbar">

      {/* Brand name and logo - clicking either goes to home */}
      <div
        className="d-flex align-items-center gap-2"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span className="navbar-brand-text">Pizzeria</span>
        {/* Replace logo.jpeg with your actual logo file placed in src/ */}
        <img
          src="/logo.jpeg"
          alt="Pizzeria"
          className="navbar-logo"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* Navigation links - only shown when logged in */}
      {isLoggedIn && (
        <div className="d-flex gap-4 ms-4">

          <Link to="/order" className={isActive('/order')}>
            Order Pizza
          </Link>

          {/*
           * Build Ur Pizza link is disabled until user has ordered.
           * hasOrdered becomes true once they click Add to Cart on Order Pizza page.
           * A tooltip appears on hover when the link is disabled.
           */}
          {hasOrdered ? (
            <Link to="/build" className={isActive('/build')}>
              Build Ur Pizza
            </Link>
          ) : (
            <span className="navbar-link-disabled">
              Build Ur Pizza
            </span>
          )}

        </div>
      )}

      {/* Right side of navbar */}
      <div className="ms-auto d-flex align-items-center gap-3">

        {isLoggedIn ? (
          <>
            {/* Greeting */}
            <span style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Hello, {user.fullName.split(' ')[0]}
            </span>

            {/* Cart button */}
            <button className="btn-cart" onClick={() => navigate('/cart')}>
              Cart
            </button>

            {/* Logout */}
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
