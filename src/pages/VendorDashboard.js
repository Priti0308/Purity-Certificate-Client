import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserCircle,
  FaFileSignature,
  FaListAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaList,
} from 'react-icons/fa';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = {
    total: 12,
    approved: 7,
    pending: 4,
    rejected: 1,
  };

  useEffect(() => {
    const storedVendor = localStorage.getItem('vendor');
    if (storedVendor) {
      setVendor(JSON.parse(storedVendor));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-muted">Loading Vendor Dashboard...</h4>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-danger">Vendor not logged in!</h4>
        <Link to="/login" className="btn btn-primary mt-3">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-primary mb-5">Vendor Dashboard</h2>

      <div className="row g-4">
        {/* Vendor Profile */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <FaUserCircle className="me-2" /> Vendor Profile
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {vendor.name}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Mobile:</strong> {vendor.mobile || 'N/A'}</p>
              <p><strong>Business:</strong> {vendor.businessName}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-8">
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/certificate" className="text-decoration-none">
                <div className="card shadow bg-success text-white text-center p-4 h-100">
                  <FaFileSignature size={36} className="mb-3" />
                  <h5>Create New Certificate</h5>
                  <p className="small">Start issuing a new purity certificate.</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/certificate-list" className="text-decoration-none">
                <div className="card shadow bg-warning text-dark text-center p-4 h-100">
                  <FaListAlt size={36} className="mb-3" />
                  <h5>View All Certificates</h5>
                  <p className="small">Access submitted certificates and history.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Summary Section */}
      <div className="row g-4 mt-5">
        <div className="col-md-3">
          <div className="card shadow text-center bg-light p-3">
            <FaList size={30} className="text-secondary mb-2" />
            <h6>Total Certificates</h6>
            <h4 className="fw-bold">{stats.total}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow text-center bg-light p-3">
            <FaCheckCircle size={30} className="text-success mb-2" />
            <h6>Approved</h6>
            <h4 className="fw-bold">{stats.approved}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow text-center bg-light p-3">
            <FaHourglassHalf size={30} className="text-warning mb-2" />
            <h6>Pending</h6>
            <h4 className="fw-bold">{stats.pending}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow text-center bg-light p-3">
            <FaTimesCircle size={30} className="text-danger mb-2" />
            <h6>Rejected</h6>
            <h4 className="fw-bold">{stats.rejected}</h4>
          </div>
        </div>
      </div>

      {/* Quick Message Section */}
      <div className="card mt-5 shadow border-0">
        <div className="card-header bg-dark text-white fw-bold">Quick Guide</div>
        <div className="card-body">
          <p className="text-muted">
            Use the dashboard to manage your purity certificates efficiently. Create new ones, track approvals,
            and review your certificate history. For issues, contact admin support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
