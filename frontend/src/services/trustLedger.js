/**
 * ⛓️ TrustLedger Service - Blockchain & vérification immuable
 * Enregistrement et vérification des transactions et décisions
 */

// Simulateur de blockchain interne (en production : vraie blockchain ou DLT)
class BlockchainLedger {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    
    // Créer le bloc genesis
    this.createGenesisBlock();
  }
  
  createGenesisBlock() {
    const genesisBlock = {
      index: 0,
      timestamp: new Date('2025-01-01').toISOString(),
      transactions: [],
      previousHash: '0',
      hash: this.calculateHash(0, '0', new Date('2025-01-01').toISOString(), []),
      nonce: 0
    };
    
    this.chain.push(genesisBlock);
  }
  
  calculateHash(index, previousHash, timestamp, transactions, nonce = 0) {
    const data = index + previousHash + timestamp + JSON.stringify(transactions) + nonce;
    // Simulation d'un hash SHA-256 (en production : utiliser crypto)
    return 'hash_' + btoa(data).substring(0, 64);
  }
  
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  
  addTransaction(transaction) {
    // Ajouter signature et horodatage
    const signedTransaction = {
      ...transaction,
      timestamp: new Date().toISOString(),
      signature: this.signTransaction(transaction),
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
    
    this.pendingTransactions.push(signedTransaction);
    return signedTransaction;
  }
  
  signTransaction(transaction) {
    // Simulation de signature cryptographique
    const data = JSON.stringify(transaction);
    return 'sig_' + btoa(data).substring(0, 40);
  }
  
  mineBlock() {
    if (this.pendingTransactions.length === 0) {
      return null;
    }
    
    const latestBlock = this.getLatestBlock();
    const newBlock = {
      index: latestBlock.index + 1,
      timestamp: new Date().toISOString(),
      transactions: [...this.pendingTransactions],
      previousHash: latestBlock.hash,
      nonce: 0
    };
    
    // Simulation de proof-of-work simple
    newBlock.hash = this.calculateHash(
      newBlock.index,
      newBlock.previousHash,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.nonce
    );
    
    this.chain.push(newBlock);
    this.pendingTransactions = [];
    
    return newBlock;
  }
  
  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Vérifier le hash du bloc actuel
      const calculatedHash = this.calculateHash(
        currentBlock.index,
        currentBlock.previousHash,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.nonce
      );
      
      if (currentBlock.hash !== calculatedHash) {
        return {
          valid: false,
          error: `Bloc ${i} a été altéré`,
          blockIndex: i
        };
      }
      
      // Vérifier le chaînage
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          valid: false,
          error: `Chaînage rompu au bloc ${i}`,
          blockIndex: i
        };
      }
    }
    
    return { valid: true, message: 'Blockchain intègre' };
  }
  
  getTransactionById(txId) {
    for (const block of this.chain) {
      const tx = block.transactions.find(t => t.id === txId);
      if (tx) {
        return {
          transaction: tx,
          block: {
            index: block.index,
            hash: block.hash,
            timestamp: block.timestamp
          },
          confirmed: true
        };
      }
    }
    
    // Chercher dans les transactions en attente
    const pendingTx = this.pendingTransactions.find(t => t.id === txId);
    if (pendingTx) {
      return {
        transaction: pendingTx,
        confirmed: false
      };
    }
    
    return null;
  }
  
  getTransactionHistory(filters = {}) {
    const { type, userId, startDate, endDate } = filters;
    let transactions = [];
    
    // Extraire toutes les transactions de la blockchain
    this.chain.forEach(block => {
      block.transactions.forEach(tx => {
        transactions.push({
          ...tx,
          blockIndex: block.index,
          blockHash: block.hash,
          confirmed: true
        });
      });
    });
    
    // Ajouter les transactions en attente
    this.pendingTransactions.forEach(tx => {
      transactions.push({
        ...tx,
        confirmed: false
      });
    });
    
    // Appliquer les filtres
    if (type) {
      transactions = transactions.filter(tx => tx.type === type);
    }
    
    if (userId) {
      transactions = transactions.filter(tx => tx.userId === userId);
    }
    
    if (startDate) {
      transactions = transactions.filter(tx => new Date(tx.timestamp) >= new Date(startDate));
    }
    
    if (endDate) {
      transactions = transactions.filter(tx => new Date(tx.timestamp) <= new Date(endDate));
    }
    
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
}

// Instance singleton de la blockchain
const ledger = new BlockchainLedger();

/**
 * Enregistrer une recommandation IA sur la blockchain
 */
