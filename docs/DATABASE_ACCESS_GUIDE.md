# 💾 AURA - Guide d'Accès à la Base de Données

## 🎯 Vue d'Ensemble

AURA utilise un système de base de données JSON stocké dans **localStorage** du navigateur. Cette base de données contient :
- Tous les utilisateurs et leurs informations
- Tous les administrateurs et leurs permissions
- L'historique des connexions
- Les sessions actives
- Les paramètres système

---

## 📂 Structure de la Base de Données

### Fichier Source
```
📁 src/database/
  └── users.json          # Base de données initiale (template)

📁 src/services/
  └── databaseService.js  # Service de gestion de la DB
```

### Structure JSON

```json
{
  "users": [
    {
      "id": "user_001",
      "username": "john_doe",
      "password": "user123",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "👨",
        "phone": "+1 234-567-8901",
        "address": "123 Main St"
      },
      "portfolio": {
        "totalValue": 134200,
        "auraScore": 78,
        "assets": [...]
      },
      "security": {
        "twoFactorEnabled": false,
        "lastPasswordChange": "2025-09-15",
        "loginAttempts": 0,
        "ipWhitelist": []
      },
      "activity": {
        "joinedAt": "2025-08-01T10:00:00Z",
        "lastActive": "2025-10-18T14:30:00Z",
        "lastLogin": "2025-10-18T08:00:00Z",
        "loginCount": 47
      }
    }
  ],
  "admins": [...],
  "sessions": [],
  "loginHistory": [...],
  "settings": {...},
  "metadata": {...}
}
```

---

## 🔧 Méthodes d'Accès à la Base de Données

### Méthode 1 : Console du Navigateur (Recommandée)

#### Étape 1 : Ouvrir la Console
1. Appuyez sur **F12** dans votre navigateur
2. Cliquez sur l'onglet **Console**

#### Étape 2 : Importer le Service Database

```javascript
// Importer le service (déjà disponible globalement)
import databaseService from './services/databaseService.js';
```

#### Étape 3 : Utiliser les Commandes

```javascript
// Obtenir toute la base de données
const db = JSON.parse(localStorage.getItem('aura_database'));
console.log(db);

// Voir tous les utilisateurs
const users = db.users;
console.table(users);

// Voir tous les admins
const admins = db.admins;
console.table(admins);

// Voir l'historique des connexions
const loginHistory = db.loginHistory;
console.table(loginHistory);

// Rechercher un utilisateur spécifique
const john = db.users.find(u => u.username === 'john_doe');
console.log(john);
```

---

### Méthode 2 : Application Storage (Plus facile)

#### Étape 1 : Ouvrir DevTools
1. Appuyez sur **F12**
2. Allez dans **Application** (Chrome) ou **Storage** (Firefox)

#### Étape 2 : Naviguer vers localStorage
1. Dans le panneau de gauche, développez **Local Storage**
2. Cliquez sur **http://localhost:3000**

#### Étape 3 : Voir la Base de Données
- Cherchez la clé **`aura_database`**
- Cliquez dessus pour voir le contenu JSON
- Vous pouvez copier, modifier, ou supprimer

---

### Méthode 3 : Console JavaScript (Avancé)

#### Lire la Base de Données

```javascript
// Lire toute la DB
const db = JSON.parse(localStorage.getItem('aura_database'));

// Afficher joliment
console.log(JSON.stringify(db, null, 2));
```

#### Modifier un Utilisateur

```javascript
// 1. Lire la DB
const db = JSON.parse(localStorage.getItem('aura_database'));

// 2. Trouver et modifier l'utilisateur
const user = db.users.find(u => u.username === 'john_doe');
user.portfolio.totalValue = 200000;
user.portfolio.auraScore = 95;

// 3. Sauvegarder
localStorage.setItem('aura_database', JSON.stringify(db));

console.log('✅ Utilisateur modifié !');
```

#### Ajouter un Nouvel Utilisateur

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

