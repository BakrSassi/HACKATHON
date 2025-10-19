/**
 * 🛡️ CyberGuardian Service - Cybersécurité proactive
 * Détection de menaces, phishing, et vulnérabilités
 */

// Base de données simulée de menaces connues
const knownThreats = [
  { domain: 'fake-binance.com', type: 'phishing', severity: 'critical' },
  { domain: 'eth-wallet-verify.net', type: 'phishing', severity: 'high' },
  { contract: '0x123fake', type: 'scam', severity: 'critical' }
];

// CVE (Common Vulnerabilities and Exposures) simulées
const cveDatabase = {
  'CVE-2025-2312': {
    severity: 'medium',
    description: 'Faille dans le mécanisme de validation des signatures',
    affectedProtocols: ['ETHX', 'DeFiPro'],
    discovered: '2025-10-16',
    patched: false
  },
  'CVE-2025-1847': {
    severity: 'critical',
    description: 'Vulnérabilité de réentrance dans les smart contracts',
    affectedProtocols: ['OldDeFi'],
    discovered: '2025-10-15',
    patched: false
  }
};

/**
 * Scanner de sécurité en temps réel
 */
export const performSecurityScan = (asset) => {
  const threats = [];
  const vulnerabilities = [];
  
  // 1. Vérification des domaines/URLs associés
  if (asset.website) {
    const domainThreat = checkDomainSecurity(asset.website);
    if (domainThreat) threats.push(domainThreat);
  }
  
  // 2. Analyse du smart contract (si crypto)
  if (asset.type === 'crypto' && asset.contractAddress) {
    const contractVulns = analyzeSmartContract(asset.contractAddress, asset.name);
    vulnerabilities.push(...contractVulns);
  }
  
  // 3. Vérification des CVE connues
  const cveThreats = checkCVE(asset.name);
  vulnerabilities.push(...cveThreats);
  
  // 4. Analyse des transactions suspectes
  const suspiciousActivity = detectSuspiciousActivity(asset);
  if (suspiciousActivity.length > 0) {
    threats.push(...suspiciousActivity);
  }
  
  // 5. Vérification de la réputation
  const reputationCheck = checkReputation(asset);
  
  // Calcul du score de sécurité
  const securityScore = calculateSecurityScore(threats, vulnerabilities);
  
  return {
    securityScore,
    threats,
    vulnerabilities,
    reputationCheck,
    recommendations: generateSecurityRecommendations(threats, vulnerabilities, securityScore)
  };
};

const checkDomainSecurity = (url) => {
  try {
    const domain = new URL(url).hostname;
    
    // Vérifier contre la liste de domaines malveillants
    const threat = knownThreats.find(t => t.domain === domain);
    if (threat) {
      return {
        type: 'phishing',
        severity: threat.severity,
        message: `⚠️ ALERTE : Le domaine ${domain} est identifié comme site de phishing`,
        blocked: true
      };
    }
    
    // Vérifications heuristiques
    if (domain.includes('verify') || domain.includes('secure') || domain.includes('wallet-')) {
      return {
        type: 'suspicious',
        severity: 'medium',
        message: `⚠️ Le domaine ${domain} contient des mots suspects souvent utilisés par les escrocs`,
        blocked: false
      };
    }
    
    return null;
  } catch (e) {
    return {
      type: 'invalid',
      severity: 'low',
      message: 'URL invalide ou inaccessible',
      blocked: false
    };
  }
};

const analyzeSmartContract = (contractAddress, assetName) => {
  const vulnerabilities = [];
  
  // Simulation d'analyse de code (en production : analyse statique + ML)
  
  // 1. Vérifier l'âge du contrat
  const contractAge = Math.floor(Math.random() * 500); // Simulé
  if (contractAge < 30) {
    vulnerabilities.push({
      type: 'risk',
      severity: 'medium',
      message: `Contrat très récent (${contractAge} jours). Risque de honeypot ou rug pull.`
    });
  }
  
  // 2. Analyse des patterns dangereux
  const hasReentrancy = Math.random() > 0.85; // 15% de risque simulé
  if (hasReentrancy) {
    vulnerabilities.push({
      type: 'vulnerability',
      severity: 'critical',
      message: 'Pattern de réentrance détecté. Risque de drainage de fonds.',
      cve: 'CVE-2025-1847'
    });
  }
  
  // 3. Vérifier la centralisation (ownership)
  const isCentralized = Math.random() > 0.7;
  if (isCentralized) {
    vulnerabilities.push({
      type: 'risk',
      severity: 'medium',
      message: 'Le contrat est contrôlé par une seule adresse (centralisé).'
    });
  }
  
  // 4. Vérifier les fonctions dangereuses (selfdestruct, delegatecall)
  const hasDangerousFunctions = Math.random() > 0.9;
  if (hasDangerousFunctions) {
    vulnerabilities.push({
      type: 'vulnerability',
      severity: 'high',
      message: 'Fonctions dangereuses détectées : selfdestruct ou delegatecall non sécurisé.'
    });
  }
  
  return vulnerabilities;
};

