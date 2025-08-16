import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      try {
        // Extract metadata from payment intent
        const { dealId, athleteId, businessId, originalAmount, serviceFee, athleteReceives } = paymentIntent.metadata;
        
        if (dealId && athleteId && businessId) {
          // Record the payment in database
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              deal_id: dealId,
              stripe_payment_intent_id: paymentIntent.id,
              amount: originalAmount / 100, // Convert from cents
              service_fee: serviceFee / 100, // Convert from cents
              athlete_receives: athleteReceives / 100, // Convert from cents
              business_pays: originalAmount / 100, // Convert from cents
              status: 'completed',
              payment_date: new Date().toISOString(),
            });

          if (paymentError) {
            console.error('Failed to record payment:', paymentError);
          } else {
            console.log('Payment recorded successfully with fee structure');
          }

          // Update deal status to completed
          const { error: dealError } = await supabase
            .from('deals')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', dealId);

          if (dealError) {
            console.error('Failed to update deal status:', dealError);
          } else {
            console.log('Deal status updated to completed');
          }
        }
      } catch (error) {
        console.error('Failed to process payment success:', error);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Handle failed payment
      try {
        // Example: Update payment status in your database
        // await updatePaymentStatus(failedPayment.id, 'failed');
        console.log('Failed payment recorded');
      } catch (error) {
        console.error('Failed to update database:', error);
      }
      break;
      
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('Payment method attached:', paymentMethod.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
} 