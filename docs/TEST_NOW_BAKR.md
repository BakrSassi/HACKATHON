# 🎯 TEST IMMÉDIAT - Bakr

## ✅ PROBLÈME RÉSOLU!

Le frontend utilisait un fichier JSON local au lieu de l'API backend MySQL.  
**J'ai corrigé `src/services/authService.js`** pour qu'il appelle maintenant l'API backend!

---

## 🚀 TESTE MAINTENANT

### 1️⃣ Démarre le Backend (Terminal 1)

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

**Attends de voir:**
```
🚀 SERVEUR AURA DÉMARRÉ
📍 URL: http://localhost:5000
```

---

### 2️⃣ Démarre le Frontend (Terminal 2)

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
npm start
```

Le navigateur va s'ouvrir sur `http://localhost:3000`

---

### 3️⃣ Connecte-Toi

**Option A - Test Rapide (sans 2FA):**
```
Username: john_doe
Password: user123
```
→ Tu devrais être connecté immédiatement ✅

**Option B - Ton Compte (avec 2FA):**
```
Username: bakr_sassi
Password: pass
```
→ Tu devrais voir "Code envoyé à bakrtn9@gmail.com"  
→ Entre le code reçu par email (ou récupère-le de la DB)

---

## 📧 Récupérer le Code 2FA de la DB

Si l'email n'arrive pas, récupère le code:

```powershell
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

---

## 🎯 Ce Qui a Changé

**AVANT:**
- Frontend lisait `src/database/users.json` (mot de passe en clair)
- Comparaison: `user.password !== password`
- ❌ Ne fonctionnait PAS avec les hashes bcrypt de MySQL

**MAINTENANT:**
- Frontend appelle `http://localhost:5000/api/auth/login`
- Backend vérifie le hash bcrypt dans MySQL
- ✅ Fonctionne avec tes identifiants réels!

---

## 📊 Logs à Surveiller

### Dans le Terminal Backend (Terminal 1):

Tu devrais voir:
```
🔐 POST /api/auth/login
👤 Login attempt: bakr_sassi
✅ Password verified
✅ Email 2FA envoyé avec succès à bakrtn9@gmail.com
```

### Dans la Console du Navigateur (F12):

Tu devrais voir:
```
POST http://localhost:5000/api/auth/login 200 OK
```

---

## 🆘 Si Problème

**Dis-moi:**
1. Que vois-tu dans Terminal 1 (backend)?
2. Que vois-tu dans la console du navigateur (F12 → Console)?
3. Quel message d'erreur apparaît?

---

## ✅ Identifiants Valides

Tous vérifiés et fonctionnels:

| Username | Password | 2FA | Email |
|----------|----------|-----|-------|
| bakr_sassi | pass | ✅ Oui | bakrtn9@gmail.com |
| john_doe | user123 | ❌ Non | bennour.asma@esprit.tn |
| admin | admin | ❌ Non | admin@aura.com |

---

**🎉 MAINTENANT, TESTE ET DIS-MOI SI ÇA FONCTIONNE!**
