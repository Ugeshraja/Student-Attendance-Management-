import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiTrendingUp, 
  FiCheckCircle, 
  FiXCircle, 
  FiCalendar, 
  FiPrinter,
  FiMapPin,
  FiPhone,
  FiMail
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import Swal from 'sweetalert2';
import API from '../../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date ranges for personal report download
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1).toISOString().substring(0, 10); // Jan 1st of current year
  const lastDay = today.toISOString().substring(0, 10);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, historyRes] = await Promise.all([
        API.get('/profile/me'),
        API.get('/attendance/student/stats'),
        API.get('/attendance/student/history')
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-danger';
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // Compile monthly trend from history logs
  const getMonthlyTrendData = () => {
    if (history.length === 0) {
      return [
        { month: 'Jan', Attendance: 100 },
        { month: 'Feb', Attendance: 100 },
        { month: 'Mar', Attendance: 100 }
      ];
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = {};

    history.forEach(item => {
      const date = new Date(item.date);
      const monthName = months[date.getMonth()];
      
      if (!monthlyStats[monthName]) {
        monthlyStats[monthName] = { present: 0, total: 0 };
      }
      monthlyStats[monthName].total += 1;
      if (item.status === 'PRESENT') {
        monthlyStats[monthName].present += 1;
      }
    });

    return Object.keys(monthlyStats).map(month => {
      const { present, total } = monthlyStats[month];
      return {
        month,
        Attendance: Math.round((present / total) * 100)
      };
    });
  };

  const trendData = getMonthlyTrendData();

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="glass-card p-4" style={{ height: '160px' }}>
              <div className="skeleton mb-3" style={{ width: '200px', height: '24px' }}></div>
              <div className="skeleton mb-2" style={{ width: '400px', height: '14px' }}></div>
            </div>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="glass-card p-4" style={{ height: '300px' }}>
              <div className="skeleton w-50 mb-3" style={{ height: '20px' }}></div>
              <div className="skeleton w-100" style={{ height: '200px' }}></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="glass-card p-4" style={{ height: '300px' }}>
              <div className="skeleton w-50 mb-3" style={{ height: '20px' }}></div>
              <div className="skeleton w-100" style={{ height: '200px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Printable Report Header */}
      <div className="d-none d-print-block mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-0 text-primary">EduTrack - Attendance Statement</h2>
        <span className="text-muted">Student Report for {profile?.name} ({profile?.rollNumber})</span>
        <div className="mt-2 text-dark small">
          <strong>Class:</strong> {profile?.className} - {profile?.sectionName} | 
          <strong> Year:</strong> {new Date().getFullYear()} | 
          <strong> Attendance Rate:</strong> {stats?.attendancePercentage}%
        </div>
      </div>

      {/* Welcome banner */}
      <div className="glass-card p-4 mb-4 bg-primary text-white border-0 d-print-none" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h3 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Welcome Back, {profile?.name}!</h3>
            <p className="mb-0 opacity-85 small">Track your personal profile parameters and view your academic attendance summaries.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button onClick={handleDownloadPDF} className="btn btn-light d-inline-flex align-items-center gap-2">
              <FiPrinter />
              <span>Download PDF Statement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Profile Card */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center gap-2">
              <FiUser />
              <span>Academic Profile</span>
            </h5>
            
            <div className="d-flex align-items-center gap-3 mb-4">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile" 
                  className="rounded-circle object-fit-cover" 
                  style={{ width: '70px', height: '70px', border: '2.5px solid #2563EB' }}
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-3"
                  style={{ width: '70px', height: '70px', backgroundColor: '#2563EB' }}
                >
                  {profile?.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
              )}
              <div>
                <h5 className="fw-bold mb-0">{profile?.name}</h5>
                <span className="text-muted small fw-medium">{profile?.rollNumber}</span>
              </div>
            </div>

            <div className="row g-3 small">
              <div className="col-6">
                <span className="text-muted d-block">Class / Section:</span>
                <span className="fw-semibold text-dark">{profile?.className} - {profile?.sectionName}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">Gender:</span>
                <span className="fw-semibold text-dark">{profile?.gender}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">Date of Birth:</span>
                <span className="fw-semibold text-dark">{profile?.dateOfBirth}</span>
              </div>
              <div className="col-6">
                <span className="text-muted d-block">Class Advisor:</span>
                <span className="fw-semibold text-dark">{profile?.teacherName || '—'}</span>
              </div>
              <div className="col-12 border-top pt-2.5">
                <div className="d-flex align-items-center gap-2 text-muted mb-1.5">
                  <FiUser className="text-primary" />
                  <span>Parent: <strong>{profile?.parentName}</strong></span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted mb-1.5">
                  <FiPhone className="text-primary" />
                  <span>Phone: <strong>{profile?.parentMobile}</strong></span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <FiMapPin className="text-primary" />
                  <span>Address: <strong>{profile?.address || '—'}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Percentage Card */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center gap-2 d-print-none">
                <FiTrendingUp />
                <span>Attendance Statistics</span>
              </h5>
              
              <div className="row g-3 mb-4 text-center mt-2">
                <div className="col-4">
                  <div className="soft-card py-3 bg-success-subtle">
                    <FiCheckCircle className="text-success mb-1" size={20} />
                    <span className="text-muted small d-block">Present</span>
                    <h4 className="fw-bold text-success mb-0">{stats?.presentToday}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="soft-card py-3 bg-danger-subtle">
                    <FiXCircle className="text-danger mb-1" size={20} />
                    <span className="text-muted small d-block">Absent</span>
                    <h4 className="fw-bold text-danger mb-0">{stats?.absentToday}</h4>
                  </div>
                </div>
                <div className="col-4">
                  <div className="soft-card py-3 bg-warning-subtle">
                    <FiCalendar className="text-warning mb-1" size={20} />
                    <span className="text-muted small d-block">Leave</span>
                    <h4 className="fw-bold text-warning mb-0">{stats?.leaveToday}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="soft-card p-4 text-center d-flex align-items-center justify-content-between">
              <div className="text-start">
                <h6 className="fw-bold mb-0">Total Attendance Rate</h6>
                <small className="text-muted">Calculated over all school working days.</small>
              </div>
              <h2 className={`fw-black mb-0 ${getPercentageColor(stats?.attendancePercentage)}`}>
                {stats?.attendancePercentage}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Monthly Trend Area Chart */}
        <div className="col-md-6 d-print-none">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Attendance Monthly Trend</h5>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Attendance" stroke="#2563EB" fillOpacity={0.15} fill="#60A5FA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Logs View */}
        <div className="col-md-6 col-print-12">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Recent Logs & Statements</h5>
            {history.length > 0 ? (
              <div className="table-responsive" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                <table className="table table-sm align-middle small">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((row) => (
                      <tr key={row.id}>
                        <td className="fw-medium">{row.date}</td>
                        <td>
                          <span className={`badge ${
                            row.status === 'PRESENT' ? 'bg-success-subtle text-success' :
                            row.status === 'ABSENT' ? 'bg-danger-subtle text-danger' :
                            'bg-warning-subtle text-warning'
                          } px-2.5 py-1 rounded-3 fw-semibold`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-muted small">{row.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted small mb-0">No attendance history available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
