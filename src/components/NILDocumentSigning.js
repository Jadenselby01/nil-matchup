import React, { useState, useEffect } from 'react';
import DigitalSignature from './DigitalSignature';
import './NILDocumentSigning.css';

const NILDocumentSigning = ({ athlete, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [signature, setSignature] = useState(null);
  const [signedDocuments, setSignedDocuments] = useState([]);
  const [electronicConsent, setElectronicConsent] = useState(false);
  const [isUnder18, setIsUnder18] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showSignatureCapture, setShowSignatureCapture] = useState(false);
  const [currentDocumentSignature, setCurrentDocumentSignature] = useState(null);

  const documents = [
    {
      id: 'nil-endorsement',
      title: 'NIL Endorsement Agreement',
      description: 'Core terms for social media promotion and endorsements',
      required: true,
      template: generateNILEndorsementTemplate(athlete),
      summary: 'This agreement outlines the terms for promoting products/services on social media, including compensation, content guidelines, and disclosure requirements.',
      keyPoints: [
        'You can promote products/services on social media',
        'You must disclose sponsored content',
        'You will be compensated for your endorsements',
        'You retain creative control over your content',
        'You can decline any promotion offer'
      ],
      documentType: 'Legal Agreement',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${athlete?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'publicity-release',
      title: 'Publicity/Media Rights Release Form',
      description: 'Permission to use your name, image, and likeness',
      required: true,
      template: generatePublicityReleaseTemplate(athlete),
      summary: 'This form grants permission for businesses to use your name, image, and likeness in their marketing materials.',
      keyPoints: [
        'Businesses can use your photo/video in their ads',
        'You approve all content before it goes live',
        'You can revoke permission at any time',
        'Your personal information is protected',
        'You receive compensation for usage rights'
      ],
      documentType: 'Release Form',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${athlete?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'contractor-agreement',
      title: 'Independent Contractor Agreement',
      description: 'Terms of service as an independent contractor',
      required: true,
      template: generateContractorTemplate(athlete),
      summary: 'This agreement establishes you as an independent contractor, not an employee, with specific terms for your services.',
      keyPoints: [
        'You are an independent contractor, not an employee',
        'You control your own schedule and work methods',
        'You are responsible for your own taxes',
        'You can work with multiple businesses',
        'You set your own rates and terms'
      ],
      documentType: 'Service Agreement',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${athlete?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'w9-form',
      title: 'IRS W-9 Form',
      description: 'Tax identification for payment processing',
      required: true,
      template: generateW9Template(athlete),
      summary: 'This IRS form provides your tax identification information for payment processing and tax reporting.',
      keyPoints: [
        'Required for payment processing',
        'Businesses will send you a 1099 form',
        'You report income on your tax return',
        'No taxes are withheld from payments',
        'Your information is kept secure'
      ],
      documentType: 'Tax Form',
      effectiveDate: new Date().toLocaleDateString(),
      parties: [`${athlete?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    }
  ];

  useEffect(() => {
    // Check if athlete is under 18
    if (athlete?.age && athlete.age < 18) {
      setIsUnder18(true);
    }
  }, [athlete]);

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
        athleteId: athlete?.id,
        athleteName: athlete?.name,
        athleteEmail: athlete?.email,
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
    localStorage.setItem('signedNILDocuments', JSON.stringify(allSignedDocs));
    
    // Mark athlete as legally compliant
    localStorage.setItem('athleteLegalCompliance', 'true');
    
    onComplete(allSignedDocs);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="consent-step">
            <div className="consent-header">
              <h2>📋 Legal Document Signing</h2>
              <p>One last step—please sign the required NIL documents to activate your profile.</p>
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

              {isUnder18 && (
                <div className="parental-consent">
                  <h4>⚠️ Parental Consent Required</h4>
                  <p>Since you are under 18, parental consent is required for NIL agreements.</p>
                  <div className="consent-checkbox">
                    <input
                      type="checkbox"
                      id="parental-consent"
                      checked={parentalConsent}
                      onChange={(e) => setParentalConsent(e.target.checked)}
                    />
                    <label htmlFor="parental-consent">
                      I confirm that my parent/guardian has reviewed and approved these agreements.
                    </label>
                  </div>
                </div>
              )}

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

              <button
                className="proceed-btn"
                onClick={() => setCurrentStep(1)}
                disabled={!electronicConsent || (isUnder18 && !parentalConsent)}
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
              athleteName={athlete?.name}
            />
          </div>
        );

      case 2:
        return (
          <div className="documents-step">
            <div className="documents-header">
              <h2>📄 Sign Documents</h2>
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
                    <div className="document-header-info">
                      <h3>{documents[currentDocumentIndex].title}</h3>
                      <div className="document-meta">
                        <span className="document-type">{documents[currentDocumentIndex].documentType}</span>
                        <span className="document-date">Effective: {documents[currentDocumentIndex].effectiveDate}</span>
                      </div>
                    </div>
                    <button 
                      className="close-btn"
                      onClick={handleSkipDocument}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="document-preview-content">
                    <div className="document-summary">
                      <h4>Document Summary</h4>
                      <p>{documents[currentDocumentIndex].summary}</p>
                      
                      <div className="key-points">
                        <h5>Key Points:</h5>
                        <ul>
                          {documents[currentDocumentIndex].keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="document-text">
                      <h4>Full Document Text</h4>
                      <div className="document-scroll">
                        <div className="document-content">
                          <div className="document-header">
                            <h2>{documents[currentDocumentIndex].title}</h2>
                            <div className="document-parties">
                              <p><strong>Parties:</strong></p>
                              <ul>
                                {documents[currentDocumentIndex].parties.map((party, index) => (
                                  <li key={index}>{party}</li>
                                ))}
                              </ul>
                            </div>
                            <p><strong>Effective Date:</strong> {documents[currentDocumentIndex].effectiveDate}</p>
                          </div>
                          <div className="document-body">
                            <pre>{documents[currentDocumentIndex].template}</pre>
                          </div>
                          <div className="document-signature-area">
                            <div className="signature-line">
                              <span>Signature: _________________________</span>
                              <span>Date: {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="signature-section">
                      <h4>Signature Options</h4>
                      
                      <div className="signature-options">
                        <div className="signature-option">
                          <h5>Sign This Document Individually</h5>
                          <p>Create a unique signature for this specific document</p>
                          <button 
                            className="capture-signature-btn"
                            onClick={handleCaptureSignature}
                          >
                            Capture New Signature
                          </button>
                        </div>
                        
                        <div className="signature-option">
                          <h5>Use Auto-Signature</h5>
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
                          <h5>Signature for This Document:</h5>
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
                      Sign This Document
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
                    athleteName={athlete?.name}
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
    <div className="nil-signing-overlay">
      <div className="nil-signing-modal">
        {renderStep()}
      </div>
    </div>
  );
};

// Template generation functions
function generateNILEndorsementTemplate(athlete) {
  return `
NIL ENDORSEMENT AGREEMENT

This NIL Endorsement Agreement (the "Agreement") is entered into on ${new Date().toLocaleDateString()} by and between:

ATHLETE: ${athlete?.name || 'Athlete Name'}
EMAIL: ${athlete?.email || 'athlete@email.com'}
UNIVERSITY: ${athlete?.university || 'University Name'}
SPORT: ${athlete?.sport || 'Sport'}

AND

NIL MATCHUP PLATFORM
A Delaware corporation

1. GRANT OF RIGHTS
The Athlete hereby grants NIL Matchup and its business partners the non-exclusive right to use the Athlete's name, image, likeness, and voice in connection with NIL promotional activities, subject to the terms and conditions set forth herein.

2. COMPENSATION
Athlete will receive compensation as agreed upon in individual partnership agreements. All compensation will be paid within 30 days of completion of the agreed-upon services.

3. CONTENT GUIDELINES
The Athlete retains creative control over their content and may decline any promotion offer that conflicts with their values or university policies.

4. DISCLOSURE REQUIREMENTS
The Athlete agrees to comply with all applicable disclosure requirements, including but not limited to clearly marking sponsored content as required by FTC guidelines.

5. TERM
This agreement is effective immediately and continues until terminated by either party with 30 days written notice.

6. COMPLIANCE
All activities must comply with NCAA, university, and applicable federal and state laws and regulations.

7. GOVERNING LAW
This agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties have executed this agreement as of the date first written above.

ATHLETE:
Signature: _________________________
Name: ${athlete?.name || 'Athlete Name'}
Date: ${new Date().toLocaleDateString()}

NIL MATCHUP PLATFORM:
Signature: _________________________
Name: Authorized Representative
Date: ${new Date().toLocaleDateString()}
  `;
}

function generatePublicityReleaseTemplate(athlete) {
  return `
PUBLICITY/MEDIA RIGHTS RELEASE FORM

I, ${athlete?.name || 'Athlete Name'}, hereby grant permission to NIL Matchup and its business partners to use my name, image, likeness, and voice in connection with NIL promotional activities.

RELEASE DETAILS:
- Name: ${athlete?.name || 'Athlete Name'}
- University: ${athlete?.university || 'University Name'}
- Sport: ${athlete?.sport || 'Sport'}
- Email: ${athlete?.email || 'athlete@email.com'}

GRANT OF RIGHTS:
I hereby grant to NIL Matchup and its business partners the irrevocable, perpetual, worldwide, non-exclusive right to use, reproduce, distribute, display, and perform my name, image, likeness, voice, and biographical information in connection with NIL promotional activities, including but not limited to:

1. Social media posts and advertisements
2. Print and digital marketing materials
3. Video content and commercials
4. Website and app content
5. Press releases and media coverage

COMPENSATION:
I understand that I will receive fair compensation for the use of my name, image, and likeness as agreed upon in individual partnership agreements.

APPROVAL RIGHTS:
I retain the right to approve all content featuring my name, image, or likeness before it is published or distributed.

REVOCATION:
I understand that I may revoke this permission at any time by providing written notice to NIL Matchup, subject to any existing contractual obligations.

GOVERNING LAW:
This release shall be governed by the laws of the State of Delaware.

I have read and understand this release and voluntarily agree to its terms.

Signature: _________________________
Name: ${athlete?.name || 'Athlete Name'}
Date: ${new Date().toLocaleDateString()}
  `;
}

function generateContractorTemplate(athlete) {
  return `
INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement (the "Agreement") is made and entered into on ${new Date().toLocaleDateString()} by and between:

CONTRACTOR: ${athlete?.name || 'Athlete Name'}
ADDRESS: ${athlete?.university || 'University Address'}
EMAIL: ${athlete?.email || 'athlete@email.com'}

AND

NIL MATCHUP PLATFORM
A Delaware corporation

1. RELATIONSHIP
The parties acknowledge that Contractor is an independent contractor and not an employee, partner, or agent of NIL Matchup. Contractor shall not be entitled to any benefits provided by NIL Matchup to its employees.

2. SERVICES
Contractor agrees to provide NIL-related services including but not limited to:
- Social media endorsements and promotions
- Event appearances and public speaking
- Product reviews and testimonials
- Brand ambassador activities
- Content creation and marketing support

3. COMPENSATION
Contractor will be compensated according to individual partnership agreements negotiated through the NIL Matchup platform. All payments will be made within 30 days of completion of services.

4. TAXES AND BENEFITS
Contractor is responsible for all taxes, including income tax, self-employment tax, and any other taxes related to compensation received under this Agreement. Contractor is not eligible for employee benefits.

5. TERM AND TERMINATION
This Agreement is effective immediately and continues until terminated by either party with 30 days written notice.

6. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CONTRACTOR:
Signature: _________________________
Name: ${athlete?.name || 'Athlete Name'}
Date: ${new Date().toLocaleDateString()}

NIL MATCHUP PLATFORM:
Signature: _________________________
Name: Authorized Representative
Date: ${new Date().toLocaleDateString()}
  `;
}

function generateW9Template(athlete) {
  return `
IRS FORM W-9
Request for Taxpayer Identification Number and Certification

Name (as shown on your income tax return): ${athlete?.name || 'Athlete Name'}
Business name (if applicable): _________________
Address: ${athlete?.university || 'University Address'}
City, State, ZIP: _________________

Taxpayer Identification Number (SSN or EIN): _________________

I certify that:
1. The TIN provided is correct
2. I am not subject to backup withholding
3. I am a U.S. person

PURPOSE OF THIS FORM:
This form is required for payment processing and tax reporting purposes. NIL Matchup will use this information to issue Form 1099-NEC for payments made to you.

IMPORTANT INFORMATION:
- You must provide your correct TIN to avoid backup withholding
- If you are subject to backup withholding, you must check the appropriate box
- This form is required for all payments over $600 in a calendar year

CERTIFICATION:
Under penalties of perjury, I certify that:
1. The number shown on this form is my correct taxpayer identification number
2. I am not subject to backup withholding because I am exempt from backup withholding, or I have not been notified by the IRS that I am subject to backup withholding
3. I am a U.S. person (including a U.S. resident alien)

Signature: _________________________
Name: ${athlete?.name || 'Athlete Name'}
Date: ${new Date().toLocaleDateString()}
  `;
}

export default NILDocumentSigning; 