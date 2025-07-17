import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaFileSignature, FaListAlt,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle,
  FaList, FaClock, FaEdit, FaSave
} from 'react-icons/fa';

const VendorDashboard = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [previewLogo, setPreviewLogo] = useState(null);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentActivities, setRecentActivities] = useState([]);


  // Load vendor and dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedVendor = localStorage.getItem('vendor');
        const token = localStorage.getItem('vendorToken');

        if (storedVendor && token) {
          const vendorData = JSON.parse(storedVendor);
          setVendor(vendorData);
          setEditData(vendorData);
          if (vendorData.logo) setPreviewLogo(vendorData.logo);

          const resStats = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/certificates/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(resStats.data);

          const resRecent = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/certificates/recent`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecentActivities(resRecent.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 200 * 1024) {
      alert("❌ Please select an image smaller than 200KB.");
      return;
    }

    setEditData((prev) => ({ ...prev, logoFile: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
      alert("✅ Logo selected successfully.");
    };
    reader.readAsDataURL(file);
  }
};


  const handleSave = async () => {
  try {
    const token = localStorage.getItem('vendorToken');

    if (!editData._id) {
      alert("❌ Vendor ID is missing. Please re-login.");
      return;
    }

    const formData = new FormData();
    // Add text fields
    formData.append('name', editData.name || '');
    formData.append('mobile', editData.mobile || '');
    formData.append('businessName', editData.businessName || '');
    formData.append('address', editData.address || '');

    // Add logo file if it exists
    if (editData.logoFile) {
      formData.append('logo', editData.logoFile);
    }

    const res = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/api/vendors/me`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    setVendor(res.data);
    localStorage.setItem('vendor', JSON.stringify(res.data));
    setEditing(false);
    alert('✅ Profile updated successfully.');
  } catch (err) {
    console.error('Update error:', err);
    alert(err.response?.data?.message || '❌ Failed to update profile.');
  }
};


  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <h4 className="text-danger mb-4">Access Denied: Please Log In</h4>
        <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      <h2 className="text-center fw-bold text-primary mb-4">Welcome to Your Dashboard</h2>

      <div className="row g-4">
        {/* Profile */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4 h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {(previewLogo || vendor.logo) && (
                  <img
                    src={previewLogo || vendor.logo}
                    alt="Logo"
                    className="rounded-circle border me-2"
                    style={{ height: 40, width: 40, objectFit: 'cover' }}
                  />
                )}
                <h5 className="mb-0">Business Profile</h5>
              </div>
              {!editing ? (
                <button className="btn btn-sm btn-light" onClick={() => setEditing(true)}><FaEdit /></button>
              ) : (
                <button className="btn btn-sm btn-success" onClick={handleSave}><FaSave /></button>
              )}
            </div>
            <div className="card-body">
              <label className="form-label">Business Name</label>
              <input type="text" name="businessName" disabled={!editing} className="form-control mb-3" value={editData.businessName} onChange={handleInputChange} />

              <label className="form-label">Owner Name</label>
              <input type="text" name="name" disabled={!editing} className="form-control mb-3" value={editData.name} onChange={handleInputChange} />

              <label className="form-label">Mobile</label>
              <input type="text" name="mobile" disabled={!editing} className="form-control mb-3" value={editData.mobile} onChange={handleInputChange} />

              <label className="form-label">Address</label>
              <input type="text" name="address" disabled={!editing} className="form-control mb-3" value={editData.address || ''} onChange={handleInputChange} />

              <label className="form-label">Business Logo (Optional)</label>
              <input type="file" accept="image/*" disabled={!editing} onChange={handleLogoChange} className="form-control" />
            </div>
          </div>
        </div>

        {/* Actions + Stats */}
        <div className="col-md-8">
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/certificate" className="text-decoration-none">
                <div className="card bg-success text-white text-center p-4 h-100 hover-scale rounded-4">
                  <FaFileSignature size={40} className="mb-3" />
                  <h5 className="fw-bold">New Certificate</h5>
                  <p className="small opacity-75">Create a new purity certificate</p>
                </div>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/certificate-list" className="text-decoration-none">
                <div className="card bg-warning text-dark text-center p-4 h-100 hover-scale rounded-4">
                  <FaListAlt size={40} className="mb-3" />
                  <h5 className="fw-bold">Certificate History</h5>
                  <p className="small opacity-75">View and manage your certificates</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="row g-4 mt-1">
            {[
              { label: 'Total Certificates', icon: <FaList />, color: 'primary', count: stats.total },
              { label: 'Approved', icon: <FaCheckCircle />, color: 'success', count: stats.approved },
              { label: 'Pending', icon: <FaHourglassHalf />, color: 'warning', count: stats.pending },
              { label: 'Rejected', icon: <FaTimesCircle />, color: 'danger', count: stats.rejected },
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="card text-center p-4 shadow-sm hover-lift bg-white rounded-4">
                  <div className={`text-${item.color} mb-3`}>{item.icon}</div>
                  <h6 className="text-muted">{item.label}</h6>
                  <h3 className="fw-bold">{item.count}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Activities */}
          <div className="card shadow-sm border-0 rounded-4 mt-4">
            <div className="card-header bg-white border-0 py-3">
              <h5><FaClock className="me-2 text-primary" />Recent Activities</h5>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, idx) => (
                  <div key={idx} className="d-flex mb-3">
                    <div className="activity-dot"></div>
                    <div className="ms-3">
                      <p className="fw-bold mb-1">{act.action}</p>
                      <small className="text-muted">{new Date(act.timestamp).toLocaleString()}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-scale:hover {
          transform: scale(1.02);
          transition: 0.2s;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
        }
        .activity-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--bs-primary);
          margin-top: 6px;
        }
      `}</style>
    </div>
  );
};

export default VendorDashboard;
