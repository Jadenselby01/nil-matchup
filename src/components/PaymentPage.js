import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-btn" onClick={handleBack}>
             Back
          </button>
          <h1>Payment</h1>
          <p className="payment-subtitle">Manage your NIL earnings and payments.</p>
        </div>

        <div className="payment-content">
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h4>No payments yet</h4>
            <p>Your payment history will appear here once you complete deals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
