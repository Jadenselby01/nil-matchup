import React, { useState, useEffect, useCallback } from 'react';
import './PaymentPage.css';

function PaymentPage({ paymentData, onBack, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Payment details, 2: Confirmation, 3: Success
  const [error, setError] = useState('');
  // const [paymentIntent, setPaymentIntent] = useState(null);

  // Default payment data if none provided
  const defaultPaymentData = {
    amount: 500,
    currency: 'USD',
    description: 'NIL Partnership Payment',
    businessName: 'Carolina Sports Bar & Grill',
    athleteName: 'Michael Johnson',
    offerType: 'Instagram Feed Post & Story',
    offerId: 'offer_123',
    businessId: 'business_101',
    athleteId: 'athlete_1'
  };

  const finalPaymentData = paymentData || defaultPaymentData;

  const initializePaymentIntent = useCallback(async () => {
    try {
      // Simulate payment intent creation
      // setPaymentIntent({
      //   id: 'pi_' + Math.random().toString(36).substr(2, 9),
      //   amount: finalPaymentData.amount,
      //   currency: finalPaymentData.currency
      // });
    } catch (err) {
      console.error('Payment intent error:', err);
      setError('Payment initialization failed. Please refresh and try again.');
    }
  }, [finalPaymentData]);

  useEffect(() => {
    // Auto-fill email if available
    if (finalPaymentData.email) {
      setEmail(finalPaymentData.email);
    }
    
    // Initialize payment intent
    initializePaymentIntent();
  }, [finalPaymentData, initializePaymentIntent]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const processCardPayment = async () => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Validate card details
      if (cardNumber.replace(/\s/g, '').length < 15) {
        throw new Error('Invalid card number');
      }
      
      if (expiryDate.length !== 5) {
        throw new Error('Invalid expiry date');
      }
      
      if (cvv.length < 3) {
        throw new Error('Invalid CVV');
      }
      
      return { success: true, paymentId: 'pay_' + Math.random().toString(36).substr(2, 9) };
    } catch (err) {
      console.error('Payment processing error:', err);
      return { success: false, error: err.message || 'Payment processing failed. Please try again.' };
    }
  };

  const processPayPalPayment = async () => {
    try {
      // Simulate PayPal payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, paymentId: 'paypal_' + Math.random().toString(36).substr(2, 9) };
    } catch (err) {
      console.error('PayPal payment error:', err);
      return { success: false, error: 'PayPal payment failed. Please try again.' };
    }
  };

  const sendPaymentConfirmation = async (paymentId) => {
    try {
      // Simulate sending confirmation email
      console.log('Sending confirmation email to:', email);
    } catch (err) {
      console.error('Email confirmation error:', err);
    }
  };

  const updatePaymentHistory = async (paymentId) => {
    try {
      // Simulate updating payment history
      console.log('Updating payment history for:', paymentId);
    } catch (err) {
      console.error('Payment history update error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    let result;
    
    if (paymentMethod === 'card') {
      result = await processCardPayment();
    } else if (paymentMethod === 'paypal') {
      result = await processPayPalPayment();
    }

    setIsProcessing(false);

    if (result.success) {
      setStep(2); // Show confirmation
      
      // Send confirmation email
      await sendPaymentConfirmation(result.paymentId);
      
      // Update payment history
      await updatePaymentHistory(result.paymentId);
      
      // Simulate success after 2 seconds
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          onSuccess(result.paymentId);
        }, 1500);
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length >= 15 &&
             expiryDate.length === 5 &&
             cvv.length >= 3 &&
             cardholderName.trim() &&
             email.trim();
    } else if (paymentMethod === 'paypal') {
      return email.trim();
    }
    return true;
  };

  const renderPaymentForm = () => (
    <div className="payment-form">
      <div className="payment-section">
        <h3>Business Payment Information</h3>
        
        <div className="payment-input-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            value={finalPaymentData.businessName || ''}
            placeholder="Enter your business name"
            readOnly
          />
        </div>

        <div className="payment-input-group">
          <label htmlFor="email">Business Email *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="business@example.com"
            required
          />
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Method</h3>
        
        <div className="payment-method-selection">
          <label className="payment-method-option">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-method-icon">Credit Card</span>
            <span>Credit/Debit Card</span>
          </label>
          
          <label className="payment-method-option">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="payment-method-icon">PayPal</span>
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="payment-section">
          <h3>Card Details</h3>
          
          <div className="payment-input-group">
            <label htmlFor="cardholderName">Cardholder Name *</label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="Name on card"
              required
            />
          </div>

          <div className="payment-input-group">
            <label htmlFor="cardNumber">Card Number *</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>

          <div className="payment-row">
            <div className="payment-input-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div className="payment-input-group">
              <label htmlFor="cvv">CVV *</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="payment-section">
        <h3>Payment Summary</h3>
        
        <div className="payment-summary">
          <div className="payment-summary-item">
            <span>Service:</span>
            <span>{finalPaymentData.description}</span>
          </div>
          <div className="payment-summary-item">
            <span>Athlete:</span>
            <span>{finalPaymentData.athleteName}</span>
          </div>
          <div className="payment-summary-item">
            <span>Service Type:</span>
            <span>{finalPaymentData.offerType}</span>
          </div>
          <div className="payment-summary-item total">
            <span>Total Amount:</span>
            <span>${finalPaymentData.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">Error</span>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="payment-submit-btn"
        onClick={handleSubmit}
        disabled={!isFormValid() || isProcessing}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${finalPaymentData.amount.toLocaleString()}`}
      </button>

      <div className="payment-security">
        <p>
          <span className="payment-security-icon">🔒</span>
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="confirmation-step">
      <div className="confirmation-content">
        <div className="confirmation-icon">Success</div>
        <h3>Payment Confirmed!</h3>
        <p>Your payment is being processed securely.</p>
        <div className="confirmation-details">
          <div className="detail-item">
            <span>Amount:</span>
            <span>${finalPaymentData.amount}</span>
          </div>
          <div className="detail-item">
            <span>Business:</span>
            <span>{finalPaymentData.businessName}</span>
          </div>
          <div className="detail-item">
            <span>Athlete:</span>
            <span>{finalPaymentData.athleteName}</span>
          </div>
          <div className="detail-item">
            <span>Payment Method:</span>
            <span>{paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="success-step">
      <div className="success-content">
        <div className="success-icon">Complete</div>
        <h3>Payment Successful!</h3>
        <p>Your NIL partnership has been confirmed.</p>
        <div className="success-details">
          <p>You will receive a confirmation email shortly.</p>
          <p>Both parties will be notified to proceed with the collaboration.</p>
          <p>Payment receipt has been sent to {email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="payment-page">
      <div className="payment-container">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="payment-header">
          <h1>Complete Payment</h1>
          <p>Secure payment powered by Stripe</p>
        </div>

        <div className="payment-summary">
          <div className="summary-header">
            <h3>Payment Summary</h3>
          </div>
          <div className="summary-content">
            <div className="summary-item">
              <span>Partnership:</span>
              <span>{finalPaymentData.description}</span>
            </div>
            <div className="summary-item">
              <span>Business:</span>
              <span>{finalPaymentData.businessName}</span>
            </div>
            <div className="summary-item">
              <span>Athlete:</span>
              <span>{finalPaymentData.athleteName}</span>
            </div>
            <div className="summary-item highlight">
              <span>Total Amount:</span>
              <span>${finalPaymentData.amount}</span>
            </div>
          </div>
        </div>

        <div className="payment-content">
          {step === 1 && renderPaymentForm()}
          {step === 2 && renderConfirmation()}
          {step === 3 && renderSuccess()}
        </div>

        <div className="payment-footer">
          <div className="security-badges">
            <span className="security-badge">SSL Secured</span>
            <span className="security-badge">Stripe Powered</span>
            <span className="security-badge">PCI Compliant</span>
            <span className="security-badge">Email Receipt</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage; 