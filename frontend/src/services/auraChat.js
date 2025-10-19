/**
 * 💬 AURA Chat Service - Assistant IA conversationnel
 * Nouvelle version avec intégration API dynamique
 */

import { getAIResponse } from './aiService';

/**
 * Générer une réponse (avec API ou fallback local)
 */
export const generateChatResponse = async (question, context, conversationHistory = []) => {
  // Essayer d'utiliser l'API d'IA en premier
  try {
    const aiResponse = await getAIResponse(question, context, conversationHistory);
    
    if (aiResponse.success) {
      return {
        response: aiResponse.response,
        type: 'ai-response',
        provider: aiResponse.provider,
        useAI: true
      };
    }
    
    // Si l'API échoue, utiliser la logique locale
    if (aiResponse.error === 'no_api_key') {
      // Message spécial pour configurer l'API
      return {
        response: aiResponse.response,
        type: 'info',
        useAI: false,
        needsApiKey: true,
        suggestedQuestions: [
          "Comment configurer une clé API ?",
          "Quelles APIs sont supportées ?",
          "Pourquoi ai-je besoin d'une API ?"
        ]
      };
    }
    
    // Erreur API, fallback sur local
    console.warn('API non disponible, utilisation du mode local');
    return generateLocalResponse(question, context);
    
  } catch (error) {
    console.error('Erreur lors de la génération de réponse:', error);
    return generateLocalResponse(question, context);
  }
};

/**
 * Générer une réponse locale (fallback)
 */
const generateLocalResponse = (question, context) => {
  const lowerQuestion = question.toLowerCase();
  
  // Détection d'intention pour réponses locales
  if (lowerQuestion.includes('api') || lowerQuestion.includes('clé') || lowerQuestion.includes('configur')) {
    return generateApiSetupGuide();
  }
  
  if (lowerQuestion.includes('risque') || lowerQuestion.includes('dangereux')) {
    return generateRiskExplanation(context);
  }
  
  if (lowerQuestion.includes('pourquoi') && lowerQuestion.includes('score')) {
    return generateScoreExplanation(context);
  }
  
  if (lowerQuestion.includes('recommand') || lowerQuestion.includes('que faire')) {
    return generateRecommendation(context);
  }
  
  if (lowerQuestion.includes('sécurité') || lowerQuestion.includes('sécuris')) {
    return generateSecurityExplanation(context);
  }
  
  if (lowerQuestion.includes('blockchain') || lowerQuestion.includes('véri')) {
    return generateBlockchainExplanation(context);
  }
  
  if (lowerQuestion.includes('performance') || lowerQuestion.includes('rendement')) {
    return generatePerformanceExplanation(context);
  }
  
  // Réponse par défaut
  return {
    response: "🤖 **Mode Local Activé**\n\nJe fonctionne avec une logique prédéfinie. Pour des réponses plus intelligentes et personnalisées, configurez une clé API !\n\nJe peux répondre à :\n- Questions sur les risques\n- Calcul des scores\n- Recommandations basiques\n- Analyses de sécurité\n\nOu demandez-moi : *'Comment configurer l'API ?'*",
    type: 'info',
    useAI: false,
    suggestedQuestions: [
      "Comment configurer une clé API ?",
      "Pourquoi cet actif est-il risqué ?",
      "Comment est calculé mon score AURA ?",
      "Quelles sont vos recommandations ?"
    ]
  };
};

/**
 * Guide de configuration API
 */
const generateApiSetupGuide = () => {
  return {
    response: `## 🔑 Configuration de l'API IA

Pour débloquer mes capacités complètes, vous avez 3 options :

### ⚡ Option 1 : Groq (GRATUIT - Recommandé)
Le plus rapide et gratuit !

1. Allez sur **https://console.groq.com**
2. Créez un compte (gratuit)
3. Obtenez votre clé API
4. Cliquez sur **"⚙️ Paramètres API"** ci-dessous
5. Collez votre clé dans "Groq API Key"

### 🤖 Option 2 : OpenAI (GPT)
Le plus connu et performant

1. Visitez **https://platform.openai.com**
2. Créez un compte
3. Ajoutez du crédit (à partir de $5)
4. Générez une clé API
5. Configurez dans les paramètres

### 🎯 Option 3 : Hugging Face
Gratuit mais plus lent

1. Allez sur **https://huggingface.co**
2. Créez un compte gratuit
3. Générez un token d'accès
4. Configurez dans les paramètres

**Avantages de l'API :**
- ✅ Réponses à n'importe quelle question
- ✅ Compréhension contextuelle avancée
- ✅ Recommandations personnalisées
- ✅ Analyse en temps réel

Cliquez sur ⚙️ pour commencer !`,
    type: 'api-setup',
    useAI: false
  };
};

