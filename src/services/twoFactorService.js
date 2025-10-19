/**
 * 🔐 Two-Factor Authentication Service
 * Service pour gérer l'authentification à deux facteurs
 * ⚡ UTILISE MAINTENANT L'API BACKEND MYSQL
 */

import { updateUser } from './databaseService';
import axios from 'axios';

// URL de l'API Backend - Port 5003 pour correspondre au frontend sur 3003
const API_URL = 'http://localhost:5003/api';

// Clé pour stocker les codes 2FA temporaires (fallback mode local)
const TFA_CODES_KEY = 'aura_2fa_codes';

/**
 * Générer un code 2FA aléatoire à 6 chiffres
 */
export const generateTwoFactorCode = () => {
  return Math.floor(100000 + Math.random() + 900000).toString();
};

/**
 * Envoyer le code 2FA par email
 * ⚡ Cette fonction est maintenant gérée par le backend lors du login
 */
export const sendTwoFactorEmail = async (email, code, username) => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║              📧 EMAIL 2FA (Mode Local Fallback)            ║
╠════════════════════════════════════════════════════════════╣
║  To: ${email.padEnd(52)}║
║  Code: ${code}                                             ║
║  Username: ${username.padEnd(44)}║
╚════════════════════════════════════════════════════════════╝
  `);

  // Stocker le code localement (fallback)
  const tfaCodes = JSON.parse(localStorage.getItem(TFA_CODES_KEY) || '{}');
  tfaCodes[email] = {
    code: code,
    timestamp: Date.now(),
    expiresIn: 5 * 60 * 1000,
    attempts: 0,
    maxAttempts: 3
  };
  localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));

  return {
    success: true,
    message: `Code envoyé à ${email}`,
    expiresIn: 300
  };
};

/**
 * Vérifier le code 2FA entré par l'utilisateur
 * ⚡ APPELLE MAINTENANT L'API BACKEND
 */
export const verifyTwoFactorCode = async (userId, enteredCode) => {
  try {
    // 🚀 Appeler l'API Backend pour vérifier le code
    const response = await axios.post(`${API_URL}/auth/verify-2fa`, {
      userId,
      code: enteredCode
    });

    if (response.data.success) {
      return {
        success: true,
        message: 'Code vérifié avec succès!',
        token: response.data.token,
        user: response.data.user
      };
    }

    return {
      success: false,
      error: response.data.message || 'Code invalide'
    };

  } catch (error) {
    console.error('❌ Erreur vérification 2FA API:', error);

    // Si l'API n'est pas accessible, fallback sur localStorage
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('⚠️ Backend non accessible, utilisation du mode local');
      return verifyTwoFactorCodeLocal(userId, enteredCode);
    }

    // Erreur du backend (code invalide, expiré, etc.)
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || error.response.data.message || 'Code invalide ou expiré'
      };
    }

    return {
      success: false,
      error: 'Erreur de connexion au serveur'
    };
  }
};

/**
 * Vérification locale (fallback si backend indisponible)
 */
const verifyTwoFactorCodeLocal = (userId, enteredCode) => {
  // Récupérer depuis localStorage
  const tfaCodes = JSON.parse(localStorage.getItem(TFA_CODES_KEY) || '{}');
  
  // Trouver le code pour cet utilisateur
  let codeData = null;
  let email = null;
  
  for (const [emailKey, data] of Object.entries(tfaCodes)) {
    if (data.code === enteredCode) {
      codeData = data;
      email = emailKey;
      break;
    }
  }

  if (!codeData) {
    return {
      success: false,
      error: 'Aucun code trouvé. Veuillez demander un nouveau code.'
    };
  }

  // Vérifier expiration
  const now = Date.now();
  if (now - codeData.timestamp > codeData.expiresIn) {
    delete tfaCodes[email];
    localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));
    return {
      success: false,
      error: 'Code expiré. Veuillez demander un nouveau code.'
    };
  }

  // Vérifier tentatives
  if (codeData.attempts >= codeData.maxAttempts) {
    delete tfaCodes[email];
    localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));
    return {
      success: false,
      error: 'Trop de tentatives échouées. Veuillez demander un nouveau code.'
    };
  }

  // Code correct
  delete tfaCodes[email];
  localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));
  
  return {
    success: true,
    message: 'Code vérifié avec succès! (Mode Local)'
  };
};

/**
 * Activer 2FA pour un utilisateur
 */
export const enableTwoFactor = (userId) => {
  try {
    updateUser(userId, {
      security: {
        twoFactorEnabled: true
      }
    });
    return { success: true, message: '2FA activé avec succès' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Désactiver 2FA pour un utilisateur
 */
export const disableTwoFactor = (userId) => {
  try {
    updateUser(userId, {
      security: {
        twoFactorEnabled: false
      }
    });
    return { success: true, message: '2FA désactivé avec succès' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Obtenir le temps restant avant expiration du code
 */
export const getCodeExpirationTime = (email) => {
  const tfaCodes = JSON.parse(localStorage.getItem(TFA_CODES_KEY) || '{}');
  const codeData = tfaCodes[email];

  if (!codeData) return 0;

  const now = Date.now();
  const elapsed = now - codeData.timestamp;
  const remaining = Math.max(0, codeData.expiresIn - elapsed);

  return Math.floor(remaining / 1000); // Retourner en secondes
};

/**
 * Renvoyer un nouveau code 2FA
 */
export const resendTwoFactorCode = async (email, username) => {
  // Supprimer l'ancien code
  const tfaCodes = JSON.parse(localStorage.getItem(TFA_CODES_KEY) || '{}');
  delete tfaCodes[email];
  localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));

  // Générer et envoyer un nouveau code
  const newCode = generateTwoFactorCode();
  return await sendTwoFactorEmail(email, newCode, username);
};

/**
 * Nettoyer les codes expirés (maintenance)
 */
export const cleanExpiredCodes = () => {
  const tfaCodes = JSON.parse(localStorage.getItem(TFA_CODES_KEY) || '{}');
  const now = Date.now();
  let cleaned = 0;

  Object.keys(tfaCodes).forEach(email => {
    const codeData = tfaCodes[email];
    if (now - codeData.timestamp > codeData.expiresIn) {
      delete tfaCodes[email];
      cleaned++;
    }
  });

  localStorage.setItem(TFA_CODES_KEY, JSON.stringify(tfaCodes));
  return cleaned;
};

// Nettoyer les codes expirés toutes les 10 minutes
setInterval(cleanExpiredCodes, 10 * 60 * 1000);

export default {
  generateTwoFactorCode,
  sendTwoFactorEmail,
  verifyTwoFactorCode,
  enableTwoFactor,
  disableTwoFactor,
  getCodeExpirationTime,
  resendTwoFactorCode,
  cleanExpiredCodes
};
