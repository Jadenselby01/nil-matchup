import React from 'react';
import './LegalDocumentsModal.css';

const LegalDocumentsModal = ({ onClose }) => {
  const documents = [
    {
      id: 'nil-endorsement',
      title: 'NIL Endorsement Agreement',
      description: 'Core terms for social media promotion and endorsements',
      content: `This NIL Endorsement Agreement outlines the terms and conditions for Name, Image, and Likeness partnerships between athletes and businesses.

Key Provisions:
• Grant of Rights: Athlete grants permission to use their NIL for promotional purposes
• Compensation: Payment terms and schedules for partnerships
• Compliance: All activities must comply with NCAA, university, and applicable laws
• Term: Agreement duration and renewal terms
• Termination: Conditions for ending partnerships

This document is legally binding and protects both parties in NIL arrangements.`
    },
    {
      id: 'publicity-release',
      title: 'Publicity/Media Rights Release Form',
      description: 'Permission to use your name, image, and likeness',
      content: `The Publicity/Media Rights Release Form grants permission for the use of an athlete's name, image, likeness, and voice in connection with NIL activities.

Covered Uses:
• Social media posts and stories
• Marketing materials and advertisements
• Event appearances and promotions
• Product endorsements and testimonials
• Press releases and media coverage

This release ensures proper authorization for all promotional activities.`
    },
    {
      id: 'contractor-agreement',
      title: 'Independent Contractor Agreement',
      description: 'Terms of service as an independent contractor',
      content: `The Independent Contractor Agreement establishes the relationship between athletes and businesses for NIL partnerships.

Key Terms:
• Relationship: Athlete is an independent contractor, not an employee
• Services: Specific NIL services to be provided
• Compensation: Payment structure and timing
• Taxes: Athlete's responsibility for tax obligations
• Intellectual Property: Rights to content and materials created
• Confidentiality: Protection of business information

This agreement ensures proper legal classification and protects both parties.`
    },
    {
      id: 'w9-form',
      title: 'IRS W-9 Form',
      description: 'Tax identification for payment processing',
      content: `The IRS W-9 Form is required for tax reporting purposes when receiving payments for NIL activities.

Required Information:
• Legal name and business name (if applicable)
• Address and contact information
• Taxpayer Identification Number (SSN or EIN)
• Certification of tax status

This form ensures proper tax reporting and compliance with IRS requirements for all NIL payments.`
    }
  ];

  return (
    <div className="legal-modal-overlay">
      <div className="legal-modal">
        <div className="legal-modal-header">
          <h2>📄 NIL Legal Documents</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="legal-modal-content">
          <p className="legal-intro">
            These are the legal documents that govern NIL partnerships on our platform. 
            All athletes must review and understand these documents before participating in NIL activities.
          </p>
          
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div className="document-header">
                  <h3>{doc.title}</h3>
                  <p className="document-description">{doc.description}</p>
                </div>
                <div className="document-content">
                  <p>{doc.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="legal-footer">
            <p className="legal-disclaimer">
              <strong>Disclaimer:</strong> These documents are for informational purposes only. 
              For legal advice specific to your situation, please consult with a qualified attorney.
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

export default LegalDocumentsModal; 