const newUser = {
  id: `user_${String(db.users.length + 1).padStart(3, '0')}`,
  username: 'sarah_connor',
  password: 'terminator123',
  email: 'sarah@skynet.com',
  role: 'user',
  status: 'active',
  profile: {
    firstName: 'Sarah',
    lastName: 'Connor',
    avatar: '👩‍🦰',
    phone: '+1 555-FUTURE',
    address: 'Los Angeles, CA'
  },
  portfolio: {
    totalValue: 50000,
    auraScore: 70,
    assets: []
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: new Date().toISOString().split('T')[0],
    loginAttempts: 0,
    ipWhitelist: []
  },
  activity: {
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    lastLogin: null,
    loginCount: 0,
    totalTransactions: 0
  }
};

db.users.push(newUser);
db.metadata.totalUsers = db.users.length;
localStorage.setItem('aura_database', JSON.stringify(db));

console.log('✅ Nouvel utilisateur créé:', newUser.username);
```

#### Supprimer un Utilisateur

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

// Supprimer par username
db.users = db.users.filter(u => u.username !== 'john_doe');
db.metadata.totalUsers = db.users.length;

localStorage.setItem('aura_database', JSON.stringify(db));

console.log('✅ Utilisateur supprimé');
```

---

### Méthode 4 : Via l'Interface Admin (En Développement)

Une interface graphique sera disponible dans le dashboard admin :

1. Se connecter en tant que **admin**
2. Aller dans **Configuration** > **Base de Données**
3. Visualiser, modifier, exporter la DB

---

## 📊 Commandes Utiles

### Statistiques Rapides

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

console.log('📊 Statistiques:');
console.log('- Utilisateurs totaux:', db.users.length);
console.log('- Admins totaux:', db.admins.length);
console.log('- Utilisateurs actifs:', db.users.filter(u => u.status === 'active').length);
console.log('- Connexions enregistrées:', db.loginHistory.length);
console.log('- Valeur totale des portfolios:', db.users.reduce((sum, u) => sum + u.portfolio.totalValue, 0));
```

### Exporter la Base de Données

```javascript
// Méthode 1 : Copier dans le clipboard
const db = localStorage.getItem('aura_database');
navigator.clipboard.writeText(db);
console.log('📋 Base de données copiée dans le clipboard');

