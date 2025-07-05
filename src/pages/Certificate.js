import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaDownload, FaEdit, FaArrowLeft  } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const Certificate = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    serialNo: "",
    name: "",
    item: "",
    fineness: "",
    grossWeight: "",
    date: "",
    notes: "",
  });

  const [certificates, setCertificates] = useState([]);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("vendorToken");

  const fetchCertificates = useCallback(async () => {
    if (!token) {
      alert("⚠️ Login required. Please login as a vendor.");
      return;
    }

    try {
      const res = await axios.get(
        "https://purity-certificate-server.onrender.com/api/certificates",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "❌ Error fetching certificates:",
        err.response?.data || err.message
      );
      setCertificates([]);
    }
  }, [token]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!token) {
    alert("❌ Vendor not authenticated. Please login.");
    return;
  }

  try {
    if (editId) {
      // ✅ Update existing certificate
      await axios.put(
        `https://purity-certificate-server.onrender.com/api/certificates/${editId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Certificate updated!");
      setEditId(null);
    } else {
      // ✅ Create new certificate
      await axios.post(
        `https://purity-certificate-server.onrender.com/api/certificates`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Certificate submitted!");
    }

    // Reset form and refresh list
    setFormData({
      serialNo: "",
      name: "",
      item: "",
      fineness: "",
      grossWeight: "",
      date: "",
      notes: "",
    });

    fetchCertificates();
  } catch (err) {
    console.error(
      "❌ Error submitting certificate:",
      err.response?.data || err.message
    );
    alert("❌ Error submitting certificate");
  }
};


  const convertToWords = (num) => {
    if (!num || isNaN(num)) return "";
    const map = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const parts = num.toString().split(".");
    const integerPart = parts[0]
      .split("")
      .map((d) => map[d] || "")
      .join(" ");
    const decimalPart = parts[1]
      ? parts[1]
          .split("")
          .map((d) => map[d] || "")
          .join(" ")
      : "";
    return `${integerPart}${decimalPart ? " Point " + decimalPart : ""}`;
  };

  const handleDownloadPDF = async (cert) => {
    const container = document.createElement("div");
    container.style.padding = "20px";
    container.innerHTML = `
      <div style="font-family: Arial; font-size: 12px; border: 1px solid black; padding: 20px; width: 700px;">
        <div style="text-align: center;">
          <div>Sri Ganeshaya Namaha</div>
          <h2 style="color: #d9534f; margin: 0;">SWARANJALE</h2>
          <div>Melting & Testing</div>
          <div>No. 41/18, Hanumantha Rayan Koil Street, Sowcarpet, Chennai - 600003</div>
          <div>Ph: 044-42137529 | Vikasrao: 9962945777</div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" border="1">
          <tr><td><strong>SILVER</strong></td><td colspan="3" style="text-align:center;"><span style="background-color: orange; color: white; padding: 2px 10px;">PURITY CERTIFICATE</span></td></tr>
          <tr><td><strong>Name</strong></td><td>${
            cert.name
          }</td><td><strong>S.No</strong></td><td>${cert.serialNo}</td></tr>
          <tr><td><strong>Item</strong></td><td>${
            cert.item
          }</td><td><strong>Date</strong></td><td>${cert.date}</td></tr>
          <tr><td><strong>Fineness</strong></td><td>${
            cert.fineness
          }%</td><td><strong>G.Wt</strong></td><td>${cert.grossWeight}</td></tr>
          <tr><td><strong>In Words</strong></td><td colspan="3">${convertToWords(
            cert.fineness
          )} %</td></tr>
        </table>
        <div style="margin-top: 15px;"><strong>Note:</strong><ul>
          <li>We are not responsible for any melting defects</li>
          <li>We are responsible for more than 0.50% difference</li>
          <li>If any doubt ask for re-testing</li>
          ${cert.notes ? `<li>${cert.notes}</li>` : ""}
        </ul></div>
        <div style="text-align: right; margin-top: 30px;"><strong>For SWARANJALE</strong></div>
      </div>`;

    document.body.appendChild(container);
    const canvas = await html2canvas(container);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`certificate_${cert.serialNo}.pdf`);
    document.body.removeChild(container);
  };

  const handleEdit = (cert) => {
    setEditId(cert._id);
    setFormData({
      serialNo: cert.serialNo || "",
      name: cert.name || "",
      item: cert.item || "",
      fineness: cert.fineness || "",
      grossWeight: cert.grossWeight || "",
      date: cert.date?.split("T")[0] || "",
      notes: cert.notes || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-4">
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)} // Go back one step
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
      </div>
      <h3 className="text-center text-primary mb-4">
        {editId ? "Edit" : "Create"} Purity Certificate
      </h3>

      <form onSubmit={handleSubmit} className="card shadow p-4 mb-5">
        <div className="row g-3">
          {[
            {
              label: "Serial No",
              name: "serialNo",
              placeholder: "e.g., SRJ-001",
            },
            {
              label: "Customer Name",
              name: "name",
              placeholder: "e.g., Ravi Kumar",
            },
            { label: "Item", name: "item", placeholder: "e.g., Silver Ring" },
            {
              label: "Fineness (%)",
              name: "fineness",
              placeholder: "e.g., 91.6",
            },
            {
              label: "Gross Weight (g)",
              name: "grossWeight",
              placeholder: "e.g., 15.2",
            },
            { label: "Date", name: "date", type: "date", placeholder: "" },
          ].map(({ label, name, type, placeholder }) => (
            <div className="col-md-4" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type || "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="form-control"
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          <div className="col-md-12">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              placeholder="Add any special note (e.g., Retesting suggested)"
              rows="2"
            />
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-success">
            {editId ? "Update" : "Submit"}{" "}
            Certificate
          </button>
        </div>
      </form>

      <div className="card shadow">
        <div className="card-header bg-dark text-white fw-bold">
          Submitted Certificates
        </div>
        <div className="card-body table-responsive">
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
                  <td colSpan="7" className="text-center text-muted">
                    No certificates found.
                  </td>
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
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDownloadPDF(cert)}
                      >
                        <FaDownload className="me-1" /> PDF
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(cert)}
                      >
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
