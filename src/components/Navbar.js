// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ backgroundColor: '#FFD700' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-dark" to="/">
          Purity Certificate Portal
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/') ? 'text-dark text-decoration-underline' : 'text-dark'}`}
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/vendor-dashboard') ? 'text-dark text-decoration-underline' : 'text-dark'}`}
                to="/vendor-dashboard"
              >
                Vendor Dashboard
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/login') ? 'text-dark text-decoration-underline' : 'text-dark'}`}
                to="/login"
              >
                Login
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/register') ? 'text-dark text-decoration-underline' : 'text-dark'}`}
                to="/register"
              >
                 Register
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/admin-login') ? 'text-dark text-decoration-underline' : 'text-dark'}`}
                to="/admin-login"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 