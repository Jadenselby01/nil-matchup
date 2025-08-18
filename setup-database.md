# 🗄️ Database Setup Guide for NIL Matchup

## **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `nil-matchup`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., US East)
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

## **Step 2: Get Your API Keys**

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

## **Step 3: Update Environment Variables**

1. In your project root, create/update `.env` file:
```env
REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## **Step 4: Run Database Scripts**

1. In Supabase dashboard, go to **SQL Editor**
2. Run the `create-user-profiles-table.sql` script first
3. Then run the `create-deals-table.sql` script
4. Verify tables are created in **Table Editor**

## **Step 5: Test Authentication**

1. Start your development server: `npm start`
2. Visit your website
3. Try to create an account
4. Check if user appears in Supabase **Authentication** → **Users**
5. Check if profile appears in **Table Editor** → **user_profiles**

## **Step 6: Test Deal Creation**

1. Login as a business user
2. Try to create a deal
3. Check if deal appears in **Table Editor** → **deals**

---

## **🚨 Common Issues & Solutions**

### **Issue: "Supabase not configured" error**
- **Solution**: Check your `.env` file has correct values
- **Solution**: Restart your development server after updating `.env`

### **Issue: "Table doesn't exist" error**
- **Solution**: Make sure you ran the SQL scripts in Supabase SQL Editor
- **Solution**: Check **Table Editor** to verify tables exist

### **Issue: Authentication not working**
- **Solution**: Verify your Supabase URL and anon key are correct
- **Solution**: Check **Authentication** → **Settings** → **Enable email confirmations** is OFF for testing

---

## **✅ Success Checklist**

- [ ] Supabase project created
- [ ] API keys copied to `.env`
- [ ] User profiles table created
- [ ] Deals table created
- [ ] User registration works
- [ ] User login works
- [ ] Deal creation works
- [ ] Data appears in Supabase tables

---

## **🎯 Next Steps After Database Setup**

1. **Test complete user flow**
2. **Set up Stripe for payments**
3. **Deploy to Vercel**
4. **Get real users testing**
5. **Iterate based on feedback** 