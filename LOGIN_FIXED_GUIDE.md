# 🔐 Guide de Connexion AURA - Mis à Jour

## ✅ Mots de Passe Corrigés!

Les hashs bcrypt ont été mis à jour dans la base de données.

---

## 👤 Comptes Utilisateurs Disponibles

### 1️⃣ **Bakr Sassi (Super Admin)** ⭐ VOTRE COMPTE
```
🔐 Page: http://localhost:3000/login
📧 Username: bakr_sassi
🔑 Password: pass
📨 Email: bakrtn9@gmail.com
👤 Rôle: super_admin
💰 Portfolio: $250,000
⭐ AURA Score: 95
🔐 2FA: Activé
```

### 2️⃣ **John Doe (User)**
```
🔐 Page: http://localhost:3000/user-login
📧 Username: john_doe
🔑 Password: user123
📨 Email: john@example.com
👤 Rôle: user
💰 Portfolio: $134,200
⭐ AURA Score: 78
🔐 2FA: Désactivé
```

### 3️⃣ **Jane Smith (User)**
```
🔐 Page: http://localhost:3000/user-login
📧 Username: jane_smith
🔑 Password: user456
📨 Email: jane@example.com
👤 Rôle: user
💰 Portfolio: $89,500
⭐ AURA Score: 85
🔐 2FA: Désactivé
```

### 4️⃣ **Admin (Admin)**
```
🔐 Page: http://localhost:3000/login
📧 Username: admin
🔑 Password: admin
📨 Email: admin@aura.com
👤 Rôle: admin
💰 Portfolio: $0
⭐ AURA Score: 100
🔐 2FA: Désactivé
```

---

## 🚀 Test de Connexion

### Étape 1: Démarrer le Frontend
```powershell
cd C:\Users\bakrt\cryptoshield-advisor
npm start
```

### Étape 2: Démarrer le Backend (Nouveau Terminal)
```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

### Étape 3: Se Connecter

#### Option A: Compte Admin (bakr_sassi)
1. Ouvrir http://localhost:3000/login
2. Username: `bakr_sassi`
3. Password: `pass`
4. Cliquer "Se connecter"
5. **2FA:** Regarder le terminal backend pour le code 6 chiffres
6. Entrer le code

#### Option B: Compte User (john_doe - Plus Rapide, Pas de 2FA)
1. Ouvrir http://localhost:3000/user-login
2. Username: `john_doe`
3. Password: `user123`
4. Cliquer "Se connecter"
5. ✅ Connexion directe (pas de 2FA)

---

## 🔍 Vérifier les Mots de Passe dans la Base

### Via phpMyAdmin:
1. Ouvrir http://localhost/phpmyadmin
2. Base de données `aura_db`
3. Table `users`
4. Les colonnes `username` et `password` devraient montrer:

```sql
bakr_sassi  | $2b$10$RDuLt8bkHojShTim5nepP...
john_doe    | $2b$10$wJ2XnMaAAMMA2yWdadNRn...
jane_smith  | $2b$10$KwnkW5v.0nvnjVSRFQCHh...
admin       | $2b$10$Yh6D6fN/6JffcD2tH.X3z...
```

---

## 🧪 Test Manuel avec cURL

### Test Login API:
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\": \"bakr_sassi\", \"password\": \"pass\"}'
```

**Résultat Attendu:**
```json
{
  "success": true,
  "requireTwoFactor": true,
  "message": "Code 2FA envoyé"
}
```

### Test Login Sans 2FA (john_doe):
```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\": \"john_doe\", \"password\": \"user123\"}'
```

**Résultat Attendu:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🚨 Dépannage

### ❌ Erreur: "Invalid credentials"

**Solutions:**

#### 1. Vérifier le serveur backend
```powershell
# Doit montrer:
✅ Connexion MySQL: OK
```

#### 2. Vérifier la base de données
```sql
-- Dans phpMyAdmin:
SELECT username, email, SUBSTRING(password, 1, 10) 
FROM users 
WHERE username = 'bakr_sassi';

-- Doit montrer:
-- bakr_sassi | bakrtn9@gmail.com | $2b$10$RDu
```

#### 3. Re-exécuter le fix des mots de passe
```powershell
Get-Content "C:\Users\bakrt\cryptoshield-advisor\fix-passwords.sql" | C:\xampp\mysql\bin\mysql.exe -u root aura_db
```

#### 4. Redémarrer le backend
```powershell
# Ctrl+C pour arrêter
node server/server.js
```

---

## 🔐 Créer un Nouveau Mot de Passe

Si vous voulez changer un mot de passe:

### 1. Générer le hash:
```powershell
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('VOTRE_MOT_DE_PASSE', 10).then(hash => console.log(hash));"
```

### 2. Mettre à jour dans MySQL:
```sql
UPDATE users 
SET password = 'LE_HASH_GÉNÉRÉ' 
WHERE username = 'bakr_sassi';
```

---

## 📊 Tableau Récapitulatif

| Username | Password | Email | Rôle | 2FA | Page Login |
|----------|----------|-------|------|-----|------------|
| `bakr_sassi` | `pass` | bakrtn9@gmail.com | super_admin | ✅ Oui | /login |
| `john_doe` | `user123` | john@example.com | user | ❌ Non | /user-login |
| `jane_smith` | `user456` | jane@example.com | user | ❌ Non | /user-login |
| `admin` | `admin` | admin@aura.com | admin | ❌ Non | /login |

---

## ✅ Checklist de Connexion

- [ ] MySQL XAMPP démarré
- [ ] Base de données `aura_db` existe
- [ ] Mots de passe mis à jour (`fix-passwords.sql` exécuté)
- [ ] Backend démarré (`node server/server.js`)
- [ ] Frontend démarré (`npm start`)
- [ ] Ouvrir http://localhost:3000/login ou /user-login
- [ ] Entrer username et password
- [ ] Si 2FA activé: regarder terminal backend pour le code

---

**Les mots de passe sont maintenant corrects! ✅**

**Connexion rapide recommandée:**
- Username: `john_doe`
- Password: `user123`
- (Pas de 2FA = Plus rapide pour tester)
