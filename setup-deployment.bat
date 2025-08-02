@echo off
echo ========================================
echo    NIL Matchup Deployment Setup
echo ========================================
echo.

echo This script will help you set up your deployment environment.
echo.

echo Step 1: Create .env file
if not exist .env (
    copy env.example .env
    echo Created .env file from template
) else (
    echo .env file already exists
)
echo.

echo Step 2: Required Services Setup
echo.
echo You need to set up the following services:
echo.
echo 1. Supabase (Database & Auth)
echo    - Go to https://supabase.com
echo    - Create new project
echo    - Get your URL and API keys
echo.
echo 2. Stripe (Payments)
echo    - Go to https://stripe.com
echo    - Create business account
echo    - Complete verification
echo    - Get API keys
echo.
echo 3. Domain (Optional)
echo    - Purchase domain (e.g., nilmatchup.com)
echo    - Configure DNS
echo.
echo 4. Email Service (Optional)
echo    - Set up Gmail SMTP or SendGrid
echo.
echo After setting up these services, edit the .env file
echo with your actual API keys and configuration.
echo.

echo Step 3: Deployment Options
echo.
echo Choose your deployment platform:
echo.
echo A) Vercel (Recommended - Easy setup)
echo    - Connect GitHub repository
echo    - Automatic deployments
echo    - Free tier available
echo.
echo B) Netlify (Alternative)
echo    - Similar to Vercel
echo    - Good free tier
echo.
echo C) AWS/GCP/Azure (Advanced)
echo    - More control
echo    - Requires more setup
echo.

echo ========================================
echo Setup complete! Next steps:
echo 1. Edit .env file with your API keys
echo 2. Choose deployment platform
echo 3. Follow platform-specific setup
echo 4. Deploy and test!
echo ========================================
echo.
pause 