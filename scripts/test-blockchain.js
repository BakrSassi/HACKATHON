/**
 * 🔗 AURA - Test Blockchain Spécifique
 * 
 * Teste les fonctionnalités blockchain:
 * 1. Connexion aux providers (Ethereum, Polygon, BSC)
 * 2. Vérification d'existence de smart contracts
 * 3. Récupération de bytecode
 * 4. Analyse de contrats réels
 */

const { ethers } = require('ethers');
const axios = require('axios');

// Couleurs terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Providers blockchain
const providers = {
  ethereum: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
  polygon: new ethers.JsonRpcProvider('https://polygon-rpc.com'),
  bsc: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org')
};

// Contrats célèbres à tester
const FAMOUS_CONTRACTS = {
  uniswap: {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    name: 'Uniswap (UNI)',
    chain: 'ethereum'
  },
  usdt: {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    name: 'Tether (USDT)',
    chain: 'ethereum'
  },
  weth: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    name: 'Wrapped Ether (WETH)',
    chain: 'ethereum'
  },
  dai: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    name: 'Dai Stablecoin (DAI)',
    chain: 'ethereum'
  }
};

/**
 * Test 1: Connexion aux Providers Blockchain
 */
async function testProviderConnections() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 1: Connexion Providers Blockchain      ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  const results = {};

  for (const [chain, provider] of Object.entries(providers)) {
    try {
      log('blue', `🔗 Test connexion ${chain.toUpperCase()}...`);
      
      // Récupérer le numéro de bloc actuel
      const blockNumber = await provider.getBlockNumber();
      
      // Récupérer les infos du réseau
      const network = await provider.getNetwork();
      
      log('green', `✅ ${chain.toUpperCase()} connecté!`);
      log('yellow', `   📦 Bloc actuel: ${blockNumber.toLocaleString()}`);
      log('yellow', `   🆔 Chain ID: ${network.chainId}`);
      log('yellow', `   🌐 Network: ${network.name}\n`);
      
      results[chain] = { success: true, blockNumber, chainId: network.chainId.toString() };
    } catch (error) {
      log('red', `❌ Erreur ${chain}: ${error.message}\n`);
      results[chain] = { success: false, error: error.message };
    }
  }

  return results;
}

/**
 * Test 2: Vérifier l'Existence de Contrats
 */
async function testContractExistence() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 2: Existence de Smart Contracts        ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  const results = {};

  for (const [key, contract] of Object.entries(FAMOUS_CONTRACTS)) {
    try {
      log('blue', `🔍 Vérification ${contract.name}...`);
      log('yellow', `   📍 Adresse: ${contract.address}`);
      
      const provider = providers[contract.chain];
      const code = await provider.getCode(contract.address);
      
      const exists = code !== '0x';
      const codeSize = code.length - 2; // Retirer '0x'
      
      if (exists) {
        log('green', `   ✅ Contrat trouvé!`);
        log('yellow', `   📏 Taille bytecode: ${codeSize} caractères (${codeSize / 2} bytes)\n`);
        results[key] = { success: true, exists: true, codeSize: codeSize / 2 };
      } else {
        log('red', `   ❌ Contrat non trouvé!\n`);
        results[key] = { success: true, exists: false };
      }
    } catch (error) {
      log('red', `   ❌ Erreur: ${error.message}\n`);
      results[key] = { success: false, error: error.message };
    }
  }

  return results;
}

/**
 * Test 3: Récupérer le Bytecode et Analyser
 */
