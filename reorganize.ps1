# Script de Reorganisation du Projet AURA
# Separe Backend et Frontend dans une structure claire

Write-Host "Reorganisation du Projet AURA" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = "C:\Users\bakrt\cryptoshield-advisor"
Set-Location $rootPath

# ETAPE 1 : Creer les dossiers
Write-Host "Etape 1 : Creation des dossiers..." -ForegroundColor Yellow

$folders = @(
    # Backend
    "backend",
    "backend\config",
    "backend\models",
    "backend\routes",
    "backend\controllers",
    "backend\services",
    "backend\middleware",
    "backend\database\migrations",
    "backend\database\seeds",
    "backend\contracts",
    "backend\utils",
    "backend\tests",
    
    # Frontend
    "frontend",
    "frontend\public",
    "frontend\src\components",
    "frontend\src\pages",
    "frontend\src\services",
    "frontend\src\utils",
    "frontend\src\hooks",
    "frontend\src\assets",
    
    # Racine
    "docs",
    "scripts"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  Cree : $folder" -ForegroundColor Green
    } else {
        Write-Host "  Existe deja : $folder" -ForegroundColor Gray
    }
}

Write-Host ""

# ETAPE 2 : Deplacer les fichiers Backend
Write-Host "Etape 2 : Migration des fichiers Backend..." -ForegroundColor Yellow

# Serveur principal
if (Test-Path "server\server.js") {
    Copy-Item "server\server.js" "backend\server.js" -Force
    Write-Host "  server.js copie vers backend\" -ForegroundColor Green
}

# Services backend
$backendServices = @{
    "server\database.js" = "backend\config\database.js"
    "server\emailService.js" = "backend\services\emailService.js"
    "server\aiDecisionSupport.js" = "backend\services\aiService.js"
    "server\contractVerifier.js" = "backend\services\blockchainService.js"
    "server\riskAnalysis.js" = "backend\services\securityService.js"
}

foreach ($source in $backendServices.Keys) {
    if (Test-Path $source) {
        $dest = $backendServices[$source]
        Copy-Item $source $dest -Force
        Write-Host "  $source copie vers $dest" -ForegroundColor Green
    }
}

# Fichiers de configuration
if (Test-Path ".env") {
    Copy-Item ".env" "backend\.env" -Force
    Write-Host "  .env copie vers backend\.env" -ForegroundColor Green
}

# Base de donnees
if (Test-Path "database\aura_database.sql") {
    Copy-Item "database\aura_database.sql" "backend\database\seeds\aura_database.sql" -Force
    Write-Host "  Database SQL copie vers backend\database\seeds\" -ForegroundColor Green
}

Write-Host ""

# ETAPE 3 : Deplacer les fichiers Frontend
Write-Host "Etape 3 : Migration des fichiers Frontend..." -ForegroundColor Yellow

# Copier src complet
if (Test-Path "src") {
    Copy-Item "src\*" "frontend\src\" -Recurse -Force
    Write-Host "  src\ copie vers frontend\src\" -ForegroundColor Green
}

# Copier public complet
if (Test-Path "public") {
    Copy-Item "public\*" "frontend\public\" -Recurse -Force
    Write-Host "  public\ copie vers frontend\public\" -ForegroundColor Green
}

# Fichiers de configuration frontend
if (Test-Path ".env.local") {
    Copy-Item ".env.local" "frontend\.env.local" -Force
    Write-Host "  .env.local copie vers frontend\.env.local" -ForegroundColor Green
}

if (Test-Path "package.json") {
    Copy-Item "package.json" "frontend\package.json" -Force
    Write-Host "  package.json copie vers frontend\package.json" -ForegroundColor Green
}

Write-Host ""

# ETAPE 4 : Deplacer la Documentation
Write-Host "Etape 4 : Migration de la documentation..." -ForegroundColor Yellow

$mdFiles = Get-ChildItem -Path $rootPath -Filter "*.md" | Where-Object { $_.Name -ne "README.md" }

foreach ($file in $mdFiles) {
    Copy-Item $file.FullName "docs\$($file.Name)" -Force
    Write-Host "  $($file.Name) copie vers docs\" -ForegroundColor Green
}

Write-Host ""

# ETAPE 5 : Deplacer les Scripts
Write-Host "Etape 5 : Migration des scripts..." -ForegroundColor Yellow

$scriptFiles = @(
    "start-server.js",
    "test-apis.js",
    "test-login-2fa.js",
    "test-login-simple.js",
    "test-passwords.js",
    "test-blockchain.js",
    "test-email-config.js",
    "verify-login.js",
    "verify-passwords.js",
    "check-2fa-codes.js",
    "generate-hashes.js"
)

foreach ($script in $scriptFiles) {
    if (Test-Path $script) {
        Copy-Item $script "scripts\$script" -Force
        Write-Host "  $script copie vers scripts\" -ForegroundColor Green
    }
}

Write-Host ""

# ETAPE 6 : Creer les package.json
Write-Host "Etape 6 : Creation des package.json..." -ForegroundColor Yellow

# Backend package.json
$backendPackageJson = @'
{
  "name": "aura-backend",
  "version": "1.0.0",
  "description": "AURA Backend API - Node.js + Express + MySQL",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node tests/api.test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
'@

$backendPackageJson | Out-File -FilePath "backend\package.json" -Encoding UTF8
Write-Host "  backend\package.json cree" -ForegroundColor Green

Write-Host ""

# RESUMER
Write-Host "REORGANISATION TERMINEE !" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""
Write-Host "Structure creee :" -ForegroundColor Cyan
Write-Host "  backend/     - API Node.js + Express" -ForegroundColor Red
Write-Host "  frontend/    - Interface React" -ForegroundColor Blue
Write-Host "  docs/        - Documentation" -ForegroundColor Yellow
Write-Host "  scripts/     - Scripts utilitaires" -ForegroundColor Yellow
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "  1. cd backend ; npm install" -ForegroundColor White
Write-Host "  2. cd backend ; npm start" -ForegroundColor White
Write-Host "  3. cd frontend ; npm install" -ForegroundColor White
Write-Host "  4. cd frontend ; npm start" -ForegroundColor White
Write-Host ""
Write-Host "Les fichiers originaux sont conserves" -ForegroundColor Green
Write-Host "Tu peux les supprimer manuellement apres verification" -ForegroundColor Yellow
