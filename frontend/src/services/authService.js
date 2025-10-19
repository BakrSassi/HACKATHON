/**
 * 🔐 Service d'Authentification
 * Gestion des connexions admin et utilisateurs avec base de données MySQL
 */

import databaseService from './databaseService';
import { generateTwoFactorCode, sendTwoFactorEmail } from './twoFactorService';
import axios from 'axios';

// URL de l'API Backend - Port 5003 pour correspondre au frontend sur 3003
const API_URL = 'http://localhost:5003/api';

// Durée de session : 8 heures
const SESSION_DURATION = 8 * 60 * 60 * 1000;

/**
 * Générer un token unique
 */
const generateToken = (userId) => {
  return `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Connexion utilisateur/admin (Étape 1: Vérification des identifiants)
 * ⚡ UTILISE MAINTENANT L'API BACKEND MYSQL
 */
export const login = async (username, password) => {
  try {
    // 🚀 Appeler l'API Backend au lieu du JSON local
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });

    const data = response.data;
    
    // Si 2FA requis
    if (data.requiresTwoFactor) {
      return {
        success: false,
        requiresTwoFactor: true,
        email: data.email,
        username: data.username,
        userId: data.userId,
        message: data.message || 'Code de vérification envoyé à votre email'
      };
    }
    
    // Si connexion directe (pas de 2FA)
    if (data.success && data.token) {
      // Sauvegarder la session
      const session = {
        user: data.user,
        token: data.token,
        expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString()
      };
      
      localStorage.setItem('aura_session', JSON.stringify(session));
      localStorage.setItem('aura_token', data.token);
      
      return {
        success: true,
        user: data.user,
        message: `Bienvenue ${data.user.username} !`
      };
    }
    
    return {
      success: false,
      message: data.message || 'Erreur de connexion'
    };
    
  } catch (error) {
    console.error('❌ Erreur login API:', error);
    
    // Si l'API n'est pas accessible, fallback sur le JSON local
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('⚠️ Backend non accessible, utilisation du mode local');
      return loginLocal(username, password);
    }
    
    // Erreur 401/403 = mauvais identifiants
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return {
        success: false,
        message: error.response.data.message || 'Identifiants incorrects'
      };
    }
    
    return {
      success: false,
      message: 'Erreur de connexion au serveur'
    };
  }
};

/**
 * Mode local (fallback si backend indisponible)
 */
const loginLocal = async (username, password) => {
  // Chercher l'utilisateur dans la base de données locale
  const user = databaseService.findUserByUsername(username);
  
  if (!user) {
    databaseService.logLoginAttempt(username, false);
    return {
      success: false,
      message: 'Identifiants incorrects'
    };
  }
  
  // Vérifier le mot de passe
  if (user.password !== password) {
    databaseService.logLoginAttempt(username, false);
    return {
      success: false,
      message: 'Identifiants incorrects'
    };
  }
  
  // Vérifier le statut
  if (user.role === 'user' && user.status !== 'active') {
    databaseService.logLoginAttempt(username, false);
    return {
      success: false,
      message: 'Votre compte est suspendu. Contactez l\'administrateur.'
    };
  }
  
  // 2FA local
  const code = generateTwoFactorCode();
  await sendTwoFactorEmail(user.email, code, user.username);
  
  return {
    success: false,
    requiresTwoFactor: true,
    email: user.email,
    username: user.username,
    userId: user.id,
    message: 'Code de vérification envoyé à votre email (Mode Local)'
  };
};

/**
 * Compléter la connexion (après vérification 2FA ou sans 2FA)
 */
export const completeLogin = (user) => {
  // Mettre à jour l'activité de l'utilisateur
  databaseService.updateUserActivity(user.id, 'login');
  
  // Enregistrer la connexion réussie
  databaseService.logLoginAttempt(user.username, true);
  
  // Créer une session
  const session = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      profile: user.profile,
      portfolioValue: user.portfolio?.totalValue,
      auraScore: user.portfolio?.auraScore
    },
    token: generateToken(user.id),
    expiresAt: new Date(Date.now() + SESSION_DURATION).toISOString()
  };
  
  // Sauvegarder la session
  localStorage.setItem('aura_session', JSON.stringify(session));
  localStorage.setItem('aura_token', session.token);
  
  return {
    success: true,
    user: session.user,
    message: `Bienvenue ${user.username} !`
  };
};

/**
 * Déconnexion
 */
export const logout = () => {
  localStorage.removeItem('aura_session');
  localStorage.removeItem('aura_token');
  
  return {
    success: true,
    message: 'Déconnexion réussie'
  };
};

/**
 * Vérifier si l'utilisateur est connecté
 */
export const isAuthenticated = () => {
  const session = getSession();
  
  if (!session) return false;
  
  // Vérifier l'expiration
  const expiresAt = new Date(session.expiresAt);
  const now = new Date();
  
  if (now > expiresAt) {
    logout();
    return false;
  }
  
  return true;
};

/**
 * Obtenir la session courante
 */
export const getSession = () => {
  const sessionStr = localStorage.getItem('aura_session');
  if (!sessionStr) return null;
  
  try {
    return JSON.parse(sessionStr);
  } catch (e) {
    return null;
  }
};

/**
 * Obtenir l'utilisateur connecté
 */
export const getCurrentUser = () => {
  const session = getSession();
  return session?.user || null;
};

/**
 * Vérifier si l'utilisateur a une permission
 */
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Super admin a toutes les permissions
  if (user.permissions?.includes('all')) return true;
  
  return user.permissions?.includes(permission) || false;
};

/**
 * Vérifier si l'utilisateur est admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'super_admin' || user?.role === 'moderator';
};

/**
 * Obtenir tous les utilisateurs (admin uniquement)
 */
export const getAllUsers = () => {
  if (!hasPermission('all') && !hasPermission('view_users')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const users = databaseService.getAllUsers();
  return users;
};

/**
 * Mettre à jour le statut d'un utilisateur (admin uniquement)
 */
export const updateUserStatus = (userId, status) => {
  if (!hasPermission('all') && !hasPermission('manage_users')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const updatedUser = databaseService.updateUser(userId, { status });
  
  if (updatedUser) {
    return {
      success: true,
      user: updatedUser,
      message: `Statut de l'utilisateur mis à jour: ${status}`
    };
  }
  
  return {
    success: false,
    message: 'Utilisateur introuvable'
  };
};

