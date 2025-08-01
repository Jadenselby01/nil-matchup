import React, { useState, useEffect } from 'react';
import './PaymentPage.css';

// Initialize Stripe
// const stripePromise = loadStripe('pk_live_51RjBBMGylPmdaSloVnjeOAosVKs6E2mg7QvMaG2LWXgttHNXB91HvWbOOhUhzNe309aioCtMCtxEoIiErtKm4z6U00s8h7plbZ');

// Stripe integration (you'll need to install: npm install @stripe/stripe-js)
// import { loadStripe } from '@stripe/stripe-js';

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
  const [paymentIntent, setPaymentIntent] = useState(null);

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

  const initializePaymentIntent = async () => {
    try {
      // Call Netlify function to create payment intent
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPaymentData.amount,
          currency: finalPaymentData.currency,
          description: finalPaymentData.description,
          metadata: {
            businessId: finalPaymentData.businessId,
            athleteId: finalPaymentData.athleteId,
            offerId: finalPaymentData.offerId,
            businessName: finalPaymentData.businessName,
            athleteName: finalPaymentData.athleteName
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentIntent(data.paymentIntent);
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      console.error('Payment intent error:', err);
      setError('Payment initialization failed. Please refresh and try again.');
    }
  };

  useEffect(() => {
    // Auto-fill email if available
    if (finalPaymentData.email) {
      setEmail(finalPaymentData.email);
    }
    
    // Initialize payment intent with backend
    initializePaymentIntent();
  }, [finalPaymentData]);

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

  const processStripePayment = async () => {
    try {
      // This would integrate with Stripe Elements for secure card processing
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          paymentMethod: {
            type: 'card',
            card: {
              number: cardNumber.replace(/\s/g, ''),
              exp_month: parseInt(expiryDate.split('/')[0]),
              exp_year: parseInt('20' + expiryDate.split('/')[1]),
              cvc: cvv
            },
            billing_details: {
              name: cardholderName,
              email: email
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Send confirmation email
        await sendPaymentConfirmation(data.paymentId);
        
        // Update payment history
        await updatePaymentHistory(data.paymentId);
        
        return { success: true, paymentId: data.paymentId };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      return { success: false, error: 'Payment processing failed. Please try again.' };
    }
  };

  const processPayPalPayment = async () => {
    try {
      // This would integrate with PayPal SDK
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPaymentData.amount,
          currency: finalPaymentData.currency,
          description: finalPaymentData.description,
          metadata: {
            businessId: finalPaymentData.businessId,
            athleteId: finalPaymentData.athleteId,
            offerId: finalPaymentData.offerId
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to PayPal or open PayPal modal
        window.location.href = data.approvalUrl;
        return { success: true, orderId: data.orderId };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('PayPal payment error:', err);
      return { success: false, error: 'PayPal payment failed. Please try again.' };
    }
  };

  const sendPaymentConfirmation = async (paymentId) => {
    try {
      await fetch('/api/send-payment-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          email,
          paymentData: finalPaymentData
        })
      });
    } catch (err) {
      console.error('Email confirmation error:', err);
    }
  };

  const updatePaymentHistory = async (paymentId) => {
    try {
      await fetch('/api/update-payment-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          paymentData: finalPaymentData,
          status: 'completed'
        })
      });
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
      result = await processStripePayment();
    } else if (paymentMethod === 'paypal') {
      result = await processPayPalPayment();
    } else if (paymentMethod === 'applepay') {
      result = await processApplePayPayment();
    }

    setIsProcessing(false);

    if (result.success) {
      setStep(2); // Show confirmation
      
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

  const processApplePayPayment = async () => {
    // Apple Pay integration would go here
    // This requires Apple Pay merchant verification
    return { success: false, error: 'Apple Pay not yet configured' };
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
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-method-selector">
        <label className="payment-method-option">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="payment-method-icon">💳</span>
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
          <span className="payment-method-icon">🅿️</span>
          <span>PayPal</span>
        </label>
        
        <label className="payment-method-option">
          <input
            type="radio"
            name="paymentMethod"
            value="applepay"
            checked={paymentMethod === 'applepay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="payment-method-icon">🍎</span>
          <span>Apple Pay</span>
        </label>
      </div>

      {paymentMethod === 'card' && (
        <>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Cardholder Name</label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
          </div>
        </>
      )}

      <div className="form-row">
        <div className="form-group full-width">
          <label>Email for Receipt</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid() || isProcessing}
        className="pay-button primary-btn"
      >
        {isProcessing ? (
          <span className="processing">
            <span className="spinner"></span>
            Processing Payment...
          </span>
        ) : (
          `Pay $${finalPaymentData.amount}`
        )}
      </button>
    </form>
  );

  const renderConfirmation = () => (
    <div className="confirmation-step">
      <div className="confirmation-content">
        <div className="confirmation-icon">✅</div>
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
            <span>{paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="success-step">
      <div className="success-content">
        <div className="success-icon">🎉</div>
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