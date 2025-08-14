# Environment Variables Setup for Vercel Deployment

## 🚨 **CRITICAL: You must set these environment variables in Vercel before deploying!**

Your app failed to deploy because these environment variables are missing.

---

## 🔑 **Required Environment Variables:**

### **1. Stripe Keys (Required for Payments)**
```
Name: STRIPE_SECRET_KEY
Value: sk_test_... (from your Stripe Dashboard)
Environment: Production ✅

Name: REACT_APP_STRIPE_PUBLISHABLE_KEY  
Value: pk_test_... (from your Stripe Dashboard)
Environment: Production ✅
```

### **2. Supabase Keys (Required for Database)**
```
Name: REACT_APP_SUPABASE_URL
Value: https://your-project.supabase.co
Environment: Production ✅

Name: REACT_APP_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production ✅
```

---

## 📋 **How to Set Environment Variables in Vercel:**

1. **Go to [vercel.com](https://vercel.com)**
2. **Click on your `nil-matchup-deploy` project**
3. **Go to Settings → Environment Variables**
4. **Add each variable above**
5. **Make sure "Production" is checked ✅**
6. **Click "Save"**

---

## 🧪 **Test Your Setup:**

1. **Set the environment variables**
2. **Redeploy your project**
3. **Test the payment system**

---

## ❌ **What Happens Without These Variables:**

- **App won't deploy** (current issue)
- **Payment system won't work**
- **Database won't connect**
- **Users can't register/login**

---

## ✅ **After Setting Variables:**

Your app will deploy successfully and all features will work! 