# PillPal Development Environment Setup
# Run this in PowerShell to set up Node.js access

$env:PATH = 'C:\node\node-v20.11.0-win-x64;' + $env:PATH
$env:NODE_PATH = 'C:\node\node-v20.11.0-win-x64'

Write-Host "✓ Node.js environment configured" -ForegroundColor Green
Write-Host "  Node: $(node --version)"
Write-Host "  npm:  $(npm --version)"
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  npm run dev          - Start dev server"
Write-Host "  npm run test         - Run tests in watch mode"
Write-Host "  npm run test:ui      - Open test UI in browser"
Write-Host "  npm run build        - Build for production"
Write-Host "  npm run deploy:check - Full validation before deploy"
