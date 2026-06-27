import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/login');
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11) 100%)' }}
    >
      <div className="text-center fade-in">
        <h1 
          className="fw-black mb-1" 
          style={{ 
            fontSize: '8rem', 
            fontFamily: "'Outfit', sans-serif",
            background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}
        >
          500
        </h1>
        <h3 className="fw-bold mb-3 text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Internal Server Error
        </h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          Opps! Something went wrong on our servers. We are working hard to resolve the problem. Please try again.
        </p>
        <button 
          onClick={handleRetry} 
          className="btn btn-danger d-inline-flex align-items-center gap-2 px-4 py-2.5 text-white"
          style={{ backgroundColor: '#EF4444', borderColor: '#EF4444' }}
        >
          <FiRefreshCw size={18} />
          <span>Reload & Retry</span>
        </button>
      </div>
    </div>
  );
};

export default ServerErrorPage;
