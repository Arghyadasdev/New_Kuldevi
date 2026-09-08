@echo off
echo Starting Kuldevi Stationery...
echo.

echo Installing dependencies...
cd frontend && npm install
cd ..

echo Starting Next.js (frontend + API)...
start "Kuldevi Stationery" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Server is starting!
echo App: http://localhost:3000
echo.
pause
