# Clear VS Code Cache Script
# Run this when VS Code shows phantom errors or stale file content

Write-Host "🧹 Clearing VS Code Cache..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# 1. Clear VS Code general cache
Write-Host "📦 Clearing VS Code Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:APPDATA\Code\Cache\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\CachedData\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$env:APPDATA\Code\CachedExtensions\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ VS Code Cache cleared" -ForegroundColor Green

# 2. Clear workspace storage (file snapshots)
Write-Host "📦 Clearing Workspace Storage..." -ForegroundColor Yellow
Remove-Item -Path "$env:APPDATA\Code\User\workspaceStorage\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Workspace Storage cleared" -ForegroundColor Green

# 3. Clear TypeScript server cache
Write-Host "📦 Clearing TypeScript Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:LOCALAPPDATA\Temp\vscode-typescript\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ TypeScript Cache cleared" -ForegroundColor Green

# 4. Clear PowerShell extension cache
Write-Host "📦 Clearing PowerShell Extension Cache..." -ForegroundColor Yellow
Remove-Item -Path "$env:USERPROFILE\.vscode\extensions\ms-vscode.powershell-*\*cache*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ PowerShell Extension Cache cleared" -ForegroundColor Green

# 5. Clear .vscode workspace folder
Write-Host "📦 Clearing Workspace Settings Cache..." -ForegroundColor Yellow
$workspaceFolder = Join-Path $PSScriptRoot ".vscode"
if (Test-Path $workspaceFolder) {
    $cacheFiles = Get-ChildItem -Path $workspaceFolder -Filter "*.cache" -Recurse -ErrorAction SilentlyContinue
    foreach ($file in $cacheFiles) {
        Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Workspace Settings Cache cleared" -ForegroundColor Green
} else {
    Write-Host "✅ No workspace cache found" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Cache clearing complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Close ALL VS Code windows" -ForegroundColor Gray
Write-Host "2. Wait 5 seconds" -ForegroundColor Gray
Write-Host "3. Reopen VS Code" -ForegroundColor Gray
Write-Host "4. Let extensions reload" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
