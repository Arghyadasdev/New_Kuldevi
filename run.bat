@echo off
echo Starting Kuldevi Stationery...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "npm run server"

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause