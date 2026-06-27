import React, { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiCalendar, 
  FiDownload, 
  FiPrinter,
  FiTrendingUp,
  FiInfo
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import API from '../../services/api';

const ReportModule = () => {
  const [reportType, setReportType] = useState('CLASS_WISE');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);

  // Selectors State
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  // Date states (default to current month)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().substring(0, 10);
  const lastDay = today.toISOString().substring(0, 10);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  // Result State
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [classRes, secRes, stuRes] = await Promise.all([
        API.get('/metadata/classes'),
        API.get('/metadata/sections'),
        API.get('/teacher/students') // load all students for student-wise report dropdown
      ]);
      setClasses(classRes.data);
      setSections(secRes.data);
      setStudents(stuRes.data);
      
      if (classRes.data.length > 0) setSelectedClass(classRes.data[0].id);
      if (secRes.data.length > 0) setSelectedSection(secRes.data[0].id);
      if (stuRes.data.length > 0) setSelectedStudent(stuRes.data[0].id);
    } catch (error) {
      console.error('Metadata load error', error);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportData(null);

    try {
      let response;
      if (reportType === 'CLASS_WISE') {
        response = await API.get(
          `/reports/class?classId=${selectedClass}&sectionId=${selectedSection}&startDate=${startDate}&endDate=${endDate}`
        );
      } else {
        response = await API.get(
          `/reports/student/${selectedStudent}?startDate=${startDate}&endDate=${endDate}`
        );
      }
      setReportData(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Report Error',
        text: 'Failed to generate report logs.',
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  // Export as CSV
  const exportToCSV = () => {
    if (!reportData || !reportData.details || reportData.details.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    if (reportType === 'CLASS_WISE') {
      csvContent += "Student Name,Roll Number,Date,Status,Remarks\r\n";
      reportData.details.forEach(item => {
        csvContent += `"${item.studentName}","${item.studentRollNumber}","${item.date}","${item.status}","${item.remarks || ''}"\r\n`;
      });
    } else {
      csvContent += "Date,Status,Remarks\r\n";
      reportData.details.forEach(item => {
        csvContent += `"${item.date}","${item.status}","${item.remarks || ''}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EduTrack_Report_${reportType}_${startDate}_to_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel (Tab Separated XLS fallback)
  const exportToExcel = () => {
    if (!reportData || !reportData.details || reportData.details.length === 0) return;

    let content = "";
    if (reportType === 'CLASS_WISE') {
      content += "Student Name\tRoll Number\tDate\tStatus\tRemarks\n";
      reportData.details.forEach(item => {
        content += `${item.studentName}\t${item.studentRollNumber}\t${item.date}\t${item.status}\t${item.remarks || ''}\n`;
      });
    } else {
      content += "Date\tStatus\tRemarks\n";
      reportData.details.forEach(item => {
        content += `${item.date}\t${item.status}\t${item.remarks || ''}\n`;
      });
    }

    const blob = new Blob([content], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `EduTrack_Report_${reportType}_${startDate}_to_${endDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print or Save as PDF
  const printReport = () => {
    window.print();
  };

  const getPercentageColor = (pct) => {
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4 d-print-none">
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Reports Module</h2>
        <p className="text-muted small">Filter class-wise and student-wise attendance records over customizable date ranges.</p>
      </div>

      {/* Selectors Panel */}
      <div className="glass-card p-4 mb-4 d-print-none">
        {/* Toggle tabs */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-3">
          <button 
            className={`btn px-4 py-2 fw-semibold ${reportType === 'CLASS_WISE' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setReportType('CLASS_WISE'); setReportData(null); }}
          >
            Class-wise Report
          </button>
          <button 
            className={`btn px-4 py-2 fw-semibold ${reportType === 'STUDENT_WISE' ? 'btn-primary' : 'btn-light'}`}
            onClick={() => { setReportType('STUDENT_WISE'); setReportData(null); }}
          >
            Student-wise Report
          </button>
        </div>

        {/* Filters Form */}
        <form onSubmit={handleGenerateReport} className="row g-3 align-items-end">
          {reportType === 'CLASS_WISE' ? (
            <>
              <div className="col-md-3 col-sm-6">
                <label className="form-label small fw-semibold">Class</label>
                <select 
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-md-3 col-sm-6">
                <label className="form-label small fw-semibold">Section</label>
                <select 
                  className="form-select"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                >
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </>
          ) : (
            <div className="col-md-6 col-sm-12">
              <label className="form-label small fw-semibold">Select Student</label>
              <select 
                className="form-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-3 col-sm-6">
            <label className="form-label small fw-semibold">Start Date</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiCalendar /></span>
              <input 
                type="date" 
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <label className="form-label small fw-semibold">End Date</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiCalendar /></span>
              <input 
                type="date" 
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-12 text-end mt-4">
            <button type="submit" className="btn btn-primary px-4 py-2.5 fw-bold" disabled={loading}>
              {loading ? 'Compiling records...' : 'Generate Attendance Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Report Output Panel */}
      {reportData && (
        <div className="glass-card p-4 fade-in">
          {/* Print/Save Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h4 className="fw-bold mb-0 text-primary">{reportData.name} Report</h4>
              <span className="text-muted small">Date Range: {startDate} to {endDate}</span>
            </div>
            
            <div className="d-flex gap-2 d-print-none">
              <button onClick={exportToCSV} className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 px-3 py-2">
                <FiDownload size={14} />
                <span>CSV</span>
              </button>
              <button onClick={exportToExcel} className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 px-3 py-2">
                <FiDownload size={14} />
                <span>Excel</span>
              </button>
              <button onClick={printReport} className="btn btn-sm btn-success text-white d-inline-flex align-items-center gap-1.5 px-3 py-2">
                <FiPrinter size={14} />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* Stats Summaries */}
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-sm-6">
              <div className="soft-card p-3 text-center bg-light">
                <span className="text-muted small fw-medium">Total Logs</span>
                <h4 className="fw-bold mb-0 mt-1">{reportData.totalDays}</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="soft-card p-3 text-center bg-success-subtle">
                <span className="text-success small fw-semibold">Present</span>
                <h4 className="fw-bold text-success mb-0 mt-1">{reportData.presentCount}</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="soft-card p-3 text-center bg-danger-subtle">
                <span className="text-danger small fw-semibold">Absent</span>
                <h4 className="fw-bold text-danger mb-0 mt-1">{reportData.absentCount}</h4>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="soft-card p-3 text-center bg-warning-subtle">
                <span className="text-warning small fw-semibold">Leave</span>
                <h4 className="fw-bold text-warning mb-0 mt-1">{reportData.leaveCount}</h4>
              </div>
            </div>

            {/* Attendance Rate percentage panel */}
            <div className="col-12">
              <div className="soft-card p-4 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <FiTrendingUp className="text-primary" size={24} />
                  <div>
                    <h6 className="fw-bold mb-0">Total Performance Index</h6>
                    <small className="text-muted">Attendance percentage rate over selected timeline.</small>
                  </div>
                </div>
                <h2 className={`fw-black mb-0 ${getPercentageColor(reportData.attendancePercentage)}`}>
                  {reportData.attendancePercentage}%
                </h2>
              </div>
            </div>
          </div>

          {/* Detailed list table */}
          {reportData.details && reportData.details.length > 0 ? (
            <div className="table-responsive">
              <table className="custom-table table align-middle">
                <thead>
                  <tr>
                    {reportType === 'CLASS_WISE' && <th>Roll Number</th>}
                    {reportType === 'CLASS_WISE' && <th>Student Name</th>}
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.details.map((row, idx) => (
                    <tr key={idx}>
                      {reportType === 'CLASS_WISE' && <td className="fw-bold text-dark">{row.studentRollNumber}</td>}
                      {reportType === 'CLASS_WISE' && <td className="fw-medium">{row.studentName}</td>}
                      <td className="fw-medium">{row.date}</td>
                      <td>
                        <span className={`badge ${
                          row.status === 'PRESENT' ? 'bg-success-subtle text-success' :
                          row.status === 'ABSENT' ? 'bg-danger-subtle text-danger' :
                          'bg-warning-subtle text-warning'
                        } px-3 py-2 rounded-3 fw-semibold`}>
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
            <div className="alert alert-warning py-3 d-flex align-items-center gap-2 mb-0">
              <FiInfo size={18} />
              <span>No attendance logs registered in the selected date range.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportModule;
