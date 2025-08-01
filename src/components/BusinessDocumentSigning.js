import React, { useState } from 'react';
import DigitalSignature from './DigitalSignature';
import './BusinessDocumentSigning.css';

const BusinessDocumentSigning = ({ business, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signature, setSignature] = useState(null);
  const [signedDocuments, setSignedDocuments] = useState([]);
  const [electronicConsent, setElectronicConsent] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showSignatureCapture, setShowSignatureCapture] = useState(false);
  const [currentDocumentSignature, setCurrentDocumentSignature] = useState(null);

  const documents = [
    {
      id: 'terms-of-service',
      title: 'Business Terms of Service Agreement',
      description: 'Platform usage terms, liability limits, and advertising standards',
      required: true,
      template: generateTermsOfServiceTemplate(business),
      summary: 'This agreement outlines the terms for using our platform to connect with athletes for NIL partnerships, including your responsibilities and our platform policies.',
      keyPoints: [
        'You can post NIL opportunities for athletes',
        'You must provide accurate information about your business',
        'You are responsible for payment to athletes',
        'You must comply with advertising and disclosure laws',
        'You can terminate partnerships with proper notice'
      ],
      documentType: 'Service Agreement',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${business?.name || 'Business Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'nil-agreement-framework',
      title: 'NIL Endorsement Agreement Framework',
      description: 'Master agreement template for all NIL partnerships',
      required: true,
      template: generateNILAgreementFrameworkTemplate(business),
      summary: 'This framework establishes the standard terms for all NIL partnerships you create through our platform.',
      keyPoints: [
        'Standardized terms for all NIL deals',
        'Clear compensation and payment terms',
        'Content approval and usage rights',
        'Dispute resolution procedures',
        'Compliance with NCAA and state regulations'
      ],
      documentType: 'Master Agreement',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${business?.name || 'Business Name'}`, 'NIL Matchup Platform']
    }
  ];

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
    setCurrentStep(2); // Move to document signing
  };

  const handleDocumentSign = (documentId) => {
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    setCurrentDocumentIndex(documentIndex);
    setShowDocumentPreview(true);
  };

  const handleCaptureSignature = () => {
    setShowSignatureCapture(true);
  };

  const handleDocumentSignatureSave = (signatureData) => {
    setCurrentDocumentSignature(signatureData);
    setShowSignatureCapture(false);
  };

  const handleAutoSignDocument = () => {
    const document = documents[currentDocumentIndex];
    const signatureToUse = currentDocumentSignature || signature;
    
    const signedDoc = {
      ...document,
      signature: signatureToUse,
      signedAt: new Date().toISOString(),
      ipAddress: signatureToUse.ipAddress,
      metadata: {
        businessId: business?.id,
        businessName: business?.name,
        businessEmail: business?.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        consentGiven: electronicConsent,
        signatureType: currentDocumentSignature ? 'individual' : 'auto'
      }
    };

    const updatedSignedDocs = [...signedDocuments, signedDoc];
    setSignedDocuments(updatedSignedDocs);
    setShowDocumentPreview(false);
    setCurrentDocumentSignature(null);
    
    // Check if all documents are signed
    if (updatedSignedDocs.length >= documents.length) {
      handleCompleteSigning();
    }
  };

  const handleSkipDocument = () => {
    setShowDocumentPreview(false);
    setCurrentDocumentSignature(null);
  };

  const handleCompleteSigning = () => {
    // Store signed documents (in production, this would go to Supabase/S3)
    const allSignedDocs = [...signedDocuments];
    localStorage.setItem('signedBusinessDocuments', JSON.stringify(allSignedDocs));
    
    // Mark business as legally compliant
    localStorage.setItem('businessLegalCompliance', 'true');
    
    onComplete(allSignedDocs);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="consent-step">
            <div className="consent-header">
              <h2>📋 Business Legal Document Signing</h2>
              <p>To activate your account, please sign the required legal documents.</p>
            </div>

            <div className="consent-content">
              <div className="consent-checkbox">
                <input
                  type="checkbox"
                  id="electronic-consent"
                  checked={electronicConsent}
                  onChange={(e) => setElectronicConsent(e.target.checked)}
                />
                <label htmlFor="electronic-consent">
                  I agree to sign these documents electronically and consent to electronic signatures under the ESIGN Act and UETA.
                </label>
              </div>

              <div className="documents-preview">
                <h4>Documents to Sign:</h4>
                <ul>
                  {documents.map(doc => (
                    <li key={doc.id}>
                      <strong>{doc.title}</strong> - {doc.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="business-requirements">
                <h4>Business Requirements:</h4>
                <ul>
                  <li>✓ FTC compliance for advertising and endorsements</li>
                  <li>✓ Proper disclosure requirements for sponsored content</li>
                  <li>✓ Fair compensation and payment terms</li>
                  <li>✓ Content usage rights and ownership</li>
                  <li>✓ Platform fee structure and billing</li>
                </ul>
              </div>

              <button
                className="proceed-btn"
                onClick={() => setCurrentStep(1)}
                disabled={!electronicConsent}
              >
                Proceed to Signature
              </button>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="signature-step">
            <DigitalSignature
              onSave={handleSignatureSave}
              onCancel={() => setCurrentStep(0)}
              athleteName={business?.name}
            />
          </div>
        );

      case 2:
        return (
          <div className="documents-step">
            <div className="documents-header">
              <h2>📄 Sign Business Documents</h2>
              <p>Click each document to review and sign individually</p>
            </div>

            <div className="documents-grid">
              {documents.map((doc, index) => (
                <div key={doc.id} className="document-card">
                  <div className="document-info">
                    <h3>{doc.title}</h3>
                    <p>{doc.description}</p>
                    <div className="document-status">
                      {signedDocuments.find(signed => signed.id === doc.id) ? (
                        <span className="status-signed">✅ Signed</span>
                      ) : (
                        <span className="status-pending">⏳ Click to Sign</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="document-actions">
                    <button
                      className="sign-doc-btn"
                      onClick={() => handleDocumentSign(doc.id)}
                      disabled={signedDocuments.find(signed => signed.id === doc.id)}
                    >
                      {signedDocuments.find(signed => signed.id === doc.id) ? 'Signed' : 'Sign Document'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="signing-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(signedDocuments.length / documents.length) * 100}%` }}
                ></div>
              </div>
              <p>{signedDocuments.length} of {documents.length} documents signed</p>
            </div>

            {showDocumentPreview && (
              <div className="document-preview-overlay">
                <div className="document-preview-modal">
                  <div className="document-preview-header">
                    <h3>📄 {documents[currentDocumentIndex].title}</h3>
                    <button 
                      className="close-btn"
                      onClick={handleSkipDocument}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="document-preview-content">
                    <div className="document-summary">
                      <h4>📋 Document Summary</h4>
                      <p>{documents[currentDocumentIndex].summary}</p>
                      
                      <div className="key-points">
                        <h5>🔑 Key Points:</h5>
                        <ul>
                          {documents[currentDocumentIndex].keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="document-text">
                      <h4>📄 Full Document Text</h4>
                      <div className="document-scroll">
                        <pre>{documents[currentDocumentIndex].template}</pre>
                      </div>
                    </div>
                    
                    <div className="signature-section">
                      <h4>✍️ Signature Options:</h4>
                      
                      <div className="signature-options">
                        <div className="signature-option">
                          <h5>🖊️ Sign This Document Individually</h5>
                          <p>Create a unique signature for this specific document</p>
                          <button 
                            className="capture-signature-btn"
                            onClick={handleCaptureSignature}
                          >
                            ✍️ Capture New Signature
                          </button>
                        </div>
                        
                        <div className="signature-option">
                          <h5>⚡ Use Auto-Signature</h5>
                          <p>Apply your saved signature automatically</p>
                          <div className="saved-signature">
                            {signature && (
                              <img 
                                src={signature.imageUrl} 
                                alt="Saved signature" 
                                className="signature-image"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {currentDocumentSignature && (
                        <div className="current-signature">
                          <h5>📝 Signature for This Document:</h5>
                          <img 
                            src={currentDocumentSignature.imageUrl} 
                            alt="Document signature" 
                            className="signature-image"
                          />
                        </div>
                      )}
                      
                      <p className="signature-note">
                        <strong>Note:</strong> By clicking "Sign Document", you agree to the terms above and authorize this electronic signature.
                      </p>
                    </div>
                  </div>
                  
                  <div className="document-preview-actions">
                    <button 
                      className="sign-document-btn"
                      onClick={handleAutoSignDocument}
                      disabled={!signature && !currentDocumentSignature}
                    >
                      ✍️ Sign This Document
                    </button>
                    <button 
                      className="skip-btn"
                      onClick={handleSkipDocument}
                    >
                      Skip for Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showSignatureCapture && (
              <div className="signature-capture-overlay">
                <div className="signature-capture-modal">
                  <div className="signature-capture-header">
                    <h3>✍️ Sign This Document</h3>
                    <button 
                      className="close-btn"
                      onClick={() => setShowSignatureCapture(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <DigitalSignature
                    onSave={handleDocumentSignatureSave}
                    onCancel={() => setShowSignatureCapture(false)}
                    athleteName={business?.name}
                    documentTitle={documents[currentDocumentIndex].title}
                  />
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="business-signing-overlay">
      <div className="business-signing-modal">
        {renderStep()}
      </div>
    </div>
  );
};

// Template generation functions
function generateTermsOfServiceTemplate(business) {
  return `
BUSINESS TERMS OF SERVICE AGREEMENT

This Business Terms of Service Agreement (the "Agreement") is entered into on ${new Date().toLocaleDateString()} by and between:

BUSINESS: ${business?.name || 'Business Name'}
EMAIL: ${business?.email || 'business@email.com'}
ADDRESS: ${business?.location || 'Business Address'}
BUSINESS TYPE: ${business?.businessType || 'Business Type'}

AND

NIL MATCHUP PLATFORM
A Delaware corporation

1. PLATFORM USAGE
Business agrees to use the NIL Matchup platform in compliance with all applicable laws and regulations, including FTC guidelines for advertising and endorsements. Business acknowledges that this platform facilitates connections between businesses and college athletes for NIL partnerships.

2. BUSINESS REPRESENTATIONS
Business represents and warrants that:
• All information provided is accurate and current
• Business has the authority to enter into NIL partnerships
• Business will comply with all applicable laws and regulations
• Business will provide fair compensation to athletes

3. ADVERTISING STANDARDS
Business agrees to comply with the following advertising standards:
• All sponsored content must include proper disclosure as required by FTC guidelines
• No false or misleading claims about products or services
• Respect for athlete rights and fair market compensation
• Compliance with university and NCAA policies
• No content that could harm an athlete's eligibility

4. PAYMENT OBLIGATIONS
Business agrees to:
• Pay agreed-upon compensation within 30 days of service completion
• Provide clear payment terms in all partnership agreements
• Authorize NIL Matchup to process payments on their behalf
• Pay platform fees as disclosed in individual transactions

5. LIABILITY LIMITS
NIL Matchup provides a platform for connecting businesses with athletes but is not responsible for the terms or execution of individual partnerships. Business acknowledges that NIL Matchup acts as an intermediary and facilitator.

6. CONTENT OWNERSHIP
Business retains ownership of their brand content while respecting athlete rights to their name, image, and likeness. Business agrees to obtain proper consent before using athlete content.

7. TERM AND TERMINATION
This Agreement is effective immediately and continues until terminated by either party with 30 days written notice.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

BUSINESS:
Signature: _________________________
Name: ${business?.name || 'Business Name'}
Title: Authorized Representative
Date: ${new Date().toLocaleDateString()}

NIL MATCHUP PLATFORM:
Signature: _________________________
Name: Authorized Representative
Date: ${new Date().toLocaleDateString()}
  `;
}

function generateNILAgreementFrameworkTemplate(business) {
  return `
NIL ENDORSEMENT AGREEMENT FRAMEWORK

This NIL Endorsement Agreement Framework (the "Framework") serves as the master template for all NIL partnerships between:

BUSINESS: ${business?.name || 'Business Name'}
ADDRESS: ${business?.location || 'Business Address'}
EMAIL: ${business?.email || 'business@email.com'}

AND

ATHLETES (to be specified per individual partnership agreement)

1. FRAMEWORK PURPOSE
This Framework establishes the standard terms and conditions that will apply to all NIL partnerships created through the NIL Matchup platform. Individual partnership agreements will incorporate these terms by reference.

2. USAGE RIGHTS
Business is granted non-exclusive rights to use athlete's name, image, likeness, and voice for promotional purposes as specified in individual agreements, subject to athlete approval and compliance with all applicable laws.

3. CONTENT OWNERSHIP AND RIGHTS
• Business owns brand-specific content created under partnership agreements
• Athlete retains rights to their personal content and social media presence
• Joint ownership of collaborative content as specified in individual agreements
• Business must obtain athlete approval before using any content

4. DELIVERABLES AND SERVICES
Standard deliverables may include:
• Social media posts and stories (Instagram, TikTok, Twitter, etc.)
• Event appearances and public speaking engagements
• Product endorsements and testimonials
• Marketing materials and advertisements
• Video content and commercials
• Brand ambassador activities

5. COMPENSATION FRAMEWORK
• All compensation must be fair market value
• Payment terms must be clearly specified in individual agreements
• Payment must be made within 30 days of service completion
• Business authorizes NIL Matchup to process payments on their behalf

6. COMPLIANCE REQUIREMENTS
All activities must comply with:
• NCAA regulations and university policies
• FTC guidelines for endorsements and advertising
• Applicable state and federal laws
• Platform terms of service
• Individual university NIL policies

7. DISPUTE RESOLUTION
• Disputes will be resolved through mediation or arbitration
• Governing law will be the state where the athlete's university is located
• NIL Matchup may act as mediator in disputes

8. TERM AND AMENDMENTS
This Framework is effective immediately and may be amended by NIL Matchup with 30 days notice to all parties.

IN WITNESS WHEREOF, the parties have executed this Framework as of the date first written above.

BUSINESS:
Signature: _________________________
Name: ${business?.name || 'Business Name'}
Title: Authorized Representative
Date: ${new Date().toLocaleDateString()}

NIL MATCHUP PLATFORM:
Signature: _________________________
Name: Authorized Representative
Date: ${new Date().toLocaleDateString()}
  `;
}

export default BusinessDocumentSigning; 