import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FiBell, FiMail, FiSliders, FiShield, FiLock } from 'react-icons/fi';

const TeacherSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(true);

  const handleSaveSettings = () => {
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your application preferences have been updated successfully.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Application Settings</h2>
        <p className="text-muted small">Manage notifications, account security, and school digest preferences.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Notification Settings */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center gap-2">
              <FiBell size={20} />
              <span>Notification Preferences</span>
            </h5>
            
            <div className="py-2">
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-3 border-bottom pb-2.5">
                <div>
                  <label className="form-check-label fw-semibold text-dark d-block" htmlFor="alertSwitch">
                    Email Attendance Alerts
                  </label>
                  <small className="text-muted">Send automated email alerts to parents on student absences.</small>
                </div>
                <input
                  className="form-check-input ms-3 cursor-pointer"
                  type="checkbox"
                  id="alertSwitch"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
              </div>

              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-3 border-bottom pb-2.5">
                <div>
                  <label className="form-check-label fw-semibold text-dark d-block" htmlFor="digestSwitch">
                    Weekly Report Digest
                  </label>
                  <small className="text-muted">Receive a compiled spreadsheet copy of all class logs every Friday.</small>
                </div>
                <input
                  className="form-check-input ms-3 cursor-pointer"
                  type="checkbox"
                  id="digestSwitch"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                />
              </div>

              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-0">
                <div>
                  <label className="form-check-label fw-semibold text-dark d-block" htmlFor="pushSwitch">
                    In-app Push Notifications
                  </label>
                  <small className="text-muted">Enable notifications for profile edits and attendance reminders.</small>
                </div>
                <input
                  className="form-check-input ms-3 cursor-pointer"
                  type="checkbox"
                  id="pushSwitch"
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Security & Access Settings */}
          <div className="glass-card p-4 mb-4">
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2 d-flex align-items-center gap-2">
              <FiShield size={20} />
              <span>Security & Access Control</span>
            </h5>
            
            <div className="py-2">
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-3 border-bottom pb-2.5">
                <div>
                  <label className="form-check-label fw-semibold text-dark d-block" htmlFor="securitySwitch">
                    Log Security Activities
                  </label>
                  <small className="text-muted">Record access times, IP addresses, and login history audits.</small>
                </div>
                <input
                  className="form-check-input ms-3 cursor-pointer"
                  type="checkbox"
                  id="securitySwitch"
                  checked={securityLogs}
                  onChange={(e) => setSecurityLogs(e.target.checked)}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-0">
                <div>
                  <span className="fw-semibold text-dark d-block">IP Login White-listing</span>
                  <small className="text-muted">Restrict dashboard access only to pre-registered IP subnets.</small>
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" disabled>Configure</button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-end">
            <button 
              type="button" 
              className="btn btn-primary px-4 py-2.5 fw-bold" 
              onClick={handleSaveSettings}
            >
              Save Application preferences
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 bg-light text-center h-100 d-flex flex-column justify-content-center">
            <FiSliders className="text-primary mb-3 mx-auto" size={40} />
            <h5 className="fw-bold text-dark">System Status</h5>
            <p className="text-muted small mb-0 px-2 mt-2">
              EduTrack system is fully operational. All database pools are running on low latency rates. CORS filters are active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;
