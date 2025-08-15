import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
      
      // Update your database here
      // You can add logic to update payment status in Supabase
      try {
        // Example: Update payment status in your database
        // await updatePaymentStatus(paymentIntent.id, 'succeeded');
        console.log('Payment recorded successfully');
      } catch (error) {
        console.error('Failed to update database:', error);
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