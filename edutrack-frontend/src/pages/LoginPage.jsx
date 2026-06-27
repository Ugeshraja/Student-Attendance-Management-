import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUser, FiLock, FiChevronRight } from 'react-icons/fi';
import Logo from '../components/Common/Logo';
import API from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set initial state from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && (roleParam === 'TEACHER' || roleParam === 'STUDENT')) {
      setRole(roleParam);
    }
    if (params.get('expired')) {
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please log in again to continue.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter username and password.',
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/login', {
        username: username.trim(),
        password: password.trim(),
        role: role
      });

      const { token, ...userData } = response.data;
      
      // Save details to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${userData.name}!`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });

      // Redirect based on role
      if (role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Invalid username, password, or role selection.';
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMsg,
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'Reset Password',
      text: 'Please contact the school administrative department or your class advisor to reset your password.',
      icon: 'info',
      confirmButtonColor: '#2563EB',
    });
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{ 
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(96, 165, 250, 0.08) 100%)',
        padding: '1.5rem'
      }}
    >
      <div className="glass-card p-4 p-md-5 w-100 fade-in" style={{ maxWidth: '480px', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
        {/* Logo and Greeting */}
        <div className="text-center mb-4">
          <div className="d-inline-block mb-3">
            <Logo width="64px" height="64px" showText={false} />
          </div>
          <h3 className="fw-bold mb-1">Welcome back!</h3>
          <p className="text-muted small">Sign in to manage student attendance records.</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 py-2.5 fw-semibold ${role === 'TEACHER' ? 'btn-primary' : 'btn-light'}`}
              style={{ borderRadius: '10px' }}
              onClick={() => setRole('TEACHER')}
            >
              Teacher
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 py-2.5 fw-semibold ${role === 'STUDENT' ? 'btn-primary' : 'btn-light'}`}
              style={{ borderRadius: '10px' }}
              onClick={() => setRole('STUDENT')}
            >
              Student
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FiUser size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <FiLock size={18} />
              </span>
              <input
                type="password"
                className="form-control border-start-0 bg-light"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label small text-muted" htmlFor="remember">
                Remember Me
              </label>
            </div>
            <button 
              type="button" 
              className="btn btn-link p-0 small text-decoration-none text-primary fw-medium"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
            style={{ borderRadius: '10px' }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <>
                <span>Sign In</span>
                <FiChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => navigate('/')} className="btn btn-link text-decoration-none text-muted small">
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
