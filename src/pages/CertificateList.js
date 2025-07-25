import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaEye,
  FaFilePdf,
  FaTrash,
  FaArrowLeft,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CertificateList = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [previewCert, setPreviewCert] = useState(null);
  const [certToDownload, setCertToDownload] = useState(null);

  const fetchCertificates = useCallback(async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setCertificates([]);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("vendorToken");
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
    fetchStats();
  }, [fetchCertificates, fetchStats]);

  const handleStatusChange = async (certId, status) => {
    try {
      const token = localStorage.getItem("vendorToken");
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates/${certId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        `Certificate ${status === "approved" ? "approved" : "rejected"} successfully.`
      );
      fetchCertificates();
      fetchStats();
    } catch (err) {
      console.error(`Error updating certificate status to ${status}:`, err);
      toast.error(`Failed to update certificate status to ${status}`);
    }
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

  const handleDelete = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const token = localStorage.getItem("vendorToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates/${certId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Certificate deleted successfully.");
      fetchCertificates();
      fetchStats();
    } catch (err) {
      console.error("Error deleting certificate:", err);
      toast.error("Failed to delete certificate. Please try again.");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
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
                <th>IC No</th>
                <th>Telephone</th>
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
                    <td>{cert.icNo || "-"}</td>
                    <td>{cert.telephone || "-"}</td>
                    <td>{cert.item}</td>
                    <td>{cert.fineness}</td>
                    <td>{cert.grossWeight}</td>
                    <td>{new Date(cert.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusColor(cert.status)}`}>
                        {cert.status || "pending"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setPreviewCert(cert)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDownloadPDF(cert)}
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
                          onClick={() => handleStatusChange(cert._id, "approved")}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-warning text-white"
                          onClick={() => handleStatusChange(cert._id, "rejected")}
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
                  <td colSpan="11" className="text-center py-4 text-muted">
                    No certificates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {certToDownload && (
        <div id="download-preview" style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <CertificatePreview cert={certToDownload} />
        </div>
      )}

      {previewCert && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Certificate Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setPreviewCert(null)}
                ></button>
              </div>
              <div className="modal-body">
                <CertificatePreview cert={previewCert} />
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CertificateList;
