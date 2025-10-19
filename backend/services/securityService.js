/**
 * 🎯 AURA - Système d'Analyse de Risque Globale
 * IA + FinTech + Cybersécurité
 * 
 * Génère une "Note de Risque Combinée" basée sur:
 * 1. Volatilité du marché (données réelles)
 * 2. Vulnérabilités du code source
 * 3. Sentiment du marché
 * 4. Sécurité du protocole
 */

const axios = require('axios');
const crypto = require('crypto');

/**
 * 📊 Analyser la Volatilité du Marché (Données Réelles)
 */
async function analyzeMarketVolatility(symbol) {
  try {
    // API CoinGecko (Gratuite) pour données réelles
    const coinId = getCoinGeckoId(symbol);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: 30,
          interval: 'daily'
        }
      }
    );

    const prices = response.data.prices.map(p => p[1]);
    
    // Calculer la volatilité (écart-type)
    const mean = prices.reduce((a, b) => a + b) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);
    const volatilityPercent = (volatility / mean) * 100;

    // Calculer le score de risque de marché (0-100)
    const marketRiskScore = Math.min(100, volatilityPercent * 2);

    // Analyser la tendance
    const recentPrices = prices.slice(-7);
    const trend = (recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0] * 100;

    return {
      symbol,
      currentPrice: prices[prices.length - 1],
      volatility: volatilityPercent.toFixed(2),
      marketRiskScore: marketRiskScore.toFixed(2),
      trend: trend.toFixed(2),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      analysis: getMarketRiskAnalysis(marketRiskScore, volatilityPercent)
    };

  } catch (error) {
    console.error('❌ Erreur analyse marché:', error.message);
    // Fallback avec données de base
    return getFallbackMarketData(symbol);
  }
}

/**
 * 🔐 Analyser les Vulnérabilités du Code Source
 */
async function analyzeCodeVulnerabilities(protocol) {
  try {
    // Simulation d'analyse de smart contract
    // En production: intégration avec MythX, Slither, ou Certik
    
    const vulnerabilities = await scanSmartContract(protocol);
    
    // Calculer le score de sécurité du code (0-100)
    const criticalIssues = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highIssues = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediumIssues = vulnerabilities.filter(v => v.severity === 'medium').length;

    const codeRiskScore = Math.min(100, 
      (criticalIssues * 30) + 
      (highIssues * 15) + 
      (mediumIssues * 5)
    );

    // Vérifier les audits
    const auditScore = await checkSecurityAudits(protocol);

    return {
      protocol,
      vulnerabilities: {
        critical: criticalIssues,
        high: highIssues,
        medium: mediumIssues,
        low: vulnerabilities.filter(v => v.severity === 'low').length
      },
      codeRiskScore: codeRiskScore.toFixed(2),
      auditScore: auditScore.toFixed(2),
      lastAudit: getLastAuditDate(protocol),
      issues: vulnerabilities.slice(0, 5), // Top 5 vulnérabilités
      analysis: getCodeRiskAnalysis(codeRiskScore, auditScore)
    };

  } catch (error) {
    console.error('❌ Erreur analyse code:', error.message);
    return getFallbackCodeData(protocol);
  }
}

/**
 * 💭 Analyser le Sentiment du Marché
 */
async function analyzeSentiment(symbol) {
  try {
    // API CoinGecko pour sentiment
    const coinId = getCoinGeckoId(symbol);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );

    const data = response.data;
    
    // Analyser les métriques de sentiment
    const sentiment = {
      communityScore: data.community_score || 50,
      developerScore: data.developer_score || 50,
      liquidityScore: data.liquidity_score || 50,
      publicInterest: data.public_interest_score || 50
    };

    const avgSentiment = (
      sentiment.communityScore +
      sentiment.developerScore +
      sentiment.liquidityScore +
      sentiment.publicInterest
    ) / 4;

    return {
      symbol,
      sentimentScore: avgSentiment.toFixed(2),
      details: sentiment,
      socialMedia: {
        twitter: data.community_data?.twitter_followers || 0,
        reddit: data.community_data?.reddit_subscribers || 0
      },
      analysis: getSentimentAnalysis(avgSentiment)
    };

  } catch (error) {
    console.error('❌ Erreur analyse sentiment:', error.message);
    return getFallbackSentimentData(symbol);
  }
}

/**
 * 🎯 FONCTION PRINCIPALE: Note de Risque Combinée
 */