export const recordRecommendation = (recommendation) => {
  const transaction = {
    type: 'AI_RECOMMENDATION',
    userId: 'user_123', // En production : ID réel de l'utilisateur
    data: {
      asset: recommendation.asset,
      action: recommendation.action,
      auraScore: recommendation.auraScore,
      reasoning: recommendation.reasoning
    }
  };
  
  const signedTx = ledger.addTransaction(transaction);
  
  // Miner le bloc immédiatement (en production : minage périodique)
  const minedBlock = ledger.mineBlock();
  
  return {
    transactionId: signedTx.id,
    signature: signedTx.signature,
    timestamp: signedTx.timestamp,
    blockHash: minedBlock?.hash,
    verified: true
  };
};

/**
 * Enregistrer une alerte de sécurité
 */
export const recordSecurityAlert = (alert) => {
  const transaction = {
    type: 'SECURITY_ALERT',
    userId: 'user_123',
    data: {
      asset: alert.asset,
      threatType: alert.threatType,
      severity: alert.severity,
      message: alert.message,
      blocked: alert.blocked
    }
  };
  
  const signedTx = ledger.addTransaction(transaction);
  const minedBlock = ledger.mineBlock();
  
  return {
    transactionId: signedTx.id,
    signature: signedTx.signature,
    timestamp: signedTx.timestamp,
    blockHash: minedBlock?.hash,
    verified: true
  };
};

/**
 * Enregistrer une transaction utilisateur
 */
export const recordUserTransaction = (transaction) => {
  const tx = {
    type: 'USER_TRANSACTION',
    userId: 'user_123',
    data: {
      asset: transaction.asset,
      action: transaction.action, // buy, sell, hold
      amount: transaction.amount,
      price: transaction.price,
      totalValue: transaction.totalValue
    }
  };
  
  const signedTx = ledger.addTransaction(tx);
  const minedBlock = ledger.mineBlock();
  
  return {
    transactionId: signedTx.id,
    signature: signedTx.signature,
    timestamp: signedTx.timestamp,
    blockHash: minedBlock?.hash,
    verified: true
  };
};

/**
 * Vérifier l'authenticité d'une transaction
 */
export const verifyTransaction = (transactionId) => {
  const result = ledger.getTransactionById(transactionId);
  
  if (!result) {
    return {
      found: false,
      message: 'Transaction introuvable'
    };
  }
  
  if (!result.confirmed) {
    return {
      found: true,
      confirmed: false,
      message: 'Transaction en attente de confirmation',
      transaction: result.transaction
    };
  }
  
  return {
    found: true,
    confirmed: true,
    message: 'Transaction vérifiée et confirmée',
    transaction: result.transaction,
    block: result.block,
    verificationProof: {
      blockHash: result.block.hash,
      blockIndex: result.block.index,
      timestamp: result.block.timestamp
    }
  };
};

/**
 * Obtenir l'historique complet
 */
export const getFullHistory = (filters = {}) => {
  return ledger.getTransactionHistory(filters);
};

/**
 * Vérifier l'intégrité de la blockchain
 */
export const verifyBlockchainIntegrity = () => {
  return ledger.verifyChain();
};

/**
 * Obtenir les statistiques de la blockchain
 */
export const getBlockchainStats = () => {
  return {
    totalBlocks: ledger.chain.length,
    totalTransactions: ledger.chain.reduce((sum, block) => sum + block.transactions.length, 0),
    pendingTransactions: ledger.pendingTransactions.length,
    lastBlockHash: ledger.getLatestBlock().hash,
    lastBlockTime: ledger.getLatestBlock().timestamp,
    integrity: ledger.verifyChain()
  };
};

/**
 * Vérifier l'authenticité d'un protocole/partenaire via smart contract
 */
export const verifyPartnerAuthenticity = (partnerName) => {
  // Simulation de vérification via smart contract certifié
  const certifiedPartners = [
    { name: 'Uniswap', verified: true, certificationDate: '2024-01-15', trustScore: 98 },
    { name: 'Aave', verified: true, certificationDate: '2024-02-20', trustScore: 96 },
    { name: 'Binance', verified: true, certificationDate: '2024-01-10', trustScore: 95 },
    { name: 'FakeProtocol', verified: false, trustScore: 0 }
  ];
  
  const partner = certifiedPartners.find(p => 
    p.name.toLowerCase() === partnerName.toLowerCase()
  );
  
  if (!partner) {
    return {
      verified: false,
      message: 'Partenaire non trouvé dans le registre certifié',
      recommendation: 'Évitez d\'interagir avec ce protocole'
    };
  }
  
  if (partner.verified) {
    return {
      verified: true,
      partner: partner.name,
      certificationDate: partner.certificationDate,
      trustScore: partner.trustScore,
      message: `✅ Partenaire vérifié et certifié`,
      recommendation: 'Vous pouvez interagir en toute confiance'
    };
  }
  
  return {
    verified: false,
    partner: partner.name,
    trustScore: partner.trustScore,
    message: '⚠️ Partenaire non vérifié ou signalé comme frauduleux',
    recommendation: 'N\'interagissez PAS avec ce protocole'
  };
};

export default ledger;