const generateRiskExplanation = (context) => {
  const { asset } = context;
  
  if (!asset) {
    return {
      response: "Pour analyser le risque, j'ai besoin de savoir de quel actif vous parlez.",
      type: 'question'
    };
  }
  
  const reasons = [];
  
  if (asset.analysis.auraScore < 60) {
    reasons.push(`📉 **Score AURA faible** (${asset.analysis.auraScore}/100)`);
  }
  
  if (asset.volatility > 40) {
    reasons.push(`⚡ **Volatilité élevée** (${asset.volatility}%) - Les prix fluctuent dangereusement`);
  }
  
  if (asset.vulnerabilities?.critical > 0 || asset.vulnerabilities?.high > 0) {
    reasons.push(`🔴 **Vulnérabilités critiques détectées** - Le smart contract présente des failles de sécurité`);
  }
  
  if (asset.performance7d < -10) {
    reasons.push(`📊 **Performance négative** (${asset.performance7d}% sur 7 jours)`);
  }
  
  if (asset.securityScan?.securityScore < 60) {
    reasons.push(`🛡️ **Score de sécurité faible** (${asset.securityScan.securityScore}/100)`);
  }
  
  // Vérifier les CVE
  const cveIssues = asset.securityScan?.vulnerabilities?.filter(v => v.type === 'cve') || [];
  if (cveIssues.length > 0) {
    const cveDetails = cveIssues.map(v => v.cveId).join(', ');
    reasons.push(`⚠️ **CVE détectées** : ${cveDetails} - ${cveIssues[0].message}`);
  }
  
  let response = `## Pourquoi ${asset.name} est risqué ?\n\n`;
  
  if (reasons.length === 0) {
    response += "Bonne nouvelle ! Cet actif ne présente pas de risque majeur selon nos analyses.\n\n";
    response += `✅ Score AURA: ${asset.analysis.auraScore}/100\n`;
    response += `✅ Score de sécurité: ${asset.securityScan?.securityScore || 'N/A'}/100`;
  } else {
    response += "Voici les raisons identifiées par notre analyse :\n\n";
    reasons.forEach(reason => {
      response += `${reason}\n\n`;
    });
    
    response += "### 💡 Recommandation\n";
    if (asset.analysis.auraScore < 40) {
      response += "🚨 **Action immédiate recommandée** : Envisagez de vendre ou réduire fortement votre exposition.";
    } else if (asset.analysis.auraScore < 60) {
      response += "⚠️ **Soyez prudent** : Surveillez de près et envisagez un rééquilibrage vers des actifs plus sûrs.";
    } else {
      response += "📊 **Surveillez attentivement** : Le risque est modéré mais gérable.";
    }
  }
  
  return {
    response,
    type: 'risk-analysis',
    data: {
      riskLevel: asset.analysis.auraScore < 40 ? 'high' : asset.analysis.auraScore < 60 ? 'medium' : 'low',
      reasons
    }
  };
};

