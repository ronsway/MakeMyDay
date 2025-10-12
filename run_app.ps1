# ParentFlow (MakeMyDay) Application Startup Script
# Hebrew language parent communication system
# 
# Authors: Ron Lederer (Lead Developer), Dana Tchetchik (Product Manager)
# Repository: https://github.com/ronsway/MakeMyDay.git
#
# Option 1: Clean window titles instead of background colors

param(
    [switch]$CleanOnly
)

# Configuration
$AppName = "MakeMyDay"
$ProjectDir = $PSScriptRoot
$FrontendPort = 5173
$BackendPort = 3001

Write-Host "MakeMyDay Application Startup" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Function to kill processes by port
function Stop-ProcessByPort {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Select-Object -ExpandProperty OwningProcess -Unique
        
        if ($processes) {
            foreach ($processId in $processes) {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "Stopping process '$($process.Name)' (PID: $processId) on port $Port" -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Milliseconds 500
                }
            }
        }
    }
    catch {
        Write-Host "No processes found on port $Port" -ForegroundColor Gray
    }
}

# Function to kill Node.js processes
function Stop-NodeProcesses {
    Write-Host "Cleaning up Node.js processes..." -ForegroundColor Yellow
    
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        foreach ($proc in $nodeProcesses) {
            $commandLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($proc.Id)" -ErrorAction SilentlyContinue).CommandLine
            if ($commandLine -and ($commandLine -like "*vite*" -or $commandLine -like "*makemyday*")) {
                Write-Host "Stopping Node.js process (PID: $($proc.Id))" -ForegroundColor Yellow
                Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Cleanup function
function Start-Cleanup {
    Write-Host "Cleaning up previous instances..." -ForegroundColor Yellow
    
    Stop-ProcessByPort -Port $FrontendPort
    Stop-ProcessByPort -Port $BackendPort
    Stop-NodeProcesses
    
    Write-Host "Cleanup completed" -ForegroundColor Green
    Start-Sleep -Seconds 1
}

# Main execution
try {
    # Always perform cleanup
    Start-Cleanup
    
    if ($CleanOnly) {
        Write-Host "Cleanup only mode - Exiting" -ForegroundColor Cyan
        exit 0
    }
    
    # Verify project structure
    if (-not (Test-Path $ProjectDir)) {
        Write-Host "Project directory not found: $ProjectDir" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Starting $AppName applications..." -ForegroundColor Cyan
    
    # Check if package.json exists (frontend)
    if (Test-Path "$ProjectDir\package.json") {
        Write-Host "Frontend detected - Starting React/Vite development server" -ForegroundColor Green
        
        # Start Frontend with clean title - NO background colors
        Write-Host "Starting frontend..." -ForegroundColor Cyan
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir`" `&`& title [FRONTEND] MakeMyDay `&`& echo Starting MakeMyDay Frontend... `&`& npm run dev"
        
        Start-Sleep -Seconds 2
    } else {
        Write-Host "No package.json found - Frontend not available" -ForegroundColor Yellow
    }
    
    # Check for backend
    $backendExists = $false
    
    if (Test-Path "$ProjectDir\backend\package.json") {
        $backendExists = $true
        Write-Host "Backend detected in /backend folder" -ForegroundColor Green
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir\backend`" `&`& title [BACKEND] MakeMyDay `&`& npm run dev"
    } elseif (Test-Path "$ProjectDir\server.js") {
        $backendExists = $true
        Write-Host "Backend detected - server.js" -ForegroundColor Green
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir`" `&`& title [BACKEND] MakeMyDay `&`& node server.js"
    } elseif (Test-Path "$ProjectDir\app.js") {
        $backendExists = $true
        Write-Host "Backend detected - app.js" -ForegroundColor Green
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir`" `&`& title [BACKEND] MakeMyDay `&`& node app.js"
    } else {
        Write-Host "No backend detected - Frontend only mode" -ForegroundColor Cyan
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir`" `&`& title [BACKEND] MakeMyDay `&`& echo MakeMyDay Backend `&`& echo ================= `&`& echo Backend not yet implemented `&`& echo Ready for future backend integration... `&`& echo. `&`& echo Typical backend commands: `&`& echo   - npm run dev (for Node.js/Express) `&`& echo   - python app.py (for Flask/FastAPI) `&`& echo   - dotnet run (for .NET Core) `&`& echo. `&`& pause"
    }
    
    Write-Host ""
    Write-Host "Startup completed!" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Cyan
    
    if (Test-Path "$ProjectDir\package.json") {
        Write-Host "Frontend: http://localhost:$FrontendPort" -ForegroundColor Cyan
    }
    
    if ($backendExists) {
        Write-Host "Backend:  http://localhost:$BackendPort" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Write-Host "Tips:" -ForegroundColor Yellow
    Write-Host "   - Look for windows with clear prefixes: [FRONTEND] and [BACKEND]" -ForegroundColor Gray
    Write-Host "   - Use Ctrl+C in each window to stop services" -ForegroundColor Gray
    Write-Host "   - Run .\run_app.ps1 -CleanOnly to cleanup without starting" -ForegroundColor Gray
    
} catch {
    Write-Host "Error during startup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}