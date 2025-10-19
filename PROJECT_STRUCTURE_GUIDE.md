# 🏗️ Structure du Projet AURA - Backend & Frontend

## 📁 Structure Recommandée

```
cryptoshield-advisor/
│
├── 📂 backend/                          # 🔴 BACKEND (Node.js + Express)
│   ├── server.js                        # Point d'entrée principal
│   ├── package.json                     # Dépendances backend
│   ├── .env                            # Variables d'environnement
│   │
│   ├── 📂 config/                       # Configuration
│   │   ├── database.js                 # Config MySQL
│   │   ├── email.js                    # Config email
│   │   └── jwt.js                      # Config JWT
│   │
│   ├── 📂 models/                       # Modèles de données
│   │   ├── User.js                     # Modèle utilisateur
│   │   ├── Asset.js                    # Modèle actif crypto
│   │   ├── Transaction.js              # Modèle transaction
│   │   ├── TwoFactorCode.js           # Modèle 2FA
│   │   └── Session.js                  # Modèle session
│   │
│   ├── 📂 routes/                       # Routes API
│   │   ├── auth.js                     # Routes authentification
│   │   ├── users.js                    # Routes utilisateurs
│   │   ├── portfolios.js              # Routes portfolios
│   │   ├── transactions.js            # Routes transactions
│   │   └── admin.js                    # Routes admin
│   │
│   ├── 📂 controllers/                  # Contrôleurs
│   │   ├── authController.js          # Logique auth
│   │   ├── userController.js          # Logique users
│   │   ├── portfolioController.js     # Logique portfolio
│   │   └── transactionController.js   # Logique transactions
│   │
│   ├── 📂 services/                     # Services métier
│   │   ├── aiService.js               # Intelligence artificielle
│   │   ├── blockchainService.js       # Blockchain (TrustLedger)
│   │   ├── securityService.js         # Cybersécurité
│   │   ├── emailService.js            # Service email
│   │   ├── jwtService.js              # Service JWT
│   │   └── marketDataService.js       # Données de marché
│   │
│   ├── 📂 middleware/                   # Middlewares
│   │   ├── auth.js                     # Vérification auth
│   │   ├── errorHandler.js            # Gestion erreurs
│   │   ├── validation.js              # Validation données
│   │   └── rateLimiter.js             # Limitation de requêtes
│   │
│   ├── 📂 database/                     # Base de données
│   │   ├── connection.js              # Connexion MySQL
│   │   ├── migrations/                # Migrations
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_assets.sql
│   │   │   └── 003_create_2fa.sql
│   │   └── seeds/                     # Données initiales
│   │       └── aura_database.sql
│   │
│   ├── 📂 contracts/                    # Smart Contracts
│   │   ├── TrustLedger.sol            # Contrat blockchain
│   │   └── compile.js                 # Compilation
│   │
│   ├── 📂 utils/                        # Utilitaires
│   │   ├── logger.js                  # Logging
│   │   ├── crypto.js                  # Fonctions crypto
│   │   └── validators.js              # Validateurs
│   │
│   └── 📂 tests/                        # Tests backend
│       ├── auth.test.js
│       ├── users.test.js
│       └── api.test.js
│
├── 📂 frontend/                         # 🔵 FRONTEND (React)
│   ├── package.json                    # Dépendances frontend
│   ├── .env.local                      # Variables env frontend
│   │
│   ├── 📂 public/                       # Fichiers publics
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── reset-db.html
│   │
│   └── 📂 src/                          # Code source React
│       ├── index.js                    # Point d'entrée
│       ├── App.js                      # Composant principal
│       ├── App.css                     # Styles principaux
│       │
│       ├── 📂 components/               # Composants réutilisables
│       │   ├── Dashboard.js
│       │   ├── Dashboard.css
│       │   ├── AuraChat.js
│       │   ├── AuraChat.css
│       │   ├── TwoFactorVerification.js
│       │   └── TwoFactorVerification.css
│       │
│       ├── 📂 pages/                    # Pages complètes
│       │   ├── UnifiedLogin.js        # Page connexion unifiée
│       │   ├── UnifiedLogin.css
│       │   ├── AdminDashboard.js
│       │   ├── AdminDashboard.css
│       │   ├── UserDashboard.js
│       │   ├── UserDashboard.css
│       │   ├── Login.js               # (Ancien - peut supprimer)
│       │   ├── Login.css
│       │   ├── UserLogin.js           # (Ancien - peut supprimer)
│       │   └── UserLogin.css
│       │
│       ├── 📂 services/                 # Services API
│       │   ├── authService.js         # Service authentification
│       │   ├── twoFactorService.js    # Service 2FA
│       │   ├── databaseService.js     # Service données
│       │   ├── aiService.js           # Service IA
│       │   ├── auraChat.js            # Service chat
│       │   ├── cyberGuardian.js       # Service sécurité
│       │   ├── smartBrain.js          # Service analyse
│       │   └── trustLedger.js         # Service blockchain
│       │
│       ├── 📂 utils/                    # Utilitaires frontend
│       │   └── mockData.js            # Données de test
│       │
│       ├── 📂 hooks/                    # Custom React hooks
│       │   ├── useAuth.js
│       │   └── usePortfolio.js
│       │
│       └── 📂 assets/                   # Images, fonts, etc.
│           ├── images/
│           └── icons/
│
├── 📂 database/                         # 📊 Scripts de base de données
│   └── aura_database.sql              # Script SQL complet
│
├── 📂 docs/                             # 📚 Documentation
│   ├── API_GUIDE.md
│   ├── DATABASE_ACCESS_GUIDE.md
│   ├── EMAIL_2FA_SETUP_GUIDE.md
│   ├── LOGIN_UNIFIED.md
│   ├── USERLOGIN_FIXED.md
│   ├── DEBUG_USERID.md
│   ├── GUIDE_DEBUG_2FA.md
│   └── ... (tous les autres MD)
│
├── 📂 scripts/                          # 🔧 Scripts utilitaires
│   ├── start-server.js
│   ├── test-apis.js
│   ├── test-login-2fa.js
│   ├── test-login-simple.js
│   ├── test-passwords.js
│   ├── verify-login.js
│   └── check-2fa-codes.js
│
├── package.json                        # Dépendances root
├── .gitignore                          # Git ignore
└── README.md                           # Documentation principale
```

