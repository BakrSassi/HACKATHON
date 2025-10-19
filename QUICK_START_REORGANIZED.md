# 🎉 Projet AURA Réorganisé - Guide de Démarrage

**Date**: 19 Octobre 2025  
**Structure**: Backend/Frontend séparés

---

## 📁 Nouvelle Structure

```
cryptoshield-advisor/
├── 🔴 backend/          # API Node.js + Express (Port 5003)
├── 🔵 frontend/         # Interface React (Port 3003)
├── 📚 docs/             # Toute la documentation
├── 🔧 scripts/          # Scripts de test
└── 📊 database/         # Fichiers SQL
```

---

## 🚀 Démarrage Rapide

### 1. Backend (Terminal 1)

```powershell
cd backend
npm install
npm start
```

**Résultat**:
```
🚀 Serveur démarré sur le port 5003
✅ Base de données MySQL connectée
📧 Service email configuré
```

**URL**: http://localhost:5003

---

### 2. Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm start
```

**Résultat**:
```
webpack compiled successfully
```

**URL**: http://localhost:3003

---

## ✅ Vérification

### Backend est OK si tu vois:
```json
{
  "message": "AURA Backend API",
  "version": "1.0.0",
  "status": "running"
}
```
Sur http://localhost:5003

### Frontend est OK si tu vois:
- Page d'accueil AURA
- Bouton "🔐 Connexion"
- Dashboard avec graphiques

---

## 📋 Structure Backend

```
backend/
├── server.js                    # ⭐ Point d'entrée
├── package.json                 # Dépendances
├── .env                        # Configuration
│
├── config/
│   └── database.js             # Config MySQL
│
├── services/
│   ├── emailService.js         # Envoi emails 2FA
│   ├── aiService.js            # Intelligence artificielle
│   ├── blockchainService.js    # Smart contracts
│   └── securityService.js      # Analyse de risques
│
└── database/
    └── seeds/
        └── aura_database.sql   # Script SQL complet
```

---

## 📋 Structure Frontend

```
frontend/
├── package.json                # Dépendances React
├── .env.local                  # Config (PORT=3003)
│
├── public/
│   ├── index.html
│   └── manifest.json
│
└── src/
    ├── App.js                  # ⭐ Composant principal
    ├── index.js                # Point d'entrée
    │
    ├── components/
    │   ├── Dashboard.js
    │   ├── AuraChat.js
    │   └── TwoFactorVerification.js
    │
    ├── pages/
    │   ├── UnifiedLogin.js     # ⭐ Page de connexion
    │   ├── AdminDashboard.js
    │   └── UserDashboard.js
    │
    └── services/
        ├── authService.js      # API Auth
        ├── twoFactorService.js # API 2FA
        └── aiService.js        # API IA
```

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5003
CORS_ORIGIN=http://localhost:3003

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=aura_db

JWT_SECRET=ton_secret_jwt_super_securise

EMAIL_USER=noreply.aura.tn@gmail.com
EMAIL_PASS=ton_app_password_gmail
```

---

### Frontend (.env.local)
```env
PORT=3003
BROWSER=none
REACT_APP_API_URL=http://localhost:5003/api
```

---

## 👤 Comptes de Test

### Utilisateurs (role='user')
| Username | Password | Portfolio | 2FA |
|----------|----------|-----------|-----|
| john_doe | user123 | $134,200 | ✅ |
| jane_smith | user456 | $89,500 | ✅ |

### Admin (role='super_admin' ou 'admin')
| Username | Password | Rôle | 2FA |
|----------|----------|------|-----|
| bakr_sassi | pass | Super Admin | ✅ |
| admin | Admin@2025 | Admin | ❌ |

---

## 🧪 Tester la Connexion

### 1. Ouvre http://localhost:3003

### 2. Clique sur "🔐 Connexion"

### 3. Toggle "Admin" ou "Utilisateur"

### 4. Connexion rapide:
- Mode User → Clique "👨 John Doe"
- Mode Admin → Clique "👨‍💻 Bakr Sassi"

### 5. Code 2FA:
```powershell
# Pour bakr_sassi (user_id=1)
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s

# Pour john_doe (user_id=2)
echo "SELECT code FROM two_factor_codes WHERE user_id=2 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

### 6. Entre le code → **Connecté !** ✅

---

## 📊 Base de Données

### Importer le SQL
```powershell
C:\xampp\mysql\bin\mysql.exe -u root aura_db < backend\database\seeds\aura_database.sql
```

### Vérifier les utilisateurs
```powershell
echo "SELECT id, username, email, role, two_factor_enabled FROM users;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db
```

---

## 🔗 API Endpoints

### Authentification
```
POST /api/auth/login
POST /api/auth/verify-2fa
POST /api/auth/logout
```

### Utilisateurs
```
GET /api/users
GET /api/users/:id
PUT /api/users/:id
```

### Portfolio
```
GET /api/portfolios/:userId
GET /api/portfolios/:userId/assets
```

---

## 🛠️ Scripts Utilitaires

Dans le dossier `scripts/`:

```powershell
# Tester les APIs
node scripts/test-apis.js

# Tester la connexion
node scripts/test-login-simple.js

# Tester la 2FA
node scripts/test-login-2fa.js

# Vérifier les mots de passe
node scripts/verify-passwords.js

# Vérifier les codes 2FA
node scripts/check-2fa-codes.js
```

---

## 📚 Documentation

Dans le dossier `docs/`:

- **LOGIN_UNIFIED.md** - Page de connexion unifiée
- **USERLOGIN_FIXED.md** - Fix userId 2FA
- **DEBUG_USERID.md** - Debug userId
- **EMAIL_2FA_SETUP_GUIDE.md** - Configuration email
- **API_GUIDE.md** - Guide des APIs
- **DATABASE_ACCESS_GUIDE.md** - Accès base de données

---

## ⚠️ Fichiers Originaux

Les fichiers originaux sont **toujours présents** à la racine :
- `src/` → Copié dans `frontend/src/`
- `server/` → Copié dans `backend/`
- `*.md` → Copié dans `docs/`
- `*.js` (tests) → Copié dans `scripts/`

**Tu peux les supprimer** après vérification que tout fonctionne.

---

## 🐛 Dépannage

### Backend ne démarre pas

```powershell
# Vérifier MySQL
Test-NetConnection -ComputerName localhost -Port 3306

# Vérifier les logs
cd backend
npm start
# Regarde les erreurs dans la console
```

---

### Frontend ne démarre pas

```powershell
# Nettoyer et réinstaller
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
npm start
```

---

### Erreur CORS

Vérifie dans `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3003
```

Et dans `backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true
}));
```

---

### Code 2FA expiré

Génère un nouveau code:
```powershell
# Connexion depuis le frontend génère automatiquement un nouveau code
# OU récupère le plus récent:
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

---

## ✅ Checklist de Démarrage

- [ ] MySQL (XAMPP) démarré
- [ ] Base `aura_db` créée et importée
- [ ] Backend: `cd backend && npm install && npm start`
- [ ] Backend accessible sur http://localhost:5003
- [ ] Frontend: `cd frontend && npm install && npm start`
- [ ] Frontend accessible sur http://localhost:3003
- [ ] Connexion avec john_doe / user123
- [ ] Code 2FA récupéré et validé
- [ ] Dashboard utilisateur s'affiche

---

## 🎉 Succès !

Si tout fonctionne :
- ✅ Backend sur port 5003
- ✅ Frontend sur port 3003
- ✅ Connexion avec 2FA
- ✅ Dashboard accessible

**Ton projet AURA est maintenant parfaitement organisé !** 🚀
