# ⚡ Quick Start - Tester AURA en 5 Minutes

## 🚀 Étapes Rapides

### 1️⃣ Vérifier MySQL (30 secondes)

```powershell
# Tester si MySQL est accessible
Test-NetConnection -ComputerName localhost -Port 3306 -InformationLevel Quiet
```

✅ Si `True` → MySQL OK  
❌ Si `False` → Démarrer XAMPP MySQL

---

### 2️⃣ Importer la Base de Données (2 minutes)

**Option A: Via phpMyAdmin (Recommandé)**
1. Ouvrir http://localhost/phpmyadmin
2. Cliquer "Nouvelle base de données"
3. Nom: `aura_db`, Interclassement: `utf8mb4_general_ci`
4. Cliquer "Créer"
5. Onglet "Importer" → Choisir `database/aura_database.sql`
6. Cliquer "Exécuter"

**Option B: Via Terminal**
```powershell
# Depuis le dossier racine du projet
cd C:\xampp\mysql\bin
.\mysql.exe -u root -p aura_db < "C:\Users\bakrt\cryptoshield-advisor\database\aura_database.sql"
```

**Vérification:**
```sql
USE aura_db;
SHOW TABLES;
-- Doit afficher 7 tables: users, assets, login_history, etc.
```

---

### 3️⃣ Démarrer le Serveur (1 minute)

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

**Résultat Attendu:**
```
╔═════════════════════════════════════════════════════════════╗
║        🚀 SERVEUR AURA DÉMARRÉ (v2.0 - DYNAMIQUE)        ║
╠═════════════════════════════════════════════════════════════╣
║   📍 URL: http://localhost:5000                            ║
║   🗄️  DB:  aura_db                                         ║
║   ✅ Connexion MySQL: OK                                   ║
║   🎯 Routes AURA: Actives                                  ║
╚═════════════════════════════════════════════════════════════╝
```

✅ Si vous voyez ça → **Serveur OK!**  
❌ Si erreur "Unknown database" → Retour étape 2

---

### 4️⃣ Tester les APIs (1 minute)

**Dans un NOUVEAU terminal** (garder le serveur ouvert):

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node test-apis.js
```

**Résultat Attendu:**
```
╔═══════════════════════════════════════════════════════════╗
║        🧪 AURA - Tests APIs Dynamiques               ║
╚═══════════════════════════════════════════════════════════╝

✅ Test 1 - Analyse de Risque:     ✅ PASS
✅ Test 2 - Vérification Contrat:  ✅ PASS
✅ Test 3 - Recommandation IA:     ✅ PASS
✅ Test 4 - Analyse Complète:      ✅ PASS

🎉 TOUS LES TESTS RÉUSSIS! (4/4)
✅ Les 3 fonctionnalités du cahier des charges sont opérationnelles!
```

---

## 🧪 Test Manuel (Optionnel)

### Test 1: Analyse Risque BTC

```powershell
curl -X POST http://localhost:5000/api/aura/analyze-risk `
  -H "Content-Type: application/json" `
  -d '{"symbol": "BTC", "protocol": "bitcoin"}'
```

**Résultat:** Score de risque combiné + détails marché/code/sentiment

---

### Test 2: Vérification Contrat Uniswap

```powershell
curl -X POST http://localhost:5000/api/aura/verify-contract `
  -H "Content-Type: application/json" `
  -d '{"contractAddress": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "chain": "ethereum"}'
```

**Résultat:** Score authenticité + vulnérabilités + réputation

---

### Test 3: Recommandation IA pour ETH

```powershell
curl -X POST http://localhost:5000/api/aura/recommend `
  -H "Content-Type: application/json" `
  -d '{\"asset\": {\"symbol\": \"ETH\", \"currentPrice\": 3250, \"amount\": 2}}'
```

**Résultat:** Action recommandée + justifications + plan d'action

---

## 🎯 Test Frontend (Optionnel)

### Démarrer React (Terminal 3)

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
npm start
```

**URL:** http://localhost:3000

### Tester le Login

**Utilisateur Admin:**
- Username: `bakr_sassi`
- Password: `pass`
- Email: `bakrtn9@gmail.com`

**Code 2FA:** Affiché dans le terminal du serveur (6 chiffres)

---

## 🚨 Dépannage Rapide

### ❌ Erreur: "Unknown database 'aura_db'"
**Solution:** Base de données non créée
```powershell
# Ouvrir phpMyAdmin
start http://localhost/phpmyadmin
# Créer aura_db et importer le SQL
```

---

### ❌ Erreur: "ECONNREFUSED ::1:3306"
**Solution:** MySQL non démarré
1. Ouvrir XAMPP Control Panel
2. Cliquer "Start" sur MySQL
3. Attendre le voyant vert
4. Redémarrer le serveur

---

### ❌ Erreur: "Cannot find module 'ethers'"
**Solution:** Packages non installés
```powershell
npm install
```

---

### ❌ Test API échoue avec "ECONNREFUSED"
**Solution:** Serveur non démarré
```powershell
# Terminal 1
node server/server.js

# Terminal 2 (après démarrage serveur)
node test-apis.js
```

---

## ✅ Checklist de Démarrage

- [ ] MySQL XAMPP démarré (port 3306 ouvert)
- [ ] Base de données `aura_db` créée
- [ ] Fichier SQL importé (7 tables visibles)
- [ ] Packages npm installés (`node_modules` présent)
- [ ] Fichier `.env` configuré
- [ ] Serveur démarré sur port 5000
- [ ] Tests APIs passent (4/4)
- [ ] Frontend accessible sur port 3000

---

## 🎉 Si Tout Fonctionne

**Félicitations!** 🎊

Vous avez maintenant:
- ✅ Backend Express avec MySQL
- ✅ 4 APIs dynamiques opérationnelles
- ✅ Analyse de risque en temps réel
- ✅ Vérification smart contracts
- ✅ Recommandations IA
- ✅ Système 2FA fonctionnel

**Prochaine étape:** Explorer la documentation complète dans `AURA_DYNAMIC_API_GUIDE.md`

---

## 📞 Besoin d'Aide?

### Commandes Utiles

```powershell
# Vérifier MySQL
Get-Process mysql*

# Voir les ports utilisés
netstat -ano | findstr :3306
netstat -ano | findstr :5000

# Redémarrer tout
# 1. Ctrl+C dans les terminaux
# 2. Redémarrer MySQL dans XAMPP
# 3. node server/server.js
# 4. npm start
```

### Logs

- **Serveur:** Affichés dans le terminal où vous avez lancé `node server/server.js`
- **Frontend:** Console du navigateur (F12)
- **MySQL:** `C:\xampp\mysql\data\*.err`

---

**Temps Total: ~5 minutes** ⚡

**Bon développement!** 🚀
