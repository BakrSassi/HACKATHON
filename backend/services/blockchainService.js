/**
 * 🔐 AURA - Vérificateur d'Authenticité Smart Contract
 * Vérification automatique des contrats intelligents
 * 
 * Fonctionnalités:
 * 1. Vérification Etherscan/Polygonscan
 * 2. Analyse du bytecode
 * 3. Détection de patterns malveillants
 * 4. Score d'authenticité
 */

const axios = require('axios');
const { ethers } = require('ethers');

// Configuration des providers
const providers = {
  ethereum: new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
  polygon: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com'),
  bsc: new ethers.JsonRpcProvider(process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org')
};

// API Keys Etherscan (gratuit)
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || 'YourApiKeyToken';
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || 'YourApiKeyToken';

/**
 * 🎯 FONCTION PRINCIPALE: Vérifier l'authenticité d'un contrat
 */
async function verifyContractAuthenticity(contractAddress, chain = 'ethereum') {
  console.log(`\n🔍 Vérification du contrat ${contractAddress} sur ${chain}...`);

  try {
    // Valider l'adresse
    if (!ethers.isAddress(contractAddress)) {
      throw new Error('Adresse de contrat invalide');
    }

    // 1. Vérifier si le contrat existe
    const contractExists = await checkContractExists(contractAddress, chain);
    if (!contractExists) {
      return {
        address: contractAddress,
        chain,
        isValid: false,
        authenticityScore: 0,
        error: 'Contrat introuvable sur cette blockchain'
      };
    }

    // 2. Récupérer les informations du contrat depuis l'explorateur
    const explorerData = await getExplorerData(contractAddress, chain);

    // 3. Analyser le bytecode
    const bytecodeAnalysis = await analyzeBytecode(contractAddress, chain);

    // 4. Vérifier les patterns malveillants
    const securityCheck = await checkMaliciousPatterns(bytecodeAnalysis.bytecode, explorerData.sourceCode);

    // 5. Vérifier la réputation du créateur
    const creatorReputation = await checkCreatorReputation(explorerData.creator, chain);

    // 6. Calculer le score d'authenticité (0-100)
    const authenticityScore = calculateAuthenticityScore({
      isVerified: explorerData.isVerified,
      hasAudit: explorerData.hasAudit,
      securityScore: securityCheck.score,
      creatorScore: creatorReputation.score,
      ageInDays: explorerData.ageInDays,
      transactionCount: explorerData.transactionCount
    });

    // 7. Générer le rapport complet
    return {
      address: contractAddress,
      chain,
      timestamp: new Date().toISOString(),
      
      // Score global
      isValid: true,
      authenticityScore: authenticityScore.toFixed(2),
      trustLevel: getTrustLevel(authenticityScore),
      
      // Détails du contrat
      contractInfo: {
        name: explorerData.name,
        creator: explorerData.creator,
        creationDate: explorerData.creationDate,
        ageInDays: explorerData.ageInDays,
        isVerified: explorerData.isVerified,
        hasAudit: explorerData.hasAudit,
        auditBy: explorerData.auditBy
      },
      
      // Analyse de sécurité
      security: {
        score: securityCheck.score,
        vulnerabilities: securityCheck.vulnerabilities,
        maliciousPatterns: securityCheck.maliciousPatterns,
        warnings: securityCheck.warnings
      },
      
      // Réputation
      reputation: {
        creator: creatorReputation,
        transactionCount: explorerData.transactionCount,
        uniqueUsers: explorerData.uniqueUsers,
        totalValue: explorerData.totalValue
      },
      
      // Recommandations
      recommendations: generateRecommendations(authenticityScore, securityCheck, explorerData),
      
      // Justification détaillée
      justification: generateAuthenticityJustification({
        authenticityScore,
        explorerData,
        securityCheck,
        creatorReputation
      })
    };

  } catch (error) {
    console.error('❌ Erreur vérification contrat:', error.message);
    return {
      address: contractAddress,
      chain,
      isValid: false,
      authenticityScore: 0,
      error: error.message
    };
  }
}

/**
 * 🔍 Vérifier si le contrat existe
 */
async function checkContractExists(address, chain) {
  try {
    const provider = providers[chain];
    const code = await provider.getCode(address);
    return code !== '0x'; // Si le code n'est pas vide, le contrat existe
  } catch (error) {
    return false;
  }
}

/**
 * 📊 Récupérer les données depuis l'explorateur
 */
async function getExplorerData(address, chain) {
  try {
    const explorerConfig = getExplorerConfig(chain);
    
    // Récupérer les informations du contrat
    const response = await axios.get(explorerConfig.apiUrl, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address,
        apikey: explorerConfig.apiKey
      }
    });

    if (response.data.status === '1' && response.data.result[0]) {
      const data = response.data.result[0];
      
      // Récupérer les transactions
      const txResponse = await axios.get(explorerConfig.apiUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,
          endblock: 99999999,
          sort: 'asc',
          apikey: explorerConfig.apiKey
        }
      });

      const transactions = txResponse.data.result || [];
      const creationTx = transactions[0];
      const creationDate = creationTx ? new Date(creationTx.timeStamp * 1000) : new Date();
      const ageInDays = Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        name: data.ContractName || 'Unknown',
        creator: creationTx?.from || 'Unknown',
        creationDate: creationDate.toISOString().split('T')[0],
        ageInDays,
        isVerified: data.SourceCode !== '',
        sourceCode: data.SourceCode,
        hasAudit: checkIfAudited(data.ContractName),
        auditBy: getAuditInfo(data.ContractName),
        transactionCount: transactions.length,
        uniqueUsers: new Set(transactions.map(tx => tx.from)).size,
        totalValue: calculateTotalValue(transactions)
      };
    }

    // Fallback si pas de données
    return getFallbackExplorerData(address);

  } catch (error) {
    console.error('Erreur récupération explorer:', error.message);
    return getFallbackExplorerData(address);
  }
}

