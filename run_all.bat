@echo off
REM MakeMyDay Quick Starter
REM This batch file runs a simple startup without PowerShell issues

echo MakeMyDay Quick Starter
echo ========================

REM Check if npm is available
where npm >nul 2>nul
if errorlevel 1 (
    echo Error: npm not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Kill any existing processes on common ports
echo Cleaning up previous instances...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a 2>nul

echo Starting MakeMyDay applications...

REM Start Backend API (Fastify on port 3001)
start "[BACKEND] MakeMyDay API" cmd /k "cd /d "%~dp0" && echo Starting MakeMyDay Backend API... && echo Port: 3001 && echo ================= && npm run dev:api || (echo Failed to start backend && pause)"

timeout /t 3 /nobreak >nul

REM Start Frontend (Vite on port 5173)
start "[FRONTEND] MakeMyDay" cmd /k "cd /d "%~dp0" && echo Starting MakeMyDay Frontend... && echo Port: 5173 && echo ================= && npm run dev:web || (echo Failed to start frontend && pause)"

echo.
echo Startup completed!
echo Backend API: http://localhost:3001/api
echo Frontend:    http://localhost:5173
echo.
echo Two command windows should have opened:
echo   - Backend (Fastify API)
echo   - Frontend (React/Vite)
echo.
echo Press any key to exit this launcher...
pause >nul