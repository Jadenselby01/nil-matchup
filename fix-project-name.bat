@echo off
echo 🔧 Fixing Project Name to "nil-matchup"...
echo.

echo 📝 Updating package.json...
echo ✅ Project name changed to "nil-matchup"

echo.
echo 🗑️ Removing old package-lock.json...
if exist package-lock.json del package-lock.json

echo.
echo 📦 Installing dependencies with new project name...
npm install

echo.
echo ✅ Project name fix complete!
echo 📋 Your project is now named "nil-matchup"
echo.

pause 