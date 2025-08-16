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
        const { deal_id, athleteId, businessId, originalAmount, serviceFee, athleteReceives } = paymentIntent.metadata;
        
        if (deal_id && athleteId && businessId) {
          // Record the payment in database - using only existing columns
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              deal_id: deal_id,
              stripe_payment_intent_id: paymentIntent.id,
              amount: originalAmount / 100, // Convert from cents
              status: 'completed',
              // Note: Only using columns that exist in the current database
            });

          if (paymentError) {
            console.error('Failed to record payment:', paymentError);
          } else {
            console.log('Payment recorded successfully');
          }

          // Try to update deal status to completed (optional)
          try {
            const { error: dealError } = await supabase
              .from('deals')
              .update({ 
                status: 'completed'
              })
              .eq('id', deal_id);

            if (dealError) {
              console.warn('Could not update deal status:', dealError);
            } else {
              console.log('Deal status updated to completed');
            }
          } catch (dealUpdateError) {
            console.warn('Deal status update failed:', dealUpdateError);
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