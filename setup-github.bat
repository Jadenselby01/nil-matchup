@echo off
echo 🚀 Setting up GitHub connection for NIL App...
echo.

echo 📝 Please follow these steps:
echo 1. Go to GitHub.com and create a new repository named "nil-matchup-app"
echo 2. Make it PRIVATE (recommended for business apps)
echo    - This protects your source code from competitors
echo    - Your website will still be public and accessible to users
echo    - Only you and collaborators can see the code
echo 3. Don't initialize with README
echo 4. Copy the repository URL
echo.

echo 💡 Why Private Repository?
echo - Protects your business model and unique features
echo - Keeps API keys and business logic secure
echo - Your website remains public and accessible to all users
echo - Professional approach for business applications
echo.

set /p GITHUB_URL="Enter your GitHub repository URL (e.g., https://github.com/username/nil-matchup-app.git): "

echo.
echo 🔗 Connecting to GitHub...
git remote add origin %GITHUB_URL%
git branch -M main
git push -u origin main

echo.
echo ✅ GitHub setup complete!
echo.
echo 🌐 Your website will be public and accessible to all users
echo 🔒 Your source code is protected and private
echo.
echo 📋 Next steps:
echo 1. Set up Supabase database
echo 2. Configure Stripe payments
echo 3. Deploy to Vercel
echo 4. Set up custom domain
echo.
echo 📖 See DEPLOYMENT_STEPS.md for detailed instructions
pause 