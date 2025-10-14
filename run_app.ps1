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
    
    # Check if package.json exists
    if (Test-Path "$ProjectDir\package.json") {
        Write-Host "Starting ParentFlow (Frontend + Backend API)..." -ForegroundColor Green
        Write-Host "  - Backend API: http://localhost:$BackendPort" -ForegroundColor Cyan
        Write-Host "  - Frontend:    http://localhost:$FrontendPort" -ForegroundColor Cyan
        
        # Start both frontend and backend with npm run dev (uses concurrently)
        Start-Process cmd -ArgumentList "/k", "cd /d `"$ProjectDir`" `&`& title [ParentFlow] Frontend + API `&`& npm run dev"
        
        Start-Sleep -Seconds 3
    } else {
        Write-Host "No package.json found - Cannot start application" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "Startup completed!" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:$FrontendPort" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:$BackendPort/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Services:" -ForegroundColor Yellow
    Write-Host "   API Health:  http://localhost:$BackendPort/health" -ForegroundColor Gray
    Write-Host "   API Version: http://localhost:$BackendPort/api/version" -ForegroundColor Gray
    Write-Host "   API Ingest:  http://localhost:$BackendPort/api/ingest" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Tips:" -ForegroundColor Yellow
    Write-Host "   - Both frontend and backend run in one window" -ForegroundColor Gray
    Write-Host "   - Use Ctrl+C in the window to stop both services" -ForegroundColor Gray
    Write-Host "   - Run .\run_app.ps1 -CleanOnly to cleanup without starting" -ForegroundColor Gray
    
} catch {
    Write-Host "Error during startup: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}