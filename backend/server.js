/**
 * 🚀 AURA - Serveur Backend Express
 * API REST pour la gestion MySQL
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { query, testConnection } = require('./database');

// 📧 Service d'envoi d'emails
const { sendTwoFactorEmail, testEmailConfiguration } = require('./emailService');

// 🎯 AURA - Services Dynamiques (Cahier des Charges)
const riskAnalysis = require('./riskAnalysis');
const contractVerifier = require('./contractVerifier');
const aiDecisionSupport = require('./aiDecisionSupport');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuré pour accepter frontend sur ports 3000 ou 3003
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3003',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Permettre les requêtes sans origin (comme curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================================
// 🔐 AUTHENTICATION ROUTES
// ================================================

/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username et password requis'
      });
    }

    // Trouver l'utilisateur
    const users = await query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      // Log tentative échouée
      await query(
        'INSERT INTO login_history (user_id, username, success, ip_address) VALUES (0, ?, FALSE, ?)',
        [username, req.ip]
      );

      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    const user = users[0];

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await query(
        'INSERT INTO login_history (user_id, username, success, ip_address) VALUES (?, ?, FALSE, ?)',
        [user.id, username, req.ip]
      );

      return res.status(401).json({
        success: false,
        message: 'Identifiants incorrects'
      });
    }

    // Vérifier le statut
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Compte suspendu. Contactez l\'administrateur.'
      });
    }

    // Retourner info 2FA si activée
    if (user.two_factor_enabled) {
      // Générer code 2FA
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Sauvegarder le code
      await query(
        'INSERT INTO two_factor_codes (user_id, email, code, expires_at) VALUES (?, ?, ?, ?)',
        [user.id, user.email, code, expiresAt]
      );

      // 📧 ENVOYER LE CODE PAR EMAIL
      try {
        const emailResult = await sendTwoFactorEmail(user.email, code, user.username);
        
        if (emailResult.success && !emailResult.simulated) {
          console.log(`✅ Email 2FA envoyé avec succès à ${user.email}`);
        } else if (emailResult.simulated) {
          // Mode simulation - afficher le code dans la console
          console.log(`\n╔════════════════════════════════════════════╗`);
          console.log(`║      📧 CODE 2FA - ${user.username.toUpperCase().padEnd(20)}║`);
          console.log(`╠════════════════════════════════════════════╣`);
          console.log(`║  Email: ${user.email.padEnd(31)}║`);
          console.log(`║  Code:  ${code}                            ║`);
          console.log(`║  Expire: ${expiresAt.toLocaleTimeString().padEnd(29)}║`);
          console.log(`║  ⚠️  Mode simulation - Email non envoyé    ║`);
          console.log(`╚════════════════════════════════════════════╝\n`);
        }
      } catch (emailError) {
        console.error('⚠️  Erreur envoi email 2FA (code affiché en console):', emailError.message);
        // Afficher le code en console en cas d'erreur
        console.log(`\n🔐 CODE 2FA pour ${user.username}: ${code}\n`);
      }

      return res.json({
        success: false,
        requiresTwoFactor: true,
        userId: user.id,
        email: user.email,
        username: user.username,
        message: 'Code de vérification envoyé à votre email'
      });
    }

    // Pas de 2FA - connexion directe
    return await completeLogin(user, req, res);

  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

/**
 * POST /api/auth/verify-2fa
 * Vérifier le code 2FA
 */
