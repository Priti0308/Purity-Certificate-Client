import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/vendors/login', {
        mobile,
        password,
      });

      localStorage.setItem('vendorToken', response.data.token);
      localStorage.setItem('vendor', JSON.stringify(response.data.vendor));

      alert('✅ Login successful!');
      navigate('/vendor-dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '❌ Login failed. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-primary mb-4">Vendor Login</h2>

      <div className="row justify-content-center">
        <div
          className="col-md-5 col-sm-10 col-11 p-4 rounded shadow-sm"
          style={{
            backgroundColor: '#fff',
            border: '2px solid #F5C45E',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Mobile Number</label>
              <input
                type="tel"
                className="form-control border-warning"
                placeholder="Enter your 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control border-warning"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{ backgroundColor: '#102E50' }}
            >
              Login as Vendor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
