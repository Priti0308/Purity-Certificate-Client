import React from 'react';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaRegQuestionCircle
} from 'react-icons/fa';

const Help = () => {
  return (
    <div className="container-fluid py-5 px-4" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <div className="mx-auto shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: 900, border: '1px solid #E5E7EB' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#1E3A8A' }} className="text-white text-center py-5 px-4">
          <FaRegQuestionCircle size={50} className="mb-3" />
          <h1 className="fw-bold mb-2">Customer Support</h1>
          <p className="mb-0 fs-5">We are here to assist you with your inquiries.</p>
        </div>

        {/* Body */}
        <div className="bg-white py-5 px-5">
          <h3 className="text-center fw-bold mb-4" style={{ color: 'black' }}>
            Varad Consultants & Analyst Pvt. Ltd.
          </h3>

          <div className="row gy-4 px-md-5">
            {/* Phone */}
            <div className="col-md-6 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaPhoneAlt size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: '#1E3A8A' }}>Contact Number</h6>
                <p className="text-muted mb-0">+91 84464 48461</p>
              </div>
            </div>

            {/* Website */}
            <div className="col-md-6 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaGlobe size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: '#1E3A8A' }}>Official Website</h6>
                <p className="text-muted mb-0">
                  <a
                    href="https://www.varadanalyst.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#1E40AF' }}
                  >
                    www.varadanalyst.com
                  </a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="col-12 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaMapMarkerAlt size={28} />
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{ color: '#1E3A8A' }}>Corporate Office</h6>
                <p className="text-muted mb-0">
                  505, Shivcity Center,<br />
                  Vijaynagar, Sangli – 416416, Maharashtra, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 text-center py-4">
          <p className="text-muted mb-0">Our dedicated team is committed to providing you with exceptional support and guidance.</p>
        </div>
      </div>
    </div>
  );
};

export default Help;