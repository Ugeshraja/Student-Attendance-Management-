import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiFileText, 
  FiLock, 
  FiTrendingUp, 
  FiMonitor, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi';
import Logo from '../components/Common/Logo';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#F8FAFC' }}>
      {/* Responsive Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3 border-bottom shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <Logo width="40px" height="40px" />
          </Link>
          <button 
            className="navbar-toggler border-0" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center gap-3 mt-3 mt-lg-0">
              <li className="nav-item">
                <a className="nav-link fw-medium text-dark" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium text-dark" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium text-dark" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium text-dark" href="#benefits">Benefits</a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-medium text-dark" href="#contact">Contact</a>
              </li>
              <li className="nav-item ms-lg-2">
                <Link className="btn btn-primary px-4 py-2" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="py-5" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(96, 165, 250, 0.05) 100%)' }}>
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-3 fs-7">
                Smart Attendance, Smarter Education.
              </span>
              <h1 className="display-4 fw-extrabold text-dark mb-3" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '3rem' }}>
                Smart Attendance Management <br />
                <span style={{
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>for Modern Schools</span>
              </h1>
              <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '650px' }}>
                Manage attendance quickly, securely, and efficiently with EduTrack. Empower teachers and keep students updated in real-time.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login?role=TEACHER" className="btn btn-primary btn-lg px-4 py-3 text-white">
                  Teacher Login
                </Link>
                <Link to="/login?role=STUDENT" className="btn btn-outline-primary btn-lg px-4 py-3">
                  Student Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Platform Features</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Everything your school needs to run an efficient attendance system.</p>
          </div>
          <div className="row g-4">
            {/* Feature 1 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiMonitor size={24} />
                </div>
                <h5 className="fw-bold mb-2">Student Dashboard</h5>
                <p className="text-muted small mb-0">Students can securely view their personal profiles, stats, calendars, and download reports.</p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiCheckCircle size={24} />
                </div>
                <h5 className="fw-bold mb-2">Teacher Dashboard</h5>
                <p className="text-muted small mb-0">Teachers can add, edit, and delete student details and log daily class attendance sheets easily.</p>
              </div>
            </div>
            {/* Feature 3 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiFileText size={24} />
                </div>
                <h5 className="fw-bold mb-2">Attendance Reports</h5>
                <p className="text-muted small mb-0">Generate detailed class-wise and student-wise reports and export them instantly as PDF or CSV.</p>
              </div>
            </div>
            {/* Feature 4 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiLock size={24} />
                </div>
                <h5 className="fw-bold mb-2">Secure Login</h5>
                <p className="text-muted small mb-0">Role-based JWT authorization mechanisms protect individual student records and API logs.</p>
              </div>
            </div>
            {/* Feature 5 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiClock size={24} />
                </div>
                <h5 className="fw-bold mb-2">Fast Performance</h5>
                <p className="text-muted small mb-0">Optimized queries and React state routing ensure smooth loading and responsive operations.</p>
              </div>
            </div>
            {/* Feature 6 */}
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="rounded-circle bg-secondary-subtle text-dark d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '60px', height: '60px' }}>
                  <FiTrendingUp size={24} />
                </div>
                <h5 className="fw-bold mb-2">Responsive Design</h5>
                <p className="text-muted small mb-0">Every dashboard component adjusts to fit mobile, tablet, and widescreen interfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>About EduTrack</h2>
              <p className="text-muted">
                EduTrack is a premium student attendance tracker created to bridge school management needs with automated software. By replacing manual paperwork sheets with web forms, we save teachers valuable teaching time and lower error rates.
              </p>
              <p className="text-muted">
                Students can check their own attendance history directly, minimizing transparency gaps and encouraging consistent attendance levels. It's safe, and designed to look beautiful.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="glass-card p-5" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(96, 165, 250, 0.08) 100%)' }}>
                <h5 className="fw-bold text-primary mb-3">Our Core Philosophy</h5>
                <p className="mb-4 text-dark">
                  We believe that education runs on structure. Clear tracking builds accountability, and beautiful layout drives positive interactions.
                </p>
                <div className="d-flex align-items-center gap-3">
                  <FiCheckCircle className="text-success" size={24} />
                  <span className="fw-medium text-dark">Saves 15+ hours of paperwork per teacher every month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Why Schools Choose Us</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>The key benefits that set EduTrack apart from traditional systems.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="soft-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Instant Insights</h5>
                <p className="text-muted small mb-0">View daily totals, leave requests, and monthly trends immediately via visual charts and graphs.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="soft-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Easy Editing</h5>
                <p className="text-muted small mb-0">Incorrect logs can be fixed directly. The system verifies unique roll numbers and dates to prevent duplicates.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="soft-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">No Clutter</h5>
                <p className="text-muted small mb-0">By omitting admin complexity, teachers and students get focused toolsets tailored to their needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>Get in Touch</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Contact the school administration or EduTrack developers.</p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary-subtle text-primary p-3">
                  <FiMail size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Email Support</h6>
                  <span className="text-muted small">support@edutrack.edu</span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary-subtle text-primary p-3">
                  <FiPhone size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Call Us</h6>
                  <span className="text-muted small">+1 (555) 0199</span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary-subtle text-primary p-3">
                  <FiMapPin size={22} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Find Us</h6>
                  <span className="text-muted small">123 Academy Blvd, Springfield</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-lg-6">
              <Logo showText={true} textColor="#FFFFFF" width="40px" height="40px" />
              <p className="text-muted small mt-3" style={{ maxWidth: '300px' }}>
                Automating attendance tracking with clean aesthetics and modern technologies.
              </p>
            </div>
            <div className="col-lg-6 text-lg-end">
              <h6 className="fw-bold text-white mb-3">Quick Links</h6>
              <div className="d-flex flex-column gap-2 text-lg-end">
                <a href="#home" className="text-muted small text-decoration-none hover:text-white">Home</a>
                <a href="#about" className="text-muted small text-decoration-none hover:text-white">About</a>
                <a href="#features" className="text-muted small text-decoration-none hover:text-white">Features</a>
                <Link to="/login" className="text-muted small text-decoration-none hover:text-white">Login</Link>
              </div>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3">
            <span className="text-muted small">&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</span>
            <span className="text-muted small">Designed for Premium School Management.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
