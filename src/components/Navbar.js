// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-warning sticky-top shadow-sm">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-dark" to="/">
          Purity Certificate Portal
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Nav Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-center">
            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/') ? 'text-decoration-underline text-dark' : 'text-dark'}`}
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/vendor-dashboard') ? 'text-decoration-underline text-dark' : 'text-dark'}`}
                to="/vendor-dashboard"
              >
                Vendor Dashboard
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/login') ? 'text-decoration-underline text-dark' : 'text-dark'}`}
                to="/login"
              >
                Login
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/register') ? 'text-decoration-underline text-dark' : 'text-dark'}`}
                to="/register"
              >
                Register
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${isActive('/admin-login') ? 'text-decoration-underline text-dark' : 'text-dark'}`}
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
