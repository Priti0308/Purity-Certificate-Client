import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    businessName: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://purity-certificate-server.onrender.com/api/vendors/register', formData);
      alert(res.data.message || 'Vendor registered successfully!');
      setFormData({ name: '', mobile: '', businessName: '', password: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-warning mb-4">Vendor Registration</h2>

      <div className="row justify-content-center">
        <div
          className="col-md-5 col-sm-10 col-11 p-4 rounded"
          style={{
            backgroundColor: '#fff',
            border: '2px solid #F5C45E',
            // boxShadow: '0 0 20px rgba(245, 196, 94, 0.7)'
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Vendor Name</label>
              <input
                type="text"
                name="name"
                className="form-control border-warning"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mobile</label>
              <input
                type="tel"
                name="mobile"
                className="form-control border-warning"
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Business Name</label>
              <input
                type="text"
                name="businessName"
                className="form-control border-warning"
                placeholder="Enter business name"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control border-warning"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{
                backgroundColor: '#102E50'
              }}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
