import React from 'react';
import PaymentForm from './PaymentForm';
import './PaymentPage.css';

const PaymentPage = ({ currentUser, onBack }) => {
  return (
    <div className="payment-page">
      <div className="payment-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h1>Payment</h1>
      </div>
      
      <div className="payment-content">
        <PaymentForm currentUser={currentUser} />
      </div>
    </div>
  );
};

export default PaymentPage; 