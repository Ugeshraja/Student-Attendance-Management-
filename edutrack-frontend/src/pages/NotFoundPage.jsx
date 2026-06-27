import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 px-3"
      style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.02) 0%, rgba(37, 99, 235, 0.04) 100%)' }}
    >
      <div className="text-center fade-in">
        <h1 
          className="fw-black mb-1" 
          style={{ 
            fontSize: '8rem', 
            fontFamily: "'Outfit', sans-serif",
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1
          }}
        >
          404
        </h1>
        <h3 className="fw-bold mb-3 text-dark" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Page Not Found
        </h3>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          Sorry, the page you are looking for does not exist or has been moved. Please check the URL or return to safety.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2.5"
        >
          <FiHome size={18} />
          <span>Go back Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