async function calculateCombinedRiskScore(asset) {
  console.log(`\n🔍 Analyse de Risque Globale pour ${asset.symbol}...`);

  // 1. Analyse Marché (40% du score)
  const marketAnalysis = await analyzeMarketVolatility(asset.symbol);
  
  // 2. Analyse Code (35% du score)
  const codeAnalysis = await analyzeCodeVulnerabilities(asset.protocol || asset.symbol);
  
  // 3. Analyse Sentiment (25% du score)
  const sentimentAnalysis = await analyzeSentiment(asset.symbol);

  // Calculer le score combiné (0-100, 0 = très sûr, 100 = très risqué)
  const combinedScore = (
    (parseFloat(marketAnalysis.marketRiskScore) * 0.40) +
    (parseFloat(codeAnalysis.codeRiskScore) * 0.35) +
    ((100 - parseFloat(sentimentAnalysis.sentimentScore)) * 0.25)
  );

  // Déterminer le niveau de risque
  const riskLevel = getRiskLevel(combinedScore);
  
  // Générer des recommandations
  const recommendations = generateRecommendations(
    combinedScore,
    marketAnalysis,
    codeAnalysis,
    sentimentAnalysis
  );

  return {
    asset: asset.symbol,
    protocol: asset.protocol || asset.symbol,
    timestamp: new Date().toISOString(),
    
    // Score Combiné
    combinedRiskScore: combinedScore.toFixed(2),
    riskLevel: riskLevel,
    
    // Détails par catégorie
    breakdown: {
      market: {
        score: parseFloat(marketAnalysis.marketRiskScore),
        weight: '40%',
        data: marketAnalysis
      },
      code: {
        score: parseFloat(codeAnalysis.codeRiskScore),
        weight: '35%',
        data: codeAnalysis
      },
      sentiment: {
        score: 100 - parseFloat(sentimentAnalysis.sentimentScore),
        weight: '25%',
        data: sentimentAnalysis
      }
    },
    
    // Recommandations
    recommendations: recommendations,
    
    // Actions suggérées
    suggestedActions: getSuggestedActions(combinedScore, asset),
    
    // Justification détaillée
    justification: generateJustification(
      combinedScore,
      marketAnalysis,
      codeAnalysis,
      sentimentAnalysis
    )
  };
}

/**
 * 🛠️ Fonctions Utilitaires
 */

function getCoinGeckoId(symbol) {
  const mapping = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'LINK': 'chainlink'
  };
  return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
}

async function scanSmartContract(protocol) {
  // Simulation d'analyse de contrat (en production: MythX API)
  const knownProtocols = {
    'bitcoin': { critical: 0, high: 0, medium: 1, low: 2 },
    'ethereum': { critical: 0, high: 1, medium: 2, low: 3 },
    'solana': { critical: 0, high: 0, medium: 1, low: 1 },
    'unknown': { critical: 2, high: 3, medium: 5, low: 8 }
  };

  const issues = knownProtocols[protocol.toLowerCase()] || knownProtocols['unknown'];
  
  const vulnerabilities = [];
  
  // Générer des vulnérabilités détaillées
  if (issues.critical > 0) {
    vulnerabilities.push({
      severity: 'critical',
      type: 'Reentrancy Attack',
      description: 'Fonction vulnérable aux attaques de réentrance',
      impact: 'Perte totale de fonds possible'
    });
  }
  
  if (issues.high > 0) {
    vulnerabilities.push({
      severity: 'high',
      type: 'Access Control',
      description: 'Contrôle d\'accès insuffisant sur fonctions critiques',
      impact: 'Manipulation non autorisée possible'
    });
  }
  
  if (issues.medium > 0) {
    vulnerabilities.push({
      severity: 'medium',
      type: 'Integer Overflow',
      description: 'Risque de dépassement d\'entier',
      impact: 'Calculs incorrects possibles'
    });
  }

  return vulnerabilities;
}

async function checkSecurityAudits(protocol) {
  // Base de données d'audits (en production: Certik API)
  const auditScores = {
    'bitcoin': 95,
    'ethereum': 90,
    'solana': 85,
    'cardano': 88,
    'polkadot': 87
  };
  
  return auditScores[protocol.toLowerCase()] || 50;
}

function getLastAuditDate(protocol) {
  const dates = {
    'bitcoin': '2024-12-01',
    'ethereum': '2025-01-15',
    'solana': '2024-11-20',
    'cardano': '2024-10-10'
  };
  return dates[protocol.toLowerCase()] || 'Non audité';
}

function getRiskLevel(score) {
  if (score < 20) return { level: 'TRÈS FAIBLE', color: '🟢', action: 'ACHETER' };
  if (score < 40) return { level: 'FAIBLE', color: '🟡', action: 'ACHETER PRUDEMMENT' };
  if (score < 60) return { level: 'MODÉRÉ', color: '🟠', action: 'SURVEILLER' };
  if (score < 80) return { level: 'ÉLEVÉ', color: '🔴', action: 'RÉDUIRE EXPOSITION' };
  return { level: 'CRITIQUE', color: '⚫', action: 'VENDRE' };
}

