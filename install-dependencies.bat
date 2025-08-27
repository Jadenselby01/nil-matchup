@echo off
echo Installing NIL Matchup Dependencies...
echo.

echo Cleaning old dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo Installing fresh dependencies...
npm install

echo.
echo Dependencies installation complete!
echo.
echo Next steps:
echo 1. Run: npm start (to test locally)
echo 2. If successful, deploy to Vercel
echo 3. Apply database fix in Supabase
echo.
pause 