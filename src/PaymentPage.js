import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import { stripeService } from './services/stripeService';
import './PaymentPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function PaymentPage({ currentUser, onBack }) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate getting deal data - replace with real API call
    const mockDeal = {
      id: 'deal-123',
      ad_type: 'Social Media Promotion',
      amount: 1500.00,
      description: 'Instagram and TikTok posts promoting local business',
      business: {
        company_name: 'Local Sports Shop',
        email: 'contact@localsportsshop.com'
      },
      athlete: {
        name: 'John Smith',
        sport: 'Basketball'
      }
    };

    setDeal(mockDeal);
    setLoading(false);
  }, []);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // You can redirect to success page or show success message
    alert('Payment successful! Your deal has been completed.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setError('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>Complete Payment</h2>
      </div>

      <div className="payment-content">
        <Elements stripe={stripePromise}>
          <PaymentForm
            deal={deal}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>
      </div>

      <div className="payment-info">
        <h4>Payment Information</h4>
        <ul>
          <li>✅ Secure payment processing via Stripe</li>
          <li>✅ Your card information is encrypted</li>
          <li>✅ Payment will be processed immediately</li>
          <li>✅ You'll receive a confirmation email</li>
        </ul>
      </div>
    </div>
  );
}

export default PaymentPage; 