/**
 * Données de test pour le prototype AURA
 */

export const mockAssets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    sector: 'Cryptocurrency',
    value: 45000,
    performance24h: 3.5,
    performance7d: 8.2,
    performance30d: 15.7,
    volatility: 35,
    marketCap: 850000000000,
    volume24h: 35000000000,
    volumeAvg: 30000000000,
    liquidityScore: 0.95,
    auditStatus: 'audited',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 1
    },
    contractAge: 4500,
    securityIncidents: 0,
    communityTrust: 0.92,
    website: 'https://bitcoin.org',
    contractAddress: '0xbtc...'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    sector: 'Smart Contracts',
    value: 32000,
    performance24h: 2.1,
    performance7d: 6.5,
    performance30d: 12.3,
    volatility: 38,
    marketCap: 380000000000,
    volume24h: 18000000000,
    volumeAvg: 16000000000,
    liquidityScore: 0.93,
    auditStatus: 'audited',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 2
    },
    contractAge: 3200,
    securityIncidents: 0,
    communityTrust: 0.90,
    website: 'https://ethereum.org',
    contractAddress: '0xeth...'
  },
  {
    name: 'ETHX',
    symbol: 'ETHX',
    type: 'crypto',
    sector: 'DeFi',
    value: 8500,
    performance24h: -5.2,
    performance7d: -8.7,
    performance30d: -12.4,
    volatility: 52,
    marketCap: 85000000,
    volume24h: 2500000,
    volumeAvg: 2000000,
    liquidityScore: 0.45,
    auditStatus: 'partial',
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3
    },
    contractAge: 120,
    securityIncidents: 1,
    communityTrust: 0.55,
    website: 'https://ethx-protocol.com',
    contractAddress: '0xethx...'
  },
  {
    name: 'Apple Stock',
    symbol: 'AAPL',
    type: 'stock',
    sector: 'Technology',
    value: 18500,
    performance24h: 1.2,
    performance7d: 3.5,
    performance30d: 8.9,
    volatility: 18,
    marketCap: 2800000000000,
    volume24h: 75000000000,
    volumeAvg: 70000000000,
    liquidityScore: 0.98,
    auditStatus: 'audited',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    contractAge: 15000,
    securityIncidents: 0,
    communityTrust: 0.95,
    website: 'https://apple.com',
    contractAddress: null
  },
  {
    name: 'SAFE-BOND Fund',
    symbol: 'SBOND',
    type: 'fund',
    sector: 'Fixed Income',
    value: 25000,
    performance24h: 0.1,
    performance7d: 0.5,
    performance30d: 2.1,
    volatility: 5,
    marketCap: 5000000000,
    volume24h: 150000000,
    volumeAvg: 140000000,
    liquidityScore: 0.88,
    auditStatus: 'audited',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    contractAge: 2500,
    securityIncidents: 0,
    communityTrust: 0.97,
    website: 'https://safebond.com',
    contractAddress: null
  },
  {
    name: 'DeFiPro',
    symbol: 'DFP',
    type: 'crypto',
    sector: 'DeFi',
    value: 5200,
    performance24h: -2.8,
    performance7d: 4.2,
    performance30d: -3.5,
    volatility: 48,
    marketCap: 120000000,
    volume24h: 4500000,
    volumeAvg: 4000000,
    liquidityScore: 0.62,
    auditStatus: 'partial',
    vulnerabilities: {
      critical: 0,
      high: 1,
      medium: 1,
      low: 2
    },
    contractAge: 180,
    securityIncidents: 0,
    communityTrust: 0.68,
    website: 'https://defipro.io',
    contractAddress: '0xdfp...'
  }
];

// Simuler des menaces pour le scan de sécurité
export const mockThreats = {
  'ETHX': [
    {
      type: 'vulnerability',
      severity: 'medium',
      message: 'CVE-2025-2312 : Faille dans le mécanisme de validation des signatures',
      discovered: '2025-10-16',
      cveId: 'CVE-2025-2312'
    }
  ],
  'DeFiPro': [
    {
      type: 'vulnerability',
      severity: 'medium',
      message: 'CVE-2025-2312 : Faille dans le mécanisme de validation des signatures',
      discovered: '2025-10-16',
      cveId: 'CVE-2025-2312'
    }
  ]
};

// Historique blockchain simulé
export const mockBlockchainHistory = [
  {
    id: 'tx_001',
    type: 'AI_RECOMMENDATION',
    timestamp: '2025-10-17T14:22:00Z',
    asset: 'ETHX',
    action: 'rebalance',
    message: 'Recommandation de rééquilibrage validée par IA',
    blockHash: 'hash_abc123',
    verified: true
  },
  {
    id: 'tx_002',
    type: 'SECURITY_ALERT',
    timestamp: '2025-10-17T15:45:00Z',
    asset: 'ETHX',
    severity: 'medium',
    message: 'CVE-2025-2312 détectée',
    blockHash: 'hash_def456',
    verified: true
  },
  {
    id: 'tx_003',
    type: 'USER_TRANSACTION',
    timestamp: '2025-10-18T09:30:00Z',
    asset: 'Bitcoin',
    action: 'buy',
    amount: 0.5,
    price: 45000,
    blockHash: 'hash_ghi789',
    verified: true
  }
];
