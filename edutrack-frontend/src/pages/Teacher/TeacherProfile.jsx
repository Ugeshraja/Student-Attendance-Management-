import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiPhone, FiLock, FiCamera } from 'react-icons/fi';
import API from '../../services/api';

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Details form state
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

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
      setDetails({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!details.name.trim() || !details.email.trim()) {
      Swal.fire('Error', 'Name and Email are required fields.', 'error');
      return;
    }

    try {
      const response = await API.put('/profile/me', details);
      setProfile(response.data);
      
      // Update local storage user details
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        user.name = response.data.name;
        localStorage.setItem('user', JSON.stringify(user));
      }

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your details have been updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile details.';
      Swal.fire('Error', msg, 'error');
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
        text: 'Profile photo updated.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Could not upload profile picture.', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'T';
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
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Profile Settings</h2>
        <p className="text-muted small">Update your profile parameters, upload your avatar, or reset your login credentials.</p>
      </div>

      <div className="row g-4">
        {/* Profile Card & Avatar */}
        <div className="col-lg-4">
          <div className="glass-card p-4 text-center">
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
              Teacher Account
            </span>

            <div className="text-start border-top pt-3 small">
              <div className="mb-2">
                <span className="text-muted d-block">Username:</span>
                <span className="fw-semibold text-dark">{profile?.username}</span>
              </div>
              <div>
                <span className="text-muted d-block">Support Email:</span>
                <span className="fw-semibold text-dark">{profile?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Forms */}
        <div className="col-lg-8">
          {/* Details Form */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Profile Details</h5>
            <form onSubmit={handleDetailsSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiUser /></span>
                    <input
                      type="text"
                      className="form-control"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiMail /></span>
                    <input
                      type="email"
                      className="form-control"
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiPhone /></span>
                    <input
                      type="text"
                      className="form-control"
                      value={details.phone}
                      onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                      placeholder="+1 (555) 0198"
                    />
                  </div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary px-4 py-2">Save Details</button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="glass-card p-4">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Change Password</h5>
            <form onSubmit={handlePasswordSubmit}>
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label small fw-semibold">Current Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiLock /></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Old password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">New Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiLock /></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm New Password *</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><FiLock /></span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary px-4 py-2">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
