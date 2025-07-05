import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorDashboard from './pages/VendorDashboard';
import Certificate from './pages/Certificate';
import CertificateList from './pages/CertificateList';
import Dashboard from './components/AdminDashboard/Dashboard'; 
import AdminLogin from './components/AdminDashboard/AdminLogin';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/certificate-list" element={<CertificateList />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />

      </Routes>
    </Router>
  );
};

export default App;
