import React from 'react';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaRegQuestionCircle
} from 'react-icons/fa';

const Help = () => {
  return (
    <div className="container-fluid py-5 px-3" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>
      <div className="mx-auto shadow rounded-4 overflow-hidden" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ backgroundColor: '#102E50' }} className="text-white text-center py-4 px-3">
          <FaRegQuestionCircle size={40} className="mb-2" />
          <h2 className="fw-bold mb-1">Help</h2>
          <p className="mb-0 fs-6">How can we help you today?</p>
        </div>

        {/* Body */}
        <div className="bg-white py-5 px-4">
          <h4 className="text-center fw-bold mb-4" style={{ color: '#102E50' }}>
            Varad Consultants & Analyst Pvt. Ltd.
          </h4>

          <div className="row gy-4 px-md-4">
            {/* Phone */}
            <div className="col-md-6 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaPhoneAlt size={24} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1" style={{ color: '#102E50' }}>Phone</h6>
                <p className="text-muted mb-0">+91 84464 48461</p>
              </div>
            </div>

            {/* Website */}
            <div className="col-md-6 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaGlobe size={24} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1" style={{ color: '#102E50' }}>Website</h6>
                <p className="text-muted mb-0">
                  <a
                    href="https://www.varadanalyst.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                    style={{ color: '#0d6efd' }}
                  >
                    www.varadanalyst.com
                  </a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="col-12 d-flex align-items-start">
              <div className="me-3 text-primary">
                <FaMapMarkerAlt size={24} />
              </div>
              <div>
                <h6 className="fw-semibold mb-1" style={{ color: '#102E50' }}>Office Address</h6>
                <p className="text-muted mb-0">
                  505, Shivcity Center,<br />
                  Vijaynagar, Sangli – 416416
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-light text-center py-3">
          <small className="text-muted">We’re always here to assist you with your queries and concerns.</small>
        </div>
      </div>
    </div>
  );
};

export default Help;
