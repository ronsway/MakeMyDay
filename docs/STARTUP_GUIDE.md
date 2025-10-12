# 🚀 Application Startup Guide

## Quick Start

The easiest way to run MakeMyDay is using the smart startup script that handles cleanup and launches the application with colored, positioned PowerShell windows.

### Option 1: Double-click to run (Recommended)

```batch
run_app.bat
```

### Option 2: Using PowerShell directly

```powershell
.\run_app.ps1
```

### Option 3: Using npm

```bash
npm start
```

## Startup Script Features

### 🧹 Smart Cleanup

- **Automatic process cleanup** - Kills any leftover processes from previous runs
- **Port conflict resolution** - Frees up ports 5173 (frontend) and 3000 (backend)
- **Node.js process management** - Safely terminates Vite and Node processes

### 🎨 Visual Organization

- **Color-coded windows**:
  - 🔵 **Frontend (Blue)** - React/Vite development server
  - 🟢 **Backend (Green)** - Ready for backend integration
- **Side-by-side positioning** - Windows automatically positioned for easy monitoring
- **Clear titles** - Each window shows its purpose

### 🔧 Smart Detection

- **Frontend detection** - Automatically detects React/Vite setup
- **Backend detection** - Ready for future backend integration
- **Service health checks** - Waits for services to be ready
- **Error handling** - Clear error messages and recovery options

## Script Options

### Basic Usage

```powershell
# Start both frontend and backend (if available)
.\run_app.ps1

# Cleanup only (no startup)
.\run_app.ps1 -CleanOnly

# Skip window positioning
.\run_app.ps1 -NoPosition
```

### NPM Scripts

```bash
# Start the application
npm start

# Cleanup only
npm run start:clean
```

## Supported Configurations

### Current Setup

- ✅ **React + Vite Frontend** (Port 5173)
- 🔧 **Backend Ready** (Port 3000) - Will auto-detect when added

### Future Backend Support

The script automatically detects these backend configurations:

- **Node.js/Express** - `backend/package.json` or `server.js`
- **Python Flask/FastAPI** - `app.py` or `main.py`
- **.NET Core** - `.csproj` files
- **Custom backends** - Easy to configure

## Window Layout

```text
┌─────────────────────┬─────────────────────┐
│  Frontend (Blue)    │  Backend (Green)    │
│  React/Vite Dev     │  API Server         │
│  Port: 5173         │  Port: 3000         │
│                     │                     │
│  npm run dev        │  npm run dev        │
│                     │  (or backend cmd)   │
└─────────────────────┴─────────────────────┘
```

## Troubleshooting

### Port Already in Use

The script automatically handles port conflicts by:

1. Detecting processes using ports 5173 and 3000
2. Safely terminating conflicting processes
3. Waiting for ports to be free before starting

### PowerShell Execution Policy

If you get an execution policy error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Windows Not Positioning

Use the `-NoPosition` flag if window positioning doesn't work:

```powershell
.\run_app.ps1 -NoPosition
```

### Script Permissions

If you can't run the script:

1. Right-click `run_app.ps1` → Properties
2. Check "Unblock" if available
3. Or run: `Unblock-File .\run_app.ps1`

## Manual Startup (Alternative)

If you prefer manual startup:

### Frontend Only

```bash
npm run dev
# Opens at http://localhost:5173
```

### With Future Backend

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (when available)
cd backend
npm run dev
```

## URLs After Startup

- 🌐 **Frontend**: <http://localhost:5173>
- 🔧 **Backend**: <http://localhost:3000> (when implemented)
- 📱 **Network Access**: Available on your local IP (shown in terminal)

## Tips

- **Ctrl+C** in each window to stop services gracefully
- **Alt+Tab** to switch between frontend and backend windows
- **Check the colored titles** to identify which window is which
- **Use the cleanup script** if you encounter startup issues

---

*The startup script is designed to grow with your project - it will automatically detect and integrate backend services as you add them!* 🚀
