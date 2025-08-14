import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../config/supabase';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export const stripeService = {
  // Initialize Stripe
  getStripe: async () => {
    return await stripePromise;
  },

  // Create payment intent for a deal
  createPaymentIntent: async (dealId, amount, currency = 'usd', athleteId, businessId) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId,
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          athleteId,
          businessId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Process payment with Stripe Elements
  processPayment: async (clientSecret, paymentMethod) => {
    try {
      const stripe = await stripePromise;
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Save payment record to database
  savePaymentRecord: async (paymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          deal_id: paymentData.dealId,
          athlete_id: paymentData.athleteId,
          business_id: paymentData.businessId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          stripe_payment_intent_id: paymentData.paymentIntentId,
          status: paymentData.status,
          payment_method: paymentData.paymentMethod,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error saving payment record:', error);
      throw error;
    }
  },

  // Get payment history for a user
  getPaymentHistory: async (userId, userType) => {
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          deals (ad_type, description),
          athletes (name, sport),
          businesses (company_name, industry)
        `);

      if (userType === 'athlete') {
        query = query.eq('athlete_id', userId);
      } else if (userType === 'business') {
        query = query.eq('business_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  },

  // Verify payment status with Stripe
  verifyPayment: async (paymentIntentId) => {
    try {
      const response = await fetch(`/api/verify-payment?payment_intent_id=${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.paymentIntent;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (paymentIntent, dealId) => {
    try {
      // Update deal status to 'completed'
      const { error: dealError } = await supabase
        .from('deals')
        .update({ 
          status: 'completed',
          payment_completed_at: new Date().toISOString()
        })
        .eq('id', dealId);

      if (dealError) {
        throw dealError;
      }

      // Save payment record
      const paymentRecord = await stripeService.savePaymentRecord({
        dealId,
        athleteId: paymentIntent.metadata.athlete_id,
        businessId: paymentIntent.metadata.business_id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method_types[0],
      });

      return paymentRecord;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStats: async (userId, userType) => {
    try {
      let query = supabase
        .from('payments')
        .select('amount, status, created_at');

      if (userType === 'athlete') {
        query = query.eq('athlete_id', userId);
      } else if (userType === 'business') {
        query = query.eq('business_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const stats = {
        totalEarnings: data
          .filter(p => p.status === 'succeeded')
          .reduce((sum, p) => sum + parseFloat(p.amount), 0),
        totalPayments: data.length,
        successfulPayments: data.filter(p => p.status === 'succeeded').length,
        pendingPayments: data.filter(p => p.status === 'processing').length,
      };

      return stats;
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  },

  // Smart Templates
  createSmartTemplate: async (templateData) => {
    const { data, error } = await supabase
      .from('smart_templates')
      .insert([templateData])
      .select();
    return { data, error };
  },

  getSmartTemplates: async (businessId) => {
    const { data, error } = await supabase
      .from('smart_templates')
      .select('*')
      .eq('business_id', businessId);
    return { data, error };
  },

  // Athlete Payment Methods
  saveAthletePaymentMethod: async (athleteId, paymentMethodId) => {
    try {
      const { data, error } = await supabase
        .from('athlete_payment_methods')
        .upsert([{
          athlete_id: athleteId,
          stripe_payment_method_id: paymentMethodId,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error saving athlete payment method:', error);
      throw error;
    }
  },

  getAthletePaymentMethod: async (athleteId) => {
    try {
      const { data, error } = await supabase
        .from('athlete_payment_methods')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting athlete payment method:', error);
      throw error;
    }
  }
}; 