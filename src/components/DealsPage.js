import React, { useState, useEffect } from 'react';
import './Deals.css';

const DealsPage = ({ currentUser, onBack }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // For now, show empty state
  }, []);

  if (loading) {
    return (
      <div className="deals-page">
        <div className="loading">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="deals-page">
      <div className="deals-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>My Deals</h1>
      </div>

      <div className="deals-content">
        {deals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h4>No Deals Yet</h4>
            <p>You haven't created or been assigned to any deals yet.</p>
          </div>
        ) : (
          <div className="deals-list">
            {deals.map(deal => (
              <div key={deal.id} className="deal-card">
                <h3>{deal.title}</h3>
                <p>{deal.description}</p>
                <div className="deal-meta">
                  <span className="amount">${deal.amount}</span>
                  <span className="status">{deal.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage; 