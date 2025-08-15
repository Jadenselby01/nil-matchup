# 🚀 Stripe Production Setup Guide

## 📋 **Prerequisites**
- ✅ Stripe account (already have)
- ✅ Vercel deployment (already have)
- ✅ Supabase database (already have)
- ✅ GitHub repository (already have)

---

## 🔑 **Step 1: Switch from Test Keys to Production Keys**

### **1.1 Get Production Keys from Stripe Dashboard**
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Toggle to "Live" mode** (top right corner)
3. Go to **Developers → API keys**
4. Copy your **Live Publishable Key** and **Live Secret Key**

### **1.2 Update Vercel Environment Variables**
1. Go to [vercel.com](https://vercel.com)
2. Select your **nil-matchup-deploy** project
3. Go to **Settings → Environment Variables**
4. **Update these variables:**

```
STRIPE_SECRET_KEY = sk_live_... (your live secret key)
REACT_APP_STRIPE_PUBLISHABLE_KEY = pk_live_... (your live publishable key)
```

5. **Redeploy** your project after updating variables

---

## 🔗 **Step 2: Set Up Stripe Webhooks**

### **2.1 Create Webhook Endpoint**
1. In Stripe Dashboard (Live mode), go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://your-vercel-domain.vercel.app/api/webhook`
4. **Events to send:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_method.attached`

### **2.2 Create Webhook API Endpoint**
Create this file in your project:

```javascript
// api/webhook.js
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
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
```

### **2.3 Get Webhook Secret**
1. After creating webhook, click on it in Stripe Dashboard
2. Copy the **Signing secret**
3. Add to Vercel: `STRIPE_WEBHOOK_SECRET = whsec_...`

---

## 🧪 **Step 3: Test Real Payment Flow**

### **3.1 Test with Small Amounts**
1. **Use real cards** (your own cards)
2. **Start with $1-5** transactions
3. **Test both user types:**
   - Business sending payment
   - Athlete receiving payment

### **3.2 Test Scenarios**
- ✅ **Successful payment**
- ✅ **Failed payment** (use test card: 4000 0000 0000 0002)
- ✅ **Payment method save** (athlete side)
- ✅ **Payment confirmation**

---

## 🗄️ **Step 4: Verify Payment Records**

### **4.1 Check Stripe Dashboard**
1. Go to **Payments** section
2. Verify transactions appear
3. Check **Customer** and **Payment Method** sections

### **4.2 Check Your Database**
1. Go to Supabase Dashboard
2. Check `payments` table
3. Verify `athlete_payment_methods` table
4. Ensure data is being recorded correctly

---

## 🔒 **Step 5: Security & Compliance**

### **5.1 Enable Security Features**
- ✅ **3D Secure** (already enabled)
- ✅ **Fraud detection** (Stripe Radar)
- ✅ **PCI compliance** (automatic with Stripe)

### **5.2 Monitor & Alerts**
- Set up **email notifications** for failed payments
- Monitor **fraud alerts** in Stripe Dashboard
- Check **webhook delivery** status

---

## 🚨 **Important Notes**

### **⚠️ Production vs Test**
- **NEVER** use test keys in production
- **NEVER** commit production keys to GitHub
- **ALWAYS** use environment variables

### **💰 Real Money**
- **Real payments** will charge real money
- **Test thoroughly** before going live
- **Monitor transactions** closely

---

## 📞 **Support Resources**

- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **Stripe Documentation:** [stripe.com/docs](https://stripe.com/docs)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

## ✅ **Checklist**

- [ ] Switch to Stripe Live mode
- [ ] Update Vercel environment variables
- [ ] Create webhook endpoint
- [ ] Test payment flow
- [ ] Verify database records
- [ ] Monitor for issues
- [ ] Set up alerts

**Ready to go live with real payments!** 🎉 