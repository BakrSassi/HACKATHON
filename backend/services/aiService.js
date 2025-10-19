/**
 * 🤖 AURA - Aide à la Décision Intelligente
 * IA + UX/UI + Justifications Financières et Sécuritaires
 * 
 * Propose des actions correctives basées sur:
 * 1. Analyse de risque globale
 * 2. Authenticité des contrats
 * 3. Contexte du portefeuille utilisateur
 * 4. Conditions du marché
 */

const axios = require('axios');

// Configuration API (en production: utiliser .env)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * 🎯 FONCTION PRINCIPALE: Générer une recommandation IA
 */
async function generateAIRecommendation(context) {
  console.log('\n🤖 Génération de recommandation IA...');

  try {
    // Construire le contexte complet
    const fullContext = buildContextPrompt(context);

    // Appeler l'API IA (Groq ou OpenAI)
    let aiResponse;
    if (GROQ_API_KEY) {
      aiResponse = await callGroqAPI(fullContext);
    } else if (OPENAI_API_KEY) {
      aiResponse = await callOpenAIAPI(fullContext);
    } else {
      // Fallback: IA simulée locale
      aiResponse = await generateLocalRecommendation(context);
    }

    // Parser et structurer la réponse
    const recommendation = parseAIResponse(aiResponse, context);

    // Ajouter les justifications détaillées
    const justifications = generateJustifications(context, recommendation);

    // Calculer le score de confiance
    const confidenceScore = calculateConfidenceScore(context, recommendation);

    return {
      timestamp: new Date().toISOString(),
      
      // Recommandation principale
      recommendation: {
        action: recommendation.action,
        priority: recommendation.priority,
        summary: recommendation.summary
      },
      
      // Actions détaillées
      actions: recommendation.actions,
      
      // Justifications
      justifications: {
        financial: justifications.financial,
        security: justifications.security,
        technical: justifications.technical
      },
      
      // Métriques
      metrics: {
        confidenceScore: confidenceScore.toFixed(2),
        riskLevel: context.riskAnalysis?.riskLevel?.level || 'INCONNU',
        expectedReturn: recommendation.expectedReturn,
        timeHorizon: recommendation.timeHorizon
      },
      
      // Alertes
      alerts: generateAlerts(context, recommendation),
      
      // Plan d'action étape par étape
      actionPlan: generateActionPlan(context, recommendation),
      
      // Rapport complet
      fullReport: generateFullReport(context, recommendation, justifications, confidenceScore)
    };

  } catch (error) {
    console.error('❌ Erreur génération recommandation:', error.message);
    return getFallbackRecommendation(context);
  }
}

/**
 * 📝 Construire le prompt contexte pour l'IA
 */
function buildContextPrompt(context) {
  const { user, asset, riskAnalysis, contractVerification, portfolio } = context;

  return `
Tu es AURA, un assistant IA expert en finance crypto et cybersécurité.

CONTEXTE UTILISATEUR:
- Nom: ${user.name}
- Niveau d'expérience: ${user.experience || 'Intermédiaire'}
- Portefeuille total: $${portfolio?.totalValue?.toLocaleString() || '0'}
- Tolérance au risque: ${user.riskTolerance || 'Modérée'}

ACTIF ANALYSÉ:
- Symbole: ${asset.symbol}
- Prix actuel: $${asset.currentPrice || '0'}
- Montant détenu: ${asset.amount || '0'} ${asset.symbol}
- Valeur position: $${(asset.amount * asset.currentPrice)?.toLocaleString() || '0'}

ANALYSE DE RISQUE:
- Score de risque combiné: ${riskAnalysis?.combinedRiskScore || 'N/A'}/100
- Niveau: ${riskAnalysis?.riskLevel?.level || 'N/A'}
- Volatilité marché: ${riskAnalysis?.breakdown?.market?.data?.volatility || 'N/A'}%
- Score sécurité code: ${riskAnalysis?.breakdown?.code?.score || 'N/A'}/100
- Sentiment: ${riskAnalysis?.breakdown?.sentiment?.score || 'N/A'}/100

AUTHENTICITÉ CONTRAT:
- Score authenticité: ${contractVerification?.authenticityScore || 'N/A'}/100
- Niveau confiance: ${contractVerification?.trustLevel?.level || 'N/A'}
- Code vérifié: ${contractVerification?.contractInfo?.isVerified ? 'Oui' : 'Non'}
- Vulnérabilités: ${contractVerification?.security?.vulnerabilities?.length || 0}

MISSION:
Propose une recommandation d'action claire avec justifications financières et sécuritaires.
Format JSON:
{
  "action": "ACHETER|CONSERVER|VENDRE|RÉDUIRE|AUGMENTER",
  "priority": "low|medium|high|critical",
  "summary": "Résumé en 1 phrase",
  "actions": ["Action 1", "Action 2", "Action 3"],
  "expectedReturn": "+15%",
  "timeHorizon": "court terme|moyen terme|long terme"
}
  `.trim();
}

