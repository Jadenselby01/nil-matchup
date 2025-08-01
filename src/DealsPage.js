import React, { useState, useEffect } from 'react';
import { demoDealsAPI } from './utils/demoMode';
import './DealsPage.css';

const DealsPage = ({ currentUser, userType, onBack, onProcessPayment }) => {
  const [deals, setDeals] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState('deals'); // 'deals' or 'payments'

  useEffect(() => {
    loadDeals();
  }, [currentUser, userType]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadDeals = async () => {
    setLoading(true);
    try {
      // Use the correct user ID format for demo data
      const userId = currentUser?.id || (userType === 'athlete' ? 'demo-athlete-1' : 'demo-business-1');
      
      let userDeals = await demoDealsAPI.getDeals(userId, userType);
      
      // If no deals found, show some example deals for demo purposes
      if (userDeals.length === 0) {
        if (userType === 'athlete') {
          userDeals = await demoDealsAPI.getDeals('demo-athlete-1', 'athlete');
        } else {
          userDeals = await demoDealsAPI.getDeals('demo-business-1', 'business');
        }
      }
      
      setDeals(userDeals);
      
      // Load payment history
      let userPayments = await demoDealsAPI.getPaymentHistory(userId, userType);
      
      // If no payments found, show some example payments for demo purposes
      if (userPayments.length === 0) {
        if (userType === 'athlete') {
          userPayments = await demoDealsAPI.getPaymentHistory('demo-athlete-1', 'athlete');
        } else {
          userPayments = await demoDealsAPI.getPaymentHistory('demo-business-1', 'business');
        }
      }
      
      setPayments(userPayments);
    } catch (error) {
      console.error('Error loading deals:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#ffc107';
      case 'agreed': return '#17a2b8';
      case 'post_uploaded': return '#28a745';
      case 'verified': return '#6f42c1';
      case 'paid': return '#28a745';
      case 'canceled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'agreed': return 'Agreed';
      case 'post_uploaded': return 'Post Uploaded';
      case 'verified': return 'Verified';
      case 'paid': return 'Paid';
      case 'canceled': return 'Canceled';
      default: return status;
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true;
    return deal.status === filter;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'amount-high':
        return b.paymentAmount - a.paymentAmount;
      case 'amount-low':
        return a.paymentAmount - b.paymentAmount;
      case 'deadline':
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });

  const handleAcceptDeal = async (dealId) => {
    try {
      await demoDealsAPI.acceptDeal(dealId);
      await loadDeals();
      // Find the accepted deal and trigger payment processing
      const acceptedDeal = deals.find(deal => deal.id === dealId);
      if (acceptedDeal && onProcessPayment) {
        onProcessPayment(acceptedDeal);
      } else {
        alert('Deal accepted! Payment has been secured.');
      }
    } catch (error) {
      alert('Error accepting deal');
    }
  };

  const handleVerifyPost = async (dealId) => {
    try {
      await demoDealsAPI.verifyPost(dealId);
      await loadDeals();
      alert('Post verified! Payment will be released.');
    } catch (error) {
      alert('Error verifying post');
    }
  };

  const handleReleasePayment = async (dealId) => {
    try {
      await demoDealsAPI.releasePayment(dealId);
      await loadDeals();
      alert('Payment released!');
    } catch (error) {
      alert('Error releasing payment');
    }
  };

  if (loading) {
    return (
      <div className="deals-page">
        <div className="deals-header">
          <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
          <h1>My Deals</h1>
        </div>
        <div className="loading">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="deals-page">
      <div className="deals-header">
        <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
        <h1>Deals & Payments</h1>
        
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
            onClick={() => setActiveTab('deals')}
          >
            My Deals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payment History
          </button>
        </div>
      </div>

      {activeTab === 'deals' && (
        <div className="deals-controls">
          <div className="filter-controls">
            <select 
              value={`${filter}-${sortBy}`} 
              onChange={(e) => {
                const [newFilter, newSortBy] = e.target.value.split('-');
                setFilter(newFilter);
                setSortBy(newSortBy);
              }}
              className="combined-filter"
            >
              <option value="all-newest">All Deals - Newest First</option>
              <option value="applied-newest">Applied</option>
              <option value="agreed-newest">Agreed</option>
              <option value="post_uploaded-newest">Post Uploaded</option>
              <option value="verified-newest">Verified</option>
              <option value="paid-newest">Paid</option>
            </select>
          </div>
        </div>
      )}

      <div className="deals-grid">
        {sortedDeals.length === 0 ? (
          <div className="no-deals">
            <h3>No deals found</h3>
            <p>You don't have any deals matching your current filters.</p>
          </div>
        ) : (
          sortedDeals.map(deal => (
            <div key={deal.id} className="deal-card">
              <div className="deal-header">
                <div className="deal-title">
                  <h3>{deal.title}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(deal.status) }}
                  >
                    {getStatusText(deal.status)}
                  </span>
                </div>
                <div className="deal-parties">
                  <p><strong>{userType === 'athlete' ? 'Business:' : 'Athlete:'}</strong> {userType === 'athlete' ? deal.businessName : deal.athleteName}</p>
                </div>
              </div>

              <div className="deal-details">
                <div className="deal-info">
                  <p><strong>Deliverables:</strong> {deal.deliverables}</p>
                  <p><strong>Payment:</strong> ${deal.paymentAmount}</p>
                  {deal.dealDate && <p><strong>Deal Date:</strong> {deal.dealDate}</p>}
                  {deal.deadline && <p><strong>Deadline:</strong> {deal.deadline}</p>}
                  {deal.postUrl && (
                    <p><strong>Post URL:</strong> <a href={deal.postUrl} target="_blank" rel="noopener noreferrer">View Post</a></p>
                  )}
                </div>

                <div className="payment-status">
                  {deal.isPaymentSecured ? (
                    <span className="payment-secured">✅ Payment Secured</span>
                  ) : (
                    <span className="payment-pending">⏳ Payment Pending</span>
                  )}
                </div>
              </div>

              <div className="deal-actions">
                {userType === 'business' && deal.status === 'applied' && (
                  <button 
                    className="action-btn primary-btn"
                    onClick={() => handleAcceptDeal(deal.id)}
                  >
                    Accept Deal
                  </button>
                )}

                {userType === 'business' && deal.status === 'post_uploaded' && (
                  <button 
                    className="action-btn primary-btn"
                    onClick={() => handleVerifyPost(deal.id)}
                  >
                    Verify Post
                  </button>
                )}

                {deal.status === 'verified' && (
                  <button 
                    className="action-btn primary-btn"
                    onClick={() => handleReleasePayment(deal.id)}
                  >
                    Release Payment
                  </button>
                )}

                {userType === 'athlete' && deal.status === 'agreed' && (
                  <button 
                    className="action-btn secondary-btn"
                    onClick={() => onProcessPayment && onProcessPayment(deal)}
                  >
                    Process Payment
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {activeTab === 'payments' && (
        <div className="payments-section">
          <div className="payments-summary">
            <div className="summary-card">
              <h3>Total Earnings</h3>
              <p className="amount">${payments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>This Month</h3>
              <p className="amount">${payments.filter(p => new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Completed Deals</h3>
              <p className="amount">{payments.length}</p>
            </div>
          </div>

          <div className="payments-list">
            {payments.length === 0 ? (
              <div className="no-payments">
                <h3>No payments yet</h3>
                <p>Complete your first deal to see payment history here.</p>
              </div>
            ) : (
              payments.map(payment => (
                <div key={payment.id} className="payment-card">
                  <div className="payment-header">
                    <h4>{payment.description}</h4>
                    <span className={`status ${payment.status}`}>
                      {payment.status === 'completed' ? '✅' : '⏳'} {payment.status}
                    </span>
                  </div>
                  <div className="payment-details">
                    <p><strong>Amount:</strong> ${payment.amount.toLocaleString()}</p>
                    <p><strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>From:</strong> {payment.from}</p>
                    {payment.transactionId && (
                      <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealsPage; 