const generateScoreExplanation = (context) => {
  const { asset, portfolio } = context;
  
  if (asset) {
    const { performanceScore, reliabilityScore, securityScore, auraScore } = asset.analysis;
    
    let response = `## Score AURA de ${asset.name} : ${auraScore}/100\n\n`;
    response += "Le score AURA est calculé sur 3 piliers :\n\n";
    response += `### 📈 Performance Financière : ${performanceScore}/40\n`;
    response += `- Performance 24h : ${asset.performance24h > 0 ? '+' : ''}${asset.performance24h}%\n`;
    response += `- Performance 7j : ${asset.performance7d > 0 ? '+' : ''}${asset.performance7d}%\n`;
    response += `- Performance 30j : ${asset.performance30d > 0 ? '+' : ''}${asset.performance30d}%\n`;
    response += `- Volatilité : ${asset.volatility}%\n\n`;
    
    response += `### 🎯 Fiabilité : ${reliabilityScore}/30\n`;
    response += `- Capitalisation : ${formatMoney(asset.marketCap)}\n`;
    response += `- Volume 24h : ${formatMoney(asset.volume24h)}\n`;
    response += `- Liquidité : ${(asset.liquidityScore * 100).toFixed(0)}%\n`;
    response += `- Audit : ${asset.auditStatus === 'audited' ? '✅ Audité' : '⚠️ Non audité'}\n\n`;
    
    response += `### 🛡️ Sécurité : ${securityScore}/30\n`;
    response += `- Vulnérabilités : ${asset.vulnerabilities.critical} critiques, ${asset.vulnerabilities.high} élevées\n`;
    response += `- Âge du contrat : ${asset.contractAge} jours\n`;
    response += `- Incidents récents : ${asset.securityIncidents}\n`;
    response += `- Confiance communauté : ${(asset.communityTrust * 100).toFixed(0)}%\n\n`;
    
    response += "### 🎯 Interprétation\n";
    if (auraScore >= 80) {
      response += "🟢 **Excellent** - Actif de haute qualité avec un profil risque/rendement favorable.";
    } else if (auraScore >= 60) {
      response += "🟡 **Bon** - Actif solide mais avec quelques points d'attention.";
    } else if (auraScore >= 40) {
      response += "🟠 **Moyen** - Actif présentant des risques significatifs.";
    } else {
      response += "🔴 **Faible** - Actif à haut risque, investissement déconseillé.";
    }
    
    return { response, type: 'score-explanation' };
  }
  
  if (portfolio) {
    let response = `## Score AURA du Portefeuille : ${portfolio.portfolioAuraScore}/100\n\n`;
    response += `Ce score représente la moyenne pondérée de tous vos actifs.\n\n`;
    response += `📊 **Diversification** : ${portfolio.diversificationScore}/100\n`;
    response += `⚠️ **Niveau de risque** : ${portfolio.riskLevel.toUpperCase()}\n`;
    response += `💰 **Valeur totale** : ${formatMoney(portfolio.totalValue)}\n`;
    
    return { response, type: 'score-explanation' };
  }
  
  return {
    response: "De quel actif ou portefeuille souhaitez-vous comprendre le score ?",
    type: 'question'
  };
};

const generateRecommendation = (context) => {
  const { asset, portfolio } = context;
  
  if (asset) {
    let response = `## Recommandations pour ${asset.name}\n\n`;
    
    asset.analysis.recommendations.forEach(rec => {
      const icon = rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : '🚨';
      response += `${icon} **${rec.message}**\n\n`;
      
      switch (rec.action) {
        case 'hold':
          response += "👉 **Action** : Conservez votre position et surveillez.\n";
          break;
        case 'sell':
          response += "👉 **Action** : Envisagez une sortie progressive de cette position.\n";
          break;
        case 'rebalance':
          response += "👉 **Action** : Rééquilibrez vers des actifs plus performants ou sûrs.\n";
          break;
        case 'reduce':
          response += "👉 **Action** : Réduisez votre exposition pour limiter les risques.\n";
          break;
        case 'exit':
          response += "👉 **Action** : Sortez immédiatement de cette position.\n";
          break;
      }
      
      response += "\n";
    });
    
    return { response, type: 'recommendation' };
  }
  
  if (portfolio) {
    let response = `## Recommandations pour votre portefeuille\n\n`;
    
    portfolio.recommendations.forEach(rec => {
      const icon = rec.type === 'danger' ? '🚨' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
      response += `${icon} **${rec.message}**\n`;
      response += `Priorité : ${rec.priority.toUpperCase()}\n\n`;
    });
    
    return { response, type: 'recommendation' };
  }
  
  return {
    response: "Sur quel actif ou votre portefeuille global souhaitez-vous des recommandations ?",
    type: 'question'
  };
};

