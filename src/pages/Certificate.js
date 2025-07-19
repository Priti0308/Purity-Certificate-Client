import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEdit, FaArrowLeft } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

const Certificate = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [editId, setEditId] = useState(null);
  const [metalType, setMetalType] = useState('Silver');
  const [certToDownload, setCertToDownload] = useState(null);

  const initialForm = {
    serialNo: '',
    name: '',
    item: '',
    fineness: '',
    grossWeight: '',
    date: '',
    leftImage: 'https://icon2.cleanpng.com/20180407/aqw/avbova9yv.webp',
    rightImage: 'https://icon2.cleanpng.com/20180407/aqw/avbova9yv.webp',
    headerTitle: '',
    headerSubtitle: '',
    address: '',
    phone: '',
    certificateTitle: '',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem('vendorToken');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        alert('Failed to load certificates');
      }
    };
    fetchCertificates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageURL = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, [side]: imageURL }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('vendorToken');
      const payload = {
        ...formData,
        metalType,
        certificateTitle: `${metalType.toUpperCase()} PURITY CERTIFICATE`,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      let response;
      if (editId) {
        response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/certificates/${editId}`,
          payload,
          { headers }
        );
        setCertificates((prev) =>
          prev.map((cert) => (cert._id === editId ? response.data : cert))
        );
        alert('✅ Certificate updated successfully.');
        setEditId(null);
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/certificates`,
          payload,
          { headers }
        );
        setCertificates((prev) => [...prev, response.data]);
        alert('✅ Certificate submitted successfully.');
      }

      // Delay reset to allow preview & user feedback
      setTimeout(() => {
        setFormData(initialForm);
        setMetalType('Silver');
      }, 1000);
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert(error.response?.data?.message || '❌ Failed to save certificate.');
    }
  };

  const handleEdit = (cert) => {
    setEditId(cert._id);
    setFormData({ ...cert });
    setMetalType(cert.certificateTitle?.includes('SILVER') ? 'Silver' : 'Gold');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const convertToWords = (num) => {
    if (!num || isNaN(num)) return '';
    const map = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const parts = num.toString().split('.');
    const integer = parts[0].split('').map((d) => map[d]).join(' ');
    const decimal = parts[1] ? parts[1].split('').map((d) => map[d]).join(' ') : '';
    return `${integer}${decimal ? ' Point ' + decimal : ''}`;
  };

  const CertificatePreview = ({ cert }) => (
    <div
      className="card mx-auto"
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        maxWidth: '816px',
        border: '2px solid #000',
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <img
            src={cert.leftImage}
            className="img-fluid"
            style={{ width: '64px', height: '64px', border: '1.5px solid #DC2626', objectFit: 'contain' }}
            alt="left"
          />
          <div className="text-center">
            <div style={{ color: '#FF4500' }} className="fs-6">श्री गणेशाय नमः</div>
            <h2 style={{ color: '#FF4500' }} className="fw-bold mb-1 fs-3">{cert.headerTitle || ''}</h2>
            <div className="fw-bold mb-1 fs-6">{cert.headerSubtitle || ''}</div>
            <div className="fs-6">{cert.address || ''}</div>
            <div className="fs-6">{cert.phone || ''}</div>
          </div>
          <img
            src={cert.rightImage}
            className="img-fluid"
            style={{ width: '64px', height: '64px', border: '1.5px solid #DC2626', objectFit: 'contain' }}
            alt="right"
          />
        </div>

        <div className="text-center my-4">
          <span className="badge" style={{ backgroundColor: '#FFFF00', color: '#fff', padding: '6px 12px' }}>
            {cert.certificateTitle || 'SILVER PURITY CERTIFICATE'}
          </span>
        </div>

        <div className="border border-dark rounded">
          <div className="d-flex border-bottom border-dark">
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Name</div>
            <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">{cert.name || ''}</div>
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>Sr.No</div>
            <div className="p-2 bg-light fw-bold fs-5" style={{ width: '128px' }}>{cert.serialNo || ''}</div>
          </div>
          <div className="d-flex border-bottom border-dark">
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Item</div>
            <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">{cert.item || ''}</div>
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>Date</div>
            <div className="p-2 bg-light fs-5" style={{ width: '128px' }}>{cert.date || ''}</div>
          </div>
          <div className="d-flex border-bottom border-dark">
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '80px' }}>Fineness</div>
            <div className="p-2 border-end border-dark bg-light flex-grow-1">
              <div className="fw-bold fs-4">{cert.fineness || ''} %</div>
              <div className="fs-6">{convertToWords(cert.fineness || '0')} Percent</div>
            </div>
            <div className="p-2 border-end border-dark fw-bold bg-light" style={{ width: '64px' }}>G.Wt</div>
            <div className="p-2 bg-light" style={{ width: '128px' }}>{cert.grossWeight || ''}</div>
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
                <div style={{ color: '#FF4500' }} className="fw-bold fs-6">For {cert.headerTitle || ''}</div>
                {/* <div style={{ color: '#FF4500' }} className="fs-6 mt-2"> {cert.name || ''}</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <button className="btn btn-outline-secondary mb-3 d-flex align-items-center" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </button>

      <h3 className="text-center text-cyan fw-bold mb-4">{editId ? 'Edit' : 'Create'} Purity Certificate</h3>

      <div className="card shadow mb-5">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Metal Type</label>
                <select className="form-select" value={metalType} onChange={(e) => setMetalType(e.target.value)}>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              {[
                { name: 'HeaderTitle', placeholder: 'Company name' },
                { name: 'HeaderSubtitle', placeholder: 'Company subtitle' },
                { name: 'Address', placeholder: 'Business address' },
                { name: 'Phone', placeholder: 'Phone' },
                { name: 'SerialNo', placeholder: 'Serial No' },
                { name: 'Name', placeholder: 'Customer Name' },
                { name: 'Item', placeholder: 'Item name' },
                { name: 'Fineness', placeholder: 'Purity %' },
                { name: 'GrossWeight', placeholder: 'Weight in grams' },
                { name: 'Date', placeholder: 'Date' },
              ].map((field) => (
                <div className="col-md-4" key={field.name}>
                  <label className="form-label">{field.name.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type={field.name === 'date' ? 'date' : 'text'}
                    name={field.name}
                    className="form-control"
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}

              <div className="col-md-6">
                <label className="form-label">Left Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImageUpload(e, 'leftImage')}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Right Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImageUpload(e, 'rightImage')}
                />
              </div>
            </div>
            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success">
                {editId ? 'Update' : 'Submit'} Certificate
              </button>
            </div>
          </form>
        </div>
      </div>

      {formData.name && formData.item && (
        <div className="my-4">
          <h5 className="text-center fw-bold">📄 Certificate Preview</h5>
          <CertificatePreview cert={formData} />
        </div>
      )}

      <div className="card shadow mb-5">
        <div className="card-header bg-dark text-white fw-bold">Submitted Certificates</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Sr.No</th>
                  <th>Name</th>
                  <th>Item</th>
                  <th>Fineness</th>
                  <th>Weight</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {certificates.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">No certificates found.</td>
                  </tr>
                ) : (
                  certificates.map((cert, idx) => (
                    <tr key={cert._id}>
                      <td>{idx + 1}</td>
                      <td>{cert.name}</td>
                      <td>{cert.item}</td>
                      <td>{cert.fineness}%</td>
                      <td>{cert.grossWeight}</td>
                      <td>{cert.date}</td>
                      <td className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-sm btn-danger" onClick={() => handleDownloadPDF(cert)}>
                          <FaDownload className="me-1" /> PDF
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(cert)}>
                          <FaEdit className="me-1" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hidden preview for PDF download */}
      {certToDownload && (
        <div id="download-preview" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <CertificatePreview cert={certToDownload} />
        </div>
      )}
    </div>
  );
};

export default Certificate;