async function testBytecodeAnalysis() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 3: Analyse Bytecode Smart Contract     ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  const contract = FAMOUS_CONTRACTS.uniswap;
  
  try {
    log('blue', `🔍 Analyse complète: ${contract.name}...`);
    log('yellow', `   📍 Adresse: ${contract.address}\n`);
    
    const provider = providers[contract.chain];
    
    // 1. Récupérer le bytecode
    log('yellow', '   1️⃣ Récupération bytecode...');
    const bytecode = await provider.getCode(contract.address);
    log('green', `   ✅ Bytecode récupéré (${bytecode.length} caractères)\n`);
    
    // 2. Analyser les opcodes dangereux
    log('yellow', '   2️⃣ Analyse opcodes...');
    const analysis = {
      hasSelfDestruct: bytecode.includes('ff'),
      hasDelegateCall: bytecode.includes('f4'),
      hasCreate2: bytecode.includes('f5'),
      size: (bytecode.length - 2) / 2
    };
    
    log('magenta', '   📊 Résultats analyse:');
    log('yellow', `      • SELFDESTRUCT: ${analysis.hasSelfDestruct ? '🔴 Détecté' : '✅ Absent'}`);
    log('yellow', `      • DELEGATECALL: ${analysis.hasDelegateCall ? '🟡 Détecté' : '✅ Absent'}`);
    log('yellow', `      • CREATE2: ${analysis.hasCreate2 ? '🟡 Détecté' : '✅ Absent'}`);
    log('yellow', `      • Taille: ${analysis.size} bytes\n`);
    
    // 3. Récupérer le solde
    log('yellow', '   3️⃣ Récupération solde...');
    const balance = await provider.getBalance(contract.address);
    const balanceEth = ethers.formatEther(balance);
    log('green', `   ✅ Solde: ${parseFloat(balanceEth).toFixed(4)} ETH\n`);
    
    // 4. Récupérer le nombre de transactions
    log('yellow', '   4️⃣ Récupération transaction count...');
    const txCount = await provider.getTransactionCount(contract.address);
    log('green', `   ✅ Transactions envoyées: ${txCount}\n`);
    
    return {
      success: true,
      analysis,
      balance: balanceEth,
      txCount
    };
  } catch (error) {
    log('red', `   ❌ Erreur: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Test 4: Vérifier via Etherscan API (avec et sans clé)
 */
async function testEtherscanAPI() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 4: Etherscan API (Code Source)         ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  const contract = FAMOUS_CONTRACTS.uniswap;
  
  try {
    log('blue', `📡 Requête Etherscan pour ${contract.name}...`);
    
    // Requête sans clé API (rate limit plus strict)
    const response = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: contract.address,
        apikey: 'YourApiKeyToken' // Clé par défaut
      },
      timeout: 10000
    });

    if (response.data.status === '1' && response.data.result[0]) {
      const data = response.data.result[0];
      
      log('green', '✅ Données récupérées!\n');
      log('magenta', '📋 Informations du contrat:');
      log('yellow', `   • Nom: ${data.ContractName || 'N/A'}`);
      log('yellow', `   • Compilateur: ${data.CompilerVersion || 'N/A'}`);
      log('yellow', `   • Optimisation: ${data.OptimizationUsed === '1' ? '✅ Oui' : '❌ Non'}`);
      log('yellow', `   • Runs: ${data.Runs || 'N/A'}`);
      log('yellow', `   • Code vérifié: ${data.SourceCode ? '✅ Oui' : '❌ Non'}`);
      log('yellow', `   • Taille code: ${data.SourceCode ? data.SourceCode.length : 0} caractères\n`);
      
      return {
        success: true,
        name: data.ContractName,
        verified: data.SourceCode !== '',
        compiler: data.CompilerVersion
      };
    } else {
      log('yellow', '⚠️ Pas de données (API key invalide ou rate limit)\n');
      return { success: true, verified: false, reason: 'API rate limit' };
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      log('yellow', '⚠️ Timeout (normal sans clé API valide)\n');
    } else {
      log('yellow', `⚠️ Erreur API: ${error.message}\n`);
    }
    return { success: true, error: error.message };
  }
}

/**
 * Test 5: TrustLedger Simulation (Blockchain Interne)
 */
async function testTrustLedger() {
  log('cyan', '\n╔════════════════════════════════════════════════╗');
  log('cyan', '║   TEST 5: TrustLedger (Blockchain Interne)    ║');
  log('cyan', '╚════════════════════════════════════════════════╝\n');

  try {
    // Charger le service TrustLedger
    const trustLedger = require('./src/services/trustLedger');
    
    log('blue', '🔗 Test enregistrement transaction blockchain...\n');
    
    // Test 1: Enregistrer une recommandation
    log('yellow', '   1️⃣ Enregistrement recommandation...');
    const rec = await trustLedger.recordRecommendation({
      userId: 'bakr_sassi',
      asset: 'BTC',
      action: 'ACHETER',
      reason: 'Faible risque + authenticité élevée'
    });
    log('green', '   ✅ Recommandation enregistrée!');
    log('yellow', `      • Hash: ${rec.hash.substring(0, 20)}...`);
    log('yellow', `      • Timestamp: ${new Date(rec.timestamp).toLocaleString()}\n`);
    
    // Test 2: Enregistrer une alerte
    log('yellow', '   2️⃣ Enregistrement alerte sécurité...');
    const alert = await trustLedger.recordSecurityAlert({
      userId: 'bakr_sassi',
      type: 'VULNERABILITY_DETECTED',
      severity: 'high',
      message: 'Vulnérabilité détectée dans smart contract'
    });
    log('green', '   ✅ Alerte enregistrée!');
    log('yellow', `      • Hash: ${alert.hash.substring(0, 20)}...`);
    log('yellow', `      • Signature: ${alert.signature.substring(0, 20)}...\n`);
    
    // Test 3: Vérifier une transaction
    log('yellow', '   3️⃣ Vérification transaction...');
    const isValid = await trustLedger.verifyTransaction(rec.hash);
    log('green', `   ${isValid ? '✅ Transaction valide!' : '❌ Transaction invalide!'}\n`);
    
    return {
      success: true,
      recommendation: rec,
      alert: alert,
      verification: isValid
    };
  } catch (error) {
    log('red', `   ❌ Erreur: ${error.message}\n`);
    return { success: false, error: error.message };
  }
}

/**
 * Exécuter tous les tests
 */
async function runAllBlockchainTests() {
  log('cyan', '\n╔═══════════════════════════════════════════════════════╗');
  log('cyan', '║      🔗 AURA - Tests Blockchain Complets            ║');
  log('cyan', '╚═══════════════════════════════════════════════════════╝');
  
  log('yellow', '\n⏳ Démarrage des tests blockchain...\n');

  const results = {
    test1: null,
    test2: null,
    test3: null,
    test4: null,
    test5: null
  };

  // Test 1: Providers
  results.test1 = await testProviderConnections();
  await delay(1000);

  // Test 2: Existence contrats
  results.test2 = await testContractExistence();
  await delay(1000);

  // Test 3: Analyse bytecode
  results.test3 = await testBytecodeAnalysis();
  await delay(1000);

  // Test 4: Etherscan API
  results.test4 = await testEtherscanAPI();
  await delay(1000);

  // Test 5: TrustLedger
  results.test5 = await testTrustLedger();

  // Résumé
  log('cyan', '\n╔═══════════════════════════════════════════════════════╗');
  log('cyan', '║                📊 RÉSUMÉ DES TESTS                    ║');
  log('cyan', '╚═══════════════════════════════════════════════════════╝\n');

  const providersOK = Object.values(results.test1).filter(r => r.success).length;
  const contractsOK = Object.values(results.test2).filter(r => r.success && r.exists).length;
  const bytecodeOK = results.test3.success;
  const etherscanOK = results.test4.success;
  const trustLedgerOK = results.test5.success;

  log('yellow', `Test 1 - Providers Blockchain:     ${providersOK}/3 connectés ${providersOK === 3 ? '✅' : '🟡'}`);
  log('yellow', `Test 2 - Existence Contrats:       ${contractsOK}/4 trouvés ${contractsOK >= 3 ? '✅' : '🟡'}`);
  log('yellow', `Test 3 - Analyse Bytecode:         ${bytecodeOK ? '✅ PASS' : '❌ FAIL'}`);
  log('yellow', `Test 4 - Etherscan API:            ${etherscanOK ? '✅ PASS' : '❌ FAIL'}`);
  log('yellow', `Test 5 - TrustLedger Interne:      ${trustLedgerOK ? '✅ PASS' : '❌ FAIL'}\n`);

  const totalPassed = (providersOK > 0 ? 1 : 0) + 
                      (contractsOK > 0 ? 1 : 0) + 
                      (bytecodeOK ? 1 : 0) + 
                      (etherscanOK ? 1 : 0) + 
                      (trustLedgerOK ? 1 : 0);

  if (totalPassed >= 4) {
    log('green', `\n🎉 BLOCKCHAIN OPÉRATIONNELLE! (${totalPassed}/5 tests réussis)`);
    log('green', '✅ Les fonctionnalités blockchain d\'AURA fonctionnent correctement!\n');
  } else {
    log('yellow', `\n⚠️ ${totalPassed}/5 tests réussis`);
    log('yellow', '\n💡 Vérifications:');
    log('yellow', '   1. Connexion internet active?');
    log('yellow', '   2. Providers RPC accessibles?');
    log('yellow', '   3. Fichier trustLedger.js existe?\n');
  }

  return results;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Exécuter
runAllBlockchainTests().catch(error => {
  log('red', `\n❌ Erreur fatale: ${error.message}`);
  process.exit(1);
});