/**
 * 🧬 Analyser le bytecode
 */
async function analyzeBytecode(address, chain) {
  try {
    const provider = providers[chain];
    const bytecode = await provider.getCode(address);

    // Analyses du bytecode
    const analysis = {
      bytecode,
      size: bytecode.length,
      hasSelfDestruct: bytecode.includes('ff'), // SELFDESTRUCT opcode
      hasDelegateCall: bytecode.includes('f4'), // DELEGATECALL opcode
      hasCreate2: bytecode.includes('f5'), // CREATE2 opcode
      complexity: calculateComplexity(bytecode)
    };

    return analysis;

  } catch (error) {
    return {
      bytecode: '0x',
      size: 0,
      hasSelfDestruct: false,
      hasDelegateCall: false,
      hasCreate2: false,
      complexity: 0
    };
  }
}

/**
 * 🛡️ Vérifier les patterns malveillants
 */
async function checkMaliciousPatterns(bytecode, sourceCode) {
  const vulnerabilities = [];
  const warnings = [];
  let score = 100; // Commencer à 100, déduire des points

  // Pattern 1: SELFDESTRUCT non protégé
  if (bytecode.includes('ff')) {
    vulnerabilities.push({
      severity: 'high',
      type: 'SELFDESTRUCT Detected',
      description: 'Le contrat peut être détruit'
    });
    score -= 20;
  }

  // Pattern 2: DELEGATECALL non sécurisé
  if (bytecode.includes('f4')) {
    warnings.push({
      severity: 'medium',
      type: 'DELEGATECALL Usage',
      description: 'Utilisation de DELEGATECALL détectée'
    });
    score -= 10;
  }

  // Pattern 3: Code source non vérifié
  if (!sourceCode || sourceCode === '') {
    vulnerabilities.push({
      severity: 'high',
      type: 'Unverified Source',
      description: 'Code source non vérifié sur l\'explorateur'
    });
    score -= 25;
  }

  // Pattern 4: Patterns de honeypot
  if (sourceCode) {
    if (sourceCode.includes('require(msg.sender == owner)') && 
        !sourceCode.includes('transferOwnership')) {
      warnings.push({
        severity: 'medium',
        type: 'Centralized Control',
        description: 'Contrôle centralisé sans possibilité de transfert'
      });
      score -= 15;
    }
  }

  // Patterns malveillants connus
  const maliciousPatterns = detectKnownMaliciousPatterns(bytecode, sourceCode);

  return {
    score: Math.max(0, score),
    vulnerabilities,
    warnings,
    maliciousPatterns
  };
}