/**
 * 🤖 Appeler l'API Groq
 */
async function callGroqAPI(prompt) {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768', // Modèle rapide et précis
        messages: [
          {
            role: 'system',
            content: 'Tu es AURA, un expert en crypto-finance et cybersécurité. Tu donnes des conseils précis et justifiés.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur Groq API:', error.message);
    throw error;
  }
}

/**
 * 🤖 Appeler l'API OpenAI
 */
async function callOpenAIAPI(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // Version économique
        messages: [
          {
            role: 'system',
            content: 'Tu es AURA, un expert en crypto-finance et cybersécurité.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur OpenAI API:', error.message);
    throw error;
  }
}

/**
 * 🧠 Générer recommandation locale (sans API)
 */
async function generateLocalRecommendation(context) {
  const { riskAnalysis, contractVerification, asset } = context;
  const riskScore = parseFloat(riskAnalysis?.combinedRiskScore || 50);
  const authScore = parseFloat(contractVerification?.authenticityScore || 50);

  let action, priority, summary;

  // Logique de décision basée sur les scores
  if (riskScore < 30 && authScore > 70) {
    action = 'ACHETER';
    priority = 'high';
    summary = `${asset.symbol} présente un faible risque et une authenticité élevée. Opportunité d'achat.`;
  } else if (riskScore < 50 && authScore > 60) {
    action = 'AUGMENTER';
    priority = 'medium';
    summary = `${asset.symbol} est relativement sûr. Augmenter progressivement la position.`;
  } else if (riskScore < 70 && authScore > 40) {
    action = 'CONSERVER';
    priority = 'low';
    summary = `${asset.symbol} en situation stable. Conserver et surveiller.`;
  } else if (riskScore < 80 || authScore < 40) {
    action = 'RÉDUIRE';
    priority = 'high';
    summary = `${asset.symbol} présente des risques élevés. Réduire l'exposition.`;
  } else {
    action = 'VENDRE';
    priority = 'critical';
    summary = `${asset.symbol} trop risqué. Vendre rapidement.`;
  }

  const actions = generateActionsList(action, riskScore, authScore);
  const expectedReturn = calculateExpectedReturn(riskScore, authScore);
  const timeHorizon = determineTimeHorizon(riskScore);

  return JSON.stringify({
    action,
    priority,
    summary,
    actions,
    expectedReturn,
    timeHorizon
  });
}

/**
 * 📊 Parser la réponse IA
 */
function parseAIResponse(aiResponse, context) {
  try {
    // Essayer de parser comme JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Sinon, parser manuellement
    return {
      action: extractAction(aiResponse),
      priority: extractPriority(aiResponse),
      summary: aiResponse.split('\n')[0],
      actions: extractActions(aiResponse),
      expectedReturn: '+10%',
      timeHorizon: 'moyen terme'
    };
  } catch (error) {
    console.error('Erreur parsing IA:', error.message);
    return generateLocalRecommendation(context);
  }
}

/**
 * 📖 Générer les justifications détaillées
 */
