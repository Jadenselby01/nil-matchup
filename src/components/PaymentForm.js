import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabaseClient';
import './PaymentForm.css';

const PaymentForm = ({ currentUser, deal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    amount: deal?.amount_cents ? (deal.amount_cents / 100).toFixed(2) : '50.00'
  });

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0.50) {
      setFormData(prev => ({ ...prev, amount: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait and try again.');
      return;
    }

    if (!deal?.id) {
      setError('No deal selected for payment.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Convert amount to cents
      const amountCents = Math.round(parseFloat(formData.amount) * 100);
      
      if (amountCents < 50) {
        setError('Minimum payment amount is $0.50');
        setLoading(false);
        return;
      }

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount_cents: amountCents,
          currency: 'usd',
          deal_id: deal.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { client_secret } = await response.json();

      // Confirm card payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: currentUser?.full_name || currentUser?.email,
            email: currentUser?.email,
          },
        },
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed. Please try again.');
      } else if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
        
        // Update deal status if needed
        try {
          const { error: updateError } = await supabase
            .from('deals')
            .update({ status: 'in_progress' })
            .eq('id', deal.id);
          
          if (updateError) {
            console.error('Failed to update deal status:', updateError);
          }
        } catch (updateError) {
          console.error('Error updating deal:', updateError);
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-icon">✅</div>
        <h3>Payment Successful!</h3>
        <p>Your payment of ${formData.amount} has been processed successfully.</p>
        <p>Deal ID: {deal.id}</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="payment-form-container">
      <div className="payment-header">
        <h2>Complete Payment</h2>
        <p>Deal: {deal?.title || 'Untitled Deal'}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Amount (USD) *</label>
          <input
            type="number"
            step="0.01"
            min="0.50"
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder="Enter amount (minimum $0.50)"
            required
          />
          <small>Minimum payment: $0.50</small>
        </div>

        <div className="form-group">
          <label>Card Information *</label>
          <div className="card-element-container">
            <CardElement
              options={{
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
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="payment-btn"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : `Pay $${formData.amount}`}
        </button>
      </form>

      <div className="payment-info">
        <h4>Payment Details</h4>
        <ul>
          <li><strong>Deal ID:</strong> {deal?.id || 'N/A'}</li>
          <li><strong>Amount:</strong> ${formData.amount}</li>
          <li><strong>Currency:</strong> USD</li>
          <li><strong>Payment Method:</strong> Credit/Debit Card</li>
        </ul>
        <p className="security-note">
          🔒 Your payment information is secure and encrypted by Stripe.
        </p>
      </div>
    </div>
  );
};

export default PaymentForm; 