/**
 * Supprimer un utilisateur (admin uniquement)
 */
export const deleteUser = (userId) => {
  if (!hasPermission('all')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const deletedUser = databaseService.deleteUser(userId);
  
  if (deletedUser) {
    return {
      success: true,
      message: `Utilisateur ${deletedUser.username} supprimé`
    };
  }
  
  return {
    success: false,
    message: 'Utilisateur introuvable'
  };
};

/**
 * Obtenir les statistiques globales
 */
export const getGlobalStats = () => {
  if (!hasPermission('view_stats') && !hasPermission('all') && !hasPermission('view_analytics')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const users = databaseService.getAllUsers();
  const stats = databaseService.getDatabaseStats();
  
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalValue = users.reduce((sum, u) => sum + (u.portfolio?.totalValue || 0), 0);
  const avgScore = users.reduce((sum, u) => sum + (u.portfolio?.auraScore || 0), 0) / (totalUsers || 1);
  
  return {
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      suspendedUsers: totalUsers - activeUsers,
      totalPortfolioValue: totalValue,
      averageAuraScore: Math.round(avgScore),
      newUsersToday: 2,
      activeSessionsNow: 5,
      ...stats
    }
  };
};

/**
 * Créer un nouvel utilisateur (inscription)
 */
export const registerUser = (userData) => {
  // Vérifier si le username existe déjà
  const existingUser = databaseService.findUserByUsername(userData.username);
  if (existingUser) {
    return {
      success: false,
      message: 'Ce nom d\'utilisateur est déjà pris'
    };
  }
  
  // Créer le nouvel utilisateur
  const newUser = databaseService.createUser(userData);
  
  return {
    success: true,
    user: newUser,
    message: 'Compte créé avec succès'
  };
};

/**
 * Obtenir l'historique des connexions (admin uniquement)
 */
export const getLoginHistory = (limit = 50) => {
  if (!hasPermission('all') && !hasPermission('view_logs')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const history = databaseService.getLoginHistory(limit);
  return {
    success: true,
    history
  };
};

/**
 * Rechercher des utilisateurs (admin uniquement)
 */
export const searchUsers = (query) => {
  if (!hasPermission('all') && !hasPermission('view_users')) {
    return { success: false, message: 'Permission refusée' };
  }
  
  const results = databaseService.searchUsers(query);
  return {
    success: true,
    results
  };
};

/**
 * Exporter la base de données (super admin uniquement)
 */
export const exportDatabaseBackup = () => {
  if (!hasPermission('all')) {
    return { success: false, message: 'Permission refusée - Super Admin uniquement' };
  }
  
  databaseService.exportDatabase();
  return {
    success: true,
    message: 'Base de données exportée'
  };
};

/**
 * Obtenir la base de données complète (super admin uniquement)
 */
export const getDatabaseAccess = () => {
  if (!hasPermission('all')) {
    return { success: false, message: 'Permission refusée - Super Admin uniquement' };
  }
  
  const db = databaseService.getDatabase();
  return {
    success: true,
    database: db
  };
};

export default {
  login,
  completeLogin,
  logout,
  isAuthenticated,
  getSession,
  getCurrentUser,
  hasPermission,
  isAdmin,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getGlobalStats,
  registerUser,
  getLoginHistory,
  searchUsers,
  exportDatabaseBackup,
  getDatabaseAccess
};
