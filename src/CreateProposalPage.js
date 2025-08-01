import React, { useState, useEffect } from 'react';
import './CreateProposalPage.css';

function CreateProposalPage({ currentUser, userType, onBack }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deliverables: [],
    compensation: '',
    deadline: '',
    targetId: ''
  });
  const [availableTargets, setAvailableTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Target, 2: Proposal Details, 3: Review

  // Sample data - this would come from Supabase
  useEffect(() => {
    const targets = userType === 'athlete' 
      ? [
          {
            id: 1,
            name: 'Carolina Sports Bar & Grill',
            image: 'https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB',
            type: 'Restaurant',
            description: 'Local sports bar looking for athlete partnerships'
          },
          {
            id: 2,
            name: 'Elite Fitness Center',
            image: 'https://via.placeholder.com/200x200/20c997/ffffff?text=EFC',
            type: 'Fitness',
            description: 'Premium fitness center seeking athlete ambassadors'
          },
          {
            id: 3,
            name: 'University Auto Service',
            image: 'https://via.placeholder.com/200x200/fd7e14/ffffff?text=UAS',
            type: 'Automotive',
            description: 'Student-friendly auto service with great discounts'
          }
        ]
      : [
          {
            id: 1,
            name: 'Michael Johnson',
            image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=MJ',
            sport: 'Football',
            university: 'University of North Carolina',
            description: 'Star quarterback with 50K+ social media followers'
          },
          {
            id: 2,
            name: 'Sarah Williams',
            image: 'https://via.placeholder.com/200x200/28a745/ffffff?text=SW',
            sport: 'Basketball',
            university: 'Duke University',
            description: 'Elite basketball player with strong engagement'
          },
          {
            id: 3,
            name: 'David Chen',
            image: 'https://via.placeholder.com/200x200/dc3545/ffffff?text=DC',
            sport: 'Soccer',
            university: 'NC State University',
            description: 'Soccer star with international following'
          }
        ];
    
    setAvailableTargets(targets);
  }, [userType]);

  const availableDeliverables = [
    { id: 'instagramFeed', name: 'Instagram Feed Post', icon: 'Instagram', basePrice: 200 },
    { id: 'instagramStory', name: 'Instagram Story', icon: 'Story', basePrice: 100 },
    { id: 'instagramReel', name: 'Instagram Reel', icon: 'Reel', basePrice: 300 },
    { id: 'tiktokVideo', name: 'TikTok Video', icon: 'TikTok', basePrice: 250 },
    { id: 'youtubeReview', name: 'YouTube Review', icon: 'Review', basePrice: 500 },
    { id: 'discountCode', name: 'Discount Code', icon: 'Discount', basePrice: 50 },
    { id: 'meetGreet', name: 'Meet & Greet', icon: 'Event', basePrice: 200 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliverableToggle = (deliverableId) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverableId)
        ? prev.deliverables.filter(id => id !== deliverableId)
        : [...prev.deliverables, deliverableId]
    }));
  };

  const handleTargetSelect = (targetId) => {
    setFormData(prev => ({
      ...prev,
      targetId
    }));
    setStep(2);
  };

  const calculateTotalCompensation = () => {
    return formData.deliverables.reduce((total, deliverableId) => {
      const deliverable = availableDeliverables.find(d => d.id === deliverableId);
      return total + (deliverable?.basePrice || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('✅ Proposal sent successfully! The recipient will be notified.');
      onBack();
    }, 2000);
  };

  const selectedTarget = availableTargets.find(target => target.id === parseInt(formData.targetId));
  const totalCompensation = calculateTotalCompensation();

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Select {userType === 'athlete' ? 'Business' : 'Athlete'}</h2>
      <p>Choose who you'd like to send a proposal to:</p>
      
      <div className="targets-grid">
        {availableTargets.map(target => (
          <div 
            key={target.id}
            className={`target-card ${formData.targetId === target.id ? 'selected' : ''}`}
            onClick={() => handleTargetSelect(target.id)}
          >
            <img src={target.image} alt={target.name} />
            <div className="target-info">
              <h3>{target.name}</h3>
              <p className="target-type">
                {userType === 'athlete' ? target.type : target.sport}
              </p>
              {userType === 'business' && (
                <p className="target-university">{target.university}</p>
              )}
              <p className="target-description">{target.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>Proposal Details</h2>
      <p>Fill in the details of your proposal:</p>
      
      <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
        <div className="form-group">
          <label htmlFor="title">Proposal Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a compelling title for your proposal"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe what you're proposing and why it would be beneficial"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Deliverables *</label>
          <div className="deliverables-grid">
            {availableDeliverables.map(deliverable => (
              <div 
                key={deliverable.id}
                className={`deliverable-card ${formData.deliverables.includes(deliverable.id) ? 'selected' : ''}`}
                onClick={() => handleDeliverableToggle(deliverable.id)}
              >
                <div className="deliverable-icon">{deliverable.icon}</div>
                <div className="deliverable-info">
                  <h4>{deliverable.name}</h4>
                  <p className="deliverable-price">${deliverable.basePrice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline *</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="compensation-summary">
          <h3>Compensation Summary</h3>
          <div className="compensation-breakdown">
            {formData.deliverables.map(deliverableId => {
              const deliverable = availableDeliverables.find(d => d.id === deliverableId);
              return (
                <div key={deliverableId} className="compensation-item">
                  <span>{deliverable?.name}</span>
                  <span>${deliverable?.basePrice}</span>
                </div>
              );
            })}
            <div className="compensation-total">
              <strong>Total: ${totalCompensation}</strong>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="secondary-btn"
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
          <button 
            type="submit" 
            className="primary-btn"
            disabled={!formData.title || !formData.description || formData.deliverables.length === 0 || !formData.deadline}
          >
            Review Proposal →
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>Review Proposal</h2>
      <p>Please review your proposal before sending:</p>
      
      <div className="proposal-review">
        <div className="review-section">
          <h3>Recipient</h3>
          <div className="recipient-info">
            <img src={selectedTarget?.image} alt={selectedTarget?.name} />
            <div>
              <h4>{selectedTarget?.name}</h4>
              <p>{userType === 'athlete' ? selectedTarget?.type : selectedTarget?.sport}</p>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h3>Proposal Details</h3>
          <div className="review-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{formData.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{formData.description}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deadline:</span>
              <span className="detail-value">{new Date(formData.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h3>Deliverables & Compensation</h3>
          <div className="deliverables-review">
            {formData.deliverables.map(deliverableId => {
              const deliverable = availableDeliverables.find(d => d.id === deliverableId);
              return (
                <div key={deliverableId} className="deliverable-review-item">
                  <span className="deliverable-icon">{deliverable?.icon}</span>
                  <span className="deliverable-name">{deliverable?.name}</span>
                  <span className="deliverable-price">${deliverable?.basePrice}</span>
                </div>
              );
            })}
            <div className="total-compensation">
              <strong>Total Compensation: ${totalCompensation}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="secondary-btn"
          onClick={() => setStep(2)}
        >
          ← Edit Proposal
        </button>
        <button 
          type="button" 
          className="primary-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Proposal'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="create-proposal-page">
      <div className="create-proposal-content">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Proposals
        </button>
        
        <div className="create-proposal-header">
          <h1 className="create-proposal-title">Create New Proposal</h1>
          <p className="create-proposal-subtitle">
            Send a proposal to {userType === 'athlete' ? 'a business' : 'an athlete'}
          </p>
        </div>

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Target</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}

export default CreateProposalPage; 