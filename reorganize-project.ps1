# 🏗️ Script de Réorganisation du Projet AURA
# Sépare Backend et Frontend dans une structure claire

Write-Host "🚀 Réorganisation du Projet AURA" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$rootPath = "C:\Users\bakrt\cryptoshield-advisor"
Set-Location $rootPath

# ============================================
# ÉTAPE 1 : Créer les dossiers
# ============================================
Write-Host "📁 Étape 1 : Création des dossiers..." -ForegroundColor Yellow

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
        Write-Host "  ✅ Créé : $folder" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Existe déjà : $folder" -ForegroundColor Gray
    }
}

Write-Host ""

# ============================================
# ÉTAPE 2 : Déplacer les fichiers Backend
# ============================================
Write-Host "🔴 Étape 2 : Migration des fichiers Backend..." -ForegroundColor Yellow

# Serveur principal
if (Test-Path "server\server.js") {
    Copy-Item "server\server.js" "backend\server.js" -Force
    Write-Host "  ✅ server.js → backend\" -ForegroundColor Green
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
        Write-Host "  ✅ $source → $dest" -ForegroundColor Green
    }
}

# Fichiers de configuration
if (Test-Path ".env") {
    Copy-Item ".env" "backend\.env" -Force
    Write-Host "  ✅ .env → backend\.env" -ForegroundColor Green
}

# Base de données
if (Test-Path "database\aura_database.sql") {
    Copy-Item "database\aura_database.sql" "backend\database\seeds\aura_database.sql" -Force
    Write-Host "  ✅ Database SQL → backend\database\seeds\" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ÉTAPE 3 : Déplacer les fichiers Frontend
# ============================================
Write-Host "🔵 Étape 3 : Migration des fichiers Frontend..." -ForegroundColor Yellow

# Copier src complet
if (Test-Path "src") {
    Copy-Item "src\*" "frontend\src\" -Recurse -Force
    Write-Host "  ✅ src\ → frontend\src\" -ForegroundColor Green
}

# Copier public complet
if (Test-Path "public") {
    Copy-Item "public\*" "frontend\public\" -Recurse -Force
    Write-Host "  ✅ public\ → frontend\public\" -ForegroundColor Green
}

# Fichiers de configuration frontend
if (Test-Path ".env.local") {
    Copy-Item ".env.local" "frontend\.env.local" -Force
    Write-Host "  ✅ .env.local → frontend\.env.local" -ForegroundColor Green
}

if (Test-Path "package.json") {
    Copy-Item "package.json" "frontend\package.json" -Force
    Write-Host "  ✅ package.json → frontend\package.json" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ÉTAPE 4 : Déplacer la Documentation
# ============================================
Write-Host "📚 Étape 4 : Migration de la documentation..." -ForegroundColor Yellow

$mdFiles = Get-ChildItem -Path $rootPath -Filter "*.md" | Where-Object { $_.Name -ne "README.md" }

foreach ($file in $mdFiles) {
    Copy-Item $file.FullName "docs\$($file.Name)" -Force
    Write-Host "  ✅ $($file.Name) → docs\" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ÉTAPE 5 : Déplacer les Scripts
# ============================================
Write-Host "🔧 Étape 5 : Migration des scripts..." -ForegroundColor Yellow

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
        Write-Host "  ✅ $script → scripts\" -ForegroundColor Green
    }
}

Write-Host ""

# ============================================
# ÉTAPE 6 : Créer les package.json
# ============================================
Write-Host "📦 Étape 6 : Création des package.json..." -ForegroundColor Yellow

# Backend package.json
$backendPackage = @"
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
"@

$backendPackage | Out-File -FilePath "backend\package.json" -Encoding UTF8
Write-Host "  ✅ backend\package.json créé" -ForegroundColor Green

Write-Host ""

# ============================================
# ÉTAPE 7 : Créer les README
# ============================================
Write-Host "📄 Étape 7 : Création des README..." -ForegroundColor Yellow

# Backend README
$backendReadme = @"
# 🔴 AURA Backend

API REST pour l'application AURA.

## 🚀 Démarrage

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

Le serveur démarre sur **http://localhost:5003**

## 📡 Endpoints API

- **POST** /api/auth/login - Connexion
- **POST** /api/auth/verify-2fa - Vérification 2FA
- **GET** /api/users - Liste des utilisateurs
- **GET** /api/portfolios/:userId - Portfolio d'un utilisateur

## 🔧 Configuration

Créer un fichier `.env` :

\`\`\`
PORT=5003
CORS_ORIGIN=http://localhost:3003
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aura_db
JWT_SECRET=votre_secret_jwt
EMAIL_USER=noreply.aura.tn@gmail.com
EMAIL_PASS=votre_app_password
\`\`\`

## 📊 Base de Données

Importer le fichier SQL :
\`\`\`bash
mysql -u root aura_db < database/seeds/aura_database.sql
\`\`\`
"@

$backendReadme | Out-File -FilePath "backend\README.md" -Encoding UTF8
Write-Host "  ✅ backend\README.md créé" -ForegroundColor Green

# Frontend README
$frontendReadme = @"
# 🔵 AURA Frontend

Interface React pour l'application AURA.

## 🚀 Démarrage

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

L'application s'ouvre sur **http://localhost:3003**

## 🎯 Structure

- **src/components/** - Composants réutilisables
- **src/pages/** - Pages complètes
- **src/services/** - Appels API vers le backend

## 🔧 Configuration

Créer un fichier `.env.local` :

\`\`\`
PORT=3003
BROWSER=none
REACT_APP_API_URL=http://localhost:5003/api
\`\`\`

## 👤 Comptes de Test

### Utilisateurs
- john_doe / user123
- jane_smith / user456

### Admin
- bakr_sassi / pass
- admin / Admin@2025
"@

$frontendReadme | Out-File -FilePath "frontend\README.md" -Encoding UTF8
Write-Host "  ✅ frontend\README.md créé" -ForegroundColor Green

Write-Host ""

# ============================================
# ÉTAPE 8 : Créer .gitignore
# ============================================
Write-Host "🚫 Étape 8 : Création des .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Dependencies
node_modules/
package-lock.json

# Environment
.env
.env.local

# Logs
*.log

# Build
build/
dist/

# IDE
.vscode/
.idea/
"@

$gitignoreContent | Out-File -FilePath "backend\.gitignore" -Encoding UTF8
$gitignoreContent | Out-File -FilePath "frontend\.gitignore" -Encoding UTF8
Write-Host "  ✅ .gitignore créés" -ForegroundColor Green

Write-Host ""

# ============================================
# RÉSUMÉ
# ============================================
Write-Host "✅ RÉORGANISATION TERMINÉE !" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Structure créée :" -ForegroundColor Cyan
Write-Host "  🔴 backend/     - API Node.js + Express" -ForegroundColor Red
Write-Host "  🔵 frontend/    - Interface React" -ForegroundColor Blue
Write-Host "  📚 docs/        - Documentation" -ForegroundColor Yellow
Write-Host "  🔧 scripts/     - Scripts utilitaires" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "  1. cd backend && npm install" -ForegroundColor White
Write-Host "  2. cd backend && npm start" -ForegroundColor White
Write-Host "  3. cd frontend && npm install" -ForegroundColor White
Write-Host "  4. cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "✅ Les fichiers originaux sont conservés" -ForegroundColor Green
Write-Host "⚠️  Tu peux les supprimer manuellement après vérification" -ForegroundColor Yellow
