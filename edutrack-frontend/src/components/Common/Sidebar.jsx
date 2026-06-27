import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiColumns, 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiX
} from 'react-icons/fi';
import Logo from './Logo';

const Sidebar = ({ show, toggleSidebar }) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { role: 'STUDENT', name: 'User' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: <FiColumns size={18} /> },
    { to: '/teacher/students', label: 'Students', icon: <FiUsers size={18} /> },
    { to: '/teacher/attendance', label: 'Attendance', icon: <FiCalendar size={18} /> },
    { to: '/teacher/reports', label: 'Reports', icon: <FiFileText size={18} /> },
    { to: '/teacher/profile', label: 'Profile', icon: <FiUser size={18} /> },
    { to: '/teacher/settings', label: 'Settings', icon: <FiSettings size={18} /> },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <FiColumns size={18} /> },
    { to: '/student/profile', label: 'Profile', icon: <FiUser size={18} /> },
  ];

  const links = user.role === 'TEACHER' ? teacherLinks : studentLinks;

  return (
    <div className={`sidebar ${show ? 'show' : ''}`}>
      {/* Sidebar Header */}
      <div className="px-4 d-flex justify-content-between align-items-center mb-4">
        <Logo width="42px" height="42px" />
        <button 
          className="btn btn-link d-lg-none p-0 text-dark" 
          onClick={toggleSidebar}
        >
          <FiX size={24} />
        </button>
      </div>

      {/* User Information Profile Summary */}
      <div className="px-4 py-3 mx-3 mb-4 rounded-3 text-center" style={{ background: 'rgba(37, 99, 235, 0.04)' }}>
        <div className="position-relative d-inline-block mb-2">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="rounded-circle object-fit-cover" 
              style={{ width: '64px', height: '64px', border: '2.5px solid #2563EB' }}
            />
          ) : (
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4 mx-auto"
              style={{ width: '64px', height: '64px', backgroundColor: '#2563EB' }}
            >
              {getInitials(user.name)}
            </div>
          )}
        </div>
        <h6 className="mb-0 text-truncate fw-bold">{user.name}</h6>
        <span className="text-muted small fw-medium">{user.role}</span>
      </div>

      {/* Navigation Links */}
      <div className="d-flex flex-column h-100 justify-content-between pb-5">
        <nav className="mb-4">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (window.innerWidth < 992) {
                  toggleSidebar();
                }
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div>
          <button 
            onClick={handleLogout}
            className="sidebar-link border-0 bg-transparent text-danger w-75 text-start"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
