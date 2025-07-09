import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FaFilePdf,
  FaTrash,
  FaSpinner,
  FaArrowLeft,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const CertificateList = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      const res = await axios.get('https://purity-certificate-server.onrender.com/api/certificates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('vendorToken');
      const res = await axios.get('https://purity-certificate-server.onrender.com/api/certificates/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
    fetchStats();
  }, [fetchCertificates, fetchStats]);

  const handleStatusChange = async (certId, status) => {
    try {
      const token = localStorage.getItem('vendorToken');
      await axios.put(
        `https://purity-certificate-server.onrender.com/api/certificates/${certId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Certificate ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
      fetchCertificates();
      fetchStats();
    } catch (err) {
      console.error(`Error updating certificate status to ${status}:`, err);
      alert(`Failed to update certificate status to ${status}`);
    }
  };

  const handleGeneratePDF = async (cert) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = `
      <div style="padding: 40px; font-family: Arial; border: 2px solid #000;">
        <h2 style="text-align: center; color: #FF4500;">श्री गणेशाय नमः</h2>
        <h2 style="text-align: center; color: #B22222;">${cert.headerTitle || 'SWARANJALE'}</h2>
        <h3 style="text-align: center;">${cert.certificateTitle || 'Purity Certificate'}</h3>
        <p><strong>Serial No:</strong> ${cert.serialNo}</p>
        <p><strong>Name:</strong> ${cert.name}</p>
        <p><strong>Item:</strong> ${cert.item}</p>
        <p><strong>Fineness:</strong> ${cert.fineness}%</p>
        <p><strong>Weight:</strong> ${cert.grossWeight} g</p>
        <p><strong>Date:</strong> ${new Date(cert.date).toLocaleDateString()}</p>
        ${cert.notes ? `<p><strong>Notes:</strong> ${cert.notes}</p>` : ''}
        <div style="margin-top: 40px; text-align: right;">
          <p>For ${cert.headerTitle || 'SWARANJALE'}</p>
          <p>Authorized by: ${cert.name}</p>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const canvas = await html2canvas(container);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`certificate_${cert.serialNo}.pdf`);

    document.body.removeChild(container);
  };

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = localStorage.getItem('vendorToken');
      await axios.delete(`https://purity-certificate-server.onrender.com/api/certificates/${certId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Certificate deleted successfully.');
      fetchCertificates();
      fetchStats();
    } catch (err) {
      console.error('Error deleting certificate:', err);
      alert('Failed to delete certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-4">Certificate Management</h2>

      <div className="mb-4 d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" />
          Back
        </button>
        <div>
          <span className="badge bg-primary me-2">Total: {stats.total}</span>
          <span className="badge bg-success me-2">Approved: {stats.approved}</span>
          <span className="badge bg-warning text-dark me-2">Pending: {stats.pending}</span>
          <span className="badge bg-danger">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="card shadow border-0">
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Serial No</th>
                <th>Name</th>
                <th>Item</th>
                <th>Fineness (%)</th>
                <th>Weight (g)</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                certificates.map((cert, idx) => (
                  <tr key={cert._id || idx}>
                    <td>{idx + 1}</td>
                    <td>{cert.serialNo}</td>
                    <td>{cert.name}</td>
                    <td>{cert.item}</td>
                    <td>{cert.fineness}</td>
                    <td>{cert.grossWeight}</td>
                    <td>{new Date(cert.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusColor(cert.status)}`}>
                        {cert.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleGeneratePDF(cert)}
                          title="Download PDF"
                        >
                          <FaFilePdf />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cert._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusChange(cert._id, 'approved')}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-warning text-white"
                          onClick={() => handleStatusChange(cert._id, 'rejected')}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No certificates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-success';
    case 'pending':
      return 'bg-warning text-dark';
    case 'rejected':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

export default CertificateList;