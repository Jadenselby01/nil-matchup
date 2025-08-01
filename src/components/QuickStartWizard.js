import React, { useState } from 'react';
import './QuickStartWizard.css';

const QuickStartWizard = ({ userType, onComplete, onSkip }) => {
  const [formData, setFormData] = useState({
    profileImage: null,
    name: '',
    sport: '',
    businessType: '',
    age: '',
    university: '',
    bio: '',
    location: '',
    businessDescription: '',
    partnershipType: '',
    budgetRange: '',
    additionalRequirements: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    linkedin: '',
    legalSigned: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('profileImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal comprehensive-setup">
        <div className="wizard-header">
          <h2>Complete Your Profile</h2>
          <p>Set up your {userType === 'athlete' ? 'athlete' : 'business'} profile to get started</p>
          <button className="skip-btn" onClick={handleSkip}>
            Skip for now
          </button>
        </div>

        <div className="wizard-content">
          <form onSubmit={handleSubmit} className="comprehensive-form">
            {/* Profile Image Section */}
            <div className="form-section">
              <h3>Profile Photo</h3>
              <div className="image-upload-section">
                {formData.profileImage ? (
                  <div className="image-preview">
                    <img src={formData.profileImage} alt="Profile preview" />
                    <button 
                      type="button" 
                      className="change-image-btn"
                      onClick={() => document.getElementById('profile-image-input').click()}
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">{userType === 'athlete' ? '📷' : '🏢'}</div>
                    <p>Click to upload your {userType === 'athlete' ? 'photo' : 'logo'}</p>
                    <small>JPG, PNG up to 5MB</small>
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button"
                      className="upload-btn"
                      onClick={() => document.getElementById('profile-image-input').click()}
                    >
                      Choose {userType === 'athlete' ? 'Photo' : 'Logo'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{userType === 'athlete' ? 'Full Name' : 'Business Name'}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={userType === 'athlete' ? 'Michael Johnson' : 'Carolina Sports Bar & Grill'}
                    required
                  />
                </div>
                
                {userType === 'athlete' ? (
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      min="16"
                      max="30"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter your business address"
                      required
                    />
                  </div>
                )}
              </div>

              {userType === 'athlete' ? (
                <>
                  <div className="form-group">
                    <label>School/University</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      placeholder="Enter your school or university"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Sport</label>
                    <select
                      value={formData.sport}
                      onChange={(e) => handleInputChange('sport', e.target.value)}
                      required
                    >
                      <option value="">Select your sport</option>
                      <option value="football">Football</option>
                      <option value="basketball">Basketball</option>
                      <option value="soccer">Soccer</option>
                      <option value="baseball">Baseball</option>
                      <option value="tennis">Tennis</option>
                      <option value="swimming">Swimming</option>
                      <option value="track">Track & Field</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell businesses about yourself, your achievements, and what makes you unique..."
                      rows="4"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="retail">Retail</option>
                      <option value="fitness">Fitness & Wellness</option>
                      <option value="automotive">Automotive</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="professional-services">Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Business Description</label>
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      placeholder="Tell athletes about your business, what you offer, and why they should partner with you..."
                      rows="4"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Social Media Section */}
            <div className="form-section">
              <h3>Social Media Links</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
                
                <div className="form-group">
                  <label>Twitter/X</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>TikTok</label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </div>
                
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              
              <div className="social-tip">
                <p>💡 <strong>Tip:</strong> Connected social accounts help {userType === 'athlete' ? 'businesses' : 'athletes'} find you and create better deals!</p>
              </div>
            </div>

            {/* Business-specific Partnership Section */}
            {userType === 'business' && (
              <div className="form-section">
                <h3>Partnership Requests</h3>
                <div className="form-group">
                  <label>What type of partnerships are you looking for?</label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                    required
                  >
                    <option value="">Select partnership type</option>
                    <option value="social-media">Social Media Promotion</option>
                    <option value="events">Event Appearances</option>
                    <option value="endorsements">Product Endorsements</option>
                    <option value="content">Content Creation</option>
                    <option value="ambassador">Brand Ambassador</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="0-500">$0 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Additional Requirements</label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    placeholder="Any specific requirements or preferences for athlete partnerships..."
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Legal Agreement Section */}
            <div className="form-section">
              <h3>Legal Agreements</h3>
              <div className="legal-section">
                <div className="legal-card">
                  <div className="legal-header">
                    <h4>NIL Platform Agreement</h4>
                    <span className="legal-badge">Required</span>
                  </div>
                  <p>Standard terms for using NILMatch platform</p>
                  <button 
                    type="button"
                    className="sign-btn"
                    onClick={() => handleInputChange('legalSigned', true)}
                  >
                    {formData.legalSigned ? '✅ Signed' : 'Sign Agreement'}
                  </button>
                </div>
                
                <div className="legal-tip">
                  <p>🔒 <strong>Secure:</strong> Your information is protected and agreements are legally binding</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="complete-btn"
                disabled={!formData.name || (userType === 'athlete' && !formData.sport) || (userType === 'business' && !formData.businessType)}
              >
                Complete Profile Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuickStartWizard; 