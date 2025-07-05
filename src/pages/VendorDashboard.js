import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCircle,
  FaFileSignature,
  FaListAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaList,
  FaPhone,
  FaClock
} from 'react-icons/fa';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedVendor = localStorage.getItem('vendor');
        if (storedVendor) {
          const vendorData = JSON.parse(storedVendor);
          setVendor(vendorData);

          // Fetch real-time statistics
          const token = localStorage.getItem('token');
          const response = await axios.get('https://purity-certificate-server.onrender.com/api/certificates/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(response.data);

          // Fetch recent activities
          const activitiesResponse = await axios.get('https://purity-certificate-server.onrender.com/api/certificates/recent', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecentActivities(activitiesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <h4 className="text-danger mb-4">Access Denied: Please Log In</h4>
        <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      <h2 className="text-center fw-bold text-primary mb-5">
        Welcome to Your Dashboard
      </h2>

      <div className="row g-4">
        {/* Vendor Profile */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100 rounded-3 overflow-hidden">
            <div className="card-header bg-primary bg-gradient text-white py-3">
              <div className="d-flex align-items-center">
                <FaUserCircle className="me-2" size={24} />
                <h5 className="mb-0">Business Profile</h5>
              </div>
            </div>
            <div className="card-body bg-white">
              <div className="mb-3">
                <small className="text-muted">Business Name</small>
                <p className="fw-bold mb-2">{vendor.businessName}</p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Owner Name</small>
                <p className="fw-bold mb-2">{vendor.name}</p>
              </div>
              <div className="contact-info bg-light p-3 rounded-3">
                <h6 className="text-primary mb-3">Contact Information</h6>
                <div className="d-flex align-items-center mb-2">
                  <FaPhone className="text-muted me-2" />
                  <p className="mb-0">{vendor.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-8">
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/certificate" className="text-decoration-none">
                <div className="card shadow-sm border-0 bg-success bg-gradient text-white text-center p-4 h-100 rounded-3 hover-scale">
                  <FaFileSignature size={40} className="mb-3 mx-auto" />
                  <h5 className="fw-bold">New Certificate</h5>
                  <p className="small mb-0 opacity-75">Create a new purity certificate</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/certificate-list" className="text-decoration-none">
                <div className="card shadow-sm border-0 bg-warning bg-gradient text-dark text-center p-4 h-100 rounded-3 hover-scale">
                  <FaListAlt size={40} className="mb-3 mx-auto" />
                  <h5 className="fw-bold">Certificate History</h5>
                  <p className="small mb-0 opacity-75">View and manage your certificates</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center p-4 bg-white hover-lift">
            <FaList size={32} className="text-primary mb-3 mx-auto" />
            <h6 className="text-muted mb-2">Total Certificates</h6>
            <h3 className="fw-bold mb-0">{stats.total}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center p-4 bg-white hover-lift">
            <FaCheckCircle size={32} className="text-success mb-3 mx-auto" />
            <h6 className="text-muted mb-2">Approved</h6>
            <h3 className="fw-bold mb-0">{stats.approved}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center p-4 bg-white hover-lift">
            <FaHourglassHalf size={32} className="text-warning mb-3 mx-auto" />
            <h6 className="text-muted mb-2">Pending</h6>
            <h3 className="fw-bold mb-0">{stats.pending}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-3 text-center p-4 bg-white hover-lift">
            <FaTimesCircle size={32} className="text-danger mb-3 mx-auto" />
            <h6 className="text-muted mb-2">Rejected</h6>
            <h3 className="fw-bold mb-0">{stats.rejected}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex align-items-center">
                <FaClock className="text-primary me-2" />
                <h5 className="mb-0">Recent Activities</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="d-flex mb-3">
                    <div className="activity-dot"></div>
                    <div className="ms-3">
                      <p className="mb-1 fw-bold">{activity.action}</p>
                      <small className="text-muted">{new Date(activity.timestamp).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
        }
        .activity-timeline .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--bs-primary);
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};

export default VendorDashboard;
