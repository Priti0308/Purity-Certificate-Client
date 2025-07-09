import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', {
        username,
        password,
      });

      alert(res.data.message || 'Admin login successful');
      localStorage.setItem('admin', JSON.stringify(res.data.admin));
      navigate('/admin-dashboard');
  
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold text-warning mb-4">Admin Login</h2>

      <div className="row justify-content-center">
        <div
          className="col-md-5 col-sm-10 col-11 p-4 rounded"
          style={{
            backgroundColor: '#fff',
            border: '2px solid #F5C45E',
            // boxShadow: '0 0 20px rgba(245, 196, 94, 0.6)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                type="text"
                className="form-control border-warning"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control border-warning"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white fw-semibold"
              style={{
                backgroundColor: '#102E50',
              }}
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
