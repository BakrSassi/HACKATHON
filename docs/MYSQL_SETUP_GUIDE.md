# 🗄️ AURA - Migration vers MySQL (XAMPP)

## 📋 Vue d'Ensemble

Ce guide vous aide à migrer d'une base de données JSON locale vers MySQL avec XAMPP.

---

## ✅ Prérequis

- ✔️ XAMPP installé
- ✔️ Node.js installé
- ✔️ Packages npm installés (`npm install` déjà fait)

---

## 🚀 Installation en 5 Étapes

### Étape 1: Démarrer XAMPP

1. **Ouvrir XAMPP Control Panel**
2. **Démarrer Apache** (cliquer sur "Start")
3. **Démarrer MySQL** (cliquer sur "Start")

Les deux doivent afficher un fond **vert** quand ils sont démarrés.

---

### Étape 2: Créer la Base de Données

#### Option A: Via phpMyAdmin (Recommandé)

1. **Ouvrir phpMyAdmin:** http://localhost/phpmyadmin
2. **Cliquer sur "Nouvelle base de données"**
3. **Nom:** `aura_db`
4. **Interclassement:** `utf8mb4_unicode_ci`
5. **Cliquer sur "Créer"**

#### Option B: Import SQL Direct

1. **Ouvrir phpMyAdmin:** http://localhost/phpmyadmin
2. **Cliquer sur "Importer"** (onglet du haut)
3. **Choisir le fichier:** `database/aura_database.sql`
4. **Cliquer sur "Exécuter"**
5. ✅ **Base de données créée avec toutes les tables et données!**

---

### Étape 3: Vérifier la Configuration

