// src/pages/Certificate.js
import React, { useState } from 'react';
import { FaTrash, FaPrint, FaEye, FaPlus } from 'react-icons/fa';

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    goldPurity: '',
    silverPurity: '',
    weight: '',
    remarks: '',
    logoFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logoFile') {
      setForm({ ...form, logoFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCertificate = {
      id: Date.now(),
      ...form,
    };
    setCertificates([...certificates, newCertificate]);
    setForm({
      customerName: '',
      goldPurity: '',
      silverPurity: '',
      weight: '',
      remarks: '',
      logoFile: null,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(certificates.filter(cert => cert.id !== id));
    }
  };

  const handlePrint = (cert) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { display: flex; justify-content: space-between; align-items: center; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            ${cert.logoFile ? `<img src="${URL.createObjectURL(cert.logoFile)}" width="80" />` : ''}
            <h2>PURITY CERTIFICATE</h2>
            ${cert.logoFile ? `<img src="${URL.createObjectURL(cert.logoFile)}" width="80" />` : ''}
          </div>
          <hr />
          <div class="section"><span class="label">Customer Name:</span> ${cert.customerName}</div>
          <div class="section"><span class="label">Gold Purity:</span> ${cert.goldPurity}%</div>
          <div class="section"><span class="label">Silver Purity:</span> ${cert.silverPurity}%</div>
          <div class="section"><span class="label">Weight:</span> ${cert.weight}g</div>
          <div class="section"><span class="label">Remarks:</span> ${cert.remarks}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-primary mb-4">Certificate Management</h2>

      {/* Create Certificate Form */}
      <div className="card shadow mb-5">
        <div className="card-header bg-success text-white">
          <FaPlus className="me-2" /> Create Certificate
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gold Purity (%)</label>
              <input
                type="number"
                name="goldPurity"
                value={form.goldPurity}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 91.6"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Silver Purity (%)</label>
              <input
                type="number"
                name="silverPurity"
                value={form.silverPurity}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 99.9"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Weight (grams)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter weight"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Upload Logo (optional)</label>
              <input
                type="file"
                name="logoFile"
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="form-control"
                placeholder="Additional notes"
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-success">
                <FaPlus className="me-1" /> Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white fw-bold">Created Certificates</div>
        <div className="card-body table-responsive">
          {certificates.length === 0 ? (
            <p className="text-muted">No certificates created yet.</p>
          ) : (
            <table className="table table-bordered table-hover text-nowrap align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Gold (%)</th>
                  <th>Silver (%)</th>
                  <th>Weight (g)</th>
                  <th>Remarks</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={cert.id}>
                    <td>{index + 1}</td>
                    <td>{cert.customerName}</td>
                    <td>{cert.goldPurity}</td>
                    <td>{cert.silverPurity}</td>
                    <td>{cert.weight}</td>
                    <td>{cert.remarks}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <button className="btn btn-sm btn-primary" onClick={() => alert('View feature coming soon')}>
                          <FaEye className="me-1" /> View
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => handlePrint(cert)}>
                          <FaPrint className="me-1" /> Print
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cert.id)}>
                          <FaTrash className="me-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
