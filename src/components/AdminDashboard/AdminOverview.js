import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { FaEdit, FaTrash, FaKey, FaCheck, FaTimes, FaSave } from 'react-icons/fa';

const AdminOverview = ({ section }) => {
  const [vendors, setVendors] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [newVendor, setNewVendor] = useState({
    name: '',
    mobile: '',
    businessName: '',
    password: '',
  });

  useEffect(() => {
    fetchVendors();
  }, [section]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/vendors', newVendor);
      alert('Vendor added successfully');
      setNewVendor({ name: '', mobile: '', businessName: '', password: '' });
      fetchVendors();
    } catch {
      alert('Failed to add vendor');
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEdit = (vendor) => {
    setEditMode(vendor._id);
    setEditData({ ...vendor });
  };

  const handleSave = async () => {
    await axios.put(`/vendors/${editMode}`, editData);
    setEditMode(null);
    fetchVendors();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this vendor?')) {
      await axios.delete(`/vendors/${id}`);
      fetchVendors();
    }
  };

  const handleSetPassword = async (id) => {
    const password = prompt('Enter new password:');
    if (password) {
      await axios.put(`/vendors/${id}/set-password`, { password });
      alert('Password set');
    }
  };

  const handleApprove = async (id) => {
    await axios.put(`/vendors/${id}/approve`);
    fetchVendors();
  };

  const handleReject = async (id) => {
    await axios.put(`/vendors/${id}/reject`);
    fetchVendors();
  };

  const renderTableHeader = () => (
    <thead style={{ backgroundColor: '#000', color: '#fff' }}>
      <tr>
        <th>Name</th>
        <th>Mobile</th>
        <th>Business</th>
        <th>Status</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
  );

  const renderVendorRow = (vendor) => (
    <tr key={vendor._id}>
      {editMode === vendor._id ? (
        <>
          <td><input className="form-control" name="name" value={editData.name} onChange={handleEditChange} placeholder="Enter name" /></td>
          <td><input className="form-control" name="mobile" value={editData.mobile} onChange={handleEditChange} placeholder="Enter mobile" /></td>
          <td><input className="form-control" name="businessName" value={editData.businessName} onChange={handleEditChange} placeholder="Enter business" /></td>
          <td><span className={`badge ${vendor.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>{vendor.status}</span></td>
          <td className="text-center">
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button className="btn btn-sm btn-success" onClick={handleSave}><FaSave className="me-1" />Save</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setEditMode(null)}>Cancel</button>
            </div>
          </td>
        </>
      ) : (
        <>
          <td>{vendor.name}</td>
          <td>{vendor.mobile}</td>
          <td>{vendor.businessName}</td>
          <td><span className={`badge ${vendor.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>{vendor.status}</span></td>
          <td className="text-center">
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <button className="btn btn-sm btn-info" onClick={() => handleEdit(vendor)}><FaEdit className="me-1" />Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vendor._id)}><FaTrash className="me-1" />Delete</button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleSetPassword(vendor._id)}><FaKey className="me-1" />Password</button>
            </div>
          </td>
        </>
      )}
    </tr>
  );

  return (
    <div className="p-4">
      {section === 'add' && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning text-dark fw-bold">Add New Vendor</div>
          <div className="card-body">
            <form onSubmit={handleAddVendor}>
              <div className="row g-3">
                {['name', 'mobile', 'businessName', 'password'].map((field, idx) => (
                  <div className="col-md-6" key={idx}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      type={field === 'password' ? 'password' : 'text'}
                      name={field}
                      value={newVendor[field]}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder={`Enter ${field}`}
                      required
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-success mt-4">Add Vendor</button>
            </form>
          </div>
        </div>
      )}

      {(section === 'all' || section === 'manage') && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning text-dark fw-bold">
            {section === 'all' ? 'All Vendors' : 'Manage Vendor Profiles'}
          </div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover text-nowrap align-middle">
              {renderTableHeader()}
              <tbody>{vendors.map(renderVendorRow)}</tbody>
            </table>
          </div>
        </div>
      )}

      {section === 'pending' && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning text-dark fw-bold">Pending Vendor Registrations</div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover text-nowrap align-middle">
              {renderTableHeader()}
              <tbody>
                {vendors.filter(v => v.status === 'pending').map(vendor => (
                  <tr key={vendor._id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.mobile}</td>
                    <td>{vendor.businessName}</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                    <td className="text-center">
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        <button className="btn btn-sm btn-success" onClick={() => handleApprove(vendor._id)}><FaCheck className="me-1" />Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleReject(vendor._id)}><FaTimes className="me-1" />Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
