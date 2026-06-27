import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiX, 
  FiCheckCircle 
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import API from '../../services/api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    gender: 'Male',
    dateOfBirth: '',
    classId: '',
    sectionId: '',
    parentName: '',
    parentMobile: '',
    email: '',
    address: '',
    username: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchMetadata();
    fetchStudents();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [classRes, secRes] = await Promise.all([
        API.get('/metadata/classes'),
        API.get('/metadata/sections')
      ]);
      setClasses(classRes.data);
      setSections(secRes.data);
    } catch (error) {
      console.error('Failed to load metadata', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/teacher/students');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch student list.',
        confirmButtonColor: '#2563EB',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchStudents();
      return;
    }
    setLoading(true);
    try {
      const response = await API.get(`/teacher/students/search?query=${searchQuery}`);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll Number is required';
    if (!formData.name.trim()) errors.name = 'Student Name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.classId) errors.classId = 'Class selection is required';
    if (!formData.sectionId) errors.sectionId = 'Section selection is required';
    if (!formData.parentName.trim()) errors.parentName = 'Parent Name is required';
    if (!formData.parentMobile.trim()) {
      errors.parentMobile = 'Parent mobile is required';
    } else if (!/^\+?[0-9\-\s]{7,15}$/.test(formData.parentMobile.trim())) {
      errors.parentMobile = 'Invalid mobile number format';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Invalid email format';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 4) {
      errors.username = 'Username must be at least 4 characters';
    }
    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({
      rollNumber: '',
      name: '',
      gender: 'Male',
      dateOfBirth: '',
      classId: classes[0]?.id || '',
      sectionId: sections[0]?.id || '',
      parentName: '',
      parentMobile: '',
      email: '',
      address: '',
      username: '',
      password: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditClick = (student) => {
    setIsEditMode(true);
    setSelectedStudent(student);
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      classId: student.classId,
      sectionId: student.sectionId,
      parentName: student.parentName,
      parentMobile: student.parentMobile,
      email: student.email,
      address: student.address || '',
      username: student.username,
      password: '' // leave password empty on edit
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleDeleteClick = (id, name) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete student "${name}". This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/teacher/students/${id}`);
          Swal.fire('Deleted!', 'Student record has been deleted.', 'success');
          fetchStudents();
        } catch (error) {
          Swal.fire('Failed!', 'Failed to delete student.', 'error');
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await API.put(`/teacher/students/${selectedStudent.id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Student details have been updated.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await API.post('/teacher/students', formData);
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: 'New student has been created.',
          timer: 2000,
          showConfirmButton: false
        });
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error occurred. Make sure fields are unique.';
      Swal.fire({
        icon: 'error',
        title: 'Submit Failed',
        text: errorMsg,
        confirmButtonColor: '#2563EB',
      });
    }
  };

  return (
    <div className="container-fluid">
      {/* Header section */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Student Directory</h2>
          <p className="text-muted small mb-0">Enroll and manage student profiles details.</p>
        </div>
        <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={handleAddClick}>
          <FiPlus />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-3 mb-4">
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-9 col-lg-10">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search students by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 col-lg-2">
            <button type="submit" className="btn btn-primary w-100 h-100">Search</button>
          </div>
        </form>
      </div>

      {/* Directory Table */}
      <div className="glass-card p-4">
        {loading ? (
          <div className="py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 small">Loading student records...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table table align-middle">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Class / Section</th>
                  <th>Email</th>
                  <th>Parent Name</th>
                  <th>Parent Phone</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="fw-bold text-dark">{student.rollNumber}</td>
                    <td className="fw-medium">{student.name}</td>
                    <td>{student.className} - {student.sectionName}</td>
                    <td>{student.email}</td>
                    <td>{student.parentName}</td>
                    <td>{student.parentMobile}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="btn btn-sm btn-light p-2 shadow-sm" 
                          style={{ borderRadius: '8px' }}
                          onClick={() => handleViewClick(student)}
                          title="View Profile"
                        >
                          <FiEye className="text-primary" size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-light p-2 shadow-sm" 
                          style={{ borderRadius: '8px' }}
                          onClick={() => handleEditClick(student)}
                          title="Edit Student"
                        >
                          <FiEdit2 className="text-warning" size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-light p-2 shadow-sm" 
                          style={{ borderRadius: '8px' }}
                          onClick={() => handleDeleteClick(student.id, student.name)}
                          title="Delete Student"
                        >
                          <FiTrash2 className="text-danger" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No student records found. Click "Add New Student" to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">{isEditMode ? 'Edit Student Details' : 'Register New Student'}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body p-4 bg-light">
                <div className="row g-3">
                  {/* Student Details */}
                  <h6 className="fw-bold mb-0 text-primary border-bottom pb-2">Academic & Personal Info</h6>
                  
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Roll Number *</label>
                    <input
                      type="text"
                      name="rollNumber"
                      className={`form-control ${formErrors.rollNumber ? 'is-invalid' : ''}`}
                      placeholder="e.g. STU1001"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                    />
                    {formErrors.rollNumber && <div className="invalid-feedback">{formErrors.rollNumber}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      placeholder="Student Name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Gender *</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className={`form-control ${formErrors.dateOfBirth ? 'is-invalid' : ''}`}
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                    {formErrors.dateOfBirth && <div className="invalid-feedback">{formErrors.dateOfBirth}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      placeholder="student@edutrack.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Class Assigned *</label>
                    <select
                      name="classId"
                      className={`form-select ${formErrors.classId ? 'is-invalid' : ''}`}
                      value={formData.classId}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Class --</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                    {formErrors.classId && <div className="invalid-feedback">{formErrors.classId}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Section Assigned *</label>
                    <select
                      name="sectionId"
                      className={`form-select ${formErrors.sectionId ? 'is-invalid' : ''}`}
                      value={formData.sectionId}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Section --</option>
                      {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                      ))}
                    </select>
                    {formErrors.sectionId && <div className="invalid-feedback">{formErrors.sectionId}</div>}
                  </div>

                  {/* Parent Details */}
                  <h6 className="fw-bold mb-0 text-primary border-bottom pb-2 mt-4">Parent Details</h6>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Parent Name *</label>
                    <input
                      type="text"
                      name="parentName"
                      className={`form-control ${formErrors.parentName ? 'is-invalid' : ''}`}
                      placeholder="Parent / Guardian Name"
                      value={formData.parentName}
                      onChange={handleInputChange}
                    />
                    {formErrors.parentName && <div className="invalid-feedback">{formErrors.parentName}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Parent Mobile *</label>
                    <input
                      type="text"
                      name="parentMobile"
                      className={`form-control ${formErrors.parentMobile ? 'is-invalid' : ''}`}
                      placeholder="+15550199"
                      value={formData.parentMobile}
                      onChange={handleInputChange}
                    />
                    {formErrors.parentMobile && <div className="invalid-feedback">{formErrors.parentMobile}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-semibold">Residential Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="2"
                      placeholder="Home Address"
                      value={formData.address}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  {/* Auth Credentials */}
                  <h6 className="fw-bold mb-0 text-primary border-bottom pb-2 mt-4">Login Credentials</h6>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Username *</label>
                    <input
                      type="text"
                      name="username"
                      className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                      placeholder="Student Username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">
                      {isEditMode ? 'New Password (Optional)' : 'Password *'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      placeholder={isEditMode ? 'Leave blank to keep same' : 'Password (min 6 char)'}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Student</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showViewModal && selectedStudent && (
        <div className="modal show d-block fade-in" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Student Profile Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                {/* Profile Picture */}
                <div className="position-relative d-inline-block mb-3">
                  {selectedStudent.profilePicture ? (
                    <img 
                      src={selectedStudent.profilePicture} 
                      alt="Profile" 
                      className="rounded-circle object-fit-cover border" 
                      style={{ width: '90px', height: '90px' }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-2 mx-auto"
                      style={{ width: '90px', height: '90px', backgroundColor: '#2563EB' }}
                    >
                      {selectedStudent.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                    </div>
                  )}
                </div>
                <h4 className="fw-bold mb-1">{selectedStudent.name}</h4>
                <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-semibold mb-4">
                  {selectedStudent.rollNumber}
                </span>

                {/* Details Table */}
                <div className="table-responsive text-start">
                  <table className="table table-bordered small">
                    <tbody>
                      <tr>
                        <td className="fw-semibold bg-light w-40">Class & Section</td>
                        <td>{selectedStudent.className} - {selectedStudent.sectionName}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Gender</td>
                        <td>{selectedStudent.gender}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Date of Birth</td>
                        <td>{selectedStudent.dateOfBirth}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Email</td>
                        <td>{selectedStudent.email}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Parent Name</td>
                        <td>{selectedStudent.parentName}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Parent Mobile</td>
                        <td>{selectedStudent.parentMobile}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Address</td>
                        <td>{selectedStudent.address || '—'}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold bg-light">Login Username</td>
                        <td>{selectedStudent.username}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <button type="button" className="btn btn-secondary w-100" onClick={() => setShowViewModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
