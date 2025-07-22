import React, { useState } from "react";
import {
  FaUserPlus,
  FaUserClock,
  FaUserEdit,
  FaBars,
  FaEnvelope,
} from "react-icons/fa";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const AdminSidebar = ({ currentSection, setCurrentSection }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menu = [
    { key: "add", label: "Add Vendor", icon: <FaUserPlus /> },
    { key: "pending", label: "Pending Registrations", icon: <FaUserClock /> },
    { key: "manage", label: "Manage Profiles", icon: <FaUserEdit /> },
    { key: "contact", label: "Contact Messages", icon: <FaEnvelope /> },
  ];

  return (
    <div
      className={`d-flex flex-column bg-white shadow-sm border-end min-vh-100 ${
        collapsed ? "p-2" : "p-3"
      }`}
      style={{
        width: collapsed ? "70px" : "250px",
        transition: "width 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        {!collapsed && (
          <h5 className="fw-bold text-dark mb-0 d-none d-md-block">
            Admin Panel
          </h5>
        )}
        <button
          className="btn btn-sm btn-light border d-md-none d-inline-block"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <button
          className="btn btn-sm btn-light border d-none d-md-inline-block"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
      </div>

      {/* Navigation Menu */}
      <ul className="nav flex-column gap-2">
        {menu.map((item) => {
          const isActive = currentSection === item.key;
          const btnClass = isActive
            ? "btn-warning text-dark"
            : "btn-outline-secondary";
          const buttonContent = (
            <li className="nav-item">
              <button
                className={`btn d-flex align-items-center w-100 fw-semibold px-2 py-2 rounded ${btnClass}`}
                onClick={() => setCurrentSection(item.key)}
              > 
                <span className="me-2 fs-5">{item.icon}</span>
                {!collapsed && (
                  <span className="text-truncate">{item.label}</span>
                )}
              </button>
            </li>
            
          );

          return collapsed ? (
            <OverlayTrigger
              key={item.key}
              placement="right"
              overlay={<Tooltip>{item.label}</Tooltip>}
            >
              {buttonContent}
            </OverlayTrigger>
          ) : (
            <React.Fragment key={item.key}>{buttonContent}</React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
