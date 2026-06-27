import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navbar from '../Common/Navbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex position-relative">
      {/* Sidebar Navigation */}
      <Sidebar show={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <main className="main-content flex-grow-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
