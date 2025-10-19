/**
 * 💾 Database Service
 * Service pour gérer la base de données locale JSON
 */

import usersDatabase from '../database/users.json';

// Clé pour le localStorage de la base de données
const DB_KEY = 'aura_database';

/**
 * Initialiser la base de données dans localStorage
 */
export const initializeDatabase = () => {
  const existingDb = localStorage.getItem(DB_KEY);
  
  if (!existingDb) {
    // Première initialisation : utiliser les données du fichier JSON
    localStorage.setItem(DB_KEY, JSON.stringify(usersDatabase));
    console.log('✅ Base de données initialisée depuis users.json');
    return usersDatabase;
  }
  
  return JSON.parse(existingDb);
};

/**
 * Obtenir toute la base de données
 */
export const getDatabase = () => {
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    return initializeDatabase();
  }
  return JSON.parse(db);
};

/**
 * Sauvegarder la base de données
 */
export const saveDatabase = (database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(database));
  console.log('💾 Base de données sauvegardée');
  return true;
};

/**
 * Obtenir tous les utilisateurs
 */
export const getAllUsers = () => {
  const db = getDatabase();
  return db.users || [];
};

/**
 * Obtenir tous les admins
 */
export const getAllAdmins = () => {
  const db = getDatabase();
  return db.admins || [];
};

/**
 * Trouver un utilisateur par username
 */
export const findUserByUsername = (username) => {
  const users = getAllUsers();
  const admins = getAllAdmins();
  
  // Chercher d'abord dans les users
  let user = users.find(u => u.username === username);
  if (user) return { ...user, type: 'user' };
  
  // Puis dans les admins
  user = admins.find(a => a.username === username);
  if (user) return { ...user, type: 'admin' };
  
  return null;
};

/**
 * Trouver un utilisateur par ID
 */
export const findUserById = (userId) => {
  const users = getAllUsers();
  const admins = getAllAdmins();
  
  let user = users.find(u => u.id === userId);
  if (user) return { ...user, type: 'user' };
  
  user = admins.find(a => a.id === userId);
  if (user) return { ...user, type: 'admin' };
  
  return null;
};

/**
 * Créer un nouvel utilisateur
 */
export const createUser = (userData) => {
  const db = getDatabase();
  
  // Générer un ID unique
  const newId = `user_${String(db.users.length + 1).padStart(3, '0')}`;
  
  const newUser = {
    id: newId,
    username: userData.username,
    password: userData.password, // En production : hasher avec bcrypt
    email: userData.email,
    role: 'user',
    status: 'active',
    profile: {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      avatar: userData.avatar || '👤',
      phone: userData.phone || '',
      address: userData.address || ''
    },
    portfolio: {
      totalValue: 0,
      auraScore: 50,
      assets: []
    },
    security: {
      twoFactorEnabled: false,
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
  saveDatabase(db);
  
  return newUser;
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUser = (userId, updates) => {
  const db = getDatabase();
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    saveDatabase(db);
    return db.users[userIndex];
  }
  
  const adminIndex = db.admins.findIndex(a => a.id === userId);
  if (adminIndex !== -1) {
    db.admins[adminIndex] = { ...db.admins[adminIndex], ...updates };
    saveDatabase(db);
    return db.admins[adminIndex];
  }
  
  return null;
};

/**
 * Supprimer un utilisateur
 */
export const deleteUser = (userId) => {
  const db = getDatabase();
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    const deletedUser = db.users.splice(userIndex, 1)[0];
    db.metadata.totalUsers = db.users.length;
    saveDatabase(db);
    return deletedUser;
  }
  
  return null;
};

/**
 * Enregistrer une tentative de connexion
 */
export const logLoginAttempt = (username, success, ip = 'unknown', location = 'unknown') => {
  const db = getDatabase();
  const user = findUserByUsername(username);
  
  const logEntry = {
    id: `log_${String(db.loginHistory.length + 1).padStart(3, '0')}`,
    userId: user?.id || 'unknown',
    username: username,
    timestamp: new Date().toISOString(),
    ip: ip,
    userAgent: navigator.userAgent || 'unknown',
    success: success,
    location: location
  };
  
  db.loginHistory.push(logEntry);
  
  // Garder seulement les 100 dernières entrées
  if (db.loginHistory.length > 100) {
    db.loginHistory = db.loginHistory.slice(-100);
  }
  
  saveDatabase(db);
  return logEntry;
};

/**
 * Mettre à jour l'activité d'un utilisateur
 */
export const updateUserActivity = (userId, activityType = 'login') => {
  const db = getDatabase();
  
  const updateActivity = (user) => {
    user.activity.lastActive = new Date().toISOString();
    
    if (activityType === 'login') {
      user.activity.lastLogin = new Date().toISOString();
      user.activity.loginCount = (user.activity.loginCount || 0) + 1;
    }
    
    return user;
  };
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex] = updateActivity(db.users[userIndex]);
    saveDatabase(db);
    return db.users[userIndex];
  }
  
  const adminIndex = db.admins.findIndex(a => a.id === userId);
  if (adminIndex !== -1) {
    db.admins[adminIndex] = updateActivity(db.admins[adminIndex]);
    saveDatabase(db);
    return db.admins[adminIndex];
  }
  
  return null;
};

/**
 * Obtenir les statistiques de la base de données
 */
export const getDatabaseStats = () => {
  const db = getDatabase();
  
  return {
    totalUsers: db.users.length,
    totalAdmins: db.admins.length,
    activeUsers: db.users.filter(u => u.status === 'active').length,
    totalLogins: db.loginHistory.length,
    lastBackup: db.metadata.lastBackup,
    version: db.metadata.version
  };
};

/**
 * Exporter la base de données
 */
export const exportDatabase = () => {
  const db = getDatabase();
  const dataStr = JSON.stringify(db, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aura_database_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  console.log('📦 Base de données exportée');
  return true;
};

/**
 * Importer une base de données
 */
export const importDatabase = (jsonData) => {
  try {
    const parsedData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Vérifier que les champs essentiels existent
    if (!parsedData.users || !parsedData.admins) {
      throw new Error('Format de base de données invalide');
    }
    
    saveDatabase(parsedData);
    console.log('📥 Base de données importée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
    return false;
  }
};

/**
 * Réinitialiser la base de données
 */
export const resetDatabase = () => {
  localStorage.removeItem(DB_KEY);
  const freshDb = initializeDatabase();
  console.log('🔄 Base de données réinitialisée');
  return freshDb;
};

/**
 * Obtenir l'historique des connexions
 */
export const getLoginHistory = (limit = 50) => {
  const db = getDatabase();
  return db.loginHistory.slice(-limit).reverse();
};

/**
 * Rechercher des utilisateurs
 */
export const searchUsers = (query) => {
  const users = getAllUsers();
  const searchLower = query.toLowerCase();
  
  return users.filter(user => 
    user.username.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    user.profile.firstName?.toLowerCase().includes(searchLower) ||
    user.profile.lastName?.toLowerCase().includes(searchLower)
  );
};

// Initialiser la base de données au chargement
initializeDatabase();

// Export par défaut pour imports default
export default {
  getDatabase,
  saveDatabase,
  getAllUsers,
  getAllAdmins,
  findUserByUsername,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  logLoginAttempt,
  updateUserActivity,
  getDatabaseStats,
  exportDatabase,
  importDatabase,
  resetDatabase,
  getLoginHistory,
  searchUsers
};
