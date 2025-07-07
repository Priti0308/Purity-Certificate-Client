// src/pages/Certificate.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaDownload, FaEdit, FaArrowLeft } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const Certificate = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    serialNo: "",
    name: "",
    item: "",
    fineness: "",
    grossWeight: "",
    date: "",
    leftImage: "",
    rightImage: "",
    headerTitle: "",
    headerSubtitle: "",
    address: "",
    phone: "",
    certificateTitle: "",
  });

  const fetchCertificates = useCallback(async () => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      alert("⚠️ Please login to access certificates.");
      navigate("/vendor-login");
      return;
    }
    try {
      const res = await axios.get("https://purity-certificate-server.onrender.com/api/certificates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("❌ Unauthorized access. Please login again.");
      navigate("/vendor-login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, [side]: imageURL }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      alert("❌ Please login first.");
      return navigate("/vendor-login");
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editId) {
        await axios.put(`https://purity-certificate-server.onrender.com/api/certificates/${editId}`, formData, { headers });
        alert("✅ Certificate updated successfully.");
        setEditId(null);
      } else {
        await axios.post("https://purity-certificate-server.onrender.com/api/certificates", formData, { headers });
        alert("✅ Certificate submitted successfully.");
      }

      setFormData({
        serialNo: "",
        name: "",
        item: "",
        fineness: "",
        grossWeight: "",
        date: "",
        leftImage: "",
        rightImage: "",
        headerTitle: "",
        headerSubtitle: "",
        address: "",
        phone: "",
        certificateTitle: "",
      });

      fetchCertificates();
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Submission failed. Try again.");
    }
  };

  const convertToWords = (num) => {
    if (!num || isNaN(num)) return "";
    const map = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const parts = num.toString().split(".");
    const integer = parts[0].split("").map((d) => map[d] || "").join(" ");
    const decimal = parts[1] ? parts[1].split("").map((d) => map[d] || "").join(" ") : "";
    return `${integer}${decimal ? " Point " + decimal : ""}`;
  };

  const CertificatePreview = ({ cert }) => (
    <div id="preview" style={{ padding: 30, width: "100%", maxWidth: 1122, margin: "0 auto", border: "2px solid black", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src={cert.leftImage || ""} style={{ width: 70, height: 70 }} alt="left" />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12 }}>Sri Ganeshaya Namaha</div>
          <h2 style={{ margin: 4, color: "#d9534f" }}>{cert.headerTitle || "SWARANJALE"}</h2>
          <div style={{ fontSize: 13 }}>{cert.headerSubtitle || "Melting & Testing"}</div>
          <div style={{ fontSize: 11 }}>{cert.address}</div>
          <div style={{ fontSize: 11 }}>{cert.phone}</div>
        </div>
        <img src={cert.rightImage || ""} style={{ width: 70, height: 70 }} alt="right" />
      </div>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <span style={{ backgroundColor: "yellow", padding: "6px 25px", fontSize: 16, fontWeight: "bold", border: "1px solid black" }}>
          {cert.certificateTitle || "PURITY CERTIFICATE"}
        </span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }} border="1">
        <tbody>
          <tr><td><strong>Name</strong></td><td>{cert.name}</td><td><strong>S.No</strong></td><td>{cert.serialNo}</td></tr>
          <tr><td><strong>Item</strong></td><td>{cert.item}</td><td><strong>Date</strong></td><td>{cert.date}</td></tr>
          <tr><td><strong>Fineness</strong></td><td>{cert.fineness} %</td><td><strong>G.Wt</strong></td><td>{cert.grossWeight}</td></tr>
          <tr><td><strong>In Words</strong></td><td colSpan="3">{convertToWords(cert.fineness)} Percent</td></tr>
        </tbody>
      </table>

      <div style={{ marginTop: 15, fontSize: 13 }}>
        <strong>Note:</strong>
        <ul style={{ paddingLeft: 18 }}>
          <li>We are not responsible for any melting defects</li>
          <li>We are responsible for more than 0.50% difference</li>
          <li>If any doubt ask for re-testing</li>
        </ul>
      </div>

      <div style={{ textAlign: "right", marginTop: 40 }}>
        <strong>For {cert.headerTitle || "SWARANJALE"}</strong>
      </div>
    </div>
  );

  const handleDownloadPDF = async (cert) => {
    const preview = document.getElementById("preview");
    if (!preview) return alert("Preview not found.");

    const canvas = await html2canvas(preview, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`certificate_${cert.serialNo}.pdf`);
  };

  const handleEdit = (cert) => {
    setEditId(cert._id);
    setFormData({ ...cert });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <FaArrowLeft className="me-2" /> Back
        </button>
      </div>

      <h3 className="text-center text-primary mb-4">{editId ? "Edit" : "Create"} Purity Certificate</h3>

      <form onSubmit={handleSubmit} className="card shadow p-4 mb-5">
        <div className="row g-3">
          {[
            ["Header Title", "headerTitle"],
            ["Subtitle", "headerSubtitle"],
            ["Address", "address"],
            ["Phone", "phone"],
            ["Certificate Title", "certificateTitle"],
            ["Serial No", "serialNo"],
            ["Customer Name", "name"],
            ["Item", "item"],
            ["Fineness (%)", "fineness"],
            ["Gross Weight (g)", "grossWeight"],
            ["Date", "date", "date"]
          ].map(([label, name, type]) => (
            <div className="col-md-4" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type || "text"}
                name={name}
                className="form-control"
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="col-md-6">
            <label className="form-label">Left Image (optional)</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => handleImageUpload(e, "leftImage")} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Right Image (optional)</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => handleImageUpload(e, "rightImage")} />
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-success">{editId ? "Update" : "Submit"} Certificate</button>
        </div>
      </form>

      {/* Preview Certificate */}
      <div className="my-4">
        <h5 className="text-center">📄 Certificate Preview</h5>
        <CertificatePreview cert={formData} />
      </div>

      {/* Certificate Table */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white fw-bold">Submitted Certificates</div>
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
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
                <tr><td colSpan="7" className="text-center text-muted">No certificates found.</td></tr>
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
  );
};

export default Certificate;