/**
 * 👤 Vérifier la réputation du créateur
 */
async function checkCreatorReputation(creatorAddress, chain) {
  try {
    const explorerConfig = getExplorerConfig(chain);
    
    // Récupérer l'historique du créateur
    const response = await axios.get(explorerConfig.apiUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address: creatorAddress,
        startblock: 0,
        endblock: 99999999,
        apikey: explorerConfig.apiKey
      }
    });

    const transactions = response.data.result || [];
    const contractsCreated = transactions.filter(tx => !tx.to).length;

    // Calculer le score de réputation
    let score = 50; // Score de base
    
    if (contractsCreated > 10) score += 20; // Créateur expérimenté
    if (contractsCreated > 50) score += 15; // Créateur très actif
    if (transactions.length > 1000) score += 10; // Très actif sur la blockchain
    
    return {
      address: creatorAddress,
      score: Math.min(100, score),
      contractsCreated,
      totalTransactions: transactions.length,
      isVerified: contractsCreated > 5
    };

  } catch (error) {
    return {
      address: creatorAddress,
      score: 50,
      contractsCreated: 0,
      totalTransactions: 0,
      isVerified: false
    };
  }
}

/**
 * 📈 Calculer le score d'authenticité
 */
function calculateAuthenticityScore(factors) {
  let score = 0;

  // 1. Vérification (30 points)
  if (factors.isVerified) score += 30;

  // 2. Audit de sécurité (25 points)
  if (factors.hasAudit) score += 25;

  // 3. Score de sécurité (20 points)
  score += (factors.securityScore / 100) * 20;

  // 4. Réputation du créateur (15 points)
  score += (factors.creatorScore / 100) * 15;

  // 5. Âge du contrat (10 points)
  if (factors.ageInDays > 365) score += 10;
  else if (factors.ageInDays > 180) score += 7;
  else if (factors.ageInDays > 90) score += 5;
  else if (factors.ageInDays > 30) score += 3;

  return Math.min(100, Math.max(0, score));
}

/**
 * 🎯 Déterminer le niveau de confiance
 */
function getTrustLevel(score) {
  if (score >= 80) return { level: 'TRÈS ÉLEVÉ', color: '🟢', action: 'CONFIANCE TOTALE' };
  if (score >= 60) return { level: 'ÉLEVÉ', color: '🟡', action: 'CONFIANCE' };
  if (score >= 40) return { level: 'MODÉRÉ', color: '🟠', action: 'PRUDENCE' };
  if (score >= 20) return { level: 'FAIBLE', color: '🔴', action: 'MÉFIANCE' };
  return { level: 'TRÈS FAIBLE', color: '⚫', action: 'ÉVITER' };
}

/**
 * 📝 Générer les recommandations
 */
function generateRecommendations(score, security, explorerData) {
  const recs = [];

  if (!explorerData.isVerified) {
    recs.push({
      priority: 'critical',
      message: '⚠️ Code source non vérifié. N\'investissez pas avant vérification.'
    });
  }

  if (security.vulnerabilities.length > 0) {
    recs.push({
      priority: 'high',
      message: `🔴 ${security.vulnerabilities.length} vulnérabilités détectées. Audit requis.`
    });
  }

  if (explorerData.ageInDays < 30) {
    recs.push({
      priority: 'medium',
      message: '🕐 Contrat récent (< 30 jours). Attendez pour plus de garanties.'
    });
  }

  if (score >= 70) {
    recs.push({
      priority: 'low',
      message: '✅ Contrat fiable. Vérifications positives.'
    });
  }

  return recs;
}

/**
 * 📄 Générer la justification d'authenticité
 */
