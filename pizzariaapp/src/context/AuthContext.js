import React, { createContext, useContext, useState } from 'react';

/*
 * AuthContext provides login state and user info to every component
 * in the app without passing props down through every level.
 *
 * Usage in any component:
 *   const { user, login, logout, isLoggedIn } = useAuth();
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /*
   * On first load, check localStorage for an existing session.
   * If the user logged in before and did not log out, restore their session.
   */
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pizzeria_user');
    return stored ? JSON.parse(stored) : null;
  });

  /*
   * Track whether user has added any pizza to cart this session.
   * Build Ur Pizza is only accessible after at least one order is placed.
   */
  const [hasOrdered, setHasOrdered] = useState(() => {
    return localStorage.getItem('pizzeria_has_ordered') === 'true';
  });

  /* Called after successful login or register */
  const login = (userData, token) => {
    localStorage.setItem('pizzeria_token', token);
    localStorage.setItem('pizzeria_user', JSON.stringify(userData));
    setUser(userData);
  };

  /* Called when user clicks logout */
  const logout = () => {
    localStorage.removeItem('pizzeria_token');
    localStorage.removeItem('pizzeria_user');
    localStorage.removeItem('pizzeria_has_ordered');
    setUser(null);
    setHasOrdered(false);
  };

  /* Called when user successfully adds a pizza to cart */
  const markOrdered = () => {
    localStorage.setItem('pizzeria_has_ordered', 'true');
    setHasOrdered(true);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, hasOrdered, login, logout, markOrdered }}>
      {children}
    </AuthContext.Provider>
  );
};

/* Custom hook for convenience */
export const useAuth = () => useContext(AuthContext);
