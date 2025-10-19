# ✅ CORS FIXÉ - Port 3003 Autorisé

**Date**: 19 Octobre 2025  
**Problème**: Frontend sur port 3003 mais CORS configuré pour port 3000

---

## 🎯 Le Problème

```
Access-Control-Allow-Origin' header has a value 'http://localhost:3000' 
that is not equal to the supplied origin 'http://localhost:3003'
```

Le frontend React tourne sur **port 3003** au lieu de 3000, donc le backend refusait les requêtes CORS.

En conséquence:
- ❌ L'API backend était bloquée
- ⚠️ Le frontend utilisait le "mode local" (fallback)
- 📧 Le code 2FA s'affichait en console au lieu d'être envoyé par email

---

## 🔧 Solution Appliquée

**Fichier modifié:** `server/server.js`

**Avant:**
```javascript
app.use(cors({ origin: 'http://localhost:3000' }));
```

**Maintenant:**
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3003',  // ← AJOUTÉ pour ton frontend
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 🚀 REDÉMARRE LE BACKEND

**IMPORTANT:** Tu dois redémarrer le serveur backend!

### 1. Arrête le serveur actuel (Ctrl+C)

### 2. Redémarre-le:
```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

### 3. Le frontend tourne déjà sur port 3003

### 4. Rafraîchis la page du navigateur (F5)

---

## ✅ Maintenant Ça Va Fonctionner!

Quand tu te connecteras avec `bakr_sassi` / `pass`:

1. ✅ Frontend appelle `http://localhost:5000/api/auth/login`
2. ✅ CORS accepte la requête du port 3003
3. ✅ Backend vérifie le hash bcrypt dans MySQL
4. ✅ Backend génère le code 2FA
5. ✅ Backend envoie l'email à `bakrtn9@gmail.com` 📧
6. ✅ Tu reçois l'email (ou code dans DB)

---

## 📊 Ce Que Tu Verras

### Dans le Terminal Backend:
```
🔐 POST /api/auth/login
👤 Login attempt: bakr_sassi
✅ Password verified
✅ Email 2FA envoyé avec succès à bakrtn9@gmail.com
```

### Dans la Console du Navigateur:
```
✅ POST http://localhost:5000/api/auth/login 200 OK
```

**PLUS de message:**
- ❌ `⚠️ Backend non accessible, utilisation du mode local`
- ❌ `CORS policy: Response to preflight request doesn't pass`

---

## 🎯 Actions Immédiates

1. **Arrête le backend** (Ctrl+C dans le terminal)
2. **Redémarre le backend:**
   ```powershell
   node server/server.js
   ```
3. **Rafraîchis le frontend** (F5 dans le navigateur)
4. **Connecte-toi avec `bakr_sassi` / `pass`**
5. **Vérifie ton email `bakrtn9@gmail.com`** (et SPAM!)

---

## 📧 Code 2FA

Si l'email n'arrive toujours pas, récupère le code:

```powershell
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

Envoie-moi:
1. Les logs du terminal backend
2. La console du navigateur (F12 → Console)
3. Le message d'erreur exact

---

**🎉 REDÉMARRE LE BACKEND ET TESTE MAINTENANT!**
