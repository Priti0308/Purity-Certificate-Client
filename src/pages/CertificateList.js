import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaFilePdf, FaTrash, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from "react-router-dom";

const CertificateList = () => {
  const navigate = useNavigate(); 
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('vendorToken');
      const res = await axios.get('https://purity-certificate-server.onrender.com/api/certificates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch certificates. Please try again.');
      console.error('Error fetching certificates:', err);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleView = (cert) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Certificate ${cert.serialNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .content { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .footer { text-align: right; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="color: #2c3e50;">SWARANJALE</h2>
            <h3 style="color: #34495e;">Purity Certificate</h3>
          </div>
          <div class="content">
            <p><strong>Serial No:</strong> ${cert.serialNo}</p>
            <p><strong>Name:</strong> ${cert.name}</p>
            <p><strong>Item:</strong> ${cert.item}</p>
            <p><strong>Fineness:</strong> ${cert.fineness}%</p>
            <p><strong>Weight:</strong> ${cert.grossWeight} g</p>
            <p><strong>Date:</strong> ${cert.date}</p>
            ${cert.notes ? `<p><strong>Notes:</strong> ${cert.notes}</p>` : ''}
          </div>
          <div class="footer">
            <p>For SWARANJALE</p>
          </div>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleGeneratePDF = async (cert) => {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="padding: 20px; font-family: Arial;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2c3e50;">SWARANJALE</h2>
          <h3 style="color: #34495e;">Purity Certificate</h3>
        </div>
        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <p><strong>Serial No:</strong> ${cert.serialNo}</p>
          <p><strong>Name:</strong> ${cert.name}</p>
          <p><strong>Item:</strong> ${cert.item}</p>
          <p><strong>Fineness:</strong> ${cert.fineness}%</p>
          <p><strong>Weight:</strong> ${cert.grossWeight} g</p>
          <p><strong>Date:</strong> ${cert.date}</p>
          ${cert.notes ? `<p><strong>Notes:</strong> ${cert.notes}</p>` : ''}
        </div>
        <div style="text-align: right; margin-top: 20px;">
          <p>For SWARANJALE</p>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    
    try {
      const canvas = await html2canvas(container);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate_${cert.serialNo}.pdf`);
    } finally {
      document.body.removeChild(container);
    }
  };

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      const token = localStorage.getItem('vendorToken');
      await axios.delete(`https://purity-certificate-server.onrender.com/api/certificates/${certId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCertificates();
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      <h2 className="text-center text-primary fw-bold mb-4">
        Certificate Management
      </h2>
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)} // Go back one step
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>

      <div className="card shadow border-0">
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="fw-semibold">Sr.No</th>
                <th className="fw-semibold">Serial No</th>
                <th className="fw-semibold">Name</th>
                <th className="fw-semibold">Item</th>
                <th className="fw-semibold">Fineness (%)</th>
                <th className="fw-semibold">Weight (g)</th>
                <th className="fw-semibold">Date</th>
                <th className="fw-semibold text-center">Actions</th>
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
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleView(cert)}
                          title="View Certificate"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleGeneratePDF(cert)}
                          title="Download PDF"
                        >
                          <FaFilePdf className="me-1" /> PDF
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cert._id)}
                          title="Delete Certificate"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
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

export default CertificateList;