function generateJustifications(context, recommendation) {
  const { riskAnalysis, contractVerification, asset, portfolio } = context;

  // Justification financière
  const financial = `
📊 JUSTIFICATION FINANCIÈRE:

1. Analyse de Marché:
   • Volatilité: ${riskAnalysis?.breakdown?.market?.data?.volatility || 'N/A'}%
   • Tendance 7j: ${riskAnalysis?.breakdown?.market?.data?.trend || 'N/A'}%
   • Score risque marché: ${riskAnalysis?.breakdown?.market?.score || 'N/A'}/100
   
2. Position dans le Portefeuille:
   • Valeur actuelle: $${(asset.amount * asset.currentPrice)?.toLocaleString() || '0'}
   • Part du portfolio: ${((asset.amount * asset.currentPrice / portfolio.totalValue) * 100).toFixed(2)}%
   • Performance: ${asset.performance || 'N/A'}%
   
3. Retour Attendu:
   • Court terme (1-3 mois): ${recommendation.expectedReturn}
   • Horizon: ${recommendation.timeHorizon}
   • Potentiel: ${getRiskReturnRatio(riskAnalysis)}
  `.trim();

  // Justification sécurité
  const security = `
🔐 JUSTIFICATION SÉCURITÉ:

1. Authenticité du Contrat:
   • Score: ${contractVerification?.authenticityScore || 'N/A'}/100
   • Niveau confiance: ${contractVerification?.trustLevel?.level || 'N/A'}
   • Code vérifié: ${contractVerification?.contractInfo?.isVerified ? '✅ Oui' : '❌ Non'}
   
2. Vulnérabilités Détectées:
   • Critiques: ${contractVerification?.security?.vulnerabilities?.filter(v => v.severity === 'critical').length || 0}
   • Élevées: ${contractVerification?.security?.vulnerabilities?.filter(v => v.severity === 'high').length || 0}
   • Score sécurité: ${riskAnalysis?.breakdown?.code?.score || 'N/A'}/100
   
3. Recommandations Sécurité:
   ${contractVerification?.recommendations?.map(r => `• ${r.message}`).join('\n   ') || '• Aucune recommandation spécifique'}
  `.trim();

  // Justification technique
  const technical = `
⚙️ JUSTIFICATION TECHNIQUE:

1. Métriques du Protocole:
   • Âge: ${contractVerification?.contractInfo?.ageInDays || 'N/A'} jours
   • Transactions: ${contractVerification?.reputation?.transactionCount?.toLocaleString() || 'N/A'}
   • Utilisateurs uniques: ${contractVerification?.reputation?.uniqueUsers?.toLocaleString() || 'N/A'}
   
2. Réputation:
   • Score créateur: ${contractVerification?.reputation?.creator?.score || 'N/A'}/100
   • Audits: ${contractVerification?.contractInfo?.hasAudit ? '✅ Oui' : '❌ Non'}
   • Par: ${contractVerification?.contractInfo?.auditBy?.join(', ') || 'Aucun'}
   
3. Sentiment:
   • Score communauté: ${riskAnalysis?.breakdown?.sentiment?.score || 'N/A'}/100
   • Twitter: ${riskAnalysis?.breakdown?.sentiment?.data?.socialMedia?.twitter?.toLocaleString() || 'N/A'} followers
   • Reddit: ${riskAnalysis?.breakdown?.sentiment?.data?.socialMedia?.reddit?.toLocaleString() || 'N/A'} membres
  `.trim();

  return { financial, security, technical };
}

/**
 * 🎯 Calculer le score de confiance
 */
function calculateConfidenceScore(context, recommendation) {
  let score = 50; // Base

  const { riskAnalysis, contractVerification } = context;

  // +20 si données complètes
  if (riskAnalysis && contractVerification) score += 20;

  // +15 si contrat vérifié
  if (contractVerification?.contractInfo?.isVerified) score += 15;

  // +10 si audité
  if (contractVerification?.contractInfo?.hasAudit) score += 10;

  // +5 si sentiment positif
  if (parseFloat(riskAnalysis?.breakdown?.sentiment?.score || 0) > 60) score += 5;

  return Math.min(100, score);
}

/**
 * 🚨 Générer les alertes
 */
function generateAlerts(context, recommendation) {
  const alerts = [];

  const { riskAnalysis, contractVerification } = context;

  // Alertes critiques
  if (parseFloat(riskAnalysis?.combinedRiskScore || 0) > 80) {
    alerts.push({
      level: 'critical',
      icon: '🔴',
      message: 'RISQUE CRITIQUE: Score de risque très élevé'
    });
  }

  if (!contractVerification?.contractInfo?.isVerified) {
    alerts.push({
      level: 'critical',
      icon: '⚠️',
      message: 'Code source non vérifié - Risque de scam'
    });
  }

  // Alertes importantes
  if (contractVerification?.security?.vulnerabilities?.length > 0) {
    alerts.push({
      level: 'high',
      icon: '🔴',
      message: `${contractVerification.security.vulnerabilities.length} vulnérabilités détectées`
    });
  }

  // Alertes modérées
  if (parseFloat(riskAnalysis?.breakdown?.market?.data?.volatility || 0) > 50) {
    alerts.push({
      level: 'medium',
      icon: '🟠',
      message: 'Volatilité élevée - Forte fluctuation des prix'
    });
  }

  return alerts;
}

