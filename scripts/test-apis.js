/**
 * 🧪 AURA - Script de Test des APIs Dynamiques
 * 
 * Teste les 3 fonctionnalités du cahier des charges:
 * 1. Analyse de Risque Globale
 * 2. Vérificateur d'Authenticité
 * 3. Aide à la Décision IA
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/aura';

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Test 1: Analyse de Risque
 */
async function testRiskAnalysis() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 1: Analyse de Risque Globale           ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  try {
    log('blue', '📊 Envoi requête pour BTC...');
    
    const response = await axios.post(`${API_URL}/analyze-risk`, {
      symbol: 'BTC',
      protocol: 'bitcoin'
    });

    const data = response.data.data;
    
    log('green', '✅ Succès!\n');
    log('yellow', `🎯 Score de Risque Combiné: ${data.combinedRiskScore}/100`);
    log('yellow', `   Niveau: ${data.riskLevel.level} ${data.riskLevel.color}`);
    log('yellow', `   Action: ${data.riskLevel.action}\n`);
    
    log('yellow', '📊 Détails par Catégorie:');
    log('yellow', `   • Marché:    ${data.breakdown.market.score.toFixed(2)}/100 (${data.breakdown.market.weight})`);
    log('yellow', `   • Code:      ${data.breakdown.code.score.toFixed(2)}/100 (${data.breakdown.code.weight})`);
    log('yellow', `   • Sentiment: ${data.breakdown.sentiment.score.toFixed(2)}/100 (${data.breakdown.sentiment.weight})\n`);
    
    if (data.recommendations.length > 0) {
      log('yellow', '💡 Recommandations:');
      data.recommendations.forEach(rec => {
        log('yellow', `   - [${rec.priority}] ${rec.message}`);
      });
    }
    
    return true;
  } catch (error) {
    log('red', `❌ Erreur: ${error.message}`);
    if (error.response) {
      log('red', `   Status: ${error.response.status}`);
      log('red', `   Message: ${error.response.data.message}`);
    }
    return false;
  }
}

/**
 * Test 2: Vérification Contrat
 */
async function testContractVerification() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 2: Vérification Contrat Smart          ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  try {
    log('blue', '🔍 Vérification du contrat Uniswap (UNI)...');
    
    const response = await axios.post(`${API_URL}/verify-contract`, {
      contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      chain: 'ethereum'
    });

    const data = response.data.data;
    
    log('green', '✅ Succès!\n');
    log('yellow', `🔐 Score d'Authenticité: ${data.authenticityScore}/100`);
    log('yellow', `   Confiance: ${data.trustLevel.level} ${data.trustLevel.color}`);
    log('yellow', `   Action: ${data.trustLevel.action}\n`);
    
    log('yellow', '📋 Informations du Contrat:');
    log('yellow', `   • Nom: ${data.contractInfo.name}`);
    log('yellow', `   • Créateur: ${data.contractInfo.creator.substring(0, 15)}...`);
    log('yellow', `   • Âge: ${data.contractInfo.ageInDays} jours`);
    log('yellow', `   • Vérifié: ${data.contractInfo.isVerified ? '✅ Oui' : '❌ Non'}`);
    log('yellow', `   • Audité: ${data.contractInfo.hasAudit ? '✅ Oui' : '❌ Non'}\n`);
    
    log('yellow', '🛡️ Sécurité:');
    log('yellow', `   • Score: ${data.security.score}/100`);
    log('yellow', `   • Vulnérabilités: ${data.security.vulnerabilities.length}`);
    log('yellow', `   • Patterns malveillants: ${data.security.maliciousPatterns.length}\n`);
    
    return true;
  } catch (error) {
    log('red', `❌ Erreur: ${error.message}`);
    if (error.response) {
      log('red', `   Status: ${error.response.status}`);
      log('red', `   Message: ${error.response.data.message}`);
    }
    return false;
  }
}

/**
 * Test 3: Recommandation IA
 */
async function testAIRecommendation() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 3: Recommandation IA                    ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  try {
    log('blue', '🤖 Génération recommandation pour ETH...');
    
    const response = await axios.post(`${API_URL}/recommend`, {
      user: {
        name: 'Bakr Sassi',
        experience: 'Avancé',
        riskTolerance: 'Élevée'
      },
      asset: {
        symbol: 'ETH',
        currentPrice: 3250.50,
        amount: 2.5
      },
      riskAnalysis: {
        combinedRiskScore: '42.30',
        riskLevel: { level: 'MODÉRÉ' }
      },
      contractVerification: {
        authenticityScore: '75.00',
        trustLevel: { level: 'ÉLEVÉ' }
      },
      portfolio: {
        totalValue: 250000
      }
    });

    const data = response.data.data;
    
    log('green', '✅ Succès!\n');
    log('yellow', `🎯 Recommandation: ${data.recommendation.action}`);
    log('yellow', `   Priorité: ${data.recommendation.priority}`);
    log('yellow', `   Confiance: ${data.metrics.confidenceScore}%`);
    log('yellow', `   Résumé: ${data.recommendation.summary}\n`);
    
    log('yellow', '📋 Actions Suggérées:');
    data.actions.forEach((action, i) => {
      log('yellow', `   ${i + 1}. ${action}`);
    });
    log('yellow', '');
    
    log('yellow', '📊 Métriques:');
    log('yellow', `   • Retour attendu: ${data.metrics.expectedReturn}`);
    log('yellow', `   • Horizon: ${data.metrics.timeHorizon}`);
    log('yellow', `   • Niveau risque: ${data.metrics.riskLevel}\n`);
    
    if (data.alerts.length > 0) {
      log('yellow', '🚨 Alertes:');
      data.alerts.forEach(alert => {
        log('yellow', `   ${alert.icon} [${alert.level}] ${alert.message}`);
      });
      log('yellow', '');
    }
    
    return true;
  } catch (error) {
    log('red', `❌ Erreur: ${error.message}`);
    if (error.response) {
      log('red', `   Status: ${error.response.status}`);
      log('red', `   Message: ${error.response.data.message}`);
    }
    return false;
  }
}

