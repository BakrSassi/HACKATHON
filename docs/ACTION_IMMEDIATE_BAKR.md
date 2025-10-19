# ✅ ACTION IMMÉDIATE - Bakr

**🎯 Ce que tu dois faire MAINTENANT pour tester si l'email arrive**

---

## 🚀 ÉTAPE 1: Démarrer le Serveur

**Ouvre un terminal PowerShell** et tape:

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node server/server.js
```

✅ Tu devrais voir:
```
🚀 SERVEUR AURA DÉMARRÉ (v2.0 - DYNAMIQUE)
📍 URL: http://localhost:5000
✅ Connexion MySQL: OK
```

⚠️ **IMPORTANT: Laisse ce terminal OUVERT et ne touche à rien!**

---

## 📧 ÉTAPE 2: Vérifie l'email de test (si pas encore fait)

**Dans un NOUVEAU terminal**, tape:

```powershell
cd C:\Users\bakrt\cryptoshield-advisor
node test-email-config.js
```

**Question:**
- ✅ As-tu reçu un email à `noreply.aura.tn@gmail.com`?
- ✅ Dans la boîte de réception ou SPAM?

Si OUI → Continue à l'étape 3  
Si NON → Il y a un problème de config Gmail (dis-le moi)

---

## 🔐 ÉTAPE 3: Test de Login depuis le Frontend

1. **Ouvre ton navigateur Chrome/Firefox**

2. **Va sur:**
   ```
   http://localhost:3000/login
   ```
   (Si le frontend n'est pas démarré, tape `npm start` dans un autre terminal)

3. **Connecte-toi avec:**
   - Username: `bakr_sassi`
   - Password: `pass`

4. **Regarde IMMÉDIATEMENT dans le terminal du serveur**
   - Est-ce que tu vois: `✅ Email 2FA envoyé avec succès à bakrtn9@gmail.com` ?
   - Ou: `🔐 CODE 2FA pour bakr_sassi: XXXXXX` ?

5. **Ouvre ta boîte email `bakrtn9@gmail.com`**
   - Cherche un nouvel email
   - **REGARDE DANS LES SPAMS** ⚠️
   - Cherche: `from:noreply.aura.tn@gmail.com`
   - Sujet: "Code de vérification AURA"

---

## 📊 ÉTAPE 4: Vérifie la Database

Si l'email n'arrive pas, récupère le code de la DB:

```powershell
echo "SELECT code FROM two_factor_codes WHERE user_id=1 ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db -N -s
```

Copie ce code et utilise-le pour te connecter.

---

## 🐛 ÉTAPE 5: Dis-moi le Résultat

**Dis-moi:**

### A. Le serveur a-t-il affiché un de ces messages? 
- [ ] `✅ Email 2FA envoyé avec succès`
- [ ] `🔐 CODE 2FA pour bakr_sassi: XXXXXX`
- [ ] `⚠️  Erreur envoi email 2FA`
- [ ] Aucun message

### B. As-tu reçu l'email à `bakrtn9@gmail.com`?
- [ ] Oui, dans la boîte de réception
- [ ] Oui, dans les SPAMS
- [ ] Non, rien du tout

### C. L'email de test (`test-email-config.js`) est-il arrivé?
- [ ] Oui, reçu à `noreply.aura.tn@gmail.com`
- [ ] Non

---

## 🎯 Résultats Possibles

### Scénario 1: Email de test OK, email login KO
→ **Problème dans le code du login**, pas dans l'email service  
→ Je vais ajouter plus de logs

### Scénario 2: Email de test OK, email login OK
→ **TOUT FONCTIONNE!** 🎉  
→ L'email était juste dans les spams

### Scénario 3: Aucun email ne fonctionne
→ **Problème de config Gmail**  
→ Vérifie le mot de passe d'application

### Scénario 4: Code visible en console
→ **Mode simulation activé**  
→ Je vais vérifier pourquoi

---

## ⏰ Attends Combien de Temps?

- Gmail peut prendre **1-2 minutes** pour délivrer l'email
- Rafraîchis ta boîte email
- Regarde **ABSOLUMENT** dans les spams

---

## 🆘 Si Rien ne Fonctionne

Envoie-moi une capture d'écran:
1. Du terminal du serveur (les logs)
2. De ta boîte email (pour voir qu'il n'y a rien)
3. Du résultat de la commande database

---

## 💡 Code Temporaire

En attendant, tu peux te connecter avec le code de la database:

```powershell
# Dernier code généré
echo "SELECT code, created_at FROM two_factor_codes ORDER BY created_at DESC LIMIT 1;" | C:\xampp\mysql\bin\mysql.exe -u root aura_db
```

Utilise ce code dans l'interface 2FA (il expire après 5 minutes).

---

**⏳ Je t'attends, fais le test et dis-moi ce qui se passe!**
