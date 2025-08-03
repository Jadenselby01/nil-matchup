import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripeService } from '../services/stripeService';
import './PaymentForm.css';

const PaymentForm = ({ deal, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');

  useEffect(() => {
    if (deal && deal.amount) {
      initializePayment();
    }
  }, [deal]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const secret = await stripeService.createPaymentIntent(
        deal.id,
        deal.amount,
        'usd'
      );
      
      setClientSecret(secret);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Payment initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      // Get payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: deal.business?.company_name || 'Business Payment',
          email: deal.business?.email || '',
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('success');
        
        // Handle successful payment
        await stripeService.handlePaymentSuccess(paymentIntent, deal.id);
        
        if (onPaymentSuccess) {
          onPaymentSuccess(paymentIntent);
        }
      } else {
        setPaymentStatus('failed');
        throw new Error('Payment failed. Please try again.');
      }

    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
      
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (paymentStatus === 'success') {
    return (
      <div className="payment-success">
        <div className="success-icon">✅</div>
        <h3>Payment Successful!</h3>
        <p>Your payment of ${deal.amount} has been processed successfully.</p>
        <p>You will receive a confirmation email shortly.</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h3>Complete Payment</h3>
        <div className="deal-summary">
          <p><strong>Deal:</strong> {deal.ad_type}</p>
          <p><strong>Amount:</strong> ${deal.amount}</p>
          <p><strong>Business:</strong> {deal.business?.company_name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="card-element">Credit or Debit Card</label>
          <div className="card-element-container">
            <CardElement
              id="card-element"
              options={cardElementOptions}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className={`btn-pay ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <span>
              <span className="spinner"></span>
              Processing Payment...
            </span>
          ) : (
            `Pay $${deal.amount}`
          )}
        </button>

        <div className="payment-security">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Stripe</p>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 