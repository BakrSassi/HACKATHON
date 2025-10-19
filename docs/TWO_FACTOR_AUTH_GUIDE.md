# 🔐 Guide d'Authentification à Deux Facteurs (2FA)

## 🎯 Vue d'Ensemble

AURA intègre maintenant un système d'**authentification à deux facteurs (2FA)** pour renforcer la sécurité de vos comptes.

---

## ✨ Fonctionnalités

### 🔑 Génération de Code
- Code à **6 chiffres** généré aléatoirement
- Valide pendant **5 minutes**
- Maximum **3 tentatives** de vérification
- **🔥 ACTIVÉ POUR TOUS LES UTILISATEURS** (dynamique)

### 📧 Envoi par Email
- Email envoyé **automatiquement à chaque connexion**
- Message formaté avec le code de vérification
- Affichage dans la console (mode démo)
- **Pas besoin de configurer 2FA** - c'est automatique!

### ⏱️ Timer en Temps Réel
- Compte à rebours visible
- Alerte visuelle quand < 1 minute restante
- Option de renvoyer le code

### 🎨 Interface Interactive
- 6 champs de saisie individuels
- Auto-focus et navigation automatique
- Support du copier-coller
- Animation de succès/erreur

---

## 🚀 Utilisation

### ✨ 2FA Activée pour TOUS les Utilisateurs

**La 2FA est maintenant OBLIGATOIRE et AUTOMATIQUE pour tous les utilisateurs!**

Utilisateurs disponibles :
- **john_doe** (john@example.com)
- **jane_smith** (jane@example.com)
- **mike_wilson** (mike@example.com)
- **admin** (admin@aura.com)
- **moderator** (mod@aura.com)

#### Étape 1 : Connexion Normale
1. Entrez votre **username** et **password**
2. Cliquez sur "Connexion"