app.post('/api/auth/verify-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: 'userId et code requis'
      });
    }

    // Trouver le code
    const codes = await query(
      `SELECT * FROM two_factor_codes 
       WHERE user_id = ? 
       AND code = ? 
       AND expires_at > NOW() 
       AND attempts < max_attempts
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId, code]
    );

    if (codes.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Code invalide ou expiré'
      });
    }

    const codeData = codes[0];

    // Code correct - supprimer et connecter
    await query('DELETE FROM two_factor_codes WHERE id = ?', [codeData.id]);

    // Récupérer l'utilisateur
    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    return await completeLogin(users[0], req, res);

  } catch (error) {
    console.error('❌ Erreur 2FA:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification 2FA'
    });
  }
});

/**
 * Fonction helper: Compléter la connexion
 */
async function completeLogin(user, req, res) {
  // Mettre à jour l'activité
  await query(
    'UPDATE users SET last_login = NOW(), last_active = NOW(), login_count = login_count + 1 WHERE id = ?',
    [user.id]
  );

  // Log connexion réussie
  await query(
    'INSERT INTO login_history (user_id, username, success, ip_address) VALUES (?, ?, TRUE, ?)',
    [user.id, user.username, req.ip]
  );

  // Créer JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  // Sauvegarder session
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  await query(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
    [user.id, token, expiresAt]
  );

  // Récupérer les actifs
  const assets = await query('SELECT * FROM assets WHERE user_id = ?', [user.id]);

  return res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address
      },
      portfolioValue: parseFloat(user.portfolio_value),
      auraScore: user.aura_score,
      assets: assets
    },
    token: token,
    message: `Bienvenue ${user.username}!`
  });
}

/**
 * POST /api/auth/logout
 * Déconnexion
 */
app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await query('DELETE FROM sessions WHERE token = ?', [token]);
    }
    res.json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la déconnexion' });
  }
});

// ================================================
// 👤 USER ROUTES
// ================================================

/**
 * GET /api/users
 * Obtenir tous les utilisateurs (admin only)
 */
app.get('/api/users', async (req, res) => {
  try {
    const users = await query('SELECT * FROM v_users_portfolio');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

/**
 * GET /api/users/:id
 * Obtenir un utilisateur par ID
 */
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const assets = await query('SELECT * FROM assets WHERE user_id = ?', [req.params.id]);

    res.json({
      success: true,
      user: { ...users[0], assets }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ================================================
// 📊 STATS ROUTES
// ================================================

/**
 * GET /api/stats
 * Statistiques globales
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(portfolio_value) as totalValue,
        AVG(aura_score) as avgScore,
        SUM(login_count) as totalLogins
      FROM users
    `);

    const recentActivity = await query(`
      SELECT * FROM v_recent_activity LIMIT 10
    `);

    res.json({
      success: true,
      stats: stats[0],
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// ================================================
// � AURA - ROUTES DYNAMIQUES (CAHIER DES CHARGES)
// ================================================

/**
 * POST /api/aura/analyze-risk
 * Analyse de Risque Globale (IA + FinTech + Cybersécurité)
 */
app.post('/api/aura/analyze-risk', async (req, res) => {
  try {
    const { symbol, protocol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Symbol requis (ex: BTC, ETH)'
      });
    }

    console.log(`\n🎯 Analyse de risque pour ${symbol}...`);

    const result = await riskAnalysis.calculateCombinedRiskScore({
      symbol,
      protocol: protocol || symbol
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erreur analyse risque:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/aura/verify-contract
 * Vérificateur d'Authenticité Smart Contract
 */
app.post('/api/aura/verify-contract', async (req, res) => {
  try {
    const { contractAddress, chain } = req.body;

    if (!contractAddress) {
      return res.status(400).json({
        success: false,
        message: 'contractAddress requis'
      });
    }

    console.log(`\n🔍 Vérification contrat ${contractAddress}...`);

    const result = await contractVerifier.verifyContractAuthenticity(
      contractAddress,
      chain || 'ethereum'
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erreur vérification contrat:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/aura/recommend
 * Aide à la Décision avec IA
 */
app.post('/api/aura/recommend', async (req, res) => {
  try {
    const { user, asset, riskAnalysis: riskData, contractVerification, portfolio } = req.body;

    if (!asset || !asset.symbol) {
      return res.status(400).json({
        success: false,
        message: 'asset.symbol requis'
      });
    }

    console.log(`\n🤖 Génération recommandation IA pour ${asset.symbol}...`);

    const result = await aiDecisionSupport.generateAIRecommendation({
      user: user || { name: 'User', experience: 'Intermédiaire', riskTolerance: 'Modérée' },
      asset,
      riskAnalysis: riskData,
      contractVerification,
      portfolio: portfolio || { totalValue: 0 }
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erreur recommandation IA:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/aura/full-analysis
 * Analyse Complète (Risque + Contrat + Recommandation)
 */
app.post('/api/aura/full-analysis', async (req, res) => {
  try {
    const { symbol, contractAddress, chain, user, portfolio } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'symbol requis'
      });
    }

    console.log(`\n🎯 Analyse complète AURA pour ${symbol}...`);

    // 1. Analyse de Risque
    console.log('  1/3 Analyse de risque...');
    const riskResult = await riskAnalysis.calculateCombinedRiskScore({
      symbol,
      protocol: symbol
    });

    // 2. Vérification Contrat (si fourni)
    let contractResult = null;
    if (contractAddress) {
      console.log('  2/3 Vérification contrat...');
      contractResult = await contractVerifier.verifyContractAuthenticity(
        contractAddress,
        chain || 'ethereum'
      );
    }

    // 3. Recommandation IA
    console.log('  3/3 Génération recommandation IA...');
    const recommendation = await aiDecisionSupport.generateAIRecommendation({
      user: user || { name: 'User', experience: 'Intermédiaire', riskTolerance: 'Modérée' },
      asset: {
        symbol,
        currentPrice: riskResult.breakdown?.market?.data?.currentPrice || 0,
        amount: 0
      },
      riskAnalysis: riskResult,
      contractVerification: contractResult,
      portfolio: portfolio || { totalValue: 0 }
    });

    console.log('✅ Analyse complète terminée!\n');

    res.json({
      success: true,
      data: {
        symbol,
        timestamp: new Date().toISOString(),
        riskAnalysis: riskResult,
        contractVerification: contractResult,
        aiRecommendation: recommendation
      }
    });

  } catch (error) {
    console.error('❌ Erreur analyse complète:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================================================
// 📧 ROUTE TEST EMAIL
// ================================================

/**
 * GET /api/test-email
 * Tester la configuration email
 */
app.get('/api/test-email', async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/test-email-send
 * Envoyer un email de test
 */
app.post('/api/test-email-send', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email requis'
      });
    }

    const testCode = '123456';
    const result = await sendTwoFactorEmail(email, testCode, 'Test User');
    
    res.json({
      success: true,
      message: 'Email de test envoyé',
      details: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================================
// � ROUTE PAR DÉFAUT
// ================================================

app.get('/', (req, res) => {
  res.json({
    message: '🚀 AURA API - Backend MySQL + IA Dynamique',
    version: '2.0.0',
    cahierDesCharges: {
      objective1: 'Augmentation de Décision',
      objective2: 'Filtrage Proactif',
      objective3: 'Vérification Immuable'
    },
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        verify2fa: 'POST /api/auth/verify-2fa',
        logout: 'POST /api/auth/logout'
      },
      users: {
        getAll: 'GET /api/users',
        getOne: 'GET /api/users/:id'
      },
      stats: {
        global: 'GET /api/stats'
      },
      aura: {
        analyzeRisk: 'POST /api/aura/analyze-risk',
        verifyContract: 'POST /api/aura/verify-contract',
        recommend: 'POST /api/aura/recommend',
        fullAnalysis: 'POST /api/aura/full-analysis'
      }
    },
    features: {
      '1': 'Analyse de Risque Globale (IA + FinTech + Cybersécurité)',
      '2': 'Vérificateur d\'Authenticité Smart Contract',
      '3': 'Aide à la Décision avec Justifications'
    }
  });
});

// ================================================
// 🚀 DÉMARRER LE SERVEUR
// ================================================

const startServer = async () => {
  // Tester la connexion DB
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('\n❌ Impossible de démarrer le serveur sans connexion DB');
    console.error('💡 Assurez-vous que:');
    console.error('   1. XAMPP MySQL est démarré');
    console.error('   2. La base de données "aura_db" existe');
    console.error('   3. Le fichier .env est correctement configuré\n');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('\n╔═════════════════════════════════════════════════════════════╗');
    console.log('║        🚀 SERVEUR AURA DÉMARRÉ (v2.0 - DYNAMIQUE)        ║');
    console.log('╠═════════════════════════════════════════════════════════════╣');
    console.log(`║   📍 URL: http://localhost:${PORT}                            ║`);
    console.log(`║   🗄️  DB:  ${process.env.DB_NAME.padEnd(46)} ║`);
    console.log('║   ✅ Connexion MySQL: OK                                   ║');
    console.log('║   🎯 Routes AURA: Actives                                  ║');
    console.log('╚═════════════════════════════════════════════════════════════╝\n');
    console.log('📡 API Endpoints Dynamiques:');
    console.log('   🎯 POST /api/aura/analyze-risk       - Analyse Risque Globale');
    console.log('   🔐 POST /api/aura/verify-contract    - Vérification Contrat');
    console.log('   🤖 POST /api/aura/recommend          - Recommandation IA');
    console.log('   📊 POST /api/aura/full-analysis      - Analyse Complète\n');
    console.log('🌟 Cahier des Charges Implémenté:');
    console.log('   ✅ 1. Analyse de Risque Combinée (Marché + Code + Sentiment)');
    console.log('   ✅ 2. Vérificateur d\'Authenticité Smart Contract');
    console.log('   ✅ 3. Aide à la Décision avec Justifications IA\n');
  });
};

startServer();

module.exports = app;
