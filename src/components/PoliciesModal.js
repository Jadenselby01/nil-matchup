import React from 'react';
import './PoliciesModal.css';

const PoliciesModal = ({ onClose }) => {
  const policies = [
    {
      id: 'code-of-conduct',
      title: 'Code of Conduct',
      content: `All users must adhere to our community standards:

• Respect all users regardless of background, sport, or business type
• No harassment, discrimination, or inappropriate behavior
• Maintain professional communication in all interactions
• Report any violations to our support team
• Uphold the integrity of NIL partnerships

Violations may result in account suspension or termination.`
    },
    {
      id: 'content-guidelines',
      title: 'Content Guidelines',
      content: `All content shared on the platform must meet these standards:

• No inappropriate, offensive, or harmful content
• Respect intellectual property rights
• No false or misleading information
• Maintain appropriate language and tone
• Follow platform-specific content rules

Content that violates these guidelines will be removed.`
    },
    {
      id: 'payment-policies',
      title: 'Payment Policies',
      content: `Our payment system ensures secure and transparent transactions:

• All payments are processed through secure payment gateways
• Platform fees are clearly disclosed before transactions
• Payment disputes are handled through our support system
• Refunds follow our established refund policy
• Tax reporting is the responsibility of each user

We recommend keeping records of all transactions.`
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      content: `We protect your personal information and data:

• Personal data is collected only for platform functionality
• Information is never sold to third parties
• Data is encrypted and stored securely
• Users can request data deletion at any time
• We comply with all applicable privacy laws

Your privacy is our priority.`
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      content: `We provide fair and efficient dispute resolution:

• Mediation is the first step for all disputes
• Clear documentation of all agreements is required
• Platform support team assists with resolution
• Legal action is available as a last resort
• All disputes are handled confidentially

We aim to resolve issues quickly and fairly.`
    }
  ];

  return (
    <div className="policies-modal-overlay">
      <div className="policies-modal">
        <div className="policies-modal-header">
          <h2>📋 Platform Policies</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="policies-modal-content">
          <p className="policies-intro">
            These policies ensure a safe, fair, and professional environment for all NIL partnerships. 
            Please review and follow these guidelines to maintain a positive community experience.
          </p>
          
          <div className="policies-list">
            {policies.map((policy) => (
              <div key={policy.id} className="policy-item">
                <div className="policy-header">
                  <h3>{policy.title}</h3>
                </div>
                <div className="policy-content">
                  <p>{policy.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="policies-footer">
            <p className="policies-note">
              <strong>Note:</strong> These policies are updated regularly. 
              Users will be notified of any changes that affect their use of the platform.
            </p>
            <button className="close-modal-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesModal; 