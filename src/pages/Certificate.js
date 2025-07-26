import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDownload, FaEdit, FaArrowLeft } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Certificate = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [editId, setEditId] = useState(null);
  const [metalType, setMetalType] = useState("Silver");
  const [certToDownload, setCertToDownload] = useState(null);

  const initialForm = {
    serialNo: "",
    name: "",
    item: "",
    fineness: "",
    grossWeight: "",
    date: "",
    leftImage: "https://icon2.cleanpng.com/20180407/aqw/avbova9yv.webp",
    rightImage: "https://icon2.cleanpng.com/20180407/aqw/avbova9yv.webp",
    headerTitle: "",
    headerSubtitle: "",
    address: "",
    phone: "",
    telephone: "",
    icNo: "",
    certificateTitle: "",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/certificates`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCertificates(response.data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        alert("Failed to load certificates");
      }
    };
    fetchCertificates();
  }, []);

  useEffect(() => {
    const storedVendor = localStorage.getItem("vendor");
    if (storedVendor) {
      const vendorData = JSON.parse(storedVendor);
      setFormData((prev) => ({
        ...prev,
        headerTitle: vendorData.businessName || "",
        address: vendorData.address || "",
        phone: vendorData.mobile || "",
        
      }));
    }
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
      const token = localStorage.getItem("vendorToken");
      const payload = {
        ...formData,
        metalType,
        certificateTitle: `${metalType.toUpperCase()} PURITY CERTIFICATE`,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let response;
      if (editId) {
        response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/api/certificates/${editId}`,
          payload,
          { headers }
        );
        if (response.data) {
          setCertificates((prev) =>
            prev.map((cert) => (cert._id === editId ? response.data : cert))
          );
        }
        toast.success("Certificate updated successfully");
        setEditId(null);
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/certificates`,
          payload,
          { headers }
        );

        if (response.data && response.data._id) {
          setCertificates((prev) => [...prev, response.data]);
        } else {
          
          const refresh = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/certificates`,
            { headers }
          );
          setCertificates(refresh.data);
        }

        toast.success("Certificate submitted successfully");
      }

      // Reset form after success
      setTimeout(() => {
        setFormData((prev) => ({
          ...initialForm,
          headerTitle: prev.headerTitle,
          address: prev.address,
          phone: prev.phone,
        }));
        setMetalType("Silver");
      }, 1000);
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error(
        error.response?.data?.message || "Failed to save certificate"
      );
    }
  };

  const handleEdit = (cert) => {
    setEditId(cert._id);
    setFormData({ ...cert });
    setMetalType(cert.certificateTitle?.includes("SILVER") ? "Silver" : "Gold");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = async (cert) => {
    try {
      setCertToDownload(cert);
      await new Promise((resolve) => setTimeout(resolve, 700));

      const preview = document.getElementById("download-preview");
      if (!preview) return alert("Preview not found.");

      const canvas = await html2canvas(preview, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = 210;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate_${cert.serialNo}.pdf`);
      setCertToDownload(null);
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to process certificate");
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
    const integer = parts[0]
      .split("")
      .map((d) => map[d])
      .join(" ");
    const decimal = parts[1]
      ? parts[1]
          .split("")
          .map((d) => map[d])
          .join(" ")
      : "";
    return `${integer}${decimal ? " Point " + decimal : ""}`;
  };

  const CertificatePreview = ({ cert }) => (
    <div
      className="card mx-auto"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        maxWidth: "816px",
        border: "2px solid #000",
      }}
    >
      <div className="card-body p-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-2 border border-dark rounded p-2">
          {/* Left Image Box */}
          <div
            className="text-center border border-dark p-2"
            style={{ width: "100px" }}
          >
            <img
              src={cert.leftImage}
              className="img-fluid"
              style={{ width: "64px", height: "64px", objectFit: "contain" }}
              alt="left"
            />
          </div>

          {/* Middle Content */}
          <div className="flex-grow-1 text-center px-3">
            <div style={{ color: "#b7410e" }} className="fw-bold">
              श्री गणेशाय नमः
            </div>
            <h2 style={{ color: "#b7410e" }} className="fw-bold mb-1">
              {cert.headerTitle || ""}
            </h2>
            <div className="fw-bold mb-1">{cert.headerSubtitle || ""}</div>
            <div>{cert.address || ""}</div>
            <div
              className="d-flex justify-content-between px-4 mt-2"
              style={{ fontSize: "13px", whiteSpace: "nowrap" }}
            >
              <div style={{ minWidth: "120px" }}>
                Ph: {cert.telephone || ""} <br /> I.C: {cert.icNo || ""}
              </div>
              <div style={{ minWidth: "120px", textAlign: "right" }}>
                Contact: {cert.phone || ""}
              </div>
            </div>
          </div>

          {/* Right Image Box */}
          <div
            className="text-center border border-dark p-2"
            style={{ width: "100px" }}
          >
            <img
              src={cert.rightImage}
              className="img-fluid"
              style={{ width: "64px", height: "64px", objectFit: "contain" }}
              alt="right"
            />
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-3">
          <span
            className="badge"
            style={{
              backgroundColor: "#FFFF00",
              color: "#b7410e",
              padding: "6px 12px",
              fontWeight: "bold",
            }}
          >
            {cert.certificateTitle || "SILVER PURITY CERTIFICATE"}
          </span>
        </div>

        {/* Table Section */}
        <div className="border border-dark rounded">
          {/* Row 1 */}
          <div className="d-flex border-bottom border-dark">
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "80px" }}
            >
              Name
            </div>
            <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">
              {cert.name || ""}
            </div>
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "64px" }}
            >
              Sr.No
            </div>
            <div
              className="p-2 bg-light fw-bold fs-5"
              style={{ width: "128px" }}
            >
              {cert.serialNo || ""}
            </div>
          </div>
          {/* Row 2 */}
          <div className="d-flex border-bottom border-dark">
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "80px" }}
            >
              Item
            </div>
            <div className="p-2 border-end border-dark fs-5 bg-light flex-grow-1">
              {cert.item || ""}
            </div>
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "64px" }}
            >
              Date
            </div>
            <div className="p-2 bg-light fs-5" style={{ width: "128px" }}>
              {cert.date || ""}
            </div>
          </div>
          {/* Row 3 */}
          <div className="d-flex border-bottom border-dark">
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "80px" }}
            >
              Fineness
            </div>
            <div className="p-2 border-end border-dark bg-light flex-grow-1">
              <div className="fw-bold fs-4">{cert.fineness || ""} %</div>
              <div className="fs-6">
                {convertToWords(cert.fineness || "0")} Percent
              </div>
            </div>
            <div
              className="p-2 border-end border-dark fw-bold bg-light"
              style={{ width: "64px" }}
            >
              G.Wt
            </div>
            <div className="p-2 bg-light" style={{ width: "128px" }}>
              {cert.grossWeight || ""}
            </div>
          </div>
          {/* Note Section */}
          <div className="bg-light border-bottom border-dark">
            <div className="d-flex">
              <div className="flex-grow-1 p-3 border-end border-dark">
                <div style={{ color: "#b7410e" }} className="fw-bold fs-6 mb-2">
                  Note
                </div>
                <div className="fs-6">
                  <div>- We are not responsible for any melting defects</div>
                  <div>- We are responsible for more than 0.50% difference</div>
                  <div>- If any doubt ask for re-testing</div>
                </div>
              </div>
              <div className="p-3 text-center" style={{ width: "256px" }}>
                <div style={{ color: "#b7410e" }} className="fw-bold fs-6">
                  For {cert.headerTitle || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-3 d-flex align-items-center"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </button>

      <h3 className="text-center text-cyan fw-bold mb-4">
        {editId ? "Edit" : "Create"} Purity Certificate
      </h3>

      {/* Form Section */}
      <div className="card shadow mb-5">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Metal Type</label>
                <select
                  className="form-select"
                  value={metalType}
                  onChange={(e) => setMetalType(e.target.value)}
                >
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              {[
                { name: "headerTitle", placeholder: "Company name" },
                { name: "headerSubtitle", placeholder: "Company subtitle" },
                { name: "address", placeholder: "Business address" },
                { name: "telephone", placeholder: "Telephone" },
                { name: "icNo", placeholder: "IC No" },
                { name: "phone", placeholder: "Phone" },
                { name: "serialNo", placeholder: "Serial No" },
                { name: "name", placeholder: "Customer Name" },
                { name: "item", placeholder: "Item name" },
                { name: "fineness", placeholder: "Purity %" },
                { name: "grossWeight", placeholder: "Weight in grams" },
                { name: "date", placeholder: "Date" },
              ].map((field) => (
                <div className="col-md-4" key={field.name}>
                  <label className="form-label">
                    {field.name.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field.name === "date" ? "date" : "text"}
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
                  onChange={(e) => handleImageUpload(e, "leftImage")}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Right Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImageUpload(e, "rightImage")}
                />
              </div>
            </div>
            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success">
                {editId ? "Update" : "Submit"} Certificate
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

      {/* Submitted Certificates */}
      <div className="card shadow mb-5">
        <div className="card-header bg-dark text-white fw-bold">
          Submitted Certificates
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
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

      {/* PDF download */}
      {certToDownload && (
        <div
          id="download-preview"
          style={{
            position: "absolute",
            left: "-9999px",
            top: 0,
            backgroundColor: "#fff",
            width: "816px", // fix width so layout doesn't shrink
            padding: "20px",
          }}
        >
          <CertificatePreview cert={certToDownload} />
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Certificate;
