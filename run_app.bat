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
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul

echo Starting MakeMyDay applications...

REM Start Frontend with better error handling
start "[FRONTEND] MakeMyDay" cmd /k "cd /d "%~dp0" && echo Starting MakeMyDay Frontend... && npm run dev || (echo Failed to start frontend && pause)"

REM Start Backend placeholder
start "[BACKEND] MakeMyDay" cmd /k "cd /d "%~dp0" && echo MakeMyDay Backend && echo ================= && echo Backend not yet implemented && echo Ready for future backend integration... && echo. && echo Typical backend commands: && echo   - npm run dev (for Node.js/Express) && echo   - python app.py (for Flask/FastAPI) && echo   - dotnet run (for .NET Core) && echo. && pause"

echo.
echo Startup completed!
echo Frontend: http://localhost:5173
echo.
echo Two colored command windows should have opened:
echo   - Frontend (React/Vite)
echo   - Backend (placeholder)
echo.
echo Press any key to exit this launcher...
pause >nul