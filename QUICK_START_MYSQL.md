# 🚀 GUIDE RAPIDE - Installation MySQL AURA

## ⚡ Installation en 3 Minutes

### Étape 1: Ouvrir phpMyAdmin
✅ J'ai ouvert phpMyAdmin pour vous: http://localhost/phpmyadmin

### Étape 2: Créer la Base de Données

Dans phpMyAdmin:

1. **Cliquez sur "Nouvelle base de données"** (dans le menu de gauche)
2. **Nom de la base:** `aura_db`
3. **Interclassement:** `utf8mb4_unicode_ci`
4. **Cliquez sur "Créer"**

### Étape 3: Importer les Tables

1. **Cliquez sur la base `aura_db`** que vous venez de créer
2. **Cliquez sur l'onglet "Importer"** (en haut)
3. **Cliquez sur "Choisir un fichier"**
4. **Sélectionnez:** `C:\Users\bakrt\cryptoshield-advisor\database\aura_database.sql`
5. **Cliquez sur "Exécuter"** (tout en bas)

✅ **C'est fait!** La base de données est créée avec toutes les tables et vos données!

---

## 📊 Ce qui Sera Créé

### Tables (7):
- ✅ `users` - 4 utilisateurs (dont bakr_sassi)
- ✅ `assets` - ~10 actifs crypto
- ✅ `login_history` - Historique des connexions
- ✅ `sessions` - Sessions actives
- ✅ `two_factor_codes` - Codes 2FA
- ✅ `transactions` - Transactions
- ✅ `notifications` - Notifications

### Votre Compte:
- **Username:** `bakr_sassi`
- **Password:** `pass`
- **Email:** `bakrtn9@gmail.com`
- **Portfolio:** $250,000
- **Role:** super_admin
- **Score AURA:** 95/100

---

## 🔄 Après l'Import

Retournez dans le terminal et **relancez** le serveur:

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

---

## 🎯 Vérification Rapide

### Test 1: Vérifier les Données

Dans phpMyAdmin, cliquez sur `aura_db` puis sur la table `users`.

Vous devriez voir 4 utilisateurs dont **bakr_sassi**.

### Test 2: Tester l'API

Ouvrez: http://localhost:5000

Vous devriez voir la liste des endpoints API.

---

## 💡 En Cas de Problème

### Problème: "Unknown database 'aura_db'"
**Solution:** Créez la base manuellement (Étape 2 ci-dessus)

### Problème: "Access denied"
**Solution:** Vérifiez `.env`:
```env
DB_USER=root
DB_PASSWORD=
```

### Problème: "Cannot connect to MySQL"
**Solution:** Démarrez MySQL dans XAMPP Control Panel

---

## ✅ Checklist

- [ ] phpMyAdmin ouvert
- [ ] Base de données `aura_db` créée
- [ ] Fichier SQL importé
- [ ] Serveur backend démarré
- [ ] API accessible sur http://localhost:5000

---

**Temps estimé:** 2-3 minutes ⏱️

Une fois terminé, votre application utilisera une **vraie base de données MySQL** au lieu du localStorage! 🎉
