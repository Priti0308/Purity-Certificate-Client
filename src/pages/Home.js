import React from 'react';
import { Link } from 'react-router-dom';
import { FaCertificate, FaUsersCog, FaUserCheck } from 'react-icons/fa';

const Home = () => {
  const steps = [
    ['Register', 'Sign up as a vendor'],
    ['Approval', 'Admin verifies your profile'],
    ['Generate', 'Fill out & create certificates'],
    ['Download', 'Save or share with clients']
  ];

  return (
    <div style={{ backgroundColor: '#FDFDFD', color: '#102E50' }}>
      
      {/* Hero Section */}
      <section className="text-white py-5" style={{ backgroundColor: '#102E50' }}>
        <div className="container text-center">
          <h1 className="fw-bold display-4 mb-3">Purity Certificate Portal</h1>
          <p className="lead mb-4">Trusted digital certificates for gold, sweets, and food businesses</p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {/* <Link to="/register" className="btn btn-warning btn-lg">Vendor Register</Link> */}
            <Link to="/login" className="btn btn-light text-dark btn-lg">Vendor Login</Link>
            <Link to="/admin-login" className="btn btn-outline-light btn-lg">Admin Login</Link>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#F5C45E' }}>Platform Highlights</h2>
        <div className="row g-4">
          {[
            { title: 'Digital Certificates', text: 'Generate barcoded & verified certificates', icon: <FaCertificate />, bg: '#E78B48', color: '#fff' },
            { title: 'Vendor Dashboard', text: 'Track, manage & download all certificates', icon: <FaUserCheck />, bg: '#8BE3D2', color: '#102E50' },
            { title: 'Admin Control', text: 'Approve vendors & manage authenticity', icon: <FaUsersCog />, bg: '#F5C45E', color: '#102E50' }
          ].map(({ title, text, icon, bg, color }, i) => (
            <div className="col-md-4" key={i}>
              <div
                className="card shadow h-100 text-center p-4"
                style={{ backgroundColor: bg, color, transition: 'transform 0.3s' }}
              >
                <div className="display-4 mb-3">{icon}</div>
                <h5 className="fw-bold">{title}</h5>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
<section className="container my-5">
  <h2 className="text-center fw-bold mb-4" style={{ color: '#E78B48' }}>How It Works</h2>
  <div className="row text-center">
    {steps.map(([title, desc], i) => (
      <div className="col-md-3 mb-4" key={i}>
        <div
          className="rounded shadow-sm p-4 h-100"
          style={{
            backgroundColor: '#102E50',
            color: '#fff',
            border: '1px solid #ccc',
            transition: 'transform 0.3s ease'
          }}
        >
          <h1 className="display-6 mb-2" style={{ color: '#F5C45E' }}>{i + 1}</h1>
          <h6 className="fw-bold">{title}</h6>
          <p className="mb-0">{desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Call to Action */}
      <section className="text-center text-dark py-5" style={{ backgroundColor: '#F5C45E' }}>
        <h3 className="fw-bold mb-3">Start Issuing Trusted Certificates</h3>
        <p className="mb-4">Simple, secure, and professional.</p>
        {/* <Link to="/register" className="btn btn-dark btn-lg me-3">Register Now</Link> */}
        <Link to="/login" className="btn btn-outline-dark btn-lg">Login</Link>
      </section>

      {/* Footer */}
      <footer className="text-white text-center py-4" style={{ backgroundColor: '#102E50' }}>
        <p className="fw-bold mb-1">Purity Certificate Portal &copy; 2025</p>
        <p className="mb-0">Designed by VCA | Contact: +91-9876543210</p>
      </footer>
    </div>
  );
};

export default Home;
