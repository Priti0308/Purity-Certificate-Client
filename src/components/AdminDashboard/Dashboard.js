
import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';


const Dashboard = () => {
  const [currentSection, setCurrentSection] = useState('add'); 

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 p-0">
          <AdminSidebar currentSection={currentSection} setCurrentSection={setCurrentSection} />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 bg-white">
          <AdminOverview section={currentSection} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
