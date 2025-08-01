import React, { useState } from 'react';
import './QuickProposal.css';

const QuickProposal = ({ targetUser, userType, onSend, onClose }) => {
  const [proposal, setProposal] = useState({
    type: 'social-media',
    duration: '1-month',
    budget: '',
    message: '',
    timeline: 'flexible'
  });

  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate sending proposal
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    onSend(proposal);
  };

  const getProposalTemplate = () => {
    if (userType === 'business') {
      return `Hi ${targetUser?.name || 'there'}! 

I'm interested in partnering with you for a ${proposal.type.replace('-', ' ')} campaign. 

Budget: $${proposal.budget}
Duration: ${proposal.duration}
Timeline: ${proposal.timeline}

${proposal.message}

Let's discuss this opportunity!`;
    } else {
      return `Hi ${targetUser?.name || 'there'}! 

I'm interested in your ${proposal.type.replace('-', ' ')} opportunity. 

I'm available for ${proposal.duration} and can start ${proposal.timeline}.

${proposal.message}

Looking forward to working together!`;
    }
  };

  return (
    <div className="proposal-overlay">
      <div className="proposal-modal">
        <div className="proposal-header">
          <h2>💼 Quick Partnership Proposal</h2>
          <p>Send a proposal to {targetUser?.name || 'this partner'}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="proposal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Partnership Type</label>
              <select 
                value={proposal.type}
                onChange={(e) => setProposal({...proposal, type: e.target.value})}
              >
                <option value="social-media">Social Media Promotion</option>
                <option value="event-appearance">Event Appearance</option>
                <option value="product-endorsement">Product Endorsement</option>
                <option value="content-creation">Content Creation</option>
                <option value="brand-ambassador">Brand Ambassador</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <select 
                value={proposal.duration}
                onChange={(e) => setProposal({...proposal, duration: e.target.value})}
              >
                <option value="1-week">1 Week</option>
                <option value="1-month">1 Month</option>
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{userType === 'business' ? 'Budget (USD)' : 'Expected Compensation (USD)'}</label>
            <input 
              type="number"
              placeholder="Enter amount"
              value={proposal.budget}
              onChange={(e) => setProposal({...proposal, budget: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Timeline</label>
            <select 
              value={proposal.timeline}
              onChange={(e) => setProposal({...proposal, timeline: e.target.value})}
            >
              <option value="flexible">Flexible</option>
              <option value="immediate">Immediate</option>
              <option value="1-2-weeks">1-2 weeks</option>
              <option value="1-month">1 month</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Message</label>
            <textarea 
              placeholder="Add any specific details or requirements..."
              value={proposal.message}
              onChange={(e) => setProposal({...proposal, message: e.target.value})}
              rows="4"
            />
          </div>

          <div className="proposal-preview">
            <h4>Preview:</h4>
            <div className="preview-content">
              {getProposalTemplate()}
            </div>
          </div>

          <div className="proposal-actions">
            <button 
              className="send-proposal-btn"
              onClick={handleSend}
              disabled={isSending || !proposal.budget}
            >
              {isSending ? 'Sending...' : '🚀 Send Proposal'}
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProposal; 