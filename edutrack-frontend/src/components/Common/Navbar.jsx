import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'User' };
  
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="glass-card px-4 py-3 mb-4 d-flex justify-content-between align-items-center">
      {/* Toggle button and Welcome */}
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-link p-0 text-dark d-lg-none" 
          onClick={toggleSidebar}
        >
          <FiMenu size={24} />
        </button>
        <div>
          <h5 className="mb-0 fw-bold">Hello, {user.name.split(' ')[0]}!</h5>
          <small className="text-muted d-none d-sm-inline-block">{formatDate()}</small>
        </div>
      </div>

      {/* Actions (Bell Notification & Quick Settings) */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light rounded-circle p-2 position-relative shadow-sm" style={{ width: '40px', height: '40px' }}>
          <FiBell size={18} className="text-dark" />
          <span 
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ transform: 'translate(-50%, 10%) !important' }}
          ></span>
        </button>

        <div className="d-none d-md-flex flex-column text-end">
          <span className="fw-medium text-dark small">{user.name}</span>
          <span className="text-muted small" style={{ fontSize: '11px' }}>{user.role}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
