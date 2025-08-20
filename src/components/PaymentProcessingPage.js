import React from 'react';
import './PaymentProcessingPage.css';

const PaymentProcessingPage = ({ dealId, onComplete, onBack }) => {
  return (
    <div className="payment-processing-page">
      <div className="processing-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Payment Processing</h1>
      </div>

      <div className="processing-content">
        <div className="processing-status">
          <div className="status-icon">⏳</div>
          <h3>Processing Your Payment</h3>
          <p>Please wait while we process your payment...</p>
          <div className="deal-info">
            <p><strong>Deal ID:</strong> {dealId || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage; 