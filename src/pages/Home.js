import React from "react";
import { Link } from "react-router-dom";
import {
  FaCertificate,
  FaUsersCog,
  FaUserCheck,
  FaArrowRight,
  FaShieldAlt,
  FaUserShield,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const steps = [
    ["Register", "Sign up as a vendor", <FaUserCheck className="display-5" />],
    [
      "Approval",
      "Admin verifies your profile",
      <FaShieldAlt className="display-5" />,
    ],
    [
      "Generate",
      "Fill out & create certificates",
      <FaCertificate className="display-5" />,
    ],
    [
      "Download",
      "Save or share with clients",
      <FaUsersCog className="display-5" />,
    ],
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section
        className="text-white d-flex align-items-center justify-content-center text-center"
        style={{
          background: "linear-gradient(135deg, #102E50 0%, #1a3a6a 100%)",
          minHeight: "50vh",
          position: "relative",
          overflow: "hidden",
          padding: "2rem",
        }}
      >
        {/* Background pattern */}
        <div
          className="position-absolute w-100 h-100"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            opacity: 0.15,
          }}
        ></div>

        {/* Centered Content */}
        <motion.div
          className="position-relative text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h1
            className="fw-bold mb-4"
            style={{ fontSize: "2.8rem", lineHeight: "1.3" }}
          >
            Purity Certificate Portal
          </h1>
          <p
            className="lead mb-5"
            style={{ fontSize: "1.25rem", color: "#dcdcdc" }}
          >
            Trusted digital certificates for gold, sweets, and food businesses
          </p>

          {/* ✅ Buttons - Admin first */}
          <motion.div
            className="d-flex flex-column flex-sm-row gap-3 justify-content-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Link
              to="/admin-login"
              className="btn btn-light btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ minWidth: "200px" }}
            >
              <FaUserShield /> Admin Login <FaArrowRight />
            </Link>
            <Link
              to="/login"
              className="btn btn-success btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{
                minWidth: "200px",
                backgroundColor: "#28a745",
                borderColor: "#28a745",
              }}
            >
              <FaUserCheck /> Vendor Login
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ✅ Keep All Other Sections Same */}
      {/* Highlights Section */}
      <section className="container my-5 py-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="fw-bold mb-3" style={{ color: "#E78B48" }}>
            Platform Highlights
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Comprehensive solutions for your certificate management needs
          </p>
        </motion.div>

        <div className="row g-4">
          {[
            {
              title: "Digital Certificates",
              text: "Generate barcoded & verified certificates",
              icon: <FaCertificate className="display-4 mb-3" />,
              bgStyle: {
                background: "linear-gradient(135deg, #E78B48 0%, #f5a35a 100%)",
              },
              color: "text-white",
            },
            {
              title: "Vendor Dashboard",
              text: "Track, manage & download all certificates",
              icon: <FaUserCheck className="display-4 mb-3" />,
              bgStyle: {
                background: "linear-gradient(135deg, #8BE3D2 0%, #a1ece0 100%)",
              },
              color: "text-dark",
            },
            {
              title: "Admin Control",
              text: "Approve vendors & manage authenticity",
              icon: <FaUsersCog className="display-4 mb-3" />,
              bgStyle: {
                background: "linear-gradient(135deg, #F5C45E 0%, #f8d277 100%)",
              },
              color: "text-dark",
            },
          ].map(({ title, text, icon, bgStyle, color }, i) => (
            <motion.div
              key={i}
              className="col-md-4"
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div
                className={`card shadow h-100 text-center p-4 border-0 ${color}`}
                style={{
                  ...bgStyle,
                  borderRadius: "15px",
                }}
              >
                <div className="mb-3">{icon}</div>
                <h5 className="fw-bold">{title}</h5>
                <p>{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="container my-4 py-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <h2 className="fw-bold mb-3" style={{ color: "#E78B48" }}>
            How It Works
          </h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Simple steps to create and manage your certificates
          </p>
        </motion.div>

        <div className="row g-4">
          {steps.map(([title, desc, icon], i) => (
            <motion.div
              key={i}
              className="col-md-6 col-lg-3"
              initial="hidden"
              whileInView="visible"
              variants={fadeIn}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div
                className="card h-100 border-0 shadow-sm p-4 text-center"
                style={{
                  backgroundColor: "#102E50",
                  color: "white",
                  borderRadius: "15px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="mb-3" style={{ color: "#F5C45E" }}>
                  {icon}
                </div>
                <div className="mb-3">
                  <span
                    className="badge rounded-circle bg-amber-400 text-dark fs-5"
                    style={{
                      backgroundColor: "#F5C45E",
                      width: "40px",
                      height: "40px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h5 className="fw-bold">{title}</h5>
                <p className="mb-0 text-light">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="text-center py-4 my-4"
        style={{
          background: "linear-gradient(135deg, #F5C45E 0%, #f8d277 100%)",
        }}
      >
        <div className="container py-3">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="fw-bold mb-3">Start Issuing Trusted Certificates</h3>
            <p className="lead mb-4">
              Simple, secure, and professional solution for your business
            </p>
            <Link
              to="/login"
              className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-bold"
              style={{ minWidth: "200px" }}
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-white py-5"
        style={{
          background: "linear-gradient(135deg, #102E50 0%, #1a3a6a 100%)",
        }}
      >
        <div className="container text-center">
          <p className="mb-1">
            &copy; 2025 Purity Certificate Portal. All rights reserved.
          </p>
          <p className="mb-0">Designed by VCA | Contact: +91-9876543210</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
