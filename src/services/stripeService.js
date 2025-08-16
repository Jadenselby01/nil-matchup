import { createClient } from '@supabase/supabase-js';

class StripeService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.baseUrl = this.isProduction ? '/api' : 'http://localhost:3000/api';
    
    // Initialize Supabase client
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(`Payment initialization failed: ${error.message}`);
    }
  }

  async verifyPayment(paymentIntentId) {
    try {
      const response = await fetch(`${this.baseUrl}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify payment');
      }

      const data = await response.json();
      return data.paymentIntent;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  async saveAthletePaymentMethod(athleteId, stripePaymentMethodId) {
    try {
      const { data, error } = await this.supabase
        .from('athlete_payment_methods')
        .upsert({
          athlete_id: athleteId,
          stripe_payment_method_id: stripePaymentMethodId,
          is_active: true,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving athlete payment method:', error);
      throw new Error(`Failed to save payment method: ${error.message}`);
    }
  }

  async getAthletePaymentMethod(athleteId) {
    try {
      const { data, error } = await this.supabase
        .from('athlete_payment_methods')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting athlete payment method:', error);
      return null;
    }
  }

  async handlePaymentSuccess(paymentIntent, dealId) {
    try {
      // Record successful payment in database
      const { data, error } = await this.supabase
        .from('payments')
        .insert({
          deal_id: dealId,
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          status: 'completed',
          // Note: payment_date will use the default value from database
          // If the column doesn't exist yet, this will still work
        });

      if (error) {
        console.error('Database error:', error);
        // If it's a column error, try without the problematic column
        if (error.message.includes('payment_date')) {
          const { data: fallbackData, error: fallbackError } = await this.supabase
            .from('payments')
            .insert({
              deal_id: dealId,
              stripe_payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              status: 'completed',
            });
          
          if (fallbackError) throw fallbackError;
          data = fallbackData;
        } else {
          throw error;
        }
      }

      // Update deal status to completed
      const { error: dealError } = await this.supabase
        .from('deals')
        .update({ status: 'completed' })
        .eq('id', dealId);

      if (dealError) {
        console.warn('Could not update deal status:', dealError);
        // Don't fail the payment if deal update fails
      }

      return data;
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw new Error(`Failed to record payment: ${error.message}`);
    }
  }

  // Production environment check
  checkProductionEnvironment() {
    if (this.isProduction) {
      console.log('🚀 Running in PRODUCTION mode');
      console.log('💰 Real payments will be processed');
    } else {
      console.log('🧪 Running in DEVELOPMENT mode');
      console.log('💳 Test payments only');
    }
    return this.isProduction;
  }

  // Get Stripe configuration status
  getStripeConfigStatus() {
    const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
    
    return {
      publishableKey: !!publishableKey,
      isProduction: publishableKey?.startsWith('pk_live_'),
      isConfigured: !!publishableKey,
    };
  }
}

const stripeService = new StripeService();
export default stripeService;
export { StripeService, stripeService };
