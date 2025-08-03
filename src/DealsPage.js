import React, { useState, useEffect, useMemo } from 'react';
import './DealsPage.css';

function DealsPage({ currentUser, onBack }) {
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'proposed', 'accepted', 'completed'
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample deals data
  const sampleDeals = useMemo(() => [
    {
      id: 1,
      title: "Game Day Menu Promotion",
      business: "Carolina Sports Bar & Grill",
      athlete: "Michael Johnson",
      status: "proposed",
      amount: 1500,
      description: "Instagram stories during game days and feed post about new menu items",
      proposedDate: "2024-01-15T10:00:00Z",
      deadline: "2024-01-25T00:00:00Z",
      type: "social_media"
    },
    {
      id: 2,
      title: "HIIT Workout Program",
      business: "Elite Fitness Center",
      athlete: "Michael Johnson",
      status: "accepted",
      amount: 2500,
      description: "Workout videos, before/after posts, and testimonials about the program",
      proposedDate: "2024-01-14T09:00:00Z",
      acceptedDate: "2024-01-16T14:00:00Z",
      deadline: "2024-01-30T00:00:00Z",
      type: "content_creation"
    },
    {
      id: 3,
      title: "Sports Equipment Review",
      business: "Sports Gear Co.",
      athlete: "Sarah Williams",
      status: "completed",
      amount: 800,
      description: "Product review and demonstration videos for new basketball equipment",
      proposedDate: "2024-01-10T14:00:00Z",
      acceptedDate: "2024-01-12T11:00:00Z",
      completedDate: "2024-01-18T16:00:00Z",
      deadline: "2024-01-20T00:00:00Z",
      type: "product_review"
    },
    {
      id: 4,
      title: "Campus Event Promotion",
      business: "Local Pizza Chain",
      athlete: "Michael Johnson",
      status: "proposed",
      amount: 1200,
      description: "Promote student discount and campus delivery service",
      proposedDate: "2024-01-20T08:00:00Z",
      deadline: "2024-01-28T00:00:00Z",
      type: "event_promotion"
    },
    {
      id: 5,
      title: "Athletic Wear Campaign",
      business: "Sportswear Brand",
      athlete: "Michael Johnson",
      status: "accepted",
      amount: 3000,
      description: "Seasonal campaign featuring new athletic wear collection",
      proposedDate: "2024-01-08T12:00:00Z",
      acceptedDate: "2024-01-10T15:00:00Z",
      deadline: "2024-02-15T00:00:00Z",
      type: "brand_campaign"
    },
    // Add more sample deals for different businesses
    {
      id: 6,
      title: "Restaurant Review",
      business: "Carolina Sports Bar & Grill",
      athlete: "Sarah Williams",
      status: "proposed",
      amount: 900,
      description: "Food review and social media posts about new menu items",
      proposedDate: "2024-01-22T11:00:00Z",
      deadline: "2024-01-30T00:00:00Z",
      type: "content_creation"
    },
    {
      id: 7,
      title: "Game Day Special Promotion",
      business: "Carolina Sports Bar & Grill",
      athlete: "David Chen",
      status: "accepted",
      amount: 1800,
      description: "Promote game day specials and atmosphere",
      proposedDate: "2024-01-18T13:00:00Z",
      acceptedDate: "2024-01-20T10:00:00Z",
      deadline: "2024-02-01T00:00:00Z",
      type: "event_promotion"
    },
    // NIL Matchup business deals
    {
      id: 8,
      title: "Platform Promotion Campaign",
      business: "NIL Matchup",
      athlete: "Alex Rodriguez",
      status: "proposed",
      amount: 2000,
      description: "Promote NIL Matchup platform to other athletes and businesses",
      proposedDate: "2024-01-25T09:00:00Z",
      deadline: "2024-02-05T00:00:00Z",
      type: "brand_campaign"
    },
    {
      id: 9,
      title: "Social Media Takeover",
      business: "NIL Matchup",
      athlete: "Emma Thompson",
      status: "accepted",
      amount: 1500,
      description: "Take over NIL Matchup social media for a week to showcase athlete success stories",
      proposedDate: "2024-01-20T14:00:00Z",
      acceptedDate: "2024-01-22T11:00:00Z",
      deadline: "2024-02-10T00:00:00Z",
      type: "social_media"
    },
    {
      id: 10,
      title: "Testimonial Video Series",
      business: "NIL Matchup",
      athlete: "Marcus Johnson",
      status: "proposed",
      amount: 3000,
      description: "Create a series of testimonial videos about successful NIL partnerships",
      proposedDate: "2024-01-23T16:00:00Z",
      deadline: "2024-02-15T00:00:00Z",
      type: "content_creation"
    },
    {
      id: 11,
      title: "Campus Ambassador Program",
      business: "NIL Matchup",
      athlete: "Sophia Chen",
      status: "completed",
      amount: 1200,
      description: "Serve as campus ambassador promoting NIL opportunities to fellow athletes",
      proposedDate: "2024-01-15T10:00:00Z",
      acceptedDate: "2024-01-17T13:00:00Z",
      completedDate: "2024-01-30T16:00:00Z",
      deadline: "2024-01-31T00:00:00Z",
      type: "event_promotion"
    }
  ], []);

  useEffect(() => {
    let userDeals = [];
    
    if (currentUser?.userType === 'business' || currentUser?.businessName) {
      // Business users see proposals from athletes
      userDeals = sampleDeals.filter(deal => 
        deal.businessName === (currentUser.businessName || currentUser.name || 'NIL Matchup')
      );
    } else {
      // Athletes see their own deals
      userDeals = sampleDeals.filter(deal => 
        deal.athleteName === (currentUser.athleteName || currentUser.name || 'Michael Johnson')
      );
    }
    
    setDeals(userDeals);
  }, [currentUser, sampleDeals]);

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true;
    return deal.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'proposed': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'completed': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'proposed': return 'Proposed';
      case 'accepted': return 'Accepted';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'social_media': return 'Social Media';
      case 'content_creation': return 'Content Creation';
      case 'product_review': return 'Product Review';
      case 'event_promotion': return 'Event Promotion';
      case 'brand_campaign': return 'Brand Campaign';
      default: return 'Other';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine if current user is a business
  const isBusinessUser = currentUser?.userType === 'business' || currentUser?.businessName;

  return (
    <div className="deals-page">
      <div className="deals-container">
        <div className="deals-header">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h1>{isBusinessUser ? 'Incoming Proposals' : 'My Deals'}</h1>
          <p className="subtitle">
            {isBusinessUser 
              ? 'Review proposals from athletes interested in your business' 
              : 'Track your NIL partnerships and collaborations'
            }
          </p>
        </div>

        <div className="filter-container">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Deals ({deals.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'proposed' ? 'active' : ''}`}
              onClick={() => setFilter('proposed')}
            >
              {isBusinessUser ? 'Pending Review' : 'Proposed'} ({deals.filter(d => d.status === 'proposed').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
              onClick={() => setFilter('accepted')}
            >
              Accepted ({deals.filter(d => d.status === 'accepted').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({deals.filter(d => d.status === 'completed').length})
            </button>
          </div>
        </div>

        <div className="deals-list">
          {filteredDeals.length === 0 ? (
            <div className="no-deals">
              <div className="no-deals-content">
                <span className="no-deals-icon">📋</span>
                <h3>No deals found</h3>
                <p>
                  {isBusinessUser 
                    ? "No proposals have been sent to your business yet. Athletes will see your smart templates and send proposals here."
                    : "No deals match your current filter. Try adjusting your selection."
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredDeals.map(deal => (
              <div key={deal.id} className="deal-item">
                <div className="deal-header">
                  <h3>{deal.title}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: `${getStatusColor(deal.status)}20`, color: getStatusColor(deal.status), borderColor: getStatusColor(deal.status) }}
                  >
                    {getStatusText(deal.status)}
                  </span>
                </div>
                
                <div className="deal-content">
                  <div className="deal-info">
                    {!isBusinessUser && <p><strong>Business:</strong> {deal.business}</p>}
                    {isBusinessUser && <p><strong>Athlete:</strong> {deal.athlete}</p>}
                    <p><strong>Amount:</strong> ${deal.amount.toLocaleString()}</p>
                    <p><strong>Type:</strong> {getTypeText(deal.type)}</p>
                    <p><strong>Description:</strong> {deal.description}</p>
                  </div>
                  
                  <div className="deal-dates">
                    <p><strong>Proposed:</strong> {formatDate(deal.proposedDate)}</p>
                    {deal.acceptedDate && (
                      <p><strong>Accepted:</strong> {formatDate(deal.acceptedDate)}</p>
                    )}
                    {deal.completedDate && (
                      <p><strong>Completed:</strong> {formatDate(deal.completedDate)}</p>
                    )}
                    <p><strong>Deadline:</strong> {formatDate(deal.deadline)}</p>
                  </div>
                </div>
                
                <div className="deal-actions">
                  {deal.status === 'proposed' && isBusinessUser && (
                    <>
                      <button className="action-btn primary-btn">Accept Proposal</button>
                      <button className="action-btn secondary-btn">Reject</button>
                      <button className="action-btn secondary-btn">Request Changes</button>
                    </>
                  )}
                  {deal.status === 'proposed' && !isBusinessUser && (
                    <>
                      <button className="action-btn secondary-btn">Cancel Proposal</button>
                      <button className="action-btn secondary-btn">Edit Proposal</button>
                    </>
                  )}
                  {deal.status === 'accepted' && (
                    <>
                      <button className="action-btn primary-btn">Mark Complete</button>
                      <button className="action-btn secondary-btn">View Details</button>
                    </>
                  )}
                  {deal.status === 'completed' && (
                    <button className="action-btn primary-btn">View Details</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DealsPage; 