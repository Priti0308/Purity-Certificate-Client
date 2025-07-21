import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  FaPlus, FaEdit, FaTrash, FaSave, FaKey,
  FaCheck, FaTimes, FaFileExcel, FaFilePdf, FaSearch
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminOverview = ({ section }) => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({});
  const [newVendor, setNewVendor] = useState({
    name: '', mobile: '', businessName: '', password: '', address: ''
  });

  const vendorsPerPage = 10;

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

  // Filter + pagination logic
  const filtered = vendors.filter(v =>
    [v.name, v.mobile, v.businessName, v.address, v.status]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / vendorsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * vendorsPerPage,
    currentPage * vendorsPerPage
  );

  // --- Add Vendor ---
  const handleInputChange = e => {
    setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
  };
  const handleAddVendor = async e => {
    e.preventDefault();
    try {
      await axios.post('/vendors', newVendor);
      toast.success('Vendor added');
      setNewVendor({ name: '', mobile: '', businessName: '', password: '', address: '' });
      fetchVendors();
    } catch {
      toast.error('Add vendor failed');
    }
  };

  // --- Edit / Save ---
  const handleEdit = v => {
    setEditMode(v._id);
    setEditData(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      const res = await axios.put(`/vendors/${editMode}`, editData);
      const updatedVendor = res.data;
      setVendors(prev =>
        prev.map(v => (v._id === updatedVendor._id ? updatedVendor : v))
      );
      toast.success('Updated Successfully');
      setEditMode(null);
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };


  // --- Delete / Password Reset ---
  const handleDelete = async id => {
    if (window.confirm('Delete this vendor?')) {
      await axios.delete(`/vendors/${id}`);
      toast.success('Deleted');
      fetchVendors();
    }
  };
  const handleSetPassword = async id => {
    const pw = prompt('Enter new password:');
    if (pw) {
      await axios.put(`/vendors/${id}/set-password`, { password: pw });
      toast.success('Password set');
    }
  };

  // --- Approve / Reject ---
  const handleApprove = async id => {
    await axios.put(`/vendors/${id}/approve`);
    toast.success('Approved');
    setVendors(v => v.filter(x => x._id !== id));
  };
  const handleReject = async id => {
    await axios.put(`/vendors/${id}/reject`);
    toast.error('Rejected');
    setVendors(v => v.filter(x => x._id !== id));
  };

  // --- Export ---
  const exportExcel = () => {
    const data = filtered.map(v => ({
      Name: v.name,
      Mobile: v.mobile,
      Business: v.businessName,
      Address: v.address,
      Status: v.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendors');
    XLSX.writeFile(wb, 'vendors.xlsx');
  };
  const exportPDF = () => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Name', 'Mobile', 'Business', 'Address', 'Status']],
    body: filtered.map(v => [
      v.name,
      v.mobile,
      v.businessName,
      v.address || '—',
      v.status
    ]),
  });
  doc.save('vendors.pdf');
};

  // --- Header for table ---
  const header = (
    <thead className="table-dark">
      <tr>
        <th>Name</th>
        <th>Mobile</th>
        <th>Business</th>
        <th>Address</th>
        <th>Status</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
  );

  return (
    <div className="p-4">
      {/* === Add Vendor === */}
      {section === 'add' && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning fw-bold">Add New Vendor</div>
          <div className="card-body">
            <form onSubmit={handleAddVendor}>
              <div className="row g-3">
                {['name','mobile','businessName','password','address'].map(f => (
                  <div key={f} className="col-md-6">
                    <label className="form-label text-capitalize">{f}</label>
                    <input
                      name={f}
                      type={f==='password'?'password':'text'}
                      className="form-control"
                      placeholder={`Enter ${f}`}
                      value={newVendor[f]}
                      onChange={handleInputChange}
                      required={f!=='address'}
                    />
                  </div>
                ))}
              </div>
              <button className="btn btn-success mt-3">
                <FaPlus className="me-1"/> Add Vendor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === Pending Registrations === */}
      {section === 'pending' && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning fw-bold">Pending Vendor Registrations</div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-hover align-middle">
              {header}
              <tbody>
                {vendors.filter(v => v.status==='pending').map(v => (
                  <tr key={v._id}>
                    <td>{v.name}</td>
                    <td>{v.mobile}</td>
                    <td>{v.businessName}</td>
                    <td>{v.address || '—'}</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-success me-2" onClick={()=>handleApprove(v._id)}><FaCheck/></button>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleReject(v._id)}><FaTimes/></button>
                    </td>
                  </tr>
                ))}
                {vendors.filter(v => v.status==='pending').length===0 && (
                  <tr><td colSpan="6" className="text-center text-muted">No pending registrations</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === Manage Profiles === */}
      {section === 'manage' && (
        <div className="card shadow mb-4">
          <div className="card-header bg-warning d-flex justify-content-between align-items-center">
            <span>Manage Vendor Profiles</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={exportExcel}><FaFileExcel className="me-1"/>Excel</button>
              <button className="btn btn-sm btn-danger" onClick={exportPDF}><FaFilePdf className="me-1"/>PDF</button>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3 d-flex justify-content-between">
              <div className="input-group w-50">
                <span className="input-group-text"><FaSearch/></span>
                <input
                  className="form-control"
                  placeholder="Search vendors..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                {header}
                <tbody>
                  {paginated.length>0 ? paginated.map(v => (
                    <tr key={v._id}>
                      {editMode===v._id ? (
                        <>
                          <td><input className="form-control" name="name"        value={editData.name}         onChange={handleEditChange}/></td>
                          <td><input className="form-control" name="mobile"      value={editData.mobile}       onChange={handleEditChange}/></td>
                          <td><input className="form-control" name="businessName"value={editData.businessName} onChange={handleEditChange}/></td>
                          <td><input className="form-control" name="address"     value={editData.address}      onChange={handleEditChange} placeholder="Enter address"/></td>
                          <td><span className={`badge ${v.status==='approved'?'bg-success':'bg-warning'}`}>{v.status}</span></td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-success me-2" onClick={handleSave}><FaSave/></button>
                            <button className="btn btn-sm btn-secondary" onClick={()=>setEditMode(null)}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{v.name}</td>
                          <td>{v.mobile}</td>
                          <td>{v.businessName}</td>
                          <td>{v.address || '—'}</td>  {/* Updated address always shows */}
                          <td><span className={`badge ${v.status==='approved'?'bg-success':'bg-warning'}`}>{v.status}</span></td>
                          <td className="text-center">
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                              <button className="btn btn-sm btn-info me-2"    onClick={()=>handleEdit(v)}><FaEdit/></button>
                              <button className="btn btn-sm btn-danger me-2"  onClick={()=>handleDelete(v._id)}><FaTrash/></button>
                              <button className="btn btn-sm btn-secondary"   onClick={()=>handleSetPassword(v._id)}><FaKey/></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )) : (
                    <tr><td colSpan="6" className="text-center text-muted">No vendors found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages>1 && (
              <nav className="d-flex justify-content-end mt-3">
                <ul className="pagination">
                  <li className={`page-item ${currentPage===1?'disabled':''}`}>
                    <button className="page-link" onClick={()=>setCurrentPage(p=>p-1)}>Previous</button>
                  </li>
                  {[...Array(totalPages)].map((_,i)=>(
                    <li key={i} className={`page-item ${currentPage===i+1?'active':''}`}>
                      <button className="page-link" onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage===totalPages?'disabled':''}`}>
                    <button className="page-link" onClick={()=>setCurrentPage(p=>p+1)}>Next</button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* No section selected */}
    </div>
  );
};

export default AdminOverview;