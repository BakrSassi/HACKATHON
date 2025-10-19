/**
 * 🧠 SmartBrain Service - Module IA & Machine Learning
 * Analyse les actifs et calcule la Note d'Aura
 */

// Simulateur d'analyse IA (en production, connecté à un modèle ML backend)
export const analyzeAsset = (asset) => {
  // Calcul de la performance financière (0-40 points)
  const performanceScore = calculatePerformanceScore(asset);
  
  // Calcul de la fiabilité (0-30 points)
  const reliabilityScore = calculateReliabilityScore(asset);
  
  // Calcul du niveau de sécurité (0-30 points)
  const securityScore = calculateSecurityScore(asset);
  
  // Note d'Aura totale (0-100)
  const auraScore = performanceScore + reliabilityScore + securityScore;
  
  return {
    auraScore: Math.round(auraScore),
    performanceScore,
    reliabilityScore,
    securityScore,
    recommendations: generateRecommendations(asset, auraScore)
  };
};

const calculatePerformanceScore = (asset) => {
  const { performance24h, performance7d, performance30d, volatility } = asset;
  
  let score = 0;
  
  // Performance à court terme (10 points)
  if (performance24h > 5) score += 10;
  else if (performance24h > 0) score += 7;
  else if (performance24h > -5) score += 4;
  
  // Performance à moyen terme (15 points)
  if (performance7d > 10) score += 15;
  else if (performance7d > 5) score += 10;
  else if (performance7d > 0) score += 6;
  
  // Performance à long terme (10 points)
  if (performance30d > 15) score += 10;
  else if (performance30d > 5) score += 6;
  else if (performance30d > 0) score += 3;
  
  // Pénalité pour volatilité excessive (max -5 points)
  if (volatility > 50) score -= 5;
  else if (volatility > 30) score -= 2;
  
  return Math.max(0, Math.min(40, score));
};

const calculateReliabilityScore = (asset) => {
  const { marketCap, volume24h, liquidityScore, auditStatus } = asset;
  
  let score = 0;
  
  // Capitalisation boursière (10 points)
  if (marketCap > 1000000000) score += 10; // > 1B
  else if (marketCap > 100000000) score += 7; // > 100M
  else if (marketCap > 10000000) score += 4; // > 10M
  
  // Volume de trading (10 points)
  if (volume24h > 50000000) score += 10;
  else if (volume24h > 10000000) score += 7;
  else if (volume24h > 1000000) score += 4;
  
  // Liquidité (5 points)
  score += liquidityScore * 5;
  
  // Audit de sécurité (5 points)
  if (auditStatus === 'audited') score += 5;
  else if (auditStatus === 'partial') score += 2;
  
  return Math.max(0, Math.min(30, score));
};

const calculateSecurityScore = (asset) => {
  const { vulnerabilities, contractAge, securityIncidents, communityTrust } = asset;
  
  let score = 30; // Start at max
  
  // Vulnérabilités détectées
  if (vulnerabilities.critical > 0) score -= 15;
  else if (vulnerabilities.high > 0) score -= 10;
  else if (vulnerabilities.medium > 0) score -= 5;
  else if (vulnerabilities.low > 0) score -= 2;
  
  // Âge du contrat (bonus de confiance)
  if (contractAge > 365) score += 5; // > 1 an
  else if (contractAge > 180) score += 2; // > 6 mois
  
  // Incidents de sécurité récents
  score -= securityIncidents * 5;
  
  // Confiance de la communauté
  score += communityTrust * 5;
  
  return Math.max(0, Math.min(30, score));
};

const generateRecommendations = (asset, auraScore) => {
  const recommendations = [];
  
  if (auraScore >= 80) {
    recommendations.push({
      type: 'success',
      message: `${asset.name} présente un excellent profil. Continuez à surveiller.`,
      action: 'hold'
    });
  } else if (auraScore >= 60) {
    recommendations.push({
      type: 'info',
      message: `${asset.name} est stable mais pourrait être optimisé.`,
      action: 'optimize'
    });
  } else if (auraScore >= 40) {
    recommendations.push({
      type: 'warning',
      message: `${asset.name} montre des signes de faiblesse. Envisagez un rééquilibrage.`,
      action: 'rebalance'
    });
  } else {
    recommendations.push({
      type: 'danger',
      message: `${asset.name} présente des risques élevés. Action recommandée : vendre ou diversifier.`,
      action: 'sell'
    });
  }
  
  // Recommandations spécifiques basées sur les scores
  if (asset.volatility > 40) {
    recommendations.push({
      type: 'warning',
      message: 'Volatilité élevée détectée. Envisagez de réduire votre exposition.',
      action: 'reduce'
    });
  }
  
  if (asset.vulnerabilities.critical > 0 || asset.vulnerabilities.high > 0) {
    recommendations.push({
      type: 'danger',
      message: 'Vulnérabilités critiques détectées. Sortez de cette position immédiatement.',
      action: 'exit'
    });
  }
  
  return recommendations;
};

// Analyse du portefeuille complet
export const analyzePortfolio = (assets) => {
  const analyses = assets.map(asset => ({
    ...asset,
    analysis: analyzeAsset(asset)
  }));
  
  // Calcul de la Note d'Aura globale du portefeuille
  const totalAuraScore = analyses.reduce((sum, a) => sum + a.analysis.auraScore, 0) / analyses.length;
  
  // Diversification
  const diversificationScore = calculateDiversificationScore(assets);
  
  // Risque global
  const riskLevel = calculateRiskLevel(analyses);
  
  return {
    assets: analyses,
    portfolioAuraScore: Math.round(totalAuraScore),
    diversificationScore,
    riskLevel,
    totalValue: assets.reduce((sum, a) => sum + a.value, 0),
    recommendations: generatePortfolioRecommendations(analyses, diversificationScore, riskLevel)
  };
};

const calculateDiversificationScore = (assets) => {
  const types = [...new Set(assets.map(a => a.type))];
  const sectors = [...new Set(assets.map(a => a.sector))];
  
  // Plus de types et secteurs = meilleure diversification
  return Math.min(100, (types.length * 20) + (sectors.length * 10));
};

const calculateRiskLevel = (analyses) => {
  const avgScore = analyses.reduce((sum, a) => sum + a.analysis.auraScore, 0) / analyses.length;
  
  if (avgScore >= 80) return 'low';
  if (avgScore >= 60) return 'moderate';
  if (avgScore >= 40) return 'high';
  return 'critical';
};

const generatePortfolioRecommendations = (analyses, diversificationScore, riskLevel) => {
  const recommendations = [];
  
  if (diversificationScore < 40) {
    recommendations.push({
      type: 'warning',
      message: 'Votre portefeuille manque de diversification. Ajoutez des actifs dans d\'autres secteurs.',
      priority: 'high'
    });
  }
  
  if (riskLevel === 'critical' || riskLevel === 'high') {
    recommendations.push({
      type: 'danger',
      message: 'Niveau de risque élevé détecté. Rééquilibrez vers des actifs plus sûrs.',
      priority: 'critical'
    });
  }
  
  // Identifier les actifs problématiques
  const problematicAssets = analyses.filter(a => a.analysis.auraScore < 50);
  if (problematicAssets.length > 0) {
    recommendations.push({
      type: 'warning',
      message: `${problematicAssets.length} actif(s) nécessite(nt) votre attention immédiate.`,
      priority: 'high',
      assets: problematicAssets.map(a => a.name)
    });
  }
  
  return recommendations;
};
