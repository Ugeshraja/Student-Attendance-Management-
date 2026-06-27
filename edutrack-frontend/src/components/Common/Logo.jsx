import React from 'react';

const Logo = ({ width = '60px', height = '60px', showText = true, textColor = '#1F2937' }) => {
  return (
    <div className="d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 4px 8px rgba(37, 99, 235, 0.15))' }}
      >
        {/* Background Circle */}
        <circle cx="60" cy="60" r="54" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        
        {/* Sky Blue Wave/Curved Swan Wing Wings */}
        <path
          d="M25 45C35 45 42 32 60 32C78 32 85 45 95 45C98 45 101 42 101 38C101 25 82 18 60 18C38 18 19 25 19 38C19 42 22 45 25 45Z"
          fill="#60A5FA"
          opacity="0.3"
        />

        {/* Lotus Petals Base - Gold & Sky Blue */}
        <path
          d="M32 90C45 105 75 105 88 90C78 95 62 95 60 90C58 95 42 95 32 90Z"
          fill="#F59E0B"
        />
        <path
          d="M40 85C50 96 70 96 80 85C72 90 62 90 60 85C58 90 48 90 40 85Z"
          fill="#2563EB"
        />

        {/* Open Book - White Pages with Royal Blue Details */}
        <path
          d="M26 78C38 75 52 75 60 82C68 75 82 75 94 78V52C82 49 68 49 60 56C52 49 38 49 26 52V78Z"
          fill="#FFFFFF"
          stroke="#2563EB"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Left Book Page Lines */}
        <path d="M34 59H48" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 65H48" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M34 71H44" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        {/* Right Book Page Lines */}
        <path d="M72 59H86" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M72 65H86" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M76 71H86" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />

        {/* Diya / Lamp / Flame - Symbolic of Knowledge (Goddess Saraswathi) */}
        {/* Lamp Base (Gold) */}
        <path
          d="M50 82C50 80 54 78 60 78C66 78 70 80 70 82H50Z"
          fill="#F59E0B"
          stroke="#1D4ED8"
          strokeWidth="1.5"
        />
        {/* Glowing Flame (Gold / Gold Orange) */}
        <path
          d="M60 48C57 58 63 68 60 78C63 78 67 66 63 58C61.5 54 61.5 50 60 48Z"
          fill="#F59E0B"
          style={{ transformOrigin: '60px 68px', animation: 'pulse 2s infinite ease-in-out' }}
        />

        {/* Stylized Veena Strings / Swan Neck - Minimalist Gold Curve */}
        <path
          d="M60 30C58 40 45 42 45 48"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M60 30C62 40 75 42 75 48"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
      {showText && (
        <span
          className="fs-4 fw-bold tracking-tight"
          style={{
            color: textColor,
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}
        >
          EduTrack
        </span>
      )}
    </div>
  );
};

export default Logo;
