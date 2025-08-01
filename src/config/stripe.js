import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-stripe-publishable-key');

// Payment helper functions
export const stripe = {
  // Get Stripe instance
  getInstance: async () => {
    return await stripePromise;
  },

  // Create payment intent for deal
  createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata
        }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Process payment with card
  processCardPayment: async (paymentIntent, cardElement) => {
    try {
      const stripe = await stripePromise;
      const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      return { data: confirmedPaymentIntent, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create customer
  createCustomer: async (email, name, metadata = {}) => {
    try {
      const response = await fetch('/.netlify/functions/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          metadata
        }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Setup payment method
  setupPaymentMethod: async (customerId, paymentMethodId) => {
    try {
      const response = await fetch('/.netlify/functions/setup-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          paymentMethodId
        }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create transfer to athlete
  createTransfer: async (amount, destinationAccount, metadata = {}) => {
    try {
      const response = await fetch('/.netlify/functions/create-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          destinationAccount,
          metadata
        }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get payment history
  getPaymentHistory: async (customerId) => {
    try {
      const response = await fetch(`/.netlify/functions/get-payment-history?customerId=${customerId}`);
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Refund payment
  refundPayment: async (paymentIntentId, amount = null) => {
    try {
      const response = await fetch('/.netlify/functions/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount
        }),
      });

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Payment calculation helpers
export const paymentUtils = {
  // Calculate service fee (5%)
  calculateServiceFee: (amount) => {
    return Math.round(amount * 0.05);
  },

  // Calculate total with service fee
  calculateTotal: (amount) => {
    const serviceFee = paymentUtils.calculateServiceFee(amount);
    return amount + serviceFee;
  },

  // Format amount for display
  formatAmount: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  },

  // Convert dollars to cents
  dollarsToCents: (dollars) => {
    return Math.round(dollars * 100);
  },

  // Convert cents to dollars
  centsToDollars: (cents) => {
    return cents / 100;
  }
};

// Payment validation helpers
export const paymentValidation = {
  // Validate card number
  validateCardNumber: (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
  },

  // Validate expiry date
  validateExpiryDate: (expiryDate) => {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(year);

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }

    return expMonth >= 1 && expMonth <= 12;
  },

  // Validate CVV
  validateCVV: (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  },

  // Validate routing number
  validateRoutingNumber: (routingNumber) => {
    return /^\d{9}$/.test(routingNumber);
  },

  // Validate account number
  validateAccountNumber: (accountNumber) => {
    return /^\d{4,17}$/.test(accountNumber);
  }
};

export default stripe; 