function generateRecommendations(score, market, code, sentiment) {
  const recs = [];
  
  if (parseFloat(market.marketRiskScore) > 60) {
    recs.push({
      type: 'MARCHÉ',
      priority: 'high',
      message: `Volatilité élevée (${market.volatility}%). Considérez le DCA (Dollar Cost Averaging).`
    });
  }
  
  if (parseFloat(code.codeRiskScore) > 50) {
    recs.push({
      type: 'SÉCURITÉ',
      priority: 'critical',
      message: `${code.vulnerabilities.critical + code.vulnerabilities.high} vulnérabilités critiques détectées. Attendez un audit.`
    });
  }
  
  if (parseFloat(sentiment.sentimentScore) < 40) {
    recs.push({
      type: 'SENTIMENT',
      priority: 'medium',
      message: 'Sentiment négatif. Attendez une amélioration des indicateurs communautaires.'
    });
  }
  
  return recs;
}

function getSuggestedActions(score, asset) {
  if (score < 30) {
    return [
      `Acheter ${asset.symbol} - Risque acceptable`,
      'Diversifier avec 2-3 autres actifs',
      'Définir un stop-loss à -15%'
    ];
  } else if (score < 60) {
    return [
      `Acheter ${asset.symbol} avec prudence`,
      'Limiter à 5-10% du portfolio',
      'Surveiller quotidiennement'
    ];
  } else {
    return [
      `Éviter ${asset.symbol} pour le moment`,
      'Attendre une amélioration des indicateurs',
      'Considérer des alternatives plus sûres'
    ];
  }
}

function generateJustification(score, market, code, sentiment) {
  return `
📊 ANALYSE DÉTAILLÉE:

1️⃣ MARCHÉ (40% du score):
   • Volatilité: ${market.volatility}%
   • Tendance 7j: ${market.trend}%
   • Score risque: ${market.marketRiskScore}/100
   ${market.analysis}

2️⃣ CODE/SÉCURITÉ (35% du score):
   • Vulnérabilités critiques: ${code.vulnerabilities.critical}
   • Vulnérabilités hautes: ${code.vulnerabilities.high}
   • Score audit: ${code.auditScore}/100
   ${code.analysis}

3️⃣ SENTIMENT (25% du score):
   • Score communauté: ${sentiment.sentimentScore}/100
   • Twitter: ${sentiment.socialMedia.twitter} followers
   • Reddit: ${sentiment.socialMedia.reddit} membres
   ${sentiment.analysis}

🎯 CONCLUSION:
Score de Risque Combiné: ${score}/100
${getRiskLevel(score).color} Niveau: ${getRiskLevel(score).level}
Action recommandée: ${getRiskLevel(score).action}
  `.trim();
}

// Fonctions d'analyse de texte
function getMarketRiskAnalysis(score, volatility) {
  if (score < 20) return '✅ Marché stable avec faible volatilité';
  if (score < 40) return '🟡 Volatilité modérée, conditions normales';
  if (score < 60) return '🟠 Forte volatilité, prudence recommandée';
  return '🔴 Volatilité extrême, risque élevé de pertes';
}

function getCodeRiskAnalysis(codeScore, auditScore) {
  if (codeScore < 20 && auditScore > 80) return '✅ Code audité et sécurisé';
  if (codeScore < 40) return '🟡 Quelques vulnérabilités mineures';
  if (codeScore < 60) return '🟠 Vulnérabilités significatives détectées';
  return '🔴 Code non sécurisé, risque majeur';
}

function getSentimentAnalysis(score) {
  if (score > 80) return '✅ Sentiment très positif, forte confiance';
  if (score > 60) return '🟡 Sentiment positif';
  if (score > 40) return '🟠 Sentiment mitigé';
  return '🔴 Sentiment négatif, méfiance du marché';
}

// Données de fallback en cas d'erreur API
function getFallbackMarketData(symbol) {
  return {
    symbol,
    currentPrice: 0,
    volatility: '15.00',
    marketRiskScore: '35.00',
    trend: '0.00',
    priceRange: { min: 0, max: 0 },
    analysis: '⚠️ Données de marché indisponibles, utilisation des estimations'
  };
}

function getFallbackCodeData(protocol) {
  return {
    protocol,
    vulnerabilities: { critical: 1, high: 2, medium: 3, low: 5 },
    codeRiskScore: '45.00',
    auditScore: '60.00',
    lastAudit: 'Non disponible',
    issues: [],
    analysis: '⚠️ Analyse de code indisponible, score estimé'
  };
}

function getFallbackSentimentData(symbol) {
  return {
    symbol,
    sentimentScore: '50.00',
    details: { communityScore: 50, developerScore: 50, liquidityScore: 50, publicInterest: 50 },
    socialMedia: { twitter: 0, reddit: 0 },
    analysis: '⚠️ Données de sentiment indisponibles'
  };
}

module.exports = {
  calculateCombinedRiskScore,
  analyzeMarketVolatility,
  analyzeCodeVulnerabilities,
  analyzeSentiment
};