#### Étape 2 : Vérification 2FA (AUTOMATIQUE)
1. Un **modal** apparaît automatiquement (peu importe l'utilisateur)
2. Un **code est généré et envoyé** à votre email (visible dans la console F12)
3. Entrez le code à 6 chiffres
4. Le code est **vérifié automatiquement** quand les 6 chiffres sont saisis

#### Étape 3 : Accès Accordé
- ✅ Si le code est correct : Connexion réussie !
- ❌ Si le code est incorrect : 2 tentatives restantes
- 🔄 Si le code expire : Bouton "Renvoyer le code"

---

## 🔧 Voir le Code dans la Console

### Méthode 1 : Console du Navigateur

1. Appuyez sur **F12** pendant la connexion
2. Allez dans l'onglet **Console**
3. Vous verrez un email formaté avec le code :

```
╔════════════════════════════════════════════════════════════╗
║                    📧 EMAIL 2FA ENVOYÉ                     ║
╠════════════════════════════════════════════════════════════╣
║  To: jane@example.com                                      ║
║  Subject: Code de vérification AURA                        ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Bonjour jane_smith                                        ║
║                                                            ║
║  Votre code de vérification à deux facteurs est:           ║
║                                                            ║
║                       123456                               ║
║                                                            ║
║  Ce code est valide pendant 5 minutes.                     ║
║                                                            ║
║  Si vous n'avez pas demandé ce code, ignorez cet email.    ║
║                                                            ║
║  Cordialement,                                             ║
║  L'équipe AURA                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Méthode 2 : localStorage

```javascript
// Voir tous les codes 2FA actifs
const codes = JSON.parse(localStorage.getItem('aura_2fa_codes'));
console.log(codes);

// Exemple de sortie:
// {
//   "jane@example.com": {
//     "code": "123456",
//     "timestamp": 1697654400000,
//     "expiresIn": 300000,
//     "attempts": 0,
//     "maxAttempts": 3
//   }
// }
```

---

## 🔐 Activer/Désactiver la 2FA

### ⚠️ Note Importante

La 2FA est maintenant **TOUJOURS ACTIVE** par défaut dans le code.

Si vous voulez permettre des connexions sans 2FA pour certains utilisateurs, vous pouvez modifier le code dans `authService.js`:

```javascript
// Dans src/services/authService.js, ligne ~50

// OPTION 1: 2FA pour tous (actuel)
const code = generateTwoFactorCode();
await sendTwoFactorEmail(user.email, code, user.username);
return { requiresTwoFactor: true, ... };

// OPTION 2: 2FA conditionnelle (selon base de données)
if (user.security?.twoFactorEnabled) {
  const code = generateTwoFactorCode();
  await sendTwoFactorEmail(user.email, code, user.username);
  return { requiresTwoFactor: true, ... };
} else {
  return completeLogin(user); // Connexion directe
}

// OPTION 3: 2FA uniquement pour certains rôles
if (user.role === 'admin' || user.role === 'moderator') {
  return completeLogin(user); // Admins: connexion directe
} else {
  // Users: 2FA obligatoire
  const code = generateTwoFactorCode();
  await sendTwoFactorEmail(user.email, code, user.username);
  return { requiresTwoFactor: true, ... };
}
```

---

## 📊 Statut 2FA des Utilisateurs

| Username | Email | 2FA Activé | ID |
|----------|-------|------------|-----|
| john_doe | john@example.com | ✅ **OUI** (Auto) | user_001 |
| jane_smith | jane@example.com | ✅ **OUI** (Auto) | user_002 |
| mike_wilson | mike@example.com | ✅ **OUI** (Auto) | user_003 |
| admin | admin@aura.com | ✅ **OUI** (Auto) | admin_001 |
| moderator | mod@aura.com | ✅ **OUI** (Auto) | admin_002 |

**🔥 Tous les utilisateurs ont maintenant la 2FA activée automatiquement!**

---

## 🧪 Test de la 2FA

### Scénario 1 : Connexion avec N'IMPORTE QUEL Utilisateur

```
1. Login avec: john_doe / user123 (ou n'importe quel utilisateur)
2. Modal 2FA apparaît AUTOMATIQUEMENT
3. Vérifier le code dans la console (F12)
4. Entrer le code (ex: 123456)
5. ✅ Connexion réussie !
```

**Testez avec:**
- john_doe / user123
- jane_smith / user456
- mike_wilson / user789
- admin / Admin@2025
- moderator / Mod@2025

Tous déclencheront la 2FA!

### Scénario 2 : Code Incorrect

```
1. Login avec: john_doe / user123 (ou n'importe qui)
2. Modal 2FA apparaît
3. Entrer un code incorrect (ex: 000000)
4. ❌ "Code incorrect. 2 tentative(s) restante(s)."
5. Réessayer avec le bon code
```

### Scénario 3 : Code Expiré

```
1. Login avec: admin / Admin@2025 (ou n'importe qui)
2. Modal 2FA apparaît
3. Attendre 5 minutes
4. ⏱️ "Code expiré. Veuillez demander un nouveau code."
5. Cliquer sur "Renvoyer le code"
6. Nouveau code généré
```

### Scénario 4 : Trop de Tentatives

```
1. Login avec: moderator / Mod@2025 (ou n'importe qui)
2. Modal 2FA apparaît
3. Entrer 3 codes incorrects
4. 🚫 "Trop de tentatives échouées."
5. Demander un nouveau code
```

---

## 🎨 Fonctionnalités de l'Interface

### Auto-Complétion Intelligente
- Saisir un chiffre **passe automatiquement** au champ suivant
- **Retour arrière** revient au champ précédent
- **Coller** remplit tous les champs automatiquement

### Validation Automatique
- Quand les 6 chiffres sont saisis, **vérification automatique**
- Pas besoin de cliquer sur "Vérifier"

### Feedback Visuel
- ✅ **Vert** : Code correct
- ❌ **Rouge** : Code incorrect avec animation de secousse
- 🔵 **Bleu** : Focus actif avec effet de brillance
- ⏱️ **Orange** : Timer proche de l'expiration

---

## 📱 Responsive

L'interface 2FA s'adapte à tous les écrans :
- **Desktop** : 6 champs de 50x60px
- **Mobile** : 6 champs de 40x50px
- **Tablette** : Taille intermédiaire

---

## 🔒 Sécurité

### Mesures de Protection

1. **Expiration** : 5 minutes maximum
2. **Limitation** : 3 tentatives par code
3. **Code unique** : Nouveau code à chaque demande
4. **Stockage sécurisé** : localStorage avec timestamps
5. **Nettoyage automatique** : Codes expirés supprimés toutes les 10 min

### En Production (À Implémenter)

Pour un environnement de production, remplacer :

```javascript
// Remplacer sendTwoFactorEmail dans twoFactorService.js

import nodemailer from 'nodemailer'; // Ou SendGrid, AWS SES, etc.

export const sendTwoFactorEmail = async (email, code, username) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'noreply@aura.com',
    to: email,
    subject: 'Code de vérification AURA',
    html: `
      <h2>Bonjour ${username}</h2>
      <p>Votre code de vérification est:</p>
      <h1 style="color: #4CAF50; font-size: 48px;">${code}</h1>
      <p>Ce code expire dans 5 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};
```

---

## 🛠️ API du Service 2FA

### Fonctions Disponibles

```javascript
import twoFactorService from './services/twoFactorService';

// Générer un code
const code = twoFactorService.generateTwoFactorCode();
// "123456"

// Envoyer par email
await twoFactorService.sendTwoFactorEmail('user@example.com', code, 'username');

// Vérifier un code
const result = twoFactorService.verifyTwoFactorCode('user@example.com', '123456');
// { success: true, message: 'Code vérifié avec succès!' }

// Obtenir le temps restant
const timeLeft = twoFactorService.getCodeExpirationTime('user@example.com');
// 180 (secondes)

// Renvoyer un code
await twoFactorService.resendTwoFactorCode('user@example.com', 'username');

// Activer/Désactiver
twoFactorService.enableTwoFactor('user_001');
twoFactorService.disableTwoFactor('user_001');

// Nettoyer les codes expirés
const cleaned = twoFactorService.cleanExpiredCodes();
// 3 (codes supprimés)
```

---

## 🎓 Exemples Pratiques

### Exemple 1 : Tester avec N'IMPORTE QUEL utilisateur

```javascript
// Tous les utilisateurs déclenchent la 2FA maintenant!

// Test 1: john_doe (n'avait pas 2FA avant)
Username: john_doe
Password: user123
// → Modal 2FA apparaît ✅

// Test 2: admin
Username: admin
Password: Admin@2025
// → Modal 2FA apparaît ✅

// Test 3: moderator
Username: moderator
Password: Mod@2025
// → Modal 2FA apparaît ✅

// 1. Ouvrir la console (F12)
// 2. Copier le code affiché
// 3. Coller dans le modal 2FA
// 4. ✅ Connexion réussie !
```

### Exemple 2 : Désactiver la 2FA (si besoin)

```javascript
// Si vous voulez désactiver la 2FA pour un utilisateur spécifique,
// modifiez le code dans src/services/authService.js

// Ouvrir: src/services/authService.js
// Chercher la section "2FA ACTIVÉE POUR TOUS"
// Remplacer par une vérification conditionnelle:

if (user.security?.twoFactorEnabled) {
  const code = generateTwoFactorCode();
  await sendTwoFactorEmail(user.email, code, user.username);
  return { requiresTwoFactor: true, ... };
} else {
  return completeLogin(user);
}

// Puis dans la console:
const db = JSON.parse(localStorage.getItem('aura_database'));
const john = db.users.find(u => u.username === 'john_doe');
john.security.twoFactorEnabled = false; // Désactiver
localStorage.setItem('aura_database', JSON.stringify(db));
```

### Exemple 3 : Voir tous les codes actifs

```javascript
const codes = JSON.parse(localStorage.getItem('aura_2fa_codes') || '{}');
Object.entries(codes).forEach(([email, data]) => {
  console.log(`${email}: Code ${data.code} - Expire dans ${Math.floor((data.expiresIn - (Date.now() - data.timestamp)) / 1000)}s`);
});
```

---

## 🎉 Résumé

✅ **2FA OBLIGATOIRE** pour tous les utilisateurs (100% dynamique)  
✅ **Pas de configuration** nécessaire - active automatiquement  
✅ **Code à 6 chiffres** envoyé à chaque connexion  
✅ **Email simulé** visible dans la console (F12)  
✅ **Interface moderne** avec auto-complétion et validation  
✅ **Sécurité renforcée** : expiration, limitation de tentatives  
✅ **Timer en temps réel** avec alertes visuelles  
✅ **Support mobile** responsive  
✅ **Fonctionne pour TOUS** : users, admins, moderators  

---

## 💡 Astuces

1. **Copier-Coller** : Vous pouvez coller le code complet au lieu de taper chaque chiffre
2. **Console** : Le code est TOUJOURS visible dans la console (F12) pendant le développement
3. **localStorage** : Vérifier `aura_2fa_codes` pour voir tous les codes actifs
4. **Renvoyer** : Utilisez le bouton "Renvoyer" si le code expire
5. **TOUS les utilisateurs** : Peu importe qui se connecte, la 2FA sera demandée!

Profitez de la sécurité maximale d'AURA! 🔐✨
