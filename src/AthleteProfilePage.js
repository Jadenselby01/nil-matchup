import React, { useState } from 'react';
import './AthleteProfilePage.css';
import { demoStorage } from './utils/demoMode';

const AthleteProfilePage = ({ user, onBack, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Michael Johnson',
    sport: user?.sport || 'Football',
    university: user?.university || 'University of North Carolina',
    age: user?.age || 20,
    bio: user?.bio || 'Star quarterback with incredible passing accuracy and leadership skills.',
    instagram: user?.instagram || 'https://instagram.com/michaeljohnson',
    twitter: user?.twitter || 'https://twitter.com/michaeljohnson',
    tiktok: user?.tiktok || 'https://tiktok.com/@michaeljohnson',
    linkedin: user?.linkedin || 'https://linkedin.com/in/michaeljohnson'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
    console.log('Profile updated:', profileData);
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
      name: user?.name || 'Michael Johnson',
      sport: user?.sport || 'Football',
      university: user?.university || 'University of North Carolina',
      age: user?.age || 20,
      bio: user?.bio || 'Star quarterback with incredible passing accuracy and leadership skills.',
      instagram: user?.instagram || 'https://instagram.com/michaeljohnson',
      twitter: user?.twitter || 'https://twitter.com/michaeljohnson',
      tiktok: user?.tiktok || 'https://tiktok.com/@michaeljohnson',
      linkedin: user?.linkedin || 'https://linkedin.com/in/michaeljohnson'
    });
  };

  return (
    <div className="profile-page-container">
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
              src={user?.image || "https://via.placeholder.com/200x200/007bff/ffffff?text=MJ"} 
              alt="Profile" 
              className="profile-image"
            />
            {isEditing && (
              <button className="change-photo-btn">
                Change Photo
              </button>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Sport</label>
                    <select 
                      value={profileData.sport}
                      onChange={(e) => setProfileData({...profileData, sport: e.target.value})}
                    >
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Soccer">Soccer</option>
                      <option value="Baseball">Baseball</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Track & Field">Track & Field</option>
                      <option value="Swimming">Swimming</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      value={profileData.age}
                      onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                      min="16" 
                      max="30"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>University</label>
                  <input 
                    type="text" 
                    value={profileData.university}
                    onChange={(e) => setProfileData({...profileData, university: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows="4"
                  />
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h1 className="profile-name">{profileData.name}</h1>
                <p className="profile-sport">{profileData.sport}</p>
                <p className="profile-university">{profileData.university}</p>
                <p className="profile-age">{profileData.age} years old</p>
                <p className="profile-bio">{profileData.bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          <div className="social-links-section">
            <h3>Social Media Links</h3>
            {isEditing ? (
              <div className="social-links-edit">
                <div className="form-group">
                  <label>Instagram</label>
                  <input 
                    type="url" 
                    value={profileData.instagram}
                    onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter/X</label>
                  <input 
                    type="url" 
                    value={profileData.twitter}
                    onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div className="form-group">
                  <label>TikTok</label>
                  <input 
                    type="url" 
                    value={profileData.tiktok}
                    onChange={(e) => setProfileData({...profileData, tiktok: e.target.value})}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input 
                    type="url" 
                    value={profileData.linkedin}
                    onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            ) : (
              <div className="social-links">
                <a href={profileData.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                  📸 Instagram
                </a>
                <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  Twitter/X
                </a>
                <a href={profileData.tiktok} target="_blank" rel="noopener noreferrer" className="social-link tiktok">
                  TikTok
                </a>
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                  💼 LinkedIn
                </a>
              </div>
            )}
          </div>

          <div className="stats-section">
            <h3>Profile Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Partnerships</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">$8.5K</span>
                <span className="stat-label">Total Earnings</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteProfilePage; 