// Méthode 2 : Télécharger en fichier
const db = localStorage.getItem('aura_database');
const blob = new Blob([db], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `aura_backup_${new Date().toISOString().split('T')[0]}.json`;
a.click();
console.log('💾 Base de données téléchargée');
```

### Importer une Base de Données

```javascript
// Copier le JSON complet de votre backup
const backupData = {
  "users": [...],
  "admins": [...],
  // ... votre JSON complet
};

localStorage.setItem('aura_database', JSON.stringify(backupData));
console.log('✅ Base de données importée');

// Recharger la page
location.reload();
```

### Réinitialiser la Base de Données

```javascript
// ATTENTION : Cela supprime toutes les données !
localStorage.removeItem('aura_database');
console.log('🔄 Base de données supprimée');

// Recharger pour réinitialiser depuis users.json
location.reload();
```

---

## 🔍 Requêtes Avancées

### Trouver tous les utilisateurs avec Score AURA > 80

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

const highScorers = db.users.filter(u => u.portfolio.auraScore > 80);
console.table(highScorers.map(u => ({
  username: u.username,
  score: u.portfolio.auraScore,
  portfolio: u.portfolio.totalValue
})));
```

### Afficher l'historique de connexion d'un utilisateur

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

const username = 'john_doe';
const userLogins = db.loginHistory.filter(log => log.username === username);
console.table(userLogins);
```

### Calculer la valeur moyenne des portfolios

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));

const avgValue = db.users.reduce((sum, u) => sum + u.portfolio.totalValue, 0) / db.users.length;
console.log('💰 Valeur moyenne:', avgValue.toLocaleString('fr-FR'), '$');
```

---

## 🛠️ API du Service Database

### Fonctions Disponibles

```javascript
import databaseService from './services/databaseService';

// Lecture
databaseService.getDatabase();                    // Toute la DB
databaseService.getAllUsers();                    // Tous les users
databaseService.getAllAdmins();                   // Tous les admins
databaseService.findUserByUsername('john_doe');   // Trouver par username
databaseService.findUserById('user_001');         // Trouver par ID
databaseService.getLoginHistory(50);              // 50 dernières connexions
databaseService.searchUsers('john');              // Recherche

// Écriture
databaseService.createUser({...});                // Créer user
databaseService.updateUser('user_001', {...});    // Modifier user
databaseService.deleteUser('user_001');           // Supprimer user
databaseService.updateUserActivity('user_001');   // Mettre à jour activité
databaseService.logLoginAttempt('john_doe', true); // Log connexion

// Utilitaires
databaseService.getDatabaseStats();               // Statistiques
databaseService.exportDatabase();                 // Exporter en fichier
databaseService.importDatabase(jsonData);         // Importer
databaseService.resetDatabase();                  // Réinitialiser
```

---

## 📁 Emplacement Physique

### Dans le Navigateur
- **Outil** : DevTools > Application > Local Storage
- **Clé** : `aura_database`
- **Format** : JSON String

### Dans le Code
- **Fichier template** : `src/database/users.json`
- **Service** : `src/services/databaseService.js`
- **Utilisé par** : `src/services/authService.js`

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **En Production** : Utiliser un backend réel (Node.js + MongoDB/PostgreSQL)
2. **Mots de passe** : Hasher avec bcrypt (actuellement en clair)
3. **Tokens** : Utiliser JWT au lieu de tokens simples
4. **Validation** : Valider toutes les entrées utilisateur
5. **Backup** : Sauvegarder régulièrement la DB

### Accès Restreint

- Seuls les **super_admin** peuvent accéder à la DB complète
- Les **moderators** voient uniquement certaines données
- Les **users** ne voient que leurs propres données

---

## 📦 Backup et Restauration

### Créer un Backup

```javascript
// Méthode automatique (Admin uniquement)
import authService from './services/authService';
authService.exportDatabaseBackup();

// Méthode manuelle
const db = localStorage.getItem('aura_database');
const backup = {
  date: new Date().toISOString(),
  data: JSON.parse(db)
};
console.log('Backup:', JSON.stringify(backup, null, 2));
```

### Restaurer depuis un Backup

```javascript
const backupData = {...}; // Votre JSON de backup

localStorage.setItem('aura_database', JSON.stringify(backupData.data));
location.reload();
```

---

## 🎓 Exemples Pratiques

### Exemple 1 : Changer le mot de passe d'un utilisateur

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));
const user = db.users.find(u => u.username === 'john_doe');
user.password = 'nouveau_mot_de_passe';
user.security.lastPasswordChange = new Date().toISOString().split('T')[0];
localStorage.setItem('aura_database', JSON.stringify(db));
console.log('✅ Mot de passe changé');
```

### Exemple 2 : Activer 2FA pour un utilisateur

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));
const user = db.users.find(u => u.username === 'jane_smith');
user.security.twoFactorEnabled = true;
localStorage.setItem('aura_database', JSON.stringify(db));
console.log('✅ 2FA activé');
```

### Exemple 3 : Voir les utilisateurs les plus actifs

```javascript
const db = JSON.parse(localStorage.getItem('aura_database'));
const sorted = db.users.sort((a, b) => b.activity.loginCount - a.activity.loginCount);
console.table(sorted.map(u => ({
  username: u.username,
  logins: u.activity.loginCount,
  lastActive: u.activity.lastActive
})));
```

---

## 🆘 Dépannage

### Problème : DB n'existe pas
```javascript
// Initialiser
import databaseService from './services/databaseService';
databaseService.initializeDatabase();
```

### Problème : DB corrompue
```javascript
// Réinitialiser
localStorage.removeItem('aura_database');
location.reload();
```

### Problème : Données perdues
```javascript
// Restaurer depuis users.json
import usersDatabase from '../database/users.json';
localStorage.setItem('aura_database', JSON.stringify(usersDatabase));
location.reload();
```

---

## 📝 Notes Importantes

1. **localStorage** est limité à ~5-10MB selon le navigateur
2. Les données sont **spécifiques au domaine** (localhost:3000)
3. Effacer le cache du navigateur **supprime la DB**
4. En mode **navigation privée**, la DB est temporaire
5. Pour un **environnement de production**, migrer vers un backend

---

## 🎉 Résumé

✅ Base de données JSON dans localStorage  
✅ Accessible via DevTools (F12)  
✅ API complète dans databaseService.js  
✅ Backup/Restore facile  
✅ Modifications en temps réel  
✅ Historique complet des connexions  

**Commande rapide pour tout voir :**
```javascript
console.table(JSON.parse(localStorage.getItem('aura_database')).users);
```

Bonne exploration de la base de données AURA! 💾