Vérifiez que le fichier **`.env`** est correct:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aura_db
DB_PORT=3306
```

**Note:** Par défaut, XAMPP MySQL:
- User: `root`
- Password: *(vide)*

Si vous avez changé le mot de passe MySQL, modifiez `DB_PASSWORD`.

---

### Étape 4: Démarrer le Serveur Backend

Ouvrez un **nouveau terminal** (PowerShell) et exécutez:

```powershell
node server/server.js
```

Vous devriez voir:

```
╔════════════════════════════════════════════╗
║   🚀 SERVEUR AURA DÉMARRÉ                 ║
╠════════════════════════════════════════════╣
║   📍 URL: http://localhost:5000           ║
║   🗄️  DB:  aura_db                        ║
║   ✅ Connexion MySQL: OK                  ║
╚════════════════════════════════════════════╝
```

**Si erreur de connexion:**
- Vérifiez que XAMPP MySQL est démarré (vert)
- Vérifiez que la base `aura_db` existe
- Vérifiez le fichier `.env`

---

### Étape 5: Modifier le Frontend pour Utiliser l'API

Le frontend doit maintenant communiquer avec le backend au lieu d'utiliser localStorage.

**Nous allons créer un nouveau service API...**

---

## 📊 Structure de la Base de Données

### Tables Créées:

| Table | Description | Lignes |
|-------|-------------|--------|
| `users` | Utilisateurs + profils | 4 |
| `assets` | Actifs crypto | ~10 |
| `login_history` | Historique connexions | 0 |
| `sessions` | Sessions actives | 0 |
| `two_factor_codes` | Codes 2FA temporaires | 0 |
| `transactions` | Transactions blockchain | 0 |
| `notifications` | Notifications système | 0 |

### Vues Créées:

- `v_users_portfolio` - Vue complète des portfolios
- `v_recent_activity` - Activité récente

### Procédures Stockées:

- `UpdateAuraScore()` - Recalculer le score AURA

---

## 👤 Utilisateurs Créés

| Username | Password | Email | Role | Portfolio |
|----------|----------|-------|------|-----------|
| **bakr_sassi** | pass | bakrtn9@gmail.com | super_admin | $250,000 |
| john_doe | user123 | john@example.com | user | $134,200 |
| jane_smith | user456 | jane@example.com | user | $89,500 |
| admin | Admin@2025 | admin@aura.com | admin | $0 |

---

## 🧪 Tester la Configuration

### Test 1: Vérifier la Base de Données

```sql
-- Dans phpMyAdmin, exécutez:
USE aura_db;
SELECT * FROM users;
SELECT * FROM assets;
SELECT * FROM v_users_portfolio;
```

### Test 2: Tester l'API Backend

Ouvrez: http://localhost:5000

Vous devriez voir:

```json
{
  "message": "🚀 AURA API - Backend MySQL",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### Test 3: Tester la Connexion

Utilisez Postman ou curl:

```powershell
# Test login
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"bakr_sassi","password":"pass"}'
```

Vous devriez recevoir un objet avec `requiresTwoFactor: true` et un code 2FA dans la console du serveur.

---

## 🔧 Commandes Utiles

### Démarrer le Serveur Backend

```powershell
node server/server.js
```

### Démarrer le Frontend React

```powershell
npm start
```

### Vérifier MySQL

```powershell
# Tester si MySQL est accessible
Test-NetConnection -ComputerName localhost -Port 3306
```

### Voir les Logs MySQL

Ouvrez: `C:\xampp\mysql\data\mysql_error.log`

---

## 📡 Endpoints API Disponibles

### Authentication

```
POST /api/auth/login
Body: { username, password }
Response: { requiresTwoFactor, userId, email } ou { success, user, token }

POST /api/auth/verify-2fa
Body: { userId, code }
Response: { success, user, token }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { success, message }
```

### Users

```
GET /api/users
Response: { success, users: [] }

GET /api/users/:id
Response: { success, user: {...} }
```

### Statistics

```
GET /api/stats
Response: { success, stats: {...}, recentActivity: [] }
```

---

## 🐛 Dépannage

### Problème: "Cannot connect to MySQL"

**Solutions:**
1. Vérifiez que MySQL est démarré dans XAMPP
2. Vérifiez le port (3306) dans `.env`
3. Vérifiez user/password dans `.env`
4. Redémarrez MySQL dans XAMPP

### Problème: "Database 'aura_db' not found"

**Solutions:**
1. Ouvrez phpMyAdmin
2. Créez manuellement la base `aura_db`
3. Importez `database/aura_database.sql`

### Problème: "Port 5000 already in use"

**Solutions:**
1. Changez le port dans `.env`: `PORT=5001`
2. Ou tuez le processus utilisant le port 5000

### Problème: "Module not found"

**Solution:**
```powershell
npm install
```

---

## 🔄 Migration des Anciennes Données

Si vous voulez migrer les données de l'ancien localStorage vers MySQL:

```javascript
// Console frontend (F12)
const oldDb = JSON.parse(localStorage.getItem('aura_database'));
console.log(JSON.stringify(oldDb, null, 2));

// Copiez les données et insérez-les via phpMyAdmin
```

---

## 📈 Prochaines Étapes

1. ✅ **Backend fonctionnel** avec MySQL
2. 🔄 **Modifier le frontend** pour utiliser l'API au lieu de localStorage
3. 🎨 **Créer un service API** dans `src/services/apiService.js`
4. 🔐 **Gérer les tokens JWT** dans le frontend
5. 🚀 **Tester la connexion** end-to-end

---

## 💡 Avantages de MySQL

✅ **Persistance réelle** - Données sauvegardées même après fermeture du navigateur  
✅ **Multi-utilisateurs** - Plusieurs personnes peuvent se connecter simultanément  
✅ **Sécurité** - Mots de passe hashés avec bcrypt  
✅ **Performance** - Requêtes optimisées avec index  
✅ **Scalabilité** - Prêt pour la production  
✅ **Backup facile** - Export SQL en un clic  
✅ **Transactions** - Garantie d'intégrité des données  

---

## 🎉 Résumé

**Fichiers Créés:**
- `database/aura_database.sql` - Script SQL complet
- `server/database.js` - Configuration MySQL
- `server/server.js` - API REST Express
- `.env` - Configuration environnement
- `MYSQL_SETUP_GUIDE.md` - Ce guide

**Commandes:**
```powershell
# 1. Démarrer XAMPP MySQL
# 2. Importer aura_database.sql dans phpMyAdmin
# 3. Démarrer le backend:
node server/server.js

# 4. Démarrer le frontend:
npm start
```

**Votre Compte:**
- Username: `bakr_sassi`
- Password: `pass`
- Email: `bakrtn9@gmail.com`
- Portfolio: $250,000
- Role: super_admin

---

Besoin d'aide? Consultez la console du serveur pour les logs détaillés! 🚀
