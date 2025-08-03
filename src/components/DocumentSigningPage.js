import React, { useState, useEffect } from 'react';
import './DocumentSigningPage.css';

const DocumentSigningPage = ({ user, userType, onComplete, onClose }) => {
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [documentsRead, setDocumentsRead] = useState([]);
  const [signature, setSignature] = useState(null);
  // const [showSignatureCapture, setShowSignatureCapture] = useState(false);
  const [isReading, setIsReading] = useState(true);
  const [readingProgress, setReadingProgress] = useState({});
  const [showReadingMessage, setShowReadingMessage] = useState(true);

  const documents = userType === 'athlete' ? [
    {
      id: 'nil-endorsement',
      title: 'NIL Endorsement Agreement',
      description: 'Core terms for social media promotion and endorsements',
      required: true,
      template: generateNILEndorsementTemplate(user),
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
      parties: [`${user?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'publicity-release',
      title: 'Publicity/Media Rights Release Form',
      description: 'Permission to use your name, image, and likeness',
      required: true,
      template: generatePublicityReleaseTemplate(user),
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
      parties: [`${user?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'contractor-agreement',
      title: 'Independent Contractor Agreement',
      description: 'Terms of service as an independent contractor',
      required: true,
      template: generateContractorTemplate(user),
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
      parties: [`${user?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'w9-form',
      title: 'IRS W-9 Form',
      description: 'Tax identification for payment processing',
      required: true,
      template: generateW9Template(user),
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
      parties: [`${user?.name || 'Athlete Name'}`, 'NIL Matchup Platform']
    }
  ] : [
    {
      id: 'terms-of-service',
      title: 'Business Terms of Service Agreement',
      description: 'Platform usage terms, liability limits, and advertising standards',
      required: true,
      template: generateTermsOfServiceTemplate(user),
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
      parties: [`${user?.name || 'Business Name'}`, 'NIL Matchup Platform']
    },
    {
      id: 'nil-agreement-framework',
      title: 'NIL Endorsement Agreement Framework',
      description: 'Master agreement template for all NIL partnerships',
      required: true,
      template: generateNILAgreementFrameworkTemplate(user),
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
      parties: [`${user?.name || 'Business Name'}`, 'NIL Matchup Platform']
    }
  ];

  useEffect(() => {
    // Initialize reading progress for all documents
    const initialProgress = {};
    documents.forEach(doc => {
      initialProgress[doc.id] = false;
    });
    setReadingProgress(initialProgress);
  }, [documents]);

  const handleDocumentRead = (documentId) => {
    setReadingProgress(prev => ({
      ...prev,
      [documentId]: true
    }));
    
    if (!documentsRead.includes(documentId)) {
      setDocumentsRead(prev => [...prev, documentId]);
    }
  };

  const handleNextDocument = () => {
    if (currentDocumentIndex < documents.length - 1) {
      setCurrentDocumentIndex(currentDocumentIndex + 1);
    } else {
      // All documents read, move to signature
      setIsReading(false);
    }
  };

  const handlePreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(currentDocumentIndex - 1);
    }
  };

  const handleSignatureSave = () => {
    // Create a simple signature object
    const signatureData = {
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iY3Vyc2l2ZSIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1dG8tU2lnbmVkPC90ZXh0Pjwvc3ZnPg==',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setSignature(signatureData);
    // Auto-sign all documents
    setTimeout(() => {
      handleCompleteSigning();
    }, 1000);
  };

  const handleCompleteSigning = () => {
    const signedDocs = documents.map(doc => ({
      ...doc,
      signature: signature,
      signedAt: new Date().toISOString(),
      metadata: {
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        signatureType: 'auto'
      }
    }));

    localStorage.setItem('legalDocumentsCompleted', 'true');
    onComplete(signedDocs);
  };

  const currentDocument = documents[currentDocumentIndex];
  // const allDocumentsRead = documents.every(doc => readingProgress[doc.id]);

  if (isReading) {
    return (
      <div className="document-signing-page">
        <div className="document-signing-container">
          <div className="document-signing-header">
            <h1>Legal Document Review</h1>
            <p>Please read each document carefully before proceeding</p>
            
            {showReadingMessage && (
              <div className="reading-message">
                <div className="message-content">
                  <h3>📋 Important Notice</h3>
                  <p>All documents will be automatically signed with your auto-signature after you complete reading each one. You must read all documents before proceeding to the signing phase.</p>
                  <button 
                    className="dismiss-message-btn"
                    onClick={() => setShowReadingMessage(false)}
                  >
                    Got it!
                  </button>
                </div>
              </div>
            )}
            
            <div className="progress-indicator">
              <span>Document {currentDocumentIndex + 1} of {documents.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentDocumentIndex + 1) / documents.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="document-content">
            <div className="document-header">
              <h2>{currentDocument.title}</h2>
              <div className="document-meta">
                <span className="document-type">{currentDocument.documentType}</span>
                <span className="document-date">Effective: {currentDocument.effectiveDate}</span>
              </div>
            </div>

            <div className="document-summary">
              <h3>Document Summary</h3>
              <p>{currentDocument.summary}</p>
              
              <div className="key-points">
                <h4>Key Points:</h4>
                <ul>
                  {currentDocument.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="document-text">
              <h3>Full Document Text</h3>
              <div className="document-scroll">
                <div className="document-content-text">
                  <div className="document-header-text">
                    <h2>{currentDocument.title}</h2>
                    <div className="document-parties">
                      <p><strong>Parties:</strong></p>
                      <ul>
                        {currentDocument.parties.map((party, index) => (
                          <li key={index}>{party}</li>
                        ))}
                      </ul>
                    </div>
                    <p><strong>Effective Date:</strong> {currentDocument.effectiveDate}</p>
                  </div>
                  <div className="document-body-text">
                    <pre>{currentDocument.template}</pre>
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

            <div className="document-actions">
              <button
                className="read-confirm-btn"
                onClick={() => handleDocumentRead(currentDocument.id)}
                disabled={readingProgress[currentDocument.id]}
              >
                {readingProgress[currentDocument.id] ? '✓ Document Read' : 'I Have Read This Document'}
              </button>
            </div>

            <div className="navigation-buttons">
              <button
                className="nav-btn prev-btn"
                onClick={handlePreviousDocument}
                disabled={currentDocumentIndex === 0}
              >
                Previous Document
              </button>
              
              <button
                className="nav-btn next-btn"
                onClick={handleNextDocument}
                disabled={!readingProgress[currentDocument.id]}
              >
                {currentDocumentIndex === documents.length - 1 ? 'Complete Review' : 'Next Document'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Signature capture phase
  return (
    <div className="document-signing-page">
      <div className="document-signing-container">
        <div className="signature-phase">
          <div className="signature-header">
            <h1>Document Signing</h1>
            <p>All documents have been reviewed. Please provide your signature to complete the process.</p>
          </div>

          <div className="signature-content">
            <div className="signature-instructions">
              <h3>Signature Required</h3>
              <p>Your signature will be applied to all reviewed documents:</p>
              <ul>
                {documents.map(doc => (
                  <li key={doc.id}>✓ {doc.title}</li>
                ))}
              </ul>
            </div>

            <div className="signature-capture">
              <h3>Auto-Signature</h3>
              <div className="signature-pad">
                <div className="auto-signature-display">
                  <div className="signature-preview">
                    <span className="signature-text">{user?.name || 'User'}</span>
                  </div>
                  <p className="signature-note">Your signature will be automatically applied to all documents</p>
                </div>
              </div>
            </div>

            <div className="signature-actions">
              <button
                className="auto-sign-btn"
                onClick={handleSignatureSave}
              >
                Auto-Sign All Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Template generation functions (same as before)
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

export default DocumentSigningPage; 