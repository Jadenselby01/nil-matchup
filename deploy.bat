@echo off
echo 🚀 Starting NIL Matchup Deployment...
echo.

echo 📦 Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors first.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.

echo 🌐 Deploying to Vercel...
echo.
echo 📋 Instructions:
echo 1. A browser window will open to Vercel
echo 2. Sign in with your GitHub account
echo 3. Click "New Project"
echo 4. Choose "Import Git Repository"
echo 5. Select your repository (or create new one)
echo 6. Project name: nil-matchup
echo 7. Click "Deploy"
echo.

echo 🔗 Opening Vercel...
start https://vercel.com/new

echo.
echo 📝 Next Steps:
echo 1. Create a GitHub repository named "nil-matchup"
echo 2. Push your code to GitHub
echo 3. Connect Vercel to your GitHub repository
echo 4. Your app will be live at: https://nil-matchup.vercel.app
echo.

pause 