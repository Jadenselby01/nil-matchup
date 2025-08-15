import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not configured');
    return res.status(500).json({ 
      error: 'Payment system not configured. Please contact support.' 
    });
  }

  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log(`Payment intent verified: ${paymentIntent.id} - Status: ${paymentIntent.status}`);

    res.status(200).json({
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata,
      },
      success: true,
    });

  } catch (error) {
    console.error('Error verifying payment intent:', error);
    
    // Don't expose internal errors to client
    const errorMessage = error.type === 'StripeInvalidRequestError' 
      ? 'Invalid payment ID' 
      : 'Payment verification failed. Please try again.';
    
    res.status(500).json({ error: errorMessage });
  }
} 