const checkCVE = (assetName) => {
  const vulnerabilities = [];
  
  // Vérifier si l'actif est affecté par des CVE connues
  Object.entries(cveDatabase).forEach(([cveId, cve]) => {
    if (cve.affectedProtocols.includes(assetName)) {
      vulnerabilities.push({
        type: 'cve',
        severity: cve.severity,
        message: `${cveId} : ${cve.description}`,
        discovered: cve.discovered,
        patched: cve.patched,
        cveId
      });
    }
  });
  
  return vulnerabilities;
};

const detectSuspiciousActivity = (asset) => {
  const suspicious = [];
  
  // Analyser les patterns de trading
  if (asset.volume24h) {
    const volumeSpike = asset.volume24h / asset.volumeAvg > 5;
    if (volumeSpike) {
      suspicious.push({
        type: 'anomaly',
        severity: 'medium',
        message: 'Volume de trading anormalement élevé détecté (possible pump & dump).'
      });
    }
  }
  
  // Analyser les mouvements de prix suspects
  if (Math.abs(asset.performance24h) > 30) {
    suspicious.push({
      type: 'anomaly',
      severity: 'high',
      message: `Mouvement de prix extrême (${asset.performance24h > 0 ? '+' : ''}${asset.performance24h}%). Méfiez-vous.`
    });
  }
  
  return suspicious;
};

const checkReputation = (asset) => {
  // Simulation de vérification de réputation
  const sources = [
    { name: 'CoinGecko', score: Math.floor(Math.random() * 30) + 70 },
    { name: 'CertiK', score: Math.floor(Math.random() * 40) + 60 },
    { name: 'Community', score: Math.floor(Math.random() * 50) + 50 }
  ];
  
  const avgScore = sources.reduce((sum, s) => sum + s.score, 0) / sources.length;
  
  return {
    sources,
    averageScore: Math.round(avgScore),
    status: avgScore >= 80 ? 'trusted' : avgScore >= 60 ? 'moderate' : 'low-trust'
  };
};

const calculateSecurityScore = (threats, vulnerabilities) => {
  let score = 100;
  
  threats.forEach(threat => {
    if (threat.severity === 'critical') score -= 30;
    else if (threat.severity === 'high') score -= 20;
    else if (threat.severity === 'medium') score -= 10;
    else score -= 5;
  });
  
  vulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') score -= 25;
    else if (vuln.severity === 'high') score -= 15;
    else if (vuln.severity === 'medium') score -= 8;
    else score -= 3;
  });
  
  return Math.max(0, score);
};

const generateSecurityRecommendations = (threats, vulnerabilities, securityScore) => {
  const recommendations = [];
  
  if (securityScore < 50) {
    recommendations.push({
      type: 'critical',
      action: 'block',
      message: '🚨 NE PAS INVESTIR - Niveau de sécurité critique détecté.'
    });
  } else if (securityScore < 70) {
    recommendations.push({
      type: 'warning',
      action: 'caution',
      message: '⚠️ Investissez avec prudence - Risques de sécurité détectés.'
    });
  }
  
  // Recommandations spécifiques par menace
  threats.forEach(threat => {
    if (threat.type === 'phishing') {
      recommendations.push({
        type: 'critical',
        action: 'avoid',
        message: `Ne visitez jamais ce site et ne connectez pas votre wallet.`
      });
    }
  });
  
  vulnerabilities.forEach(vuln => {
    if (vuln.type === 'cve' && !vuln.patched) {
      recommendations.push({
        type: 'warning',
        action: 'wait',
        message: `Attendez que la vulnérabilité ${vuln.cveId} soit corrigée avant d'investir.`
      });
    }
  });
  
  if (recommendations.length === 0 && securityScore >= 80) {
    recommendations.push({
      type: 'success',
      action: 'proceed',
      message: '✅ Aucune menace majeure détectée. Vous pouvez procéder.'
    });
  }
  
  return recommendations;
};

/**
 * Surveillance en temps réel
 */
export const startRealTimeMonitoring = (assets, onThreatDetected) => {
  // Simulation de monitoring continu
  const monitoringInterval = setInterval(() => {
    assets.forEach(asset => {
      // Scan aléatoire pour détecter de nouvelles menaces
      if (Math.random() > 0.95) { // 5% de chance de nouvelle menace
        const newThreat = {
          asset: asset.name,
          type: 'new-vulnerability',
          severity: 'high',
          message: `Nouvelle vulnérabilité détectée pour ${asset.name}`,
          timestamp: new Date().toISOString()
        };
        
        onThreatDetected(newThreat);
      }
    });
  }, 30000); // Vérifier toutes les 30 secondes
  
  return monitoringInterval;
};

export const stopRealTimeMonitoring = (intervalId) => {
  clearInterval(intervalId);
};
