# 🚀 **COMPLETE DEPLOYMENT GUIDE FOR NIL APP**

## **Step 1: Create GitHub Repository**

1. **Go to GitHub.com** and sign in
2. **Click "New repository"**
3. **Repository name**: `nil-matchup-app`
4. **Description**: `NIL (Name, Image, Likeness) platform connecting athletes and businesses`
5. **Make it Private** (recommended for business apps)
6. **Don't initialize** with README (we already have files)
7. **Click "Create repository"**

## **Step 2: Connect Your Local Repo to GitHub**

Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/nil-matchup-app.git
git branch -M main
git push -u origin main
```

## **Step 3: Set Up Supabase Database**

1. **Go to supabase.com** and sign in
2. **Create a new project**:
   - Name: `nil-matchup-db`
   - Database Password: Create a strong password
   - Region: Choose closest to your users

3. **Get your credentials**:
   - Go to Settings → API
   - Copy your **Project URL** and **anon public key**

4. **Create database tables** (run in SQL Editor):

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('athlete', 'business')),
  profile_completed BOOLEAN DEFAULT FALSE,
  legal_documents_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID REFERENCES public.profiles(id),
  business_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id),
  sender_id UUID REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal documents table
CREATE TABLE public.legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  document_type TEXT NOT NULL,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
```

## **Step 4: Set Up Stripe Account**

1. **Go to stripe.com** and sign in
2. **Complete your business profile**:
   - Business name: "NIL Matchup LLC"
   - Business type: "Corporation" or "LLC"
   - Industry: "Technology"
   - Website: Your domain (we'll set this up)

3. **Get your API keys**:
   - Go to Developers → API keys
   - Copy your **Publishable key** and **Secret key**
   - **Keep these secure!**

4. **Set up webhooks**:
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## **Step 5: Deploy to Vercel**

1. **Go to vercel.com** and sign in with GitHub
2. **Click "New Project"**
3. **Import your GitHub repository** (`nil-matchup-app`)
4. **Configure project**:
   - Framework Preset: `Create React App`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `build`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add these variables:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
REACT_APP_ENCRYPTION_KEY=your-32-character-encryption-key
REACT_APP_JWT_SECRET=your-jwt-secret
REACT_APP_SESSION_SECRET=your-session-secret
```

6. **Deploy** - Click "Deploy"

## **Step 6: Set Up Custom Domain**

1. **Purchase a domain** (GoDaddy, Namecheap, etc.)
   - Suggested: `nilmatchup.com` or `nilmatchup.app`

2. **Connect to Vercel**:
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

## **Step 7: Test Everything**

1. **Test user registration/login**
2. **Test payment flow** (use Stripe test cards)
3. **Test file uploads**
4. **Test messaging system**

## **Step 8: Business Setup (URGENT)**

1. **Register LLC** in your state ($100-500)
2. **Get EIN** from IRS (free)
3. **Business bank account**
4. **Business insurance** (general liability + cyber)

## **Environment Variables Template**

Create a `.env.local` file in your project root:

```env
# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
REACT_APP_STRIPE_SECRET_KEY=sk_test_your-key

# Security
REACT_APP_ENCRYPTION_KEY=your-32-character-encryption-key
REACT_APP_JWT_SECRET=your-jwt-secret
REACT_APP_SESSION_SECRET=your-session-secret

# App Settings
REACT_APP_NAME=NIL Matchup
REACT_APP_URL=https://yourdomain.com
```

## **Next Steps After Deployment**

1. **Test all features thoroughly**
2. **Set up monitoring and analytics**
3. **Launch marketing campaign**
4. **Get first users and feedback**
5. **Iterate and improve**

## **Support & Resources**

- **GitHub Issues**: For technical problems
- **Stripe Support**: For payment issues
- **Supabase Support**: For database issues
- **Vercel Support**: For deployment issues

---

**Your NIL app is now ready for real users and payments! 🎉** 