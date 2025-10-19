# 🚀 Guide Rapide - Configuration Email 2FA en 5 Minutes

## ⚡ Configuration Express avec Gmail

### 1️⃣ Créer un App Password Gmail (2 minutes)

1. Allez sur: [https://myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez **"Vérification en 2 étapes"** si pas déjà fait
3. Recherchez **"Mots de passe des applications"** ou **"App passwords"**
4. Créez un nouveau mot de passe:
   - Nom: `AURA CryptoShield`
   - Copiez le mot de passe à 16 caractères (ex: `abcd efgh ijkl mnop`)

### 2️⃣ Configurer le .env (1 minute)

Ouvrez `c:\Users\bakrt\cryptoshield-advisor\.env` et modifiez:

```env
# ----------------------------------------
# 📧 Email Configuration (2FA)
# ----------------------------------------
EMAIL_PROVIDER=gmail
EMAIL_USER=bakrtn9@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=AURA CryptoShield
```

**Remplacez:**
- `bakrtn9@gmail.com` → Votre email Gmail
- `abcd efgh ijkl mnop` → Votre App Password (16 caractères)

### 3️⃣ Tester la configuration (1 minute)

```powershell
# Dans le terminal PowerShell
node test-email-config.js
```

**Résultat attendu:**
```
✅ Configuration complète détectée
✅ Connexion au serveur email réussie!
✅ Email envoyé avec succès!
```

### 4️⃣ Tester avec une vraie connexion 2FA (1 minute)

1. Démarrez le serveur: `node server/server.js`
2. Allez sur: `http://localhost:3000/login`
3. Connectez-vous: `bakr_sassi` / `pass`
4. **Vérifiez votre boîte email Gmail** 📧
5. Entrez le code reçu

---

## 🎯 C'est tout!

Vous devriez maintenant recevoir de **vrais emails** avec:
- ✅ Design professionnel avec dégradé violet/bleu
- ✅ Code à 6 chiffres bien visible
- ✅ Informations de sécurité
- ✅ Footer AURA CryptoShield

---

## ❓ Problèmes?

### Email pas reçu?
- ✅ Vérifiez les **spams**
- ✅ Attendez 1-2 minutes (peut être lent)
- ✅ Vérifiez que l'App Password est correct

### "Invalid login"?
- ✅ Utilisez un **App Password**, pas votre mot de passe Gmail
- ✅ Supprimez les espaces dans le mot de passe
- ✅ Vérifiez que la vérification en 2 étapes est activée

### Mode simulation activé?
- ✅ Vérifiez que `EMAIL_USER` et `EMAIL_PASSWORD` sont dans `.env`
- ✅ Redémarrez le serveur: `Ctrl+C` puis `node server/server.js`

---

## 📚 Plus d'Options

Pour d'autres providers (Outlook, SendGrid, SMTP):
👉 Consultez: `EMAIL_2FA_SETUP_GUIDE.md`

---

**Fait avec ❤️ par AURA CryptoShield**
