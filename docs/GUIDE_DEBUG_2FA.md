# 🔧 Corrections Timer et userId - 2FA

**Date**: 19 Octobre 2025  
**Problèmes résolus**: Timer 00:00 et "userId requis"

---

## ✅ Corrections Effectuées

### 1. Timer Qui Affiche 00:00

**Problème**: Le timer cherchait dans localStorage au lieu de compter à rebours  
**Solution**: Timer local de 5 minutes (300 secondes) qui décrémente chaque seconde

**Avant:**
```javascript
const remaining = getCodeExpirationTime(email); // ❌ localStorage vide
setTimeRemaining(remaining); // → 0 secondes
```

**Maintenant:**
```javascript
setTimeRemaining(prev => prev <= 0 ? 0 : prev - 1); // ✅ Compte à rebours
```

---

### 2. Erreur "userId et code requis"

**Problème**: userId potentiellement undefined ou code incomplet  
**Solution**: Validation avant l'appel API

**Ajouté:**
```javascript
// Vérifications
if (!userId) {
  setError('Erreur: userId manquant');
  return;
}

if (code.length !== 6) {
  setError('Code à 6 chiffres requis');
  return;
}

// Debug dans console
console.log('🔍 Vérification 2FA:', { userId, code, email });
```

---

## 🧪 Comment Tester

### 1. Rafraîchis la Page Frontend

Appuie sur **F5** ou **Ctrl+R** dans ton navigateur

---

### 2. Connecte-Toi

```
Username: bakr_sassi
Password: pass
```

---

### 3. Vérifie le Timer

Le popup 2FA devrait maintenant afficher:
```
⏱️ Expire dans: 5:00
              4:59
              4:58
              ...
```

Au lieu de:
```
❌ Expire dans: 0:00  (Ancien problème)
```

---

### 4. Récupère le Code 2FA

**Option A - Email:**
Vérifie `bakrtn9@gmail.com` (et SPAM!)

**Option B - Database (Plus rapide):**
```powershell
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

Le code le plus récent est: **637918** (valide encore 3 minutes)

---

### 5. Entre le Code

Entre les 6 chiffres du code.

---

### 6. Vérifie la Console du Navigateur (F12)

Tu devrais voir:
```
🔍 Vérification 2FA: {
  userId: 1,
  code: "637918",
  email: "bakrtn9@gmail.com",
  username: "bakr_sassi"
}
```

**Si userId est undefined** → Le problème vient de Login.js qui ne passe pas userId

---

## 🔍 Debug - Si userId Manquant

Si tu vois `userId: undefined` dans la console, vérifie Login.js:

```javascript
// Doit passer userId au composant
<TwoFactorVerification
  email={twoFactorData.email}
  username={twoFactorData.username}
  userId={twoFactorData.userId}  // ← Cette ligne!
  onVerified={handleTwoFactorVerified}
  onCancel={handleTwoFactorCancel}
/>
```

Et `twoFactorData` doit contenir:
```javascript
setTwoFactorData({
  email: result.email,
  username: result.username,
  userId: result.userId  // ← De la réponse API
});
```

---

## 📊 Requête API Attendue

Quand tu cliques "Vérifier", le frontend envoie:

```http
POST http://localhost:5003/api/auth/verify-2fa
Content-Type: application/json

{
  "userId": 1,
  "code": "637918"
}
```

**Réponse attendue:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "bakr_sassi",
    "email": "bakrtn9@gmail.com",
    "role": "super_admin"
  }
}
```

---

## ✅ Résumé des Corrections

| Problème | Cause | Solution |
|----------|-------|----------|
| Timer 00:00 | Cherchait dans localStorage vide | Compte à rebours local de 5 min |
| "userId requis" | userId undefined ou validation manquante | Validation + logs debug |

---

## 🚀 TESTE MAINTENANT

1. **Rafraîchis** le navigateur (F5)
2. **Connecte-toi** avec bakr_sassi / pass
3. **Vérifie** que le timer affiche 5:00 et décrémente
4. **Récupère** le code de la DB: `637918`
5. **Entre** le code
6. **Ouvre** F12 → Console pour voir les logs
7. **Tu devrais être connecté!** ✅

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

**Dis-moi:**
1. Que vois-tu dans la console (F12 → Console)?
2. Le timer décrémente-t-il correctement?
3. Quel message d'erreur apparaît quand tu cliques "Vérifier"?
4. Capture d'écran du popup 2FA?

Je vais t'aider à résoudre!
