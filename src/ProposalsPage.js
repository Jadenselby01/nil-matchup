import React, { useState, useEffect } from 'react';
import './ProposalsPage.css';

function ProposalsPage({ currentUser, userType, onBack }) {
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'sent'
  const [loading, setLoading] = useState(true);

  // Sample proposals data - this would come from Supabase
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const sampleProposals = [
        {
          id: 1,
          type: 'received',
          from: {
            id: 1,
            name: 'Carolina Sports Bar & Grill',
            image: 'https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB',
            type: 'Restaurant'
          },
          to: {
            id: 1,
            name: 'Michael Johnson',
            image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=MJ',
            sport: 'Football'
          },
          title: 'Game Day Menu Promotion',
          description: 'We want you to promote our new game day menu on your social media platforms.',
          deliverables: ['Instagram Feed Post', 'Instagram Story', 'Discount Code'],
          compensation: 900,
          status: 'pending', // 'pending', 'accepted', 'archived'
          createdAt: '2024-01-15T10:30:00Z',
          deadline: '2024-02-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'sent',
          from: {
            id: 1,
            name: 'Michael Johnson',
            image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=MJ',
            sport: 'Football'
          },
          to: {
            id: 2,
            name: 'Elite Fitness Center',
            image: 'https://via.placeholder.com/200x200/20c997/ffffff?text=EFC',
            type: 'Fitness'
          },
          title: 'HIIT Training Program Promotion',
          description: 'I would love to showcase your new HIIT training program and premium equipment.',
          deliverables: ['Instagram Feed Post', 'Instagram Reel', 'TikTok Video'],
          compensation: 1200,
          status: 'pending',
          createdAt: '2024-01-14T14:20:00Z',
          deadline: '2024-02-14T14:20:00Z'
        },
        {
          id: 3,
          type: 'received',
          from: {
            id: 3,
            name: 'University Auto Service',
            image: 'https://via.placeholder.com/200x200/fd7e14/ffffff?text=UAS',
            type: 'Automotive'
          },
          to: {
            id: 1,
            name: 'Michael Johnson',
            image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=MJ',
            sport: 'Football'
          },
          title: 'Student Discount Program',
          description: 'Promote our 20% student discount program on your social media.',
          deliverables: ['Instagram Feed Post', 'Instagram Story'],
          compensation: 225,
          status: 'accepted',
          createdAt: '2024-01-13T09:15:00Z',
          deadline: '2024-02-13T09:15:00Z'
        }
      ];

      // Filter proposals based on user type and tab
      const filteredProposals = sampleProposals.filter(proposal => {
        if (userType === 'athlete') {
          return proposal.to.id === currentUser?.id && proposal.type === activeTab;
        } else {
          return proposal.from.id === currentUser?.id && proposal.type === activeTab;
        }
      });

      setProposals(filteredProposals);
      setLoading(false);
    }, 1000);
  }, [currentUser, userType, activeTab]);

  const handleAcceptProposal = (proposalId) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, status: 'accepted' }
        : proposal
    ));
    alert('✅ Proposal accepted! The other party will be notified.');
  };

  const handleArchiveProposal = (proposalId) => {
    setProposals(prev => prev.map(proposal => 
      proposal.id === proposalId 
        ? { ...proposal, status: 'archived' }
        : proposal
    ));
    alert('📁 Proposal archived.');
  };

  const handleCreateProposal = () => {
    // This would navigate to create proposal page
    alert('Create proposal functionality would open here!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'archived': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  };

  const filteredProposals = proposals.filter(proposal => proposal.status !== 'archived' || activeTab === 'archived');

  return (
    <div className="proposals-page">
      <div className="proposals-content">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
        
        <div className="proposals-header">
          <h1 className="proposals-title">Proposals</h1>
          <p className="proposals-subtitle">
            {userType === 'athlete' ? 'Manage your NIL opportunities' : 'Manage your athlete partnerships'}
          </p>
        </div>

        <div className="proposals-actions">
          <button 
            className="create-proposal-btn primary-btn"
            onClick={handleCreateProposal}
          >
            + Create New Proposal
          </button>
        </div>

        <div className="proposals-tabs">
          <button 
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received ({proposals.filter(p => p.status === 'pending').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent ({proposals.filter(p => p.type === 'sent').length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived ({proposals.filter(p => p.status === 'archived').length})
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading proposals...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No proposals found</h3>
            <p>
              {activeTab === 'received' 
                ? 'You haven\'t received any proposals yet.' 
                : activeTab === 'sent'
                ? 'You haven\'t sent any proposals yet.'
                : 'No archived proposals found.'
              }
            </p>
            {activeTab === 'sent' && (
              <button 
                className="create-proposal-btn secondary-btn"
                onClick={handleCreateProposal}
              >
                Create Your First Proposal
              </button>
            )}
          </div>
        ) : (
          <div className="proposals-grid">
            {filteredProposals.map(proposal => (
              <div key={proposal.id} className="proposal-card">
                <div className="proposal-header">
                  <div className="proposal-parties">
                    <div className="party-info">
                      <img 
                        src={userType === 'athlete' ? proposal.from.image : proposal.to.image} 
                        alt={userType === 'athlete' ? proposal.from.name : proposal.to.name} 
                      />
                      <div>
                        <h4>{userType === 'athlete' ? proposal.from.name : proposal.to.name}</h4>
                        <p className="party-type">
                          {userType === 'athlete' ? proposal.from.type : proposal.to.sport}
                        </p>
                      </div>
                    </div>
                    <div className="proposal-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(proposal.status) }}
                      >
                        {getStatusText(proposal.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="proposal-content">
                  <h3 className="proposal-title">{proposal.title}</h3>
                  <p className="proposal-description">{proposal.description}</p>
                  
                  <div className="proposal-details">
                    <div className="detail-item">
                      <span className="detail-label">Deliverables:</span>
                      <div className="deliverables-list">
                        {proposal.deliverables.map((deliverable, index) => (
                          <span key={index} className="deliverable-tag">{deliverable}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Compensation:</span>
                      <span className="compensation-amount">${proposal.compensation}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Deadline:</span>
                      <span className="deadline-date">{formatDate(proposal.deadline)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="created-date">{formatDate(proposal.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {proposal.status === 'pending' && activeTab === 'received' && (
                  <div className="proposal-actions">
                    <button 
                      className="accept-btn primary-btn"
                      onClick={() => handleAcceptProposal(proposal.id)}
                    >
                      Accept Proposal
                    </button>
                    <button 
                      className="archive-btn secondary-btn"
                      onClick={() => handleArchiveProposal(proposal.id)}
                    >
                      Archive
                    </button>
                  </div>
                )}

                {proposal.status === 'pending' && activeTab === 'sent' && (
                  <div className="proposal-actions">
                    <button 
                      className="archive-btn secondary-btn"
                      onClick={() => handleArchiveProposal(proposal.id)}
                    >
                      Archive
                    </button>
                  </div>
                )}

                {proposal.status === 'accepted' && (
                  <div className="proposal-actions">
                    <span className="accepted-badge">✅ Accepted</span>
                    <button 
                      className="archive-btn secondary-btn"
                      onClick={() => handleArchiveProposal(proposal.id)}
                    >
                      Archive
                    </button>
                  </div>
                )}

                {proposal.status === 'archived' && (
                  <div className="proposal-actions">
                    <span className="archived-badge">📁 Archived</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProposalsPage; 