# Backend API Structure for NIL Payment System

## 🚀 **What I've Implemented (Frontend Ready):**

### ✅ **Complete Frontend Features:**
1. **Stripe Integration Ready** - All API calls structured
2. **Multiple Payment Methods** - Card, PayPal, Apple Pay
3. **Payment History Tracking** - Full UI with filtering/search
4. **Email Confirmation System** - Ready for backend integration
5. **Webhook Handling** - Structure in place
6. **Error Handling** - Comprehensive frontend validation

---

## 🔧 **What You Need to Implement (Backend):**

### **1. Stripe Integration**
```bash
# Install Stripe
npm install stripe

# Environment Variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **2. Required API Endpoints**

#### **Payment Processing:**
```javascript
// POST /api/create-payment-intent
{
  "amount": 500,
  "currency": "USD", 
  "description": "NIL Partnership Payment",
  "metadata": {
    "businessId": "business_101",
    "athleteId": "athlete_1",
    "offerId": "offer_123"
  }
}

// POST /api/process-payment
{
  "paymentIntentId": "pi_1234567890",
  "paymentMethod": {
    "type": "card",
    "card": { ... },
    "billing_details": { ... }
  }
}
```

#### **PayPal Integration:**
```javascript
// POST /api/paypal/create-order
// POST /api/paypal/capture-order
// POST /api/paypal/webhook
```

#### **Email Confirmations:**
```javascript
// POST /api/send-payment-confirmation
{
  "paymentId": "pi_1234567890",
  "email": "user@example.com",
  "paymentData": { ... }
}
```

#### **Payment History:**
```javascript
// GET /api/payment-history?userId=athlete_1
// POST /api/update-payment-history
// GET /api/payment-receipt/:paymentId
```

#### **Webhook Handling:**
```javascript
// POST /api/webhooks/stripe
// POST /api/webhooks/paypal
```

---

## 📧 **Email Templates Needed:**

### **Payment Confirmation Email:**
```html
Subject: Payment Confirmed - NIL Partnership

Hi [Athlete Name],

Your payment of $[Amount] to [Business Name] has been confirmed!

Partnership Details:
- Business: [Business Name]
- Description: [Campaign Description]
- Amount: $[Amount]
- Payment ID: [Payment ID]

Both parties will be notified to proceed with the collaboration.

Download your receipt: [Receipt Link]

Best regards,
NIL Matchup Team
```

### **Business Notification Email:**
```html
Subject: New NIL Partnership Payment Received

Hi [Business Name],

You've received a payment of $[Amount] from [Athlete Name] for your NIL offer!

Partnership Details:
- Athlete: [Athlete Name]
- Description: [Campaign Description]
- Amount: $[Amount]
- Payment ID: [Payment ID]

Please contact the athlete to coordinate the campaign.

Best regards,
NIL Matchup Team
```

---

## 🗄️ **Database Schema (Supabase):**

### **Payments Table:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id TEXT UNIQUE,
  paypal_order_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  business_id UUID REFERENCES businesses(id),
  athlete_id UUID REFERENCES athletes(id),
  offer_id UUID REFERENCES offers(id),
  description TEXT,
  receipt_url TEXT,
  failure_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

### **Payment History Table:**
```sql
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  user_id UUID,
  user_type TEXT, -- 'athlete' or 'business'
  action TEXT, -- 'created', 'completed', 'failed'
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 **Webhook Events to Handle:**

### **Stripe Webhooks:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `invoice.payment_succeeded`

### **PayPal Webhooks:**
- `PAYMENT.CAPTURE.COMPLETED`
- `PAYMENT.CAPTURE.DENIED`
- `PAYMENT.CAPTURE.REFUNDED`

---

## 📋 **Implementation Checklist:**

### **Phase 1: Basic Stripe Integration**
- [ ] Set up Stripe account and get API keys
- [ ] Install Stripe SDK
- [ ] Create `/api/create-payment-intent` endpoint
- [ ] Create `/api/process-payment` endpoint
- [ ] Test basic payment flow

### **Phase 2: PayPal Integration**
- [ ] Set up PayPal Business account
- [ ] Install PayPal SDK
- [ ] Create PayPal order endpoints
- [ ] Implement PayPal webhook handling

### **Phase 3: Email System**
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Create email templates
- [ ] Implement `/api/send-payment-confirmation`
- [ ] Test email delivery

### **Phase 4: Database & History**
- [ ] Create payments table in Supabase
- [ ] Create payment_history table
- [ ] Implement payment tracking
- [ ] Add receipt generation

### **Phase 5: Webhooks**
- [ ] Set up webhook endpoints
- [ ] Configure Stripe webhooks
- [ ] Configure PayPal webhooks
- [ ] Test webhook handling

### **Phase 6: Advanced Features**
- [ ] Apple Pay integration
- [ ] Payment retry logic
- [ ] Refund handling
- [ ] Analytics dashboard

---

## 🛠️ **Recommended Tech Stack:**

### **Backend:**
- **Node.js + Express** or **Next.js API Routes**
- **Stripe SDK** for payment processing
- **PayPal SDK** for PayPal integration
- **SendGrid** or **AWS SES** for emails
- **Supabase** for database

### **Environment Setup:**
```bash
# Install dependencies
npm install stripe @paypal/checkout-server-sdk nodemailer

# Set environment variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
SENDGRID_API_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

---

## 🎯 **Priority Order:**

1. **Stripe Integration** (Most Critical)
2. **Email Confirmations** (User Experience)
3. **Payment History** (Data Tracking)
4. **PayPal Integration** (Payment Options)
5. **Webhook Handling** (Reliability)
6. **Apple Pay** (Advanced Feature)

---

## 💡 **Quick Start Guide:**

1. **Get Stripe Account:** Sign up at stripe.com
2. **Get API Keys:** From Stripe Dashboard
3. **Install Dependencies:** `npm install stripe`
4. **Create First Endpoint:** `/api/create-payment-intent`
5. **Test Payment:** Use Stripe test cards
6. **Deploy & Test:** Go live with real payments

The frontend is **100% ready** - you just need to implement these backend endpoints! 🚀 