/**
 * Test 4: Analyse Complète
 */
async function testFullAnalysis() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 4: Analyse Complète                     ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  try {
    log('blue', '📊 Analyse complète pour SOL...');
    
    const response = await axios.post(`${API_URL}/full-analysis`, {
      symbol: 'SOL',
      user: {
        name: 'Bakr Sassi',
        experience: 'Avancé',
        riskTolerance: 'Élevée'
      },
      portfolio: {
        totalValue: 250000
      }
    });

    const data = response.data.data;
    
    log('green', '✅ Succès!\n');
    log('yellow', `📌 Actif: ${data.symbol}`);
    log('yellow', `📅 Timestamp: ${data.timestamp}\n`);
    
    log('yellow', '📊 Résultats:');
    log('yellow', `   1. Risque: ${data.riskAnalysis.combinedRiskScore}/100 - ${data.riskAnalysis.riskLevel.level}`);
    
    if (data.contractVerification) {
      log('yellow', `   2. Contrat: ${data.contractVerification.authenticityScore}/100 - ${data.contractVerification.trustLevel.level}`);
    } else {
      log('yellow', `   2. Contrat: Non fourni`);
    }
    
    log('yellow', `   3. IA: ${data.aiRecommendation.recommendation.action} (${data.aiRecommendation.metrics.confidenceScore}%)\n`);
    
    return true;
  } catch (error) {
    log('red', `❌ Erreur: ${error.message}`);
    if (error.response) {
      log('red', `   Status: ${error.response.status}`);
      log('red', `   Message: ${error.response.data.message}`);
    }
    return false;
  }
}

/**
 * Exécuter tous les tests
 */
async function runAllTests() {
  log('cyan', '\n╔═══════════════════════════════════════════════════════╗');
  log('cyan', '║        🧪 AURA - Tests APIs Dynamiques               ║');
  log('cyan', '╚═══════════════════════════════════════════════════════╝');
  
  log('yellow', '\n⏳ Démarrage des tests...');
  log('yellow', '   Assurez-vous que le serveur est lancé: node server/server.js\n');

  const results = {
    test1: false,
    test2: false,
    test3: false,
    test4: false
  };

  // Pause entre les tests pour éviter le rate limiting
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Test 1
  results.test1 = await testRiskAnalysis();
  await delay(2000);

  // Test 2
  results.test2 = await testContractVerification();
  await delay(2000);

  // Test 3
  results.test3 = await testAIRecommendation();
  await delay(2000);

  // Test 4
  results.test4 = await testFullAnalysis();

  // Résumé
  log('cyan', '\n╔═══════════════════════════════════════════════════════╗');
  log('cyan', '║                 📊 RÉSUMÉ DES TESTS                   ║');
  log('cyan', '╚═══════════════════════════════════════════════════════╝\n');

  const total = 4;
  const passed = Object.values(results).filter(r => r).length;

  log('yellow', `Test 1 - Analyse de Risque:     ${results.test1 ? '✅ PASS' : '❌ FAIL'}`);
  log('yellow', `Test 2 - Vérification Contrat:  ${results.test2 ? '✅ PASS' : '❌ FAIL'}`);
  log('yellow', `Test 3 - Recommandation IA:     ${results.test3 ? '✅ PASS' : '❌ FAIL'}`);
  log('yellow', `Test 4 - Analyse Complète:      ${results.test4 ? '✅ PASS' : '❌ FAIL'}\n`);

  if (passed === total) {
    log('green', `\n🎉 TOUS LES TESTS RÉUSSIS! (${passed}/${total})`);
    log('green', '✅ Les 3 fonctionnalités du cahier des charges sont opérationnelles!\n');
  } else {
    log('red', `\n⚠️  ${passed}/${total} tests réussis`);
    log('yellow', '\n💡 Vérifications:');
    log('yellow', '   1. Le serveur est-il démarré? (node server/server.js)');
    log('yellow', '   2. La base de données MySQL est-elle accessible?');
    log('yellow', '   3. Les packages sont-ils installés? (npm install)');
    log('yellow', '   4. Le fichier .env est-il configuré?\n');
  }
}

// Exécuter
runAllTests().catch(error => {
  log('red', `\n❌ Erreur fatale: ${error.message}`);
  process.exit(1);
});