---

## 🎯 Séparation Backend/Frontend

### 🔴 Backend (Port 5003)
```bash
cd backend
npm install
node server.js
```

**Responsabilités**:
- API REST
- Authentification JWT + 2FA
- Base de données MySQL
- Envoi d'emails
- Smart contracts blockchain
- IA et analyse de risques

---

### 🔵 Frontend (Port 3003)
```bash
cd frontend
npm install
npm start
```

**Responsabilités**:
- Interface utilisateur React
- Appels API vers backend
- Gestion de l'état (localStorage)
- Affichage des données
- Expérience utilisateur

---

## 🚀 Commandes de Migration

### Étape 1 : Créer les Dossiers

```bash
# Créer la structure backend
mkdir backend
mkdir backend/config backend/models backend/routes backend/controllers
mkdir backend/services backend/middleware backend/database backend/contracts
mkdir backend/utils backend/tests

# Créer la structure frontend
mkdir frontend
mkdir -p frontend/src/components frontend/src/pages frontend/src/services
mkdir -p frontend/src/utils frontend/src/hooks frontend/src/assets

# Créer dossiers racine
mkdir docs scripts
```

---

### Étape 2 : Déplacer les Fichiers Backend

```bash
# Déplacer le serveur principal
move server/server.js backend/server.js

# Déplacer les services backend
move server/database.js backend/config/database.js
move server/emailService.js backend/services/emailService.js
move server/aiDecisionSupport.js backend/services/aiService.js
move server/contractVerifier.js backend/services/blockchainService.js
move server/riskAnalysis.js backend/services/securityService.js

# Copier .env
copy .env backend/.env
```

---

### Étape 3 : Déplacer les Fichiers Frontend

```bash
# Déplacer le dossier src complet
move src frontend/src

# Déplacer public
move public frontend/public

# Copier package.json et .env.local
copy package.json frontend/package.json
copy .env.local frontend/.env.local
```

---

### Étape 4 : Déplacer la Documentation

```bash
# Déplacer tous les MD dans docs
move *.md docs/
# Garder README.md à la racine
move docs/README.md ./README.md
```

---

### Étape 5 : Déplacer les Scripts

```bash
# Déplacer les scripts de test
move test-*.js scripts/
move check-*.js scripts/
move verify-*.js scripts/
move start-server.js scripts/
```

---

## 📦 Configuration après Migration

### Backend package.json
```json
{
  "name": "aura-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Frontend package.json
```json
{
  "name": "aura-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.5.0",
    "react-router-dom": "^6.16.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

---

## 🔗 Communication Backend ↔ Frontend

### Backend expose les APIs
```
http://localhost:5003/api/auth/login
http://localhost:5003/api/auth/verify-2fa
http://localhost:5003/api/users
http://localhost:5003/api/portfolios
```

### Frontend consomme les APIs
```javascript
// frontend/src/services/authService.js
const API_URL = 'http://localhost:5003/api';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  return response.data;
};
```

---

## ✅ Avantages de cette Structure

| Aspect | Avant | Après |
|--------|-------|-------|
| Organisation | Tout mélangé | Backend/Frontend séparés |
| Déploiement | Compliqué | Indépendant |
| Maintenance | Difficile | Facile |
| Scalabilité | Limitée | Excellente |
| Collaboration | Confusion | Claire |

---

## 🚦 Prochaines Étapes

1. **Créer les dossiers** (commandes ci-dessus)
2. **Déplacer les fichiers** progressivement
3. **Mettre à jour les imports** dans le code
4. **Tester backend** : `cd backend && npm start`
5. **Tester frontend** : `cd frontend && npm start`
6. **Vérifier la connexion** API

---

Veux-tu que je t'aide à créer automatiquement cette structure ou préfères-tu des commandes PowerShell pour migrer les fichiers ?
