@echo off
echo Starting Kuldevi Stationery...
echo.

echo Installing Backend dependencies...
cd backend && npm install
cd ..

echo Installing Frontend dependencies...
cd frontend && npm install
cd ..

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
