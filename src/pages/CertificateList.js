// src/pages/CertificateList.js
import React, { useState } from 'react';
import { FaEye, FaPrint, FaTrash } from 'react-icons/fa';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      customer: 'Ravi Patel',
      goldPurity: '91.6',
      silverPurity: '99.9',
      weight: '22',
      remarks: 'Gold necklace',
    },
    {
      id: 2,
      customer: 'Anjali Shah',
      goldPurity: '92',
      silverPurity: '',
      weight: '15',
      remarks: 'Gold ring',
    },
    {
      id: 3,
      customer: 'Amit Rao',
      goldPurity: '',
      silverPurity: '99.5',
      weight: '40',
      remarks: 'Silver chain',
    },
  ]);

  const handlePrint = (cert) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Print Certificate</title></head><body>
      <h2>Purity Certificate</h2>
      <p><strong>Customer:</strong> ${cert.customer}</p>
      <p><strong>Gold Purity:</strong> ${cert.goldPurity}%</p>
      <p><strong>Silver Purity:</strong> ${cert.silverPurity}%</p>
      <p><strong>Weight:</strong> ${cert.weight}g</p>
      <p><strong>Remarks:</strong> ${cert.remarks}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      setCertificates(certificates.filter((cert) => cert.id !== id));
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-4">All Submitted Certificates</h2>

      <div className="card shadow border-0">
        <div className="card-body table-responsive">
          {certificates.length === 0 ? (
            <p className="text-muted">No certificates available.</p>
          ) : (
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Gold Purity</th>
                  <th>Silver Purity</th>
                  <th>Weight (g)</th>
                  <th>Remarks</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((cert, index) => (
                  <tr key={cert.id}>
                    <td>{index + 1}</td>
                    <td>{cert.customer}</td>
                    <td>{cert.goldPurity || '-'}</td>
                    <td>{cert.silverPurity || '-'}</td>
                    <td>{cert.weight}</td>
                    <td>{cert.remarks}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-info me-2" title="View">
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Print"
                        onClick={() => handlePrint(cert)}
                      >
                        <FaPrint />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => handleDelete(cert.id)}
                      >
                        <FaTrash />
                      </button>
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

export default CertificateList;
