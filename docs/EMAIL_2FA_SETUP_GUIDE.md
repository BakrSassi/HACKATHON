# 📧 Guide de Configuration Email 2FA

Ce guide vous explique comment configurer l'envoi réel d'emails pour la vérification 2FA.

## 📋 Table des Matières
- [Configuration Gmail (Recommandé)](#configuration-gmail)
- [Configuration Outlook/Hotmail](#configuration-outlook)
- [Configuration SMTP Personnalisé](#configuration-smtp)
- [Configuration SendGrid](#configuration-sendgrid)
- [Test de Configuration](#test-de-configuration)
- [Dépannage](#dépannage)

---

## 🎯 Configuration Gmail (Recommandé)

Gmail est la solution la plus simple et gratuite pour commencer.

### Étape 1: Créer un App Password Gmail

1. **Connectez-vous à votre compte Gmail**
   - Allez sur [https://myaccount.google.com/](https://myaccount.google.com/)

2. **Activer la vérification en 2 étapes**
   - Sécurité → Vérification en 2 étapes → Activer
   - Suivez les instructions

3. **Créer un App Password**
   - Retournez dans Sécurité
   - Recherchez "Mots de passe des applications" ou "App Passwords"
   - Cliquez sur "Générer"
   - Sélectionnez "Autre (nom personnalisé)"
   - Entrez "AURA CryptoShield"
   - Cliquez sur "Générer"
   - **Copiez le mot de passe à 16 caractères** (ex: `abcd efgh ijkl mnop`)

### Étape 2: Configuration du fichier .env

Ouvrez votre fichier `.env` et ajoutez:

```env
# ================================================
# 📧 CONFIGURATION EMAIL (2FA)
# ================================================

# Provider email (gmail, outlook, smtp, sendgrid)
EMAIL_PROVIDER=gmail

# Votre adresse Gmail
EMAIL_USER=votre-email@gmail.com

# App Password Gmail (16 caractères)
EMAIL_PASSWORD=abcd efgh ijkl mnop

# Nom de l'expéditeur (affiché dans l'email)
EMAIL_FROM_NAME=AURA CryptoShield
```

### Étape 3: Remplacer les valeurs

```env
EMAIL_USER=bakrtn9@gmail.com
EMAIL_PASSWORD=votre-app-password-ici
```

⚠️ **Important**: Utilisez le **App Password** (16 caractères), PAS votre mot de passe Gmail normal!

---

## 📮 Configuration Outlook/Hotmail

### Étape 1: Configuration

Ouvrez votre fichier `.env`:

```env
# ================================================
# 📧 CONFIGURATION EMAIL (2FA)
# ================================================

EMAIL_PROVIDER=outlook
EMAIL_USER=votre-email@outlook.com
EMAIL_PASSWORD=votre-mot-de-passe
EMAIL_FROM_NAME=AURA CryptoShield
```

### Étape 2: Activer "Autoriser les applications moins sécurisées"

1. Allez sur [https://account.live.com/proofs/manage/additional](https://account.live.com/proofs/manage/additional)
2. Activez "Applications moins sécurisées"

---

## 🔧 Configuration SMTP Personnalisé

Pour utiliser un serveur SMTP personnalisé:

```env
# ================================================
# 📧 CONFIGURATION EMAIL (2FA)
# ================================================

EMAIL_PROVIDER=smtp

# Serveur SMTP
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_SECURE=false

# Identifiants
EMAIL_USER=noreply@votre-domaine.com
EMAIL_PASSWORD=votre-mot-de-passe

EMAIL_FROM_NAME=AURA CryptoShield
```

**Ports SMTP communs:**
- `587` - TLS (recommandé)
- `465` - SSL (mettre `SMTP_SECURE=true`)
- `25` - Non sécurisé (déconseillé)

---

## 📨 Configuration SendGrid

SendGrid offre 100 emails/jour gratuits.

### Étape 1: Créer un compte SendGrid

1. Créez un compte sur [https://sendgrid.com/](https://sendgrid.com/)
2. Vérifiez votre email
3. Créez une API Key:
   - Settings → API Keys → Create API Key
   - Nommez-la "AURA CryptoShield"
   - Full Access
   - Copiez l'API Key

### Étape 2: Configuration

```env
# ================================================
# 📧 CONFIGURATION EMAIL (2FA)
# ================================================

EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_USER=noreply@votre-domaine.com
EMAIL_FROM_NAME=AURA CryptoShield
```

---

## ✅ Test de Configuration

### Méthode 1: Test API

```bash
# Tester la configuration
curl http://localhost:5000/api/test-email

# Envoyer un email de test
curl -X POST http://localhost:5000/api/test-email-send \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"votre-email@gmail.com\"}"
```

### Méthode 2: Test PowerShell

```powershell
# Tester la configuration
Invoke-WebRequest -Uri http://localhost:5000/api/test-email -UseBasicParsing

# Envoyer un email de test
$body = @{email='votre-email@gmail.com'} | ConvertTo-Json
Invoke-WebRequest -Uri http://localhost:5000/api/test-email-send -Method POST -ContentType 'application/json' -Body $body -UseBasicParsing
```

### Méthode 3: Tester avec une vraie connexion 2FA

1. Démarrez le serveur: `node server/server.js`
2. Connectez-vous avec `bakr_sassi` / `pass`
3. Vérifiez votre boîte email
4. Entrez le code reçu

---

## 🔍 Résultats Attendus

### ✅ Configuration Valide (Email réellement envoyé)

```
✅ Email 2FA envoyé à bakrtn9@gmail.com
```

Dans votre boîte email, vous recevrez un **email HTML stylisé** avec:
- En-tête AURA CryptoShield avec design moderne
- Code à 6 chiffres bien visible
- Informations sur la validité (5 minutes)
- Avertissement de sécurité

### ⚠️ Mode Simulation (Configuration manquante)

```
╔════════════════════════════════════════════════════════════╗
║           📧 EMAIL 2FA SIMULÉ (MODE DEV)                  ║
╠════════════════════════════════════════════════════════════╣
║  To: bakrtn9@gmail.com                                     ║
║  User: bakr_sassi                                          ║
║  Code: 123456                                              ║
║  Status: Mode simulation - Email non envoyé               ║
╚════════════════════════════════════════════════════════════╝
```

Le système bascule automatiquement en mode simulation si:
- `EMAIL_USER` ou `EMAIL_PASSWORD` manquant dans `.env`
- Erreur de connexion au serveur email
- Identifiants invalides

---

## 🐛 Dépannage

### Problème: "Invalid login" (Gmail)

**Solution:**
- ✅ Vérifiez que vous utilisez un **App Password**, pas votre mot de passe Gmail
- ✅ Vérifiez que la vérification en 2 étapes est activée
- ✅ Générez un nouveau App Password si nécessaire

### Problème: "Connection timeout"

**Solution:**
- ✅ Vérifiez votre connexion internet
- ✅ Vérifiez que le port n'est pas bloqué par votre firewall
- ✅ Essayez un autre provider (Gmail si vous utilisiez Outlook)

### Problème: "Self signed certificate error"

**Solution:**
Ajoutez dans `.env`:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```
⚠️ Uniquement en développement!

### Problème: Email dans les spams

**Solution:**
- ✅ Ajoutez l'adresse expéditrice à vos contacts
- ✅ Marquez l'email comme "Non spam"
- ✅ Pour la production, configurez SPF/DKIM/DMARC

---

## 📝 Exemple de Configuration Complète (.env)

```env
# ================================================
# 📧 CONFIGURATION EMAIL 2FA
# ================================================

# Gmail (Recommandé pour le développement)
EMAIL_PROVIDER=gmail
EMAIL_USER=bakrtn9@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM_NAME=AURA CryptoShield

# Alternative: Outlook
# EMAIL_PROVIDER=outlook
# EMAIL_USER=votre-email@outlook.com
# EMAIL_PASSWORD=votre-mot-de-passe

# Alternative: SendGrid (Production)
# EMAIL_PROVIDER=sendgrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx
# EMAIL_USER=noreply@aura-crypto.com

# Alternative: SMTP Personnalisé
# EMAIL_PROVIDER=smtp
# SMTP_HOST=smtp.votre-domaine.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=noreply@votre-domaine.com
# EMAIL_PASSWORD=votre-mot-de-passe
```

---

## 🎨 Aperçu de l'Email Envoyé

L'email 2FA contient:

```
┌─────────────────────────────────────────┐
│   🔐 AURA CryptoShield                  │
│   Sécurité & Intelligence Artificielle  │
├─────────────────────────────────────────┤
│                                         │
│   Bonjour bakr_sassi,                   │
│                                         │
│   Votre code de vérification:          │
│                                         │
│            123456                       │
│                                         │
│   ⏱️  Valide 5 minutes                  │
│   🔢 3 tentatives maximum               │
│   🔒 Ne pas partager                    │
│                                         │
│   ⚠️ Pas vous? Ignorez cet email       │
│                                         │
└─────────────────────────────────────────┘
```

Design moderne avec:
- Dégradé violet/bleu (couleurs AURA)
- Code en gros et bien lisible
- Icônes et sections claires
- Footer professionnel

---

## 🚀 Prochaines Étapes

1. **Choisissez votre provider email** (Gmail recommandé)
2. **Configurez le fichier .env** avec vos identifiants
3. **Testez avec**: `curl http://localhost:5000/api/test-email`
4. **Envoyez un email de test**: `curl -X POST http://localhost:5000/api/test-email-send -H "Content-Type: application/json" -d "{\"email\":\"votre-email@gmail.com\"}"`
5. **Testez une vraie connexion 2FA** avec bakr_sassi

---

## 📞 Besoin d'Aide?

Si vous rencontrez des problèmes:

1. Vérifiez que toutes les variables sont dans `.env`
2. Redémarrez le serveur après modification du `.env`
3. Testez d'abord avec `GET /api/test-email`
4. Consultez les logs du serveur pour les erreurs

---

## 🔒 Sécurité

**Important:**
- ✅ Ne commitez JAMAIS votre `.env` sur Git
- ✅ Utilisez des App Passwords, pas vos vrais mots de passe
- ✅ Pour la production, utilisez SendGrid ou un service professionnel
- ✅ Activez SPF/DKIM pour éviter les spams

---

**Fait avec ❤️ par AURA CryptoShield**
