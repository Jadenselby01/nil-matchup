import React, { useState } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ onClose, currentUser }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    offers: true,
    messages: true,
    payments: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    contactInfo: 'businesses-only',
    activityStatus: true
  });

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePrivacyChange = (type, value) => {
    setPrivacy(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('userSettings', JSON.stringify({
      notifications,
      privacy
    }));
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-modal-content">
          <div className="settings-section">
            <h3>🔔 Notifications</h3>
            <div className="settings-options">
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  Email Notifications
                </label>
                <p className="setting-description">Receive updates via email</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  Push Notifications
                </label>
                <p className="setting-description">Get real-time alerts</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={notifications.offers}
                    onChange={() => handleNotificationChange('offers')}
                  />
                  NIL Offers
                </label>
                <p className="setting-description">New partnership opportunities</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={notifications.messages}
                    onChange={() => handleNotificationChange('messages')}
                  />
                  Messages
                </label>
                <p className="setting-description">New messages from partners</p>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={notifications.payments}
                    onChange={() => handleNotificationChange('payments')}
                  />
                  Payment Updates
                </label>
                <p className="setting-description">Payment confirmations and status</p>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>🔒 Privacy</h3>
            <div className="settings-options">
              <div className="setting-item">
                <label className="setting-label">Profile Visibility</label>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="setting-select"
                >
                  <option value="public">Public - All users can see your profile</option>
                  <option value="verified">Verified Only - Only verified businesses</option>
                  <option value="private">Private - Only invited users</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">Contact Information</label>
                <select
                  value={privacy.contactInfo}
                  onChange={(e) => handlePrivacyChange('contactInfo', e.target.value)}
                  className="setting-select"
                >
                  <option value="businesses-only">Businesses Only</option>
                  <option value="verified-businesses">Verified Businesses Only</option>
                  <option value="public">Public</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label className="setting-label">
                  <input
                    type="checkbox"
                    checked={privacy.activityStatus}
                    onChange={() => handlePrivacyChange('activityStatus', !privacy.activityStatus)}
                  />
                  Show Activity Status
                </label>
                <p className="setting-description">Let others see when you're online</p>
              </div>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Account</h3>
            <div className="account-info">
              <p><strong>Email:</strong> {currentUser?.email || 'user@example.com'}</p>
              <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Account Type:</strong> {currentUser?.type === 'athlete' ? 'Athlete' : 'Business'}</p>
            </div>
          </div>
          
          <div className="settings-footer">
            <button className="save-settings-btn" onClick={handleSaveSettings}>
              Save Settings
            </button>
            <button className="close-modal-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 