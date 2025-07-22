import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/certificate.svg'; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Check if vendor is logged in
  const isVendorLoggedIn = localStorage.getItem("vendorToken");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendor");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{ backgroundColor: "#FFD700" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center text-dark" to="/">
          <img
            src={logo}
            alt="Logo"
            height="30"
            className="me-2"
            style={{ objectFit: 'contain' }}
          />
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
          <ul className="navbar-nav ms-auto text-center align-items-center">
            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${
                  isActive("/")
                    ? "text-dark text-decoration-underline"
                    : "text-dark"
                }`}
                to="/"
              >
                Home
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${
                  isActive("/vendor-dashboard")
                    ? "text-dark text-decoration-underline"
                    : "text-dark"
                }`}
                to="/vendor-dashboard"
              >
                Vendor Dashboard
              </Link>
            </li>

<li className="nav-item mx-2">
  <Link
    className={`nav-link fw-semibold ${
      isActive("/contact")
        ? "text-dark text-decoration-underline"
        : "text-dark"
    }`}
    to="/contact"
  >
    Contact Us
  </Link>
</li>
            <li className="nav-item mx-2">
              <Link
                className={`nav-link fw-semibold ${
                  isActive("/help")
                    ? "text-dark text-decoration-underline"
                    : "text-dark"
                }`}
                to="/help"
              >
                Help
              </Link>
            </li>

            {/* Logout (only if logged in) */}
            {isVendorLoggedIn && (
              <li className="nav-item mx-2">
                <button
                  className="btn btn-outline-dark fw-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
