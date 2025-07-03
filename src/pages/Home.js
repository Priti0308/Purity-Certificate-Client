import React from 'react';
import { Link } from 'react-router-dom';

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
          <h1 className="fw-bold display-4">Purity Certificate Portal</h1>
          <p className="lead">Trusted digital certificates for gold, sweets, and food businesses</p>
          <div className="mt-4">
            <Link to="/register" className="btn btn-warning me-3">Vendor Register</Link>
            <Link to="/login" className="btn btn-light text-dark me-3">Vendor Login</Link>
            <Link to="/admin-login" className="btn btn-outline-light">Admin Login</Link>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#F5C45E' }}>Platform Highlights</h2>
        <div className="row g-4">
          {[
            { title: 'Digital Certificates', text: 'Generate barcoded & verified certificates', bg: '#E78B48', color: '#fff' },
            { title: 'Vendor Dashboard', text: 'Track, manage & download all certificates', bg: '#8BE3D2', color: '#102E50' },
            { title: 'Admin Control', text: 'Approve vendors & manage authenticity', bg: '#F5C45E', color: '#102E50' }
          ].map(({ title, text, bg, color }, i) => (
            <div className="col-md-4" key={i}>
              <div className="card shadow h-100" style={{ backgroundColor: bg, color }}>
                <div className="card-body">
                  <h5 className="fw-bold">{title}</h5>
                  <p>{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container my-5">
        <h2 className="text-center fw-bold mb-4" style={{ color: '#E78B48' }}>How It Works</h2>
        <div className="row text-center">
          {steps.map(([title, desc], i) => (
            <div className="col-md-3" key={i}>
              <div className="p-3">
                <h1 className="display-6" style={{ color: '#F5C45E' }}>{i + 1}</h1>
                <h6 className="fw-bold">{title}</h6>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center text-dark py-5" style={{ backgroundColor: '#F5C45E' }}>
        <h3 className="fw-bold">Start Issuing Trusted Certificates</h3>
        <p>Simple, secure, and professional.</p>
        <Link to="/register" className="btn btn-dark btn-lg me-3">Register Now</Link>
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