/**
 * 📋 Générer le plan d'action étape par étape
 */
function generateActionPlan(context, recommendation) {
  const steps = [];
  const { action } = recommendation;

  if (action === 'ACHETER') {
    steps.push(
      { step: 1, action: 'Vérifier la liquidité disponible sur votre compte', duration: '2 min' },
      { step: 2, action: `Définir le montant d'achat (max ${context.user.riskTolerance === 'Élevée' ? '15%' : '10%'} du portfolio)`, duration: '5 min' },
      { step: 3, action: 'Placer un ordre limite à -2% du prix actuel', duration: '3 min' },
      { step: 4, action: 'Définir un stop-loss à -15%', duration: '2 min' },
      { step: 5, action: 'Ajouter un take-profit à +25%', duration: '2 min' }
    );
  } else if (action === 'VENDRE') {
    steps.push(
      { step: 1, action: 'Vérifier le prix actuel et la liquidité du marché', duration: '2 min' },
      { step: 2, action: 'Vendre 50% de la position immédiatement', duration: '3 min' },
      { step: 3, action: 'Vendre les 50% restants avec ordre limite +5%', duration: '3 min' },
      { step: 4, action: 'Transférer les fonds vers stablecoin (USDC/USDT)', duration: '5 min' },
      { step: 5, action: 'Analyser des alternatives plus sûres', duration: '10 min' }
    );
  } else if (action === 'CONSERVER') {
    steps.push(
      { step: 1, action: 'Maintenir la position actuelle', duration: '0 min' },
      { step: 2, action: 'Définir des alertes à ±10%', duration: '3 min' },
      { step: 3, action: 'Surveiller quotidiennement les indicateurs', duration: '5 min/jour' },
      { step: 4, action: 'Réévaluer la position dans 7 jours', duration: '15 min' }
    );
  }

  return steps;
}

/**
 * 📄 Générer le rapport complet
 */
function generateFullReport(context, recommendation, justifications, confidenceScore) {
  const { asset, riskAnalysis, contractVerification } = context;
  const trustLevel = contractVerification?.trustLevel || { level: 'INCONNU', color: '⚪' };

  return `
╔════════════════════════════════════════════════════════════╗
║           🤖 AURA - AIDE À LA DÉCISION INTELLIGENTE        ║
╚════════════════════════════════════════════════════════════╝

📅 Date: ${new Date().toISOString().split('T')[0]}
💼 Actif: ${asset.symbol}
💰 Prix: $${asset.currentPrice?.toLocaleString() || '0'}

┌─────────────────────────────────────────────────────────────┐
│ 🎯 RECOMMANDATION PRINCIPALE                                │
└─────────────────────────────────────────────────────────────┘

Action: ${recommendation.action}
Priorité: ${recommendation.priority.toUpperCase()}
Confiance: ${confidenceScore}%

${recommendation.summary}

┌─────────────────────────────────────────────────────────────┐
│ 📊 SCORES CLÉS                                               │
└─────────────────────────────────────────────────────────────┘

• Risque Combiné: ${riskAnalysis?.combinedRiskScore || 'N/A'}/100
  └─ Niveau: ${riskAnalysis?.riskLevel?.level || 'N/A'}
  
• Authenticité: ${contractVerification?.authenticityScore || 'N/A'}/100
  └─ ${trustLevel.color} Confiance: ${trustLevel.level}

${justifications.financial}

${justifications.security}

${justifications.technical}

┌─────────────────────────────────────────────────────────────┐
│ 📋 PLAN D'ACTION                                             │
└─────────────────────────────────────────────────────────────┘

${generateActionPlan(context, recommendation).map(s => 
  `${s.step}. ${s.action} [${s.duration}]`
).join('\n')}

┌─────────────────────────────────────────────────────────────┐
│ 🎯 RETOUR ATTENDU                                            │
└─────────────────────────────────────────────────────────────┘

Horizon: ${recommendation.timeHorizon}
Retour estimé: ${recommendation.expectedReturn}
Risque/Rendement: ${getRiskReturnRatio(riskAnalysis)}

╔════════════════════════════════════════════════════════════╗
║  💡 Cette recommandation combine IA + FinTech + CyberSec   ║
╚════════════════════════════════════════════════════════════╝
  `.trim();
}

