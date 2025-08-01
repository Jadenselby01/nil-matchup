@echo off
echo 🐙 Setting up GitHub Repository for NIL Matchup...
echo.

echo 📁 Initializing Git repository...
git init

echo.
echo 📝 Adding all files to Git...
git add .

echo.
echo 💾 Creating initial commit...
git commit -m "Initial commit: NIL Matchup app"

echo.
echo 🔗 Setting up GitHub remote...
echo.
echo 📋 Instructions:
echo 1. Go to https://github.com/new
echo 2. Repository name: nil-matchup
echo 3. Make it Public
echo 4. Don't initialize with README (we already have files)
echo 5. Click "Create repository"
echo 6. Copy the repository URL (https://github.com/YOUR_USERNAME/nil-matchup.git)
echo 7. Come back here and press any key
echo.

pause

echo.
echo 🔗 Adding remote origin...
git remote add origin https://github.com/jadenselby01/nil-matchup.git

echo.
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ GitHub setup complete!
echo 🌐 Your repository: https://github.com/jadenselby01/nil-matchup
echo.

pause 