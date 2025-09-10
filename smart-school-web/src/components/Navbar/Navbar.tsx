// src/components/Navbar/Navbar.tsx
import React from 'react';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Smart School</h1>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            <span className="navbar-user">
              {user.firstName} {user.lastName} ({user.role})
            </span>
            <button className="navbar-logout" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
