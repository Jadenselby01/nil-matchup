# 🔧 Vercel Environment Variables Fix

## Problem
Your Vercel deployment is using a different Supabase URL than your local environment:
- **Local Supabase URL**: `https://tcsaszpbbqnvwvbwlwcr.supabase.co`
- **Vercel Supabase URL**: `https://tmireksoykxlnvnbvkfy.supabase.co`

## Solution: Update Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Sign in to your account
3. Select your project: `nil-matchup-deploy`

### Step 2: Update Environment Variables
1. Click **"Settings"** tab
2. Click **"Environment Variables"** in the left sidebar
3. Update these variables:

| Variable Name | Value |
|---------------|-------|
| `REACT_APP_SUPABASE_URL` | `https://tcsaszpbbqnvwvbwlwcr.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjc2FzenBiYnFudnd2Yndsd2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NTQ2MjUsImV4cCI6MjA3MTAzMDYyNX0.ymDaTFGZyJYRJm9BMQWm5LbrdNppHr-sa-f3SFelVFM` |

### Step 3: Redeploy
1. After updating environment variables, click **"Redeploy"**
2. Wait for the build to complete
3. Test your app at `nil-matchup-deploy.vercel.app`

## Alternative: Use the Vercel Supabase URL

If you prefer to use the Supabase project that Vercel is currently pointing to:

1. **Go to Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Find the project**: `tmireksoykxlnvnbvkfy`
3. **Get the anon key** from Settings → API
4. **Update your local .env file** to match

## Recommended Approach
Use your original Supabase project (`tcsaszpbbqnvwvbwlwcr`) since it likely has your existing data and configurations.

## After Fixing Environment Variables
Run the `complete-database-fix.sql` script in your Supabase SQL Editor to fix the database schema issues. 