import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiSearch, 
  FiCheck, 
  FiSave,
  FiUserCheck,
  FiInfo
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import API from '../../services/api';

const AttendanceModule = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sheetLoaded, setSheetLoaded] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [classRes, secRes] = await Promise.all([
        API.get('/metadata/classes'),
        API.get('/metadata/sections')
      ]);
      setClasses(classRes.data);
      setSections(secRes.data);
      if (classRes.data.length > 0) setSelectedClass(classRes.data[0].id);
      if (secRes.data.length > 0) setSelectedSection(secRes.data[0].id);
    } catch (error) {
      console.error('Failed to load metadata', error);
    }
  };

  const loadAttendanceSheet = async (e) => {
    if (e) e.preventDefault();
    if (!selectedClass || !selectedSection || !selectedDate) {
      Swal.fire('Info', 'Please select class, section and date.', 'info');
      return;
    }

    setLoading(true);
    setSheetLoaded(false);
    try {
      const response = await API.get(
        `/attendance?classId=${selectedClass}&sectionId=${selectedSection}&date=${selectedDate}`
      );
      
      const list = response.data;
      setAttendanceList(list);
      setSheetLoaded(true);

      // Check if attendance was already logged for this sheet
      // If at least one student has an ID/status already stored, we are in EDIT mode
      const alreadyLogged = list.some(item => item.id !== null || item.status !== null);
      setIsEditingExisting(alreadyLogged);

      if (list.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Empty Class',
          text: 'No students enrolled in the selected Class and Section.',
          confirmButtonColor: '#2563EB',
        });
      } else if (alreadyLogged) {
        Swal.fire({
          icon: 'info',
          title: 'Existing Logs Found',
          text: 'Attendance for this class/section and date has already been marked. Saving will overwrite existing records.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to load attendance sheet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceList(prevList => 
      prevList.map(item => 
        item.studentId === studentId ? { ...item, status: status } : item
      )
    );
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceList(prevList => 
      prevList.map(item => 
        item.studentId === studentId ? { ...item, remarks: remarks } : item
      )
    );
  };

  const markAllAs = (status) => {
    setAttendanceList(prevList => 
      prevList.map(item => ({ ...item, status: status }))
    );
    Swal.fire({
      icon: 'success',
      title: `Marked All as ${status}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const saveAttendance = async () => {
    // Check if any student hasn't been marked
    const unmarked = attendanceList.filter(item => !item.status);
    if (unmarked.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Unmarked Students',
        text: `Please mark attendance for all students. There are ${unmarked.length} unmarked student(s).`,
        confirmButtonColor: '#2563EB',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        classId: parseInt(selectedClass),
        sectionId: parseInt(selectedSection),
        date: selectedDate,
        records: attendanceList.map(item => ({
          studentId: item.studentId,
          status: item.status,
          remarks: item.remarks || ''
        }))
      };

      await API.post('/attendance', payload);

      Swal.fire({
        icon: 'success',
        title: 'Attendance Saved!',
        text: 'The student attendance record has been logged successfully.',
        confirmButtonColor: '#22C55E'
      });
      
      // Reload sheet
      loadAttendanceSheet();
    } catch (error) {
      console.error(error);
      Swal.fire('Failed!', 'Failed to save attendance records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = attendanceList.filter(item => 
    item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.studentRollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Attendance Module</h2>
        <p className="text-muted small">Select class, section, and date to mark or edit student attendance logs.</p>
      </div>

      {/* Selectors Panel */}
      <div className="glass-card p-4 mb-4">
        <form onSubmit={loadAttendanceSheet} className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Class *</label>
            <select
              className="form-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Section *</label>
            <select
              className="form-select"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Date *</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FiCalendar /></span>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold" disabled={loading}>
              Load Attendance Sheet
            </button>
          </div>
        </form>
      </div>

      {/* Attendance Sheet */}
      {sheetLoaded && (
        <div className="glass-card p-4 fade-in">
          {/* Quick Actions & Search */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 border-bottom pb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="text-muted small fw-semibold me-2">Mark Bulk:</span>
              <button 
                type="button" 
                className="btn btn-outline-success btn-sm px-3 py-1.5"
                onClick={() => markAllAs('PRESENT')}
              >
                All Present
              </button>
              <button 
                type="button" 
                className="btn btn-outline-danger btn-sm px-3 py-1.5"
                onClick={() => markAllAs('ABSENT')}
              >
                All Absent
              </button>
              <button 
                type="button" 
                className="btn btn-outline-warning btn-sm px-3 py-1.5"
                onClick={() => markAllAs('LEAVE')}
              >
                All On Leave
              </button>
            </div>
            
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0 text-muted"><FiSearch /></span>
                <input
                  type="text"
                  className="form-control border-start-0 py-1.5"
                  placeholder="Filter student list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status Label Info */}
          {isEditingExisting && (
            <div className="alert alert-info py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 mb-4" style={{ fontSize: '13px' }}>
              <FiInfo size={16} />
              <span>You are viewing already submitted attendance records. Saving changes will overwrite existing entries.</span>
            </div>
          )}

          {/* Student Sheet Table */}
          {filteredList.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="custom-table table align-middle">
                  <thead>
                    <tr>
                      <th className="w-15">Roll Number</th>
                      <th className="w-25">Student Name</th>
                      <th className="w-35 text-center">Attendance Status</th>
                      <th className="w-25">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((item) => (
                      <tr key={item.studentId}>
                        <td className="fw-bold text-dark">{item.studentRollNumber}</td>
                        <td className="fw-medium">{item.studentName}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {/* Present Radio */}
                            <label 
                              className={`btn btn-sm px-3 py-2.5 border fw-semibold d-flex align-items-center gap-1.5 cursor-pointer ${
                                item.status === 'PRESENT' 
                                  ? 'btn-success text-white border-success' 
                                  : 'btn-outline-success border-success-subtle bg-white text-success'
                              }`}
                              style={{ borderRadius: '8px', minWidth: '95px' }}
                            >
                              <input
                                type="radio"
                                className="d-none"
                                name={`status-${item.studentId}`}
                                checked={item.status === 'PRESENT'}
                                onChange={() => handleStatusChange(item.studentId, 'PRESENT')}
                              />
                              {item.status === 'PRESENT' && <FiCheck size={14} />}
                              <span>Present</span>
                            </label>

                            {/* Absent Radio */}
                            <label 
                              className={`btn btn-sm px-3 py-2.5 border fw-semibold d-flex align-items-center gap-1.5 cursor-pointer ${
                                item.status === 'ABSENT' 
                                  ? 'btn-danger text-white border-danger' 
                                  : 'btn-outline-danger border-danger-subtle bg-white text-danger'
                              }`}
                              style={{ borderRadius: '8px', minWidth: '95px' }}
                            >
                              <input
                                type="radio"
                                className="d-none"
                                name={`status-${item.studentId}`}
                                checked={item.status === 'ABSENT'}
                                onChange={() => handleStatusChange(item.studentId, 'ABSENT')}
                              />
                              {item.status === 'ABSENT' && <FiCheck size={14} />}
                              <span>Absent</span>
                            </label>

                            {/* Leave Radio */}
                            <label 
                              className={`btn btn-sm px-3 py-2.5 border fw-semibold d-flex align-items-center gap-1.5 cursor-pointer ${
                                item.status === 'LEAVE' 
                                  ? 'btn-warning text-white border-warning' 
                                  : 'btn-outline-warning border-warning-subtle bg-white text-warning'
                              }`}
                              style={{ borderRadius: '8px', minWidth: '95px' }}
                            >
                              <input
                                type="radio"
                                className="d-none"
                                name={`status-${item.studentId}`}
                                checked={item.status === 'LEAVE'}
                                onChange={() => handleStatusChange(item.studentId, 'LEAVE')}
                              />
                              {item.status === 'LEAVE' && <FiCheck size={14} />}
                              <span>Leave</span>
                            </label>
                          </div>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm py-2 bg-light border-0"
                            placeholder="Add reason/remarks..."
                            value={item.remarks || ''}
                            onChange={(e) => handleRemarksChange(item.studentId, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={() => loadAttendanceSheet()}
                  disabled={loading}
                >
                  Discard Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-success text-white d-inline-flex align-items-center gap-2 px-4 py-2.5"
                  onClick={saveAttendance}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <FiSave />
                      <span>{isEditingExisting ? 'Update Logs' : 'Submit Attendance'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted mb-0">No matching student names found in this filter list.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceModule;
