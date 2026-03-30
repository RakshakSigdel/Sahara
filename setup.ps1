# Bhul Rakshak — Automated Setup Script (Windows / PowerShell)
# Run from the repo root: .\setup.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bhul Rakshak — Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ---------------------------------------------------------------------------
# 1. Backend
# ---------------------------------------------------------------------------
Write-Host "[1/4] Setting up Python backend..." -ForegroundColor Yellow

$ApiDir = Join-Path $Root "Dementia_API"
Set-Location $ApiDir

if (-not (Test-Path "myvenv")) {
    Write-Host "      Creating virtual environment..."
    python -m venv myvenv
} else {
    Write-Host "      Virtual environment already exists, skipping."
}

Write-Host "      Installing Python dependencies..."
& ".\myvenv\Scripts\pip.exe" install -r requirements.txt --quiet

# ---------------------------------------------------------------------------
# 2. Backend .env
# ---------------------------------------------------------------------------
Write-Host "[2/4] Configuring backend environment..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "  ACTION REQUIRED:" -ForegroundColor Red
    $key = Read-Host "  Enter your Google Gemini API key (or press Enter to skip)"
    if ($key -ne "") {
        (Get-Content ".env") -replace "API_KEY=.*", "API_KEY=$key" | Set-Content ".env"
        Write-Host "      API key saved to Dementia_API/.env" -ForegroundColor Green
    } else {
        Write-Host "      Skipped. Edit Dementia_API/.env manually before starting the server." -ForegroundColor DarkYellow
    }
} else {
    Write-Host "      .env already exists, skipping."
}

# ---------------------------------------------------------------------------
# 3. Frontend
# ---------------------------------------------------------------------------
Write-Host "[3/4] Setting up frontend..." -ForegroundColor Yellow

$WebDir = Join-Path $Root "web"
Set-Location $WebDir

Write-Host "      Installing npm packages..."
npm install --silent

# ---------------------------------------------------------------------------
# 4. Frontend .env.local
# ---------------------------------------------------------------------------
Write-Host "[4/4] Configuring frontend environment..." -ForegroundColor Yellow

if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "      Created web/.env.local from template." -ForegroundColor Green
    Write-Host "      Default API URL: http://localhost:8000"
    Write-Host "      Edit web/.env.local to change VITE_AI_API_BASE_URL if needed."
} else {
    Write-Host "      .env.local already exists, skipping."
}

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
Set-Location $Root

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the backend:" -ForegroundColor White
Write-Host "  cd Dementia_API" -ForegroundColor Gray
Write-Host "  .\myvenv\Scripts\activate" -ForegroundColor Gray
Write-Host "  python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "To start the frontend (new terminal):" -ForegroundColor White
Write-Host "  cd web" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Backend  -> http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Frontend -> http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
