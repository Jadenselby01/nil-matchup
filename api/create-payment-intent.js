import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dealId, amount, currency = 'usd', athleteId, businessId } = req.body;

    if (!dealId || !amount) {
      return res.status(400).json({ error: 'Missing required fields: dealId and amount are required' });
    }

    if (!athleteId || !businessId) {
      return res.status(400).json({ error: 'Missing required fields: athleteId and businessId are required' });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Create payment intent with proper metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        dealId,
        athleteId,
        businessId,
        integration_check: 'accept_a_payment',
        source: 'nil-matchup-app'
      },
      description: `NIL Deal Payment - Deal ID: ${dealId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Provide more specific error messages
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Card error: ' + error.message });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid request: ' + error.message });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ error: 'Stripe API error: ' + error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
} 