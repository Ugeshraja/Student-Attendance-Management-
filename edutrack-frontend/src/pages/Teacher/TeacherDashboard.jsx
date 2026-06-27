import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText, 
  FiTrendingUp, 
  FiCalendar,
  FiArrowRight
} from 'react-icons/fi';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import Swal from 'sweetalert2';
import API from '../../services/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await API.get('/teacher/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch dashboard statistics.',
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-danger';
  };

  // Mock historical data for charts
  const historyData = [
    { name: 'Mon', Present: 88, Absent: 8, Leave: 4 },
    { name: 'Tue', Present: 92, Absent: 5, Leave: 3 },
    { name: 'Wed', Present: 85, Absent: 10, Leave: 5 },
    { name: 'Thu', Present: 90, Absent: 6, Leave: 4 },
    { name: 'Fri', Present: 95, Absent: 2, Leave: 3 },
  ];

  // Pie Chart Setup
  const pieData = stats ? [
    { name: 'Present', value: stats.presentToday, color: '#22C55E' },
    { name: 'Absent', value: stats.absentToday, color: '#EF4444' },
    { name: 'Leave', value: stats.leaveToday, color: '#F59E0B' },
  ].filter(item => item.value > 0) : [];

  // Fallback if no attendance today
  const chartPieData = pieData.length > 0 ? pieData : [
    { name: 'No Attendance Logged Yet', value: 100, color: '#E2E8F0' }
  ];

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="row g-4 mb-4">
          {[1, 2, 3, 4].map(idx => (
            <div key={idx} className="col-md-3">
              <div className="glass-card p-4">
                <div className="skeleton mb-3" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
                <div className="skeleton mb-2" style={{ width: '70px', height: '14px' }}></div>
                <div className="skeleton" style={{ width: '110px', height: '24px' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="glass-card p-4" style={{ height: '350px' }}>
              <div className="skeleton w-25 mb-3" style={{ height: '20px' }}></div>
              <div className="skeleton w-100" style={{ height: '260px' }}></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-card p-4" style={{ height: '350px' }}>
              <div className="skeleton w-50 mb-3" style={{ height: '20px' }}></div>
              <div className="skeleton w-100" style={{ height: '260px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Welcome Title */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Overview Dashboard</h2>
          <p className="text-muted small mb-0">Here is what is happening today in your school classes.</p>
        </div>
        <button onClick={() => navigate('/teacher/attendance')} className="btn btn-primary d-inline-flex align-items-center gap-2">
          <span>Mark Today's Attendance</span>
          <FiArrowRight />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {/* Total Students */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium">Total Students</span>
              <h3 className="mb-0 fw-bold mt-1">{stats?.totalStudents}</h3>
            </div>
            <div className="rounded-circle bg-primary-subtle text-primary p-3">
              <FiUsers size={24} />
            </div>
          </div>
        </div>

        {/* Present Today */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium">Present Today</span>
              <h3 className="mb-0 fw-bold text-success mt-1">{stats?.presentToday}</h3>
            </div>
            <div className="rounded-circle bg-success-subtle text-success p-3">
              <FiCheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Absent Today */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium">Absent Today</span>
              <h3 className="mb-0 fw-bold text-danger mt-1">{stats?.absentToday}</h3>
            </div>
            <div className="rounded-circle bg-danger-subtle text-danger p-3">
              <FiXCircle size={24} />
            </div>
          </div>
        </div>

        {/* Leave Today */}
        <div className="col-sm-6 col-xl-3">
          <div className="glass-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-medium">On Leave Today</span>
              <h3 className="mb-0 fw-bold text-warning mt-1">{stats?.leaveToday}</h3>
            </div>
            <div className="rounded-circle bg-warning-subtle text-warning p-3">
              <FiCalendar size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Attendance Percentage Card */}
        <div className="col-md-6 col-xl-4">
          <div className="glass-card p-4 h-100 text-center d-flex flex-column justify-content-center align-items-center">
            <FiTrendingUp className="text-primary mb-2" size={32} />
            <span className="text-muted small fw-medium">Today's Attendance Rate</span>
            <h1 className={`display-4 fw-extrabold my-2 ${getPercentageColor(stats?.attendancePercentage)}`}>
              {stats?.attendancePercentage}%
            </h1>
            <p className="text-muted small mb-0 px-2">
              Based on the number of present students relative to overall students enrolled.
            </p>
          </div>
        </div>

        {/* Today's Status breakdown Pie chart */}
        <div className="col-md-6 col-xl-4">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Today's Status Breakdown</h5>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-2 flex-wrap">
              {stats?.presentToday > 0 || stats?.absentToday > 0 || stats?.leaveToday > 0 ? (
                <>
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="p-1.5 rounded-circle bg-success"></span>
                    <span className="text-muted">Present ({stats.presentToday})</span>
                  </div>
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="p-1.5 rounded-circle bg-danger"></span>
                    <span className="text-muted">Absent ({stats.absentToday})</span>
                  </div>
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="p-1.5 rounded-circle bg-warning"></span>
                    <span className="text-muted">Leave ({stats.leaveToday})</span>
                  </div>
                </>
              ) : (
                <span className="text-muted small">No attendance records logged for today</span>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Trend Bar Chart */}
        <div className="col-xl-4">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3">Weekly Class Attendance</h5>
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer>
                <BarChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="Present" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="row g-4">
        <div className="col-12">
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3">Recent Attendance Activity</h5>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="table-responsive">
                <table className="custom-table table align-middle">
                  <thead>
                    <tr>
                      <th>Roll Number</th>
                      <th>Student Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentActivity.map((act) => (
                      <tr key={act.id}>
                        <td className="fw-bold text-dark">{act.studentRollNumber}</td>
                        <td className="fw-medium">{act.studentName}</td>
                        <td>{act.date}</td>
                        <td>
                          <span className={`badge ${
                            act.status === 'PRESENT' ? 'bg-success-subtle text-success' :
                            act.status === 'ABSENT' ? 'bg-danger-subtle text-danger' :
                            'bg-warning-subtle text-warning'
                          } px-3 py-2 rounded-3 fw-semibold`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="text-muted small">{act.remarks || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted mb-0">No recent attendance activities to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
