import React, { useState } from 'react';
import './BusinessProfilePage.css';
import { demoStorage } from './utils/demoMode';

const BusinessProfilePage = ({ user, onBack, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Carolina Sports Bar & Grill',
    businessType: user?.businessType || 'Restaurant',
    location: user?.location || 'Chapel Hill, NC',
    description: user?.description || 'Local sports bar serving the best wings and burgers in Chapel Hill.',
    partnershipType: user?.partnershipType || 'Event Appearances',
    budgetRange: user?.budgetRange || '$500 - $1,000',
    requirements: user?.requirements || 'Looking for athletes to make appearances during game days.',
    website: user?.website || 'https://carolinasportsbar.com',
    phone: user?.phone || '(919) 555-0123',
    email: user?.email || 'info@carolinasportsbar.com'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
    console.log('Business profile updated:', profileData);
  };

  const handleCompleteProfile = () => {
    // Mark profile as completed and go to dashboard
    demoStorage.setItem('profileCompleted', 'true');
    onBack(); // This will go back to dashboard
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      name: user?.name || 'Carolina Sports Bar & Grill',
      businessType: user?.businessType || 'Restaurant',
      location: user?.location || 'Chapel Hill, NC',
      description: user?.description || 'Local sports bar serving the best wings and burgers in Chapel Hill.',
      partnershipType: user?.partnershipType || 'Event Appearances',
      budgetRange: user?.budgetRange || '$500 - $1,000',
      requirements: user?.requirements || 'Looking for athletes to make appearances during game days.',
      website: user?.website || 'https://carolinasportsbar.com',
      phone: user?.phone || '(919) 555-0123',
      email: user?.email || 'info@carolinasportsbar.com'
    });
  };

  return (
    <div className="business-profile-container">
              <div className="profile-header">
          <button className="back-btn" onClick={onBack}>
            ← Back to Login
          </button>
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button className="complete-btn" onClick={handleCompleteProfile}>
                Complete Profile
              </button>
            </>
          ) : (
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-image-section">
            <img 
              src={user?.image || "https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB"} 
              alt="Business Logo" 
              className="profile-image"
            />
            {isEditing && (
              <button className="change-photo-btn">
                Change Logo
              </button>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Business Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Type</label>
                    <select 
                      value={profileData.businessType}
                      onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Retail">Retail</option>
                      <option value="Fitness & Wellness">Fitness & Wellness</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Business Description</label>
                  <textarea 
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    rows="4"
                    placeholder="Tell athletes about your business..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Partnership Type</label>
                    <select 
                      value={profileData.partnershipType}
                      onChange={(e) => setProfileData({...profileData, partnershipType: e.target.value})}
                    >
                      <option value="Social Media Promotion">Social Media Promotion</option>
                      <option value="Event Appearances">Event Appearances</option>
                      <option value="Product Endorsements">Product Endorsements</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Brand Ambassador">Brand Ambassador</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Budget Range</label>
                    <select 
                      value={profileData.budgetRange}
                      onChange={(e) => setProfileData({...profileData, budgetRange: e.target.value})}
                    >
                      <option value="$0 - $500">$0 - $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Requirements</label>
                  <textarea 
                    value={profileData.requirements}
                    onChange={(e) => setProfileData({...profileData, requirements: e.target.value})}
                    rows="3"
                    placeholder="Specific requirements for athlete partnerships..."
                  />
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h1 className="profile-name">{profileData.name}</h1>
                <p className="profile-type">{profileData.businessType}</p>
                <p className="profile-location">{profileData.location}</p>
                <p className="profile-description">{profileData.description}</p>
                
                <div className="partnership-info">
                  <div className="info-item">
                    <span className="info-label">Partnership Type:</span>
                    <span className="info-value">{profileData.partnershipType}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Budget Range:</span>
                    <span className="info-value">{profileData.budgetRange}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="contact-section">
            <h3>Contact Information</h3>
            {isEditing ? (
              <div className="contact-edit">
                <div className="form-group">
                  <label>Website</label>
                  <input 
                    type="url" 
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="contact@business.com"
                  />
                </div>
              </div>
            ) : (
              <div className="contact-links">
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="contact-link website">
                  Website
                </a>
                <a href={`tel:${profileData.phone}`} className="contact-link phone">
                  {profileData.phone}
                </a>
                <a href={`mailto:${profileData.email}`} className="contact-link email">
                  ✉️ {profileData.email}
                </a>
              </div>
            )}
          </div>

          <div className="stats-section">
            <h3>Business Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">8</span>
                <span className="stat-label">Active Partnerships</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$12K</span>
                <span className="stat-label">Total Spent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">Athletes Connected</span>
              </div>
            </div>
          </div>

          <div className="requirements-section">
            <h3>Partnership Requirements</h3>
            <div className="requirements-content">
              <p>{profileData.requirements}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage; 