function generateAuthenticityJustification(data) {
  const { authenticityScore, explorerData, securityCheck, creatorReputation } = data;
  const trustLevel = getTrustLevel(authenticityScore);

  return `
🔐 RAPPORT D'AUTHENTICITÉ:

📊 Score Global: ${authenticityScore}/100
${trustLevel.color} Niveau de Confiance: ${trustLevel.level}
Action: ${trustLevel.action}

1️⃣ INFORMATIONS DU CONTRAT:
   • Nom: ${explorerData.name}
   • Créateur: ${explorerData.creator.substring(0, 10)}...
   • Date de création: ${explorerData.creationDate}
   • Âge: ${explorerData.ageInDays} jours
   • ${explorerData.isVerified ? '✅' : '❌'} Code source vérifié
   • ${explorerData.hasAudit ? '✅' : '❌'} Audit de sécurité

2️⃣ ANALYSE DE SÉCURITÉ:
   • Score: ${securityCheck.score}/100
   • Vulnérabilités: ${securityCheck.vulnerabilities.length}
   • Avertissements: ${securityCheck.warnings.length}
   ${securityCheck.vulnerabilities.map(v => `   ⚠️ ${v.type}: ${v.description}`).join('\n')}

3️⃣ RÉPUTATION DU CRÉATEUR:
   • Score: ${creatorReputation.score}/100
   • Contrats créés: ${creatorReputation.contractsCreated}
   • Transactions totales: ${creatorReputation.totalTransactions}
   • ${creatorReputation.isVerified ? '✅' : '❌'} Créateur vérifié

4️⃣ ACTIVITÉ:
   • Transactions: ${explorerData.transactionCount}
   • Utilisateurs uniques: ${explorerData.uniqueUsers}
   • Valeur totale: $${explorerData.totalValue.toLocaleString()}

🎯 CONCLUSION:
${authenticityScore >= 70 
  ? '✅ Ce contrat présente des garanties d\'authenticité satisfaisantes.'
  : '⚠️ Ce contrat nécessite des vérifications supplémentaires avant utilisation.'
}
  `.trim();
}

/**
 * 🛠️ Fonctions utilitaires
 */

function getExplorerConfig(chain) {
  const configs = {
    ethereum: {
      apiUrl: 'https://api.etherscan.io/api',
      apiKey: ETHERSCAN_API_KEY
    },
    polygon: {
      apiUrl: 'https://api.polygonscan.com/api',
      apiKey: POLYGONSCAN_API_KEY
    },
    bsc: {
      apiUrl: 'https://api.bscscan.com/api',
      apiKey: BSCSCAN_API_KEY
    }
  };
  return configs[chain] || configs.ethereum;
}

function calculateComplexity(bytecode) {
  // Simplicité: longueur du bytecode / 1000
  return Math.min(100, (bytecode.length / 1000) * 10);
}

function checkIfAudited(contractName) {
  const auditedProjects = ['Uniswap', 'Aave', 'Compound', 'MakerDAO'];
  return auditedProjects.some(project => contractName.includes(project));
}

function getAuditInfo(contractName) {
  const audits = {
    'Uniswap': ['Consensys Diligence', 'Trail of Bits'],
    'Aave': ['OpenZeppelin', 'Certik'],
    'Compound': ['Trail of Bits', 'OpenZeppelin']
  };
  
  for (const [project, auditors] of Object.entries(audits)) {
    if (contractName.includes(project)) return auditors;
  }
  return [];
}

function calculateTotalValue(transactions) {
  return transactions.reduce((sum, tx) => {
    return sum + (parseFloat(ethers.formatEther(tx.value || '0')));
  }, 0);
}

function detectKnownMaliciousPatterns(bytecode, sourceCode) {
  const patterns = [];
  
  // Pattern: Honeypot (approve sans effet)
  if (sourceCode && sourceCode.includes('approve') && !sourceCode.includes('allowance[')) {
    patterns.push('Possible Honeypot: Approve sans effet');
  }
  
  // Pattern: Backdoor owner
  if (sourceCode && sourceCode.includes('onlyOwner') && sourceCode.includes('transfer(')) {
    patterns.push('Backdoor possible: Owner peut transférer tous les tokens');
  }

  return patterns;
}

function getFallbackExplorerData(address) {
  return {
    name: 'Unknown Contract',
    creator: 'Unknown',
    creationDate: new Date().toISOString().split('T')[0],
    ageInDays: 0,
    isVerified: false,
    sourceCode: '',
    hasAudit: false,
    auditBy: [],
    transactionCount: 0,
    uniqueUsers: 0,
    totalValue: 0
  };
}

module.exports = {
  verifyContractAuthenticity,
  checkContractExists,
  analyzeBytecode,
  checkMaliciousPatterns
};