const generateSecurityExplanation = (context) => {
  const { asset } = context;
  
  if (!asset || !asset.securityScan) {
    return {
      response: "Je n'ai pas d'informations de sécurité pour cet actif.",
      type: 'info'
    };
  }
  
  const { securityScore, threats, vulnerabilities, reputationCheck } = asset.securityScan;
  
  let response = `## Analyse de sécurité : ${asset.name}\n\n`;
  response += `🛡️ **Score de sécurité** : ${securityScore}/100\n\n`;
  
  if (threats.length > 0) {
    response += `### ⚠️ Menaces détectées (${threats.length})\n\n`;
    threats.forEach(threat => {
      const icon = threat.severity === 'critical' ? '🔴' : threat.severity === 'high' ? '🟠' : '🟡';
      response += `${icon} **${threat.type.toUpperCase()}** : ${threat.message}\n`;
      if (threat.blocked) {
        response += `   ✋ **Bloqué automatiquement**\n`;
      }
      response += `\n`;
    });
  }
  
  if (vulnerabilities.length > 0) {
    response += `### 🔍 Vulnérabilités détectées (${vulnerabilities.length})\n\n`;
    vulnerabilities.forEach(vuln => {
      const icon = vuln.severity === 'critical' ? '🔴' : vuln.severity === 'high' ? '🟠' : '🟡';
      response += `${icon} **${vuln.type.toUpperCase()}** : ${vuln.message}\n`;
      if (vuln.cveId) {
        response += `   📋 CVE : ${vuln.cveId}\n`;
      }
      response += `\n`;
    });
  }
  
  if (threats.length === 0 && vulnerabilities.length === 0) {
    response += `✅ **Aucune menace majeure détectée !**\n\n`;
  }
  
  response += `### 📊 Réputation\n`;
  response += `Score moyen : ${reputationCheck.averageScore}/100\n`;
  response += `Statut : ${reputationCheck.status === 'trusted' ? '✅ Fiable' : reputationCheck.status === 'moderate' ? '⚠️ Modéré' : '🔴 Faible confiance'}\n`;
  
  return { response, type: 'security-analysis' };
};

const generateBlockchainExplanation = (context) => {
  let response = `## 🔗 Vérification Blockchain\n\n`;
  response += "Toutes vos décisions, recommandations et alertes sont enregistrées sur notre blockchain interne.\n\n";
  response += "**Avantages** :\n";
  response += "- ✅ **Immuabilité** : Impossible de modifier l'historique\n";
  response += "- 🔒 **Traçabilité** : Chaque action est horodatée et signée\n";
  response += "- 🔍 **Transparence** : Vous pouvez vérifier l'authenticité de toute transaction\n";
  response += "- 🛡️ **Confiance** : Preuve cryptographique de chaque recommandation\n\n";
  response += "Consultez l'onglet **TrustLedger** pour voir l'historique complet.\n";
  
  return { response, type: 'blockchain-info' };
};

const generatePerformanceExplanation = (context) => {
  const { asset } = context;
  
  if (!asset) {
    return {
      response: "De quel actif voulez-vous connaître les performances ?",
      type: 'question'
    };
  }
  
  let response = `## 📈 Performances : ${asset.name}\n\n`;
  response += `**Court terme (24h)** : ${asset.performance24h > 0 ? '📈' : '📉'} ${asset.performance24h > 0 ? '+' : ''}${asset.performance24h}%\n`;
  response += `**Moyen terme (7j)** : ${asset.performance7d > 0 ? '📈' : '📉'} ${asset.performance7d > 0 ? '+' : ''}${asset.performance7d}%\n`;
  response += `**Long terme (30j)** : ${asset.performance30d > 0 ? '📈' : '📉'} ${asset.performance30d > 0 ? '+' : ''}${asset.performance30d}%\n\n`;
  
  response += `**Volatilité** : ${asset.volatility}% `;
  if (asset.volatility > 40) {
    response += `🔴 (Très élevée - risque important)`;
  } else if (asset.volatility > 25) {
    response += `🟡 (Élevée)`;
  } else {
    response += `🟢 (Modérée)`;
  }
  
  response += `\n\n**Volume 24h** : ${formatMoney(asset.volume24h)}\n`;
  response += `**Capitalisation** : ${formatMoney(asset.marketCap)}\n`;
  
  return { response, type: 'performance-analysis' };
};

// Utilitaire de formatage
const formatMoney = (amount) => {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
  return `$${amount.toFixed(2)}`;
};

export default { generateChatResponse };