/**
 * 🛠️ Fonctions utilitaires
 */

function generateActionsList(action, riskScore, authScore) {
  if (action === 'ACHETER') {
    return [
      'Acheter progressivement sur 3-5 jours (DCA)',
      'Limiter à 10-15% du portefeuille total',
      'Définir un stop-loss à -15%',
      'Ajouter un take-profit à +25%'
    ];
  } else if (action === 'VENDRE') {
    return [
      'Vendre 50% immédiatement',
      'Vendre 50% avec ordre limite +5%',
      'Transférer vers stablecoin',
      'Réévaluer dans 30 jours'
    ];
  } else {
    return [
      'Maintenir la position',
      'Définir des alertes à ±10%',
      'Surveiller quotidiennement',
      'Réévaluer dans 7 jours'
    ];
  }
}

function calculateExpectedReturn(riskScore, authScore) {
  const avgScore = (100 - riskScore + authScore) / 2;
  if (avgScore > 70) return '+20-30%';
  if (avgScore > 50) return '+10-20%';
  if (avgScore > 30) return '+5-10%';
  return '0-5%';
}

function determineTimeHorizon(riskScore) {
  if (riskScore < 30) return 'long terme (6-12 mois)';
  if (riskScore < 60) return 'moyen terme (3-6 mois)';
  return 'court terme (1-3 mois)';
}

function getRiskReturnRatio(riskAnalysis) {
  const riskScore = parseFloat(riskAnalysis?.combinedRiskScore || 50);
  if (riskScore < 30) return 'Excellent (1:3)';
  if (riskScore < 50) return 'Bon (1:2)';
  if (riskScore < 70) return 'Modéré (1:1.5)';
  return 'Faible (1:1)';
}

function extractAction(text) {
  if (text.includes('acheter') || text.includes('ACHETER')) return 'ACHETER';
  if (text.includes('vendre') || text.includes('VENDRE')) return 'VENDRE';
  if (text.includes('réduire') || text.includes('RÉDUIRE')) return 'RÉDUIRE';
  if (text.includes('augmenter') || text.includes('AUGMENTER')) return 'AUGMENTER';
  return 'CONSERVER';
}

function extractPriority(text) {
  if (text.includes('critical') || text.includes('critique')) return 'critical';
  if (text.includes('high') || text.includes('élevé')) return 'high';
  if (text.includes('medium') || text.includes('moyen')) return 'medium';
  return 'low';
}

function extractActions(text) {
  const lines = text.split('\n');
  return lines
    .filter(line => line.match(/^[\d\-\•\*]/))
    .slice(0, 5)
    .map(line => line.replace(/^[\d\-\•\*\s]+/, ''));
}

function getFallbackRecommendation(context) {
  return {
    timestamp: new Date().toISOString(),
    recommendation: {
      action: 'CONSERVER',
      priority: 'medium',
      summary: 'Données insuffisantes pour une recommandation précise. Conserver et surveiller.'
    },
    actions: [
      'Attendre plus de données',
      'Surveiller le marché',
      'Réévaluer dans 24h'
    ],
    justifications: {
      financial: 'Données de marché limitées',
      security: 'Analyse de sécurité partielle',
      technical: 'Métriques incomplètes'
    },
    metrics: {
      confidenceScore: '30',
      riskLevel: 'INCONNU',
      expectedReturn: 'N/A',
      timeHorizon: 'À déterminer'
    },
    alerts: [
      { level: 'medium', icon: '⚠️', message: 'Données incomplètes' }
    ],
    actionPlan: [],
    fullReport: 'Rapport incomplet - Données manquantes'
  };
}

module.exports = {
  generateAIRecommendation,
  generateLocalRecommendation,
  calculateConfidenceScore
};
