import React, { useState, useEffect } from 'react';
import './PaymentProcessingPage.css';

const isUuid = v =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

const PaymentProcessingPage = ({ dealId, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [deal, setDeal] = useState(null);
  const [businessPayment, setBusinessPayment] = useState({
    amount: 0,
    serviceFee: 0,
    totalAmount: 0,
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    bankAccount: {
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking'
    }
  });

  const [athletePayment, setAthletePayment] = useState({
    paymentMethod: 'bank_account',
    bankAccount: {
      accountNumber: '',
      routingNumber: '',
      accountType: 'checking'
    },
    cardInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });

  // const [userType, setUserType] = useState(''); // 'athlete' or 'business'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulate deal data
  useEffect(() => {
    // In real app, fetch deal data from backend
    const mockDeal = {
      id: dealId,
      athlete: {
        name: 'Michael Johnson',
        sport: 'Football',
        university: 'University of North Carolina'
      },
      business: {
        name: 'Sports Gear Co.',
        type: 'Sports Equipment'
      },
      dealAmount: 500,
      serviceFee: 50, // 10% of 500
      totalAmount: 500,
      deliverables: '1x Instagram Story tagging @sportsgearco within 7 days',
      deadline: '2024-02-15',
      status: 'accepted'
    };
    setDeal(mockDeal);
    setBusinessPayment(prev => ({
      ...prev,
      amount: mockDeal.dealAmount,
      serviceFee: mockDeal.serviceFee,
      totalAmount: mockDeal.totalAmount
    }));
  }, [dealId]);

  // Determine user type (in real app, get from auth context)
  useEffect(() => {
    // Simulate getting user type from localStorage or context
    // const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    // setUserType('business'); // Default to business for now
  }, []);

  const handleBusinessPaymentMethodChange = (method) => {
    setBusinessPayment(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleAthletePaymentMethodChange = (method) => {
    setAthletePayment(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleBusinessPaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate payment information
      if (businessPayment.paymentMethod === 'credit_card') {
        if (!businessPayment.cardNumber || !businessPayment.expiryDate || !businessPayment.cvv || !businessPayment.cardholderName) {
          throw new Error('Please fill in all credit card information');
        }
      } else {
        if (!businessPayment.bankAccount.accountNumber || !businessPayment.bankAccount.routingNumber) {
          throw new Error('Please fill in all bank account information');
        }
      }

      // UUID validation guard for when stripeService.createPaymentIntent is integrated:
      // const realDealId = (dealDetails?.id ?? dealId ?? selectedDeal?.id);
      // if (!isUuid(realDealId)) {
      //   console.error('Invalid deal UUID for payment', { realDealId });
      //   if (typeof setError === 'function') setError('Cannot start payment: missing valid deal.');
      //   else alert('Cannot start payment: missing valid deal.');
      //   return;
      // }
      // Then update the createPaymentIntent call to include the UUID:
      // await stripeService.createPaymentIntent(amount, 'usd', { deal_id: realDealId });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update deal status
      const updatedDeal = { ...deal, status: 'payment_processed' };
      setDeal(updatedDeal);

      // Move to next step
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAthletePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate payment information
      if (athletePayment.paymentMethod === 'bank_account') {
        if (!athletePayment.bankAccount.accountNumber || !athletePayment.bankAccount.routingNumber) {
          throw new Error('Please fill in all bank account information');
        }
      } else {
        if (!athletePayment.cardInfo.cardNumber || !athletePayment.cardInfo.expiryDate || !athletePayment.cardInfo.cvv) {
          throw new Error('Please fill in all card information');
        }
      }

      // Simulate payment info processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update deal status
      const updatedDeal = { ...deal, status: 'payment_info_complete' };
      setDeal(updatedDeal);

      // Complete the process
      if (onComplete) {
        onComplete(updatedDeal);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (!deal) {
    return <div className="loading">Loading deal information...</div>;
  }

  return (
    <div className="payment-processing-page">
      <div className="payment-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Deal
        </button>
        <h1>Payment Processing</h1>
        <div className="deal-summary">
          <h2>Deal Summary</h2>
          <div className="deal-details">
            <div className="deal-party">
              <strong>Athlete:</strong> {deal.athlete.name} ({deal.athlete.sport})
            </div>
            <div className="deal-party">
              <strong>Business:</strong> {deal.business.name}
            </div>
            <div className="deal-amount">
              <strong>Deal Amount:</strong> ${deal.dealAmount.toLocaleString()}
            </div>
            <div className="deal-deliverables">
              <strong>Deliverables:</strong> {deal.deliverables}
            </div>
            <div className="deal-deadline">
              <strong>Deadline:</strong> {new Date(deal.deadline).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="payment-steps">
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Business Payment</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Athlete Payment Info</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Complete</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Step 1: Business Payment */}
        {currentStep === 1 && (
          <div className="payment-step">
            <h3>Business Payment</h3>
            <div className="payment-breakdown">
              <div className="breakdown-item">
                <span>Deal Amount:</span>
                <span>${deal.dealAmount.toLocaleString()}</span>
              </div>
              <div className="breakdown-item service-fee">
                <span>Service Fee (5%):</span>
                <span>${deal.serviceFee.toLocaleString()}</span>
              </div>
              <div className="breakdown-item total">
                <span>Total Amount:</span>
                <span>${deal.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleBusinessPaymentSubmit} className="payment-form">
              <div className="payment-method-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="businessPaymentMethod"
                      value="credit_card"
                      checked={businessPayment.paymentMethod === 'credit_card'}
                      onChange={() => handleBusinessPaymentMethodChange('credit_card')}
                    />
                    <span className="method-label">💳 Credit/Debit Card</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="businessPaymentMethod"
                      value="bank_account"
                      checked={businessPayment.paymentMethod === 'bank_account'}
                      onChange={() => handleBusinessPaymentMethodChange('bank_account')}
                    />
                    <span className="method-label">🏦 Bank Account Transfer</span>
                  </label>
                </div>
              </div>

              {businessPayment.paymentMethod === 'credit_card' && (
                <div className="card-payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={businessPayment.cardNumber}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        cardNumber: formatCardNumber(e.target.value)
                      }))}
                      maxLength="19"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={businessPayment.expiryDate}
                        onChange={(e) => setBusinessPayment(prev => ({
                          ...prev,
                          expiryDate: formatExpiryDate(e.target.value)
                        }))}
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={businessPayment.cvv}
                        onChange={(e) => setBusinessPayment(prev => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                        }))}
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={businessPayment.cardholderName}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        cardholderName: e.target.value
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Billing Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={businessPayment.billingAddress.street}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        billingAddress: {
                          ...prev.billingAddress,
                          street: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="City"
                        value={businessPayment.billingAddress.city}
                        onChange={(e) => setBusinessPayment(prev => ({
                          ...prev,
                          billingAddress: {
                            ...prev.billingAddress,
                            city: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="State"
                        value={businessPayment.billingAddress.state}
                        onChange={(e) => setBusinessPayment(prev => ({
                          ...prev,
                          billingAddress: {
                            ...prev.billingAddress,
                            state: e.target.value
                          }
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={businessPayment.billingAddress.zipCode}
                        onChange={(e) => setBusinessPayment(prev => ({
                          ...prev,
                          billingAddress: {
                            ...prev.billingAddress,
                            zipCode: e.target.value
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {businessPayment.paymentMethod === 'bank_account' && (
                <div className="bank-payment-form">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={businessPayment.bankAccount.accountNumber}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          accountNumber: e.target.value.replace(/\D/g, '')
                        }
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Routing Number</label>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={businessPayment.bankAccount.routingNumber}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          routingNumber: e.target.value.replace(/\D/g, '')
                        }
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type</label>
                    <select
                      value={businessPayment.bankAccount.accountType}
                      onChange={(e) => setBusinessPayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          accountType: e.target.value
                        }
                      }))}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="security-notice">
                <p>🔒 Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.</p>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : `Pay $${deal.totalAmount.toLocaleString()}`}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Athlete Payment Information */}
        {currentStep === 2 && (
          <div className="payment-step">
            <h3>Athlete Payment Information</h3>
            <p className="step-description">
              Please provide your payment information so we can securely transfer your earnings once the deal is completed.
            </p>

            <form onSubmit={handleAthletePaymentSubmit} className="payment-form">
              <div className="payment-method-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="athletePaymentMethod"
                      value="bank_account"
                      checked={athletePayment.paymentMethod === 'bank_account'}
                      onChange={() => handleAthletePaymentMethodChange('bank_account')}
                    />
                    <span className="method-label">🏦 Bank Account (Recommended)</span>
                  </label>
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="athletePaymentMethod"
                      value="credit_card"
                      checked={athletePayment.paymentMethod === 'credit_card'}
                      onChange={() => handleAthletePaymentMethodChange('credit_card')}
                    />
                    <span className="method-label">💳 Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              {athletePayment.paymentMethod === 'bank_account' && (
                <div className="bank-payment-form">
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      value={athletePayment.bankAccount.accountNumber}
                      onChange={(e) => setAthletePayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          accountNumber: e.target.value.replace(/\D/g, '')
                        }
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Routing Number</label>
                    <input
                      type="text"
                      placeholder="123456789"
                      value={athletePayment.bankAccount.routingNumber}
                      onChange={(e) => setAthletePayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          routingNumber: e.target.value.replace(/\D/g, '')
                        }
                      }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type</label>
                    <select
                      value={athletePayment.bankAccount.accountType}
                      onChange={(e) => setAthletePayment(prev => ({
                        ...prev,
                        bankAccount: {
                          ...prev.bankAccount,
                          accountType: e.target.value
                        }
                      }))}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>
                </div>
              )}

              {athletePayment.paymentMethod === 'credit_card' && (
                <div className="card-payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={athletePayment.cardInfo.cardNumber}
                      onChange={(e) => setAthletePayment(prev => ({
                        ...prev,
                        cardInfo: {
                          ...prev.cardInfo,
                          cardNumber: formatCardNumber(e.target.value)
                        }
                      }))}
                      maxLength="19"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={athletePayment.cardInfo.expiryDate}
                        onChange={(e) => setAthletePayment(prev => ({
                          ...prev,
                          cardInfo: {
                            ...prev.cardInfo,
                            expiryDate: formatExpiryDate(e.target.value)
                          }
                        }))}
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={athletePayment.cardInfo.cvv}
                        onChange={(e) => setAthletePayment(prev => ({
                          ...prev,
                          cardInfo: {
                            ...prev.cardInfo,
                            cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                          }
                        }))}
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={athletePayment.cardInfo.cardholderName}
                      onChange={(e) => setAthletePayment(prev => ({
                        ...prev,
                        cardInfo: {
                          ...prev.cardInfo,
                          cardholderName: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>
              )}

              <div className="security-notice">
                <p>🔒 Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.</p>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Saving Payment Info...' : 'Save Payment Information'}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Completion */}
        {currentStep === 3 && (
          <div className="payment-step completion">
            <div className="completion-icon">✅</div>
            <h3>Payment Processing Complete!</h3>
            <p>Your deal is now ready to proceed. Here's what happens next:</p>
            
            <div className="next-steps">
              <div className="step-item">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Deal Activation</h4>
                  <p>The deal is now active and the athlete can begin working on deliverables.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Deliverable Completion</h4>
                  <p>The athlete will complete the required deliverables and upload proof.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Payment Release</h4>
                  <p>Once deliverables are verified, payment will be automatically released to the athlete.</p>
                </div>
              </div>
            </div>

            <div className="deal-status">
              <h4>Current Deal Status</h4>
              <div className="status-badge active">Active</div>
              <p>Deal ID: {deal.id}</p>
              <p>Amount: ${deal.dealAmount.toLocaleString()}</p>
              <p>Deadline: {new Date(deal.deadline).toLocaleDateString()}</p>
            </div>

            <button 
              className="complete-btn"
              onClick={() => onComplete && onComplete(deal)}
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessingPage; 