import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard/Dashboard.css';

const DemoDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('opportunities');

  const opportunities = [
    {
      id: 1,
      name: 'Carolina Sports Bar & Grill',
      category: 'RESTAURANT',
      location: 'Chapel Hill, NC',
      description: 'Local sports bar serving the best wings and burgers in Chapel Hill. Perfect venue for athlete appearances and events.',
      buttons: ['EVENT APPEARANCES', '$500 - $1,000']
    },
    {
      id: 2,
      name: 'Elite Fitness Center',
      category: 'FITNESS & WELLNESS',
      location: 'Durham, NC',
      description: 'Premium fitness facility offering personal training, group classes, and state-of-the-art equipment.',
      buttons: ['BRAND AMBASSADOR', '$1,000 - $5,000']
    },
    {
      id: 3,
      name: 'University Auto Service',
      category: 'AUTOMOTIVE',
      location: 'Raleigh, NC',
      description: 'Trusted automotive service center providing maintenance and repairs for students and faculty.',
      buttons: ['SOCIAL MEDIA PROMOTION', '$0 - $500']
    }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'deals') {
      navigate('/deals');
    } else if (tab === 'messages') {
      navigate('/messages');
    } else if (tab === 'payment') {
      navigate('/payment');
    }
  };

  return (
    <div className="demo-dashboard">
      <div className="dashboard-header">
        <h1>Jaden Selby's Dashboard</h1>
        <p className="welcome-text">Welcome back, Jaden Selby!</p>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          NIL OPPORTUNITIES
        </button>
        <button 
          className={`nav-btn ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => handleTabClick('deals')}
        >
          DEALS
        </button>
        <button 
          className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => handleTabClick('messages')}
        >
          MESSAGES
        </button>
        <button 
          className={`nav-btn ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => handleTabClick('payment')}
        >
          PAYMENT
        </button>
      </div>

      <div className="opportunities-section">
        <div className="opportunities-grid">
          {opportunities.map(opportunity => (
            <div key={opportunity.id} className="opportunity-card">
              <div className="card-header">
                <div className="business-logo">
                  <div className="logo-placeholder"></div>
                  <span className="business-name">{opportunity.name}</span>
                </div>
              </div>
              <h3 className="business-title">{opportunity.name}</h3>
              <div className="business-category">{opportunity.category}</div>
              <div className="business-location">{opportunity.location}</div>
              <p className="business-description">{opportunity.description}</p>
              <div className="card-buttons">
                <button className="action-btn">{opportunity.buttons[0]}</button>
                <button className="amount-btn">{opportunity.buttons[1]}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;
