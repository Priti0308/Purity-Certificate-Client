
import React from 'react';
import {
  FaUserPlus,
  FaUserClock,
  FaUserEdit,
} from 'react-icons/fa';

const AdminSidebar = ({ currentSection, setCurrentSection }) => {
  const menu = [
    { key: 'add', label: 'Add Vendor', icon: <FaUserPlus className="me-2" /> },
    { key: 'pending', label: 'Pending Registrations', icon: <FaUserClock className="me-2" /> },
    { key: 'manage', label: 'Manage Profiles', icon: <FaUserEdit className="me-2" /> },
  ];

  return (
    <div className="bg-white shadow-sm p-3 border-end min-vh-100">
      <h5 className="fw-bold mb-4 text-dark text-center">Admin Panel</h5>
      <ul className="nav flex-column">
        {menu.map((item) => (
          <li className="nav-item mb-2" key={item.key}>
            <button
              className={`btn w-100 text-start fw-semibold d-flex align-items-center px-3 py-2 rounded 
                ${currentSection === item.key ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
              onClick={() => setCurrentSection(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
