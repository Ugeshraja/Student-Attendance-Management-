import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './components/Layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';

// Common Components
import PrivateRoute from './components/Common/PrivateRoute';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentManagement from './pages/Teacher/StudentManagement';
import AttendanceModule from './pages/Teacher/AttendanceModule';
import ReportModule from './pages/Teacher/ReportModule';
import TeacherProfile from './pages/Teacher/TeacherProfile';
import TeacherSettings from './pages/Teacher/TeacherSettings';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        {/* Protected Teacher Routes */}
        <Route 
          path="/teacher" 
          element={
            <PrivateRoute allowedRoles={['TEACHER']}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="attendance" element={<AttendanceModule />} />
          <Route path="reports" element={<ReportModule />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* Protected Student Routes */}
        <Route 
          path="/student" 
          element={
            <PrivateRoute allowedRoles={['STUDENT']}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
