import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FaEye,
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
  const [previewCert, setPreviewCert] = useState(null);
  const [certToDownload, setCertToDownload] = useState(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('vendorToken');
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/certificates`, {
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
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/certificates/stats`, {
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
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates/${certId}`,
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

  const handleDownloadPDF = async (cert) => {
    try {
      setCertToDownload(cert);
      await new Promise((resolve) => setTimeout(resolve, 700));

      const preview = document.getElementById('download-preview');
      if (!preview) return alert('Preview not found.');

      const canvas = await html2canvas(preview, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate_${cert.serialNo}.pdf`);
      setCertToDownload(null);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to process certificate');
    }
  };

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const token = localStorage.getItem('vendorToken');
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/certificates/${certId}`, {
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

  const CertificatePreview = ({ cert }) => {
    if (!cert) return null;
    return (
      <div
        className="card mx-auto"
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', maxWidth: '816px', border: '2px solid #000' }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <img src={cert.leftImage} alt="left" className="img-fluid" style={{ width: '64px', height: '64px', border: '1.5px solid #DC2626', objectFit: 'contain' }} />
            <div className="text-center">
              <div style={{ color: '#FF4500' }} className="fs-6">श्री गणेशाय नमः</div>
              <h2 style={{ color: '#FF4500' }} className="fw-bold mb-1 fs-3">{cert.headerTitle}</h2>
              <div className="fw-bold mb-1 fs-6">{cert.headerSubtitle}</div>
              <div className="fs-6">{cert.address}</div>
              <div className="fs-6">{cert.phone}</div>
            </div>
            <img src={cert.rightImage} alt="right" className="img-fluid" style={{ width: '64px', height: '64px', border: '1.5px solid #DC2626', objectFit: 'contain' }} />
          </div>

          <div className="text-center my-4">
            <span className="badge" style={{ backgroundColor: '#FF4500', color: '#fff', padding: '6px 12px' }}>{cert.certificateTitle || 'SILVER PURITY CERTIFICATE'}</span>
          </div>

          <div className="border border-dark rounded">
            <div className="d-flex border-bottom border-dark">
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Name</div>
              <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">{cert.name}</div>
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>S.No</div>
              <div className="p-2 bg-light fw-bold fs-5" style={{ width: '128px' }}>{cert.serialNo}</div>
            </div>
            <div className="d-flex border-bottom border-dark">
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Item</div>
              <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">{cert.item}</div>
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>Date</div>
              <div className="p-2 bg-light fs-5" style={{ width: '128px' }}>{new Date(cert.date).toLocaleDateString()}</div>
            </div>
            <div className="d-flex border-bottom border-dark">
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Fineness</div>
              <div className="p-2 border-end border-dark bg-light flex-grow-1">
                <div className="fw-bold fs-4">{cert.fineness} %</div>
                <div className="fs-6">{cert.fineness} Percent</div>
              </div>
              <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>G.Wt</div>
              <div className="p-2 bg-light" style={{ width: '128px' }}>{cert.grossWeight}</div>
            </div>
            <div className="bg-light border-bottom border-dark">
              <div className="d-flex">
                <div className="flex-grow-1 p-3 border-end border-dark">
                  <div style={{ color: '#FF4500' }} className="fw-bold fs-6 mb-2">Note</div>
                  <div className="fs-6">
                    <div>- We are not responsible for any melting defects</div>
                    <div>- We are responsible for more than 0.50% difference</div>
                    <div>- If any doubt ask for re-testing</div>
                  </div>
                </div>
                <div className="p-3 text-center" style={{ width: '256px' }}>
                  <div style={{ color: '#FF4500' }} className="fw-bold fs-6">For {cert.headerTitle}</div>
                  <div style={{ color: '#FF4500' }} className="fs-6 mt-2">Authorized by: {cert.name}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'pending': return 'bg-warning text-dark';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-black fw-bold mb-4">Certificate Management</h2>

      <div className="mb-4 d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Back
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
                <th>Sr.No</th>
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
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setPreviewCert(cert)} title="View">
                          <FaEye />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDownloadPDF(cert)} title="Download PDF">
                          <FaFilePdf />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cert._id)} title="Delete">
                          <FaTrash />
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(cert._id, 'approved')} title="Approve">
                          <FaCheck />
                        </button>
                        <button className="btn btn-sm btn-warning text-white" onClick={() => handleStatusChange(cert._id, 'rejected')} title="Reject">
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">No certificates found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {certToDownload && (
        <div id="download-preview" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <CertificatePreview cert={certToDownload} />
        </div>
      )}

      {previewCert && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Certificate Preview</h5>
                <button type="button" className="btn-close" onClick={() => setPreviewCert(null)}></button>
              </div>
              <div className="modal-body">
                <CertificatePreview cert={previewCert} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateList;
