import React, { useState } from 'react';
import './AutoAdProofTool.css';

const AutoAdProofTool = ({ deal, onVerificationComplete, onClose }) => {
  const [postUrl, setPostUrl] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [verificationResults, setVerificationResults] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);

  const handleUrlSubmit = async () => {
    if (!postUrl.trim()) return;

    setIsVerifying(true);
    setVerificationStatus('verifying');

    // Simulate verification process
    setTimeout(() => {
      const results = verifyPost(postUrl);
      setVerificationResults(results);
      setVerificationStatus(results.allChecksPass ? 'success' : 'failed');
      setIsVerifying(false);
    }, 2000);
  };

  const verifyPost = (url) => {
    const results = {
      urlValid: false,
      hasAdTag: false,
      hasBrandTag: false,
      hasFTCCompliance: false,
      allChecksPass: false
    };

    // URL validation
    const validDomains = ['instagram.com', 'tiktok.com', 'facebook.com', 'twitter.com'];
    const urlObj = new URL(url);
    results.urlValid = validDomains.some(domain => urlObj.hostname.includes(domain));

    // Check for ad tags
    const adTags = ['#ad', '#sponsored', '#paid', '#partnership'];
    const hasAdTag = adTags.some(tag => url.toLowerCase().includes(tag.toLowerCase()));
    results.hasAdTag = hasAdTag;

    // Check for brand tags (simplified - in real app would check actual content)
    const brandTags = ['@brand', '@business', '@company'];
    const hasBrandTag = brandTags.some(tag => url.toLowerCase().includes(tag.toLowerCase()));
    results.hasBrandTag = hasBrandTag;

    // FTC compliance (has either ad tag or sponsored tag)
    results.hasFTCCompliance = hasAdTag;

    // All checks pass
    results.allChecksPass = results.urlValid && results.hasAdTag && results.hasBrandTag && results.hasFTCCompliance;

    return results;
  };

  const handleManualOverride = () => {
    setVerificationStatus('manual');
    setVerificationResults({
      ...verificationResults,
      allChecksPass: true,
      manualOverride: true
    });
  };

  const handleComplete = () => {
    onVerificationComplete({
      postUrl,
      verificationResults,
      status: verificationStatus,
      verifiedAt: new Date().toISOString()
    });
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      case 'manual':
        return '👨‍💼';
      case 'verifying':
        return '⏳';
      default:
        return '📋';
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Verification Successful';
      case 'failed':
        return 'Verification Failed';
      case 'manual':
        return 'Manually Approved';
      case 'verifying':
        return 'Verifying Post...';
      default:
        return 'Ready to Verify';
    }
  };

  return (
    <div className="proof-tool-overlay">
      <div className="proof-tool-modal">
        <div className="proof-tool-header">
          <h2>🔍 Auto-Ad Proof Tool</h2>
          <p>Upload your social media post for automatic verification</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="proof-tool-content">
          <div className="deal-info">
            <h3>Deal: {deal?.title || 'Instagram Story'}</h3>
            <p>Deliverables: {deal?.deliverables || '1x Instagram Story tagging @brand within 7 days'}</p>
            <p>Payment: ${deal?.paymentAmount || 100}</p>
          </div>

          <div className="upload-section">
            <h4>Paste Your Post URL</h4>
            <div className="url-input-group">
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="url-input"
              />
              <button 
                className="verify-btn"
                onClick={handleUrlSubmit}
                disabled={!postUrl.trim() || isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Post'}
              </button>
            </div>
          </div>

          {verificationStatus !== 'pending' && (
            <div className="verification-results">
              <div className={`status-header ${verificationStatus}`}>
                <span className="status-icon">{getStatusIcon()}</span>
                <h4>{getStatusText()}</h4>
              </div>

              <div className="check-list">
                <div className={`check-item ${verificationResults.urlValid ? 'passed' : 'failed'}`}>
                  <span className="check-icon">
                    {verificationResults.urlValid ? '✅' : '❌'}
                  </span>
                  <span>Valid Social Media URL</span>
                </div>

                <div className={`check-item ${verificationResults.hasAdTag ? 'passed' : 'failed'}`}>
                  <span className="check-icon">
                    {verificationResults.hasAdTag ? '✅' : '❌'}
                  </span>
                  <span>Contains #ad or #sponsored tag</span>
                </div>

                <div className={`check-item ${verificationResults.hasBrandTag ? 'passed' : 'failed'}`}>
                  <span className="check-icon">
                    {verificationResults.hasBrandTag ? '✅' : '❌'}
                  </span>
                  <span>Brand tag included (@brand)</span>
                </div>

                <div className={`check-item ${verificationResults.hasFTCCompliance ? 'passed' : 'failed'}`}>
                  <span className="check-icon">
                    {verificationResults.hasFTCCompliance ? '✅' : '❌'}
                  </span>
                  <span>FTC Compliance (#ad/#sponsored)</span>
                </div>
              </div>

              {verificationStatus === 'failed' && (
                <div className="fix-suggestions">
                  <h5>🔧 Fix Suggestions:</h5>
                  <ul>
                    <li>Add #ad or #sponsored to your post</li>
                    <li>Include the brand's @handle in your post</li>
                    <li>Make sure the URL is from a valid social platform</li>
                  </ul>
                  <button 
                    className="manual-override-btn"
                    onClick={handleManualOverride}
                  >
                    👨‍💼 Request Manual Review
                  </button>
                </div>
              )}

              {verificationStatus === 'success' && (
                <div className="success-message">
                  <p>🎉 Your post meets all requirements! Payment will be released after admin review.</p>
                </div>
              )}

              {verificationStatus === 'manual' && (
                <div className="manual-message">
                  <p>👨‍💼 Manual review requested. Admin will review your post and release payment.</p>
                </div>
              )}
            </div>
          )}

          <div className="ftc-reminder">
            <h5>📋 FTC Compliance Reminder</h5>
            <p>Remember to include #ad or #sponsored in your posts to comply with FTC guidelines.</p>
          </div>
        </div>

        <div className="proof-tool-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          
          {(verificationStatus === 'success' || verificationStatus === 'manual') && (
            <button 
              className="complete-btn"
              onClick={handleComplete}
            >
              Complete & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoAdProofTool; 