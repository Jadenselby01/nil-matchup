import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './components/PaymentForm';
import './PaymentPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function PaymentPage({ currentUser, onBack }) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UUID generation function with fallback
  const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback UUID generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  useEffect(() => {
    // Get deal from URL params or localStorage, or create a sample deal for testing
    const getDealData = () => {
      // Try to get deal from localStorage (if coming from a specific deal)
      const savedDeal = localStorage.getItem('currentDeal');
      if (savedDeal) {
        try {
          return JSON.parse(savedDeal);
        } catch (e) {
          console.log('Could not parse saved deal');
        }
      }

      // Create a sample deal for testing if no real deal exists
      return {
        id: generateUUID(), // Generate a proper UUID for testing
        ad_type: 'Social Media Promotion',
        amount: 500.00, // Default amount, but user can change this
        title: 'Social Media Campaign',
        description: 'Instagram and TikTok posts promoting local business',
        business: currentUser?.type === 'business' ? {
          company_name: currentUser.company_name || 'Your Business',
          email: currentUser.email || 'business@example.com'
        } : {
          company_name: 'Local Sports Shop',
          email: 'contact@localsportsshop.com'
        },
        athlete: currentUser?.type === 'athlete' ? {
          name: currentUser.name || 'You',
          sport: currentUser.sport || 'Athlete',
          email: currentUser.email || 'athlete@example.com'
        } : {
          name: 'John Smith',
          sport: 'Basketball',
          email: 'john@example.com'
        }
      };
    };

    const dealData = getDealData();
    setDeal(dealData);
    setLoading(false);
  }, [currentUser]);

  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    
    // Clear any saved deal data
    localStorage.removeItem('currentDeal');
    
    // Show success message
    if (currentUser?.type === 'business') {
      alert('✅ Payment successful! Your payment of $' + deal.amount + ' has been sent to the athlete.');
    } else {
      alert('✅ Payment information saved! You can now receive payments from businesses.');
    }
    
    // Redirect back to dashboard
    if (onBack) {
      onBack();
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setError('Payment failed: ' + error.message);
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
          <h3>Payment Error</h3>
          <p>{error}</p>
          <button onClick={() => setError(null)} className="btn-primary">
            Try Again
          </button>
          <button onClick={onBack} className="btn-secondary">
            Go Back
      </button>
      </div>
    </div>
  );
  }

  if (!deal) {
    return (
      <div className="payment-page">
        <div className="error-container">
          <h3>No Deal Found</h3>
          <p>Please select a deal to make a payment.</p>
          <button onClick={onBack} className="btn-primary">
            Go Back
          </button>
      </div>
    </div>
  );
  }

  return (
    <div className="payment-page">
      <div className="page-title-header">
        <button onClick={onBack} className="back-button">
          ← Back
        </button>
        <h2>Complete Payment</h2>
      </div>

      <div className="payment-content">
        <Elements stripe={stripePromise}>
          <PaymentForm
            deal={deal}
            currentUser={currentUser}
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
          <li>✅ {currentUser?.type === 'business' ? 'Payment will be processed immediately' : 'Payment info saved securely'}</li>
          <li>✅ {currentUser?.type === 'business' ? 'You\'ll receive a confirmation email' : 'You can receive payments from businesses'}</li>
        </ul>
      </div>
    </div>
  );
}

export default PaymentPage; 