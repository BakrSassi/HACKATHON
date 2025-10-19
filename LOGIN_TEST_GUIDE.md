# 🧪 Guide de Test du Login 2FA

## 🎯 Objectif
Tester le système de 2FA et vérifier que l'email est bien envoyé.

## 📋 Étapes de Test

### 1️⃣ Démarrer le Serveur

Ouvrez un **premier terminal PowerShell** et exécutez:

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

✅ Attendez de voir le message:
```
🚀 SERVEUR AURA DÉMARRÉ (v2.0 - DYNAMIQUE)
📍 URL: http://localhost:5000
```

⚠️ **IMPORTANT**: Laissez ce terminal OUVERT

---

### 2️⃣ Tester le Login

Ouvrez un **SECOND terminal PowerShell** (nouveau) et exécutez:

```powershell
cd C:\Users\bakrt\cryptoshield-advisor

# Test avec curl
curl.exe -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"bakr_sassi\",\"password\":\"pass\"}'
```

---

### 3️⃣ Vérifier la Réponse

Vous devriez voir:
```json
{
  "success": false,
  "requiresTwoFactor": true,
  "userId": 1,
  "email": "bakrtn9@gmail.com",
  "username": "bakr_sassi",
  "message": "Code de vérification envoyé à votre email"
}
```

---

### 4️⃣ Vérifier les Logs du Serveur

Dans le **PREMIER terminal** (celui du serveur), vous devriez voir:

```
✅ Email 2FA envoyé avec succès à bakrtn9@gmail.com
```

OU

```
🔐 CODE 2FA pour bakr_sassi: 123456
```

---

### 5️⃣ Vérifier votre Email

1. Ouvrez votre boîte mail: **bakrtn9@gmail.com**
2. Cherchez un email de: **noreply.aura.tn@gmail.com**
3. **Vérifiez aussi le dossier SPAM** ⚠️
4. Le sujet devrait être: **"Code de vérification AURA - bakr_sassi"**

---

### 6️⃣ Vérifier dans la Base de Données

```powershell
echo "SELECT id, user_id, email, code, created_at FROM two_factor_codes ORDER BY created_at DESC LIMIT 5;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db
```

Vous devriez voir le code généré dans la base de données.

---

## 🐛 Dépannage

### Le serveur s'arrête tout seul
- Ne lancez PAS deux fois `node server/server.js`
- Utilisez DEUX terminaux séparés (un pour le serveur, un pour les tests)

### Pas de log "Email envoyé"
- Vérifiez le fichier `.env`:
  - `EMAIL_USER=noreply.aura.tn@gmail.com`
  - `EMAIL_PASSWORD=svgc mmfl reqp hdqi`
  - `EMAIL_PROVIDER=gmail`

### L'email n'arrive pas
1. Vérifiez les SPAMS
2. Cherchez: `from:noreply.aura.tn@gmail.com`
3. Le code expire après 5 minutes
4. Gmail peut bloquer temporairement (attendre quelques minutes)

---

## ✅ Test Réussi Si:

- [x] Le serveur reste actif
- [x] L'API retourne `requiresTwoFactor: true`
- [x] Le serveur log "Email 2FA envoyé"
- [x] Le code est dans la base de données
- [x] L'email arrive dans votre boîte (ou spam)

---

## 📧 Test Email Configuration

Pour tester juste l'email (sans login):

```powershell
node test-email-config.js
```

Ceci envoie un email de test à `noreply.aura.tn@gmail.com`.
