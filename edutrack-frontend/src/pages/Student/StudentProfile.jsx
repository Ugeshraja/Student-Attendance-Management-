import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FiLock, FiCamera, FiUser, FiInfo } from 'react-icons/fi';
import API from '../../services/api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await API.get('/profile/me');
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire('Error', 'Please fill in all password fields.', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      Swal.fire('Error', 'New password must be at least 6 characters long.', 'error');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire('Error', 'New passwords do not match.', 'error');
      return;
    }

    try {
      await API.put('/profile/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text: 'Your password was successfully updated.',
        timer: 2000,
        showConfirmButton: false
      });
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password. Make sure old password is correct.';
      Swal.fire('Error', msg, 'error');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'File size exceeds the 5MB limit.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await API.post('/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const fileUrl = response.data.profilePictureUrl;
      
      // Update profile picture state
      setProfile(prev => ({
        ...prev,
        profilePicture: fileUrl
      }));

      // Update user details in localStorage
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.profilePicture = fileUrl;
        localStorage.setItem('user', JSON.stringify(user));
      }

      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Profile photo updated successfully.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Could not upload profile picture.', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted mt-2 small">Loading your profile info...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Personal Profile Settings</h2>
        <p className="text-muted small">View your academic directory information, upload your avatar, or update your password details.</p>
      </div>

      <div className="row g-4">
        {/* Profile Card & Avatar */}
        <div className="col-lg-5">
          <div className="glass-card p-4 text-center h-100">
            <div className="position-relative d-inline-block mx-auto mb-3">
              {profile?.profilePicture ? (
                <img 
                  src={profile.profilePicture} 
                  alt="Profile" 
                  className="rounded-circle object-fit-cover" 
                  style={{ width: '120px', height: '120px', border: '3px solid #2563EB' }}
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-1 mx-auto shadow-sm"
                  style={{ width: '120px', height: '120px', backgroundColor: '#2563EB' }}
                >
                  {getInitials(profile?.name)}
                </div>
              )}
              
              <label 
                htmlFor="photoUpload" 
                className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow border border-white cursor-pointer"
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Upload Photo"
              >
                <FiCamera size={16} />
                <input 
                  type="file" 
                  id="photoUpload" 
                  accept="image/*" 
                  className="d-none" 
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            
            <h4 className="fw-bold mb-1">{profile?.name}</h4>
            <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill fw-semibold mb-4">
              {profile?.rollNumber}
            </span>

            {/* Profile Info Details List */}
            <div className="table-responsive text-start border-top pt-3">
              <table className="table table-sm table-borderless small mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted w-40">Class & Section:</td>
                    <td className="fw-bold text-dark">{profile?.className} - {profile?.sectionName}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Advisor / Teacher:</td>
                    <td className="fw-bold text-dark">{profile?.teacherName || '—'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Parent / Guardian:</td>
                    <td className="fw-bold text-dark">{profile?.parentName}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Parent Mobile:</td>
                    <td className="fw-bold text-dark">{profile?.parentMobile}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Personal Email:</td>
                    <td className="fw-bold text-dark">{profile?.email}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Address:</td>
                    <td className="fw-bold text-dark">{profile?.address || '—'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">Username:</td>
                    <td className="fw-bold text-dark">{profile?.username}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="alert alert-warning py-2.5 px-3 rounded-3 d-flex align-items-center gap-2 mt-4 text-start" style={{ fontSize: '12px' }}>
              <FiInfo size={16} className="text-warning flex-shrink-0" />
              <span>To correct or update your profile details, please contact your Class Advisor.</span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="col-lg-7">
          <div className="glass-card p-4 h-100">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center gap-2">
              <FiLock />
              <span>Change Password</span>
            </h5>
            
            <form onSubmit={handlePasswordSubmit} className="mt-3">
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Current Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Old password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">New Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm New Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="text-end mt-4 pt-3 border-top">
                <button type="submit" className="btn btn-primary px-4 py-2.5 fw-bold">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
