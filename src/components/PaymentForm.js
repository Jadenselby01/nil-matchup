import React, { useState, useEffect, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripeService from '../services/stripeService';
import './PaymentForm.css';

const PaymentForm = ({ deal, currentUser, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentMode, setPaymentMode] = useState(''); // 'send' or 'receive'
  const [stripeAvailable, setStripeAvailable] = useState(false);

  // Check if Stripe is properly configured
  useEffect(() => {
    const checkStripeConfig = () => {
      const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey || publishableKey === 'undefined' || publishableKey.includes('your_')) {
        setError('Stripe is not configured. Please contact support.');
        setStripeAvailable(false);
        return false;
      }
      setStripeAvailable(true);
      return true;
    };

    checkStripeConfig();
  }, []);

  // Determine payment mode based on user type
  const isBusiness = currentUser && currentUser.type === 'business';
  const isAthlete = currentUser && currentUser.type === 'athlete';

  const initializePayment = useCallback(async () => {
    try {
      if (!stripeAvailable) {
        setError('Payment system not available. Please contact support.');
        return;
      }

      setLoading(true);
      setError(null);
      
      // For businesses: create payment intent to send money
      if (isBusiness) {
        setPaymentMode('send');
        
        // Calculate service fee (10%)
        const serviceFee = Math.round(deal.amount * 0.10);
        const totalAmount = deal.amount + serviceFee;
        
        // Create payment intent with correct parameters
        const secret = await stripeService.createPaymentIntent(
          totalAmount, // total amount including service fee
          'usd',
          {
            dealId: deal.id,
            athleteId: deal.athlete?.id || currentUser.id,
            businessId: currentUser.id,
            originalAmount: deal.amount,
            serviceFee: serviceFee,
            totalAmount: totalAmount
          }
        );
        setClientSecret(secret);
      }
      // For athletes: set up to receive payments (no payment intent needed)
      else if (isAthlete) {
        setPaymentMode('receive');
        setClientSecret('athlete-receive-mode');
      }
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Payment initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [deal, isBusiness, isAthlete, currentUser, stripeAvailable]);

  useEffect(() => {
    if (deal && deal.amount && (isBusiness || isAthlete) && stripeAvailable) {
      initializePayment();
    }
  }, [deal, initializePayment, isBusiness, isAthlete, stripeAvailable]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      if (isBusiness && paymentMode === 'send') {
        // Business sending payment to athlete
        if (!clientSecret || clientSecret === 'athlete-receive-mode') {
          throw new Error('Payment not initialized properly');
        }

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
      } else if (isAthlete && paymentMode === 'receive') {
        // Athlete setting up payment info for receiving payments
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            name: deal.athlete?.name || 'Athlete Payment',
            email: deal.athlete?.email || '',
          },
        });

        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }

        // Save athlete's payment method for receiving payments
        await stripeService.saveAthletePaymentMethod(currentUser.id, paymentMethod.id);
        
        setPaymentStatus('success');
        if (onPaymentSuccess) {
          onPaymentSuccess({ type: 'payment_method_saved', paymentMethod });
        }
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

  // Show error if Stripe is not configured
  if (!stripeAvailable) {
    return (
      <div className="payment-error">
        <h4>⚠️ Stripe Not Configured</h4>
        <p>Payment processing is not available. Please contact support.</p>
      </div>
    );
  }

  if (paymentMode === 'athlete-receive-mode') {
    return (
      <div className="athlete-payment-setup">
        <div className="payment-form-container">
          <div className="payment-header">
            <h3>Set Up Payment Info</h3>
            <p>💳 Athlete Setup: You are setting up payment info to receive money</p>
          </div>

          <div className="deal-summary">
            <h4>Deal: {deal.title}</h4>
            <p className="deal-amount">Original Amount: ${deal.amount}</p>
            <p className="service-fee">Service Fee (10%): ${Math.round(deal.amount * 0.10)}</p>
            <p className="total-amount">Total Amount: ${deal.amount + Math.round(deal.amount * 0.10)}</p>
            <p className="deal-business">Athlete: {deal.athlete?.name || 'Athlete'}</p>
          </div>

          <div className="payment-notice">
            <h4>Credit or Debit Card (to receive payments)</h4>
            <p>✅ Your card info is saved securely for receiving payments</p>
            <p className="secure-info">🔒 Your payment information is secure and encrypted</p>
            <p className="stripe-powered">Powered by Stripe</p>
          </div>

          <div className="payment-form">
            <div className="form-group">
              <label>Card Information</label>
              <div className="card-element-container">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#000000',
                        '::placeholder': {
                          color: '#666666',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-save-payment"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Payment Info'}
            </button>
          </div>

          {/* The success and error states were not part of the new_code, so they are removed. */}
        </div>
      </div>
    );
  }

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
        <h3>Payment {isBusiness ? 'Sent' : 'Info Saved'} Successfully!</h3>
        {isBusiness ? (
          <>
            <p>Your payment of ${deal.amount} has been sent to the athlete.</p>
            <p>You will receive a confirmation email shortly.</p>
          </>
        ) : (
          <>
            <p>Your payment information has been saved.</p>
            <p>You can now receive payments from businesses.</p>
          </>
        )}
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
        <h3>{isBusiness ? 'Send Payment' : 'Set Up Payment Info'}</h3>
        <div className="deal-summary">
          <p><strong>Deal:</strong> {deal.ad_type}</p>
          <p><strong>Amount:</strong> ${deal.amount}</p>
          {isBusiness ? (
            <p><strong>Athlete:</strong> {deal.athlete?.name}</p>
          ) : (
            <p><strong>Business:</strong> {deal.business?.company_name}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="card-element">
            {isBusiness ? 'Credit or Debit Card (to send payment)' : 'Credit or Debit Card (to receive payments)'}
          </label>
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
          disabled={!stripe || loading || !clientSecret || clientSecret === 'athlete-receive-mode'}
          className={`btn-pay ${loading ? 'loading' : ''}`}
        >
          {loading ? (
            <span>
              <span className="spinner"></span>
              {isBusiness ? 'Processing Payment...' : 'Saving Payment Info...'}
            </span>
          ) : (
            isBusiness ? `Send $${deal.amount + Math.round(deal.amount * 0.10)}` : 'Save Payment Info'
          )}
        </button>

        <div className="payment-info">
          {isBusiness ? (
            <>
              <p>💳 <strong>Business Payment:</strong> You are sending money to the athlete</p>
              <p>✅ Payment will be processed immediately</p>
            </>
          ) : (
            <>
              <p>💳 <strong>Athlete Setup:</strong> You are setting up payment info to receive money</p>
              <p>✅ Your card info is saved securely for receiving payments</p>
            </>
          )}
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Stripe</p>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 