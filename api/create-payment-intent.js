import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const isUuid = v =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

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
    const { amount, currency = 'usd', metadata = {} } = req.body;
    const dealId = metadata?.deal_id;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Validate deal_id is a UUID if provided
    if (dealId && !isUuid(dealId)) {
      return res.status(400).json({ error: `Invalid deal_id (must be UUID). Got: ${dealId}` });
    }

    // Convert amount to cents if it's a decimal
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create payment intent with validated metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        ...metadata,
        deal_id: dealId, // Pass through the validated deal_id
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`Payment intent created: ${paymentIntent.id} for $${amount} in ${process.env.NODE_ENV} mode`);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amountInCents,
      currency,
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Don't expose internal errors to client
    const errorMessage = error.type === 'StripeCardError' 
      ? error.message 
      : 'Payment initialization failed. Please try again.';
    
    res.status(500).json({ error: errorMessage });
  }
} 