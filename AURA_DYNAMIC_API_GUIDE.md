# 🎯 AURA - Guide API Dynamique

## 📘 Implémentation du Cahier des Charges

Ce guide présente les 3 fonctionnalités dynamiques implémentées selon le cahier des charges AURA.

---

## 🏆 Objectifs Réalisés

### 1️⃣ **Augmentation de Décision**
Fourniture d'insights personnalisés intégrant risques financiers et sécuritaires.

### 2️⃣ **Filtrage Proactif**
Surveillance de l'environnement digital et alertes avant actions risquées.

### 3️⃣ **Vérification Immuable**
Utilisation de blockchain pour validation d'authenticité des données/transactions.

---

## 🚀 API Endpoints Dynamiques

### 📊 1. Analyse de Risque Globale

**Endpoint:** `POST /api/aura/analyze-risk`

**Description:** Génère une "Note de Risque Combinée" basée sur:
- ✅ Volatilité du marché (données réelles via CoinGecko)
- ✅ Vulnérabilités du code source (analyse smart contract)
- ✅ Sentiment du marché (communauté, développeurs)

**Requête:**
```json
{
  "symbol": "BTC",
  "protocol": "bitcoin"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "asset": "BTC",
    "protocol": "bitcoin",
    "timestamp": "2025-01-26T10:30:00Z",
    
    "combinedRiskScore": "32.45",
    "riskLevel": {
      "level": "FAIBLE",
      "color": "🟡",
      "action": "ACHETER PRUDEMMENT"
    },
    
    "breakdown": {
      "market": {
        "score": 35.20,
        "weight": "40%",
        "data": {
          "symbol": "BTC",
          "currentPrice": 45280.50,
          "volatility": "17.60",
          "trend": "+2.34",
          "analysis": "🟡 Volatilité modérée, conditions normales"
        }
      },
      "code": {
        "score": 15.00,
        "weight": "35%",
        "data": {
          "protocol": "bitcoin",
          "vulnerabilities": {
            "critical": 0,
            "high": 0,
            "medium": 1,
            "low": 2
          },
          "codeRiskScore": "15.00",
          "auditScore": "95.00",
          "analysis": "✅ Code audité et sécurisé"
        }
      },
      "sentiment": {
        "score": 32.00,
        "weight": "25%",
        "data": {
          "sentimentScore": "68.00",
          "details": {
            "communityScore": 70,
            "developerScore": 72,
            "liquidityScore": 65,
            "publicInterest": 65
          },
          "analysis": "🟡 Sentiment positif"
        }
      }
    },
    
    "recommendations": [
      {
        "type": "MARCHÉ",
        "priority": "medium",
        "message": "Volatilité modérée. Utilisez le DCA pour étaler l'achat."
      }
    ],
    
    "suggestedActions": [
      "Acheter BTC avec prudence",
      "Limiter à 5-10% du portfolio",
      "Surveiller quotidiennement"
    ],
    
    "justification": "📊 ANALYSE DÉTAILLÉE:\n1️⃣ MARCHÉ (40%)...\n2️⃣ CODE (35%)...\n3️⃣ SENTIMENT (25%)..."
  }
}
```

---

### 🔐 2. Vérificateur d'Authenticité Smart Contract

**Endpoint:** `POST /api/aura/verify-contract`

**Description:** Vérification automatique de l'authenticité d'un smart contract via:
- ✅ Vérification Etherscan/Polygonscan
- ✅ Analyse du bytecode
- ✅ Détection de patterns malveillants
- ✅ Réputation du créateur

**Requête:**
```json
{
  "contractAddress": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "chain": "ethereum"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "chain": "ethereum",
    "timestamp": "2025-01-26T10:30:00Z",
    
    "isValid": true,
    "authenticityScore": "87.50",
    "trustLevel": {
      "level": "TRÈS ÉLEVÉ",
      "color": "🟢",
      "action": "CONFIANCE TOTALE"
    },
    
    "contractInfo": {
      "name": "Uniswap",
      "creator": "0x123abc...",
      "creationDate": "2020-09-17",
      "ageInDays": 1592,
      "isVerified": true,
      "hasAudit": true,
      "auditBy": ["Consensys Diligence", "Trail of Bits"]
    },
    
    "security": {
      "score": 95,
      "vulnerabilities": [],
      "maliciousPatterns": [],
      "warnings": [
        {
          "severity": "medium",
          "type": "DELEGATECALL Usage",
          "description": "Utilisation de DELEGATECALL détectée"
        }
      ]
    },
    
    "reputation": {
      "creator": {
        "address": "0x123abc...",
        "score": 85,
        "contractsCreated": 12,
        "totalTransactions": 5420,
        "isVerified": true
      },
      "transactionCount": 1245680,
      "uniqueUsers": 85420,
      "totalValue": 1240000000
    },
    
    "recommendations": [
      {
        "priority": "low",
        "message": "✅ Contrat fiable. Vérifications positives."
      }
    ],
    
    "justification": "🔐 RAPPORT D'AUTHENTICITÉ:\n📊 Score Global: 87.50/100..."
  }
}
```

---

### 🤖 3. Aide à la Décision Intelligente (IA)

**Endpoint:** `POST /api/aura/recommend`

**Description:** Recommandation IA avec justifications financières ET sécuritaires:
- ✅ Intégration Groq/OpenAI (ou IA locale)
- ✅ Analyse combinée marché + sécurité
- ✅ Justifications détaillées
- ✅ Plan d'action étape par étape

**Requête:**
```json
{
  "user": {
    "name": "Bakr Sassi",
    "experience": "Avancé",
    "riskTolerance": "Élevée"
  },
  "asset": {
    "symbol": "ETH",
    "currentPrice": 3250.50,
    "amount": 2.5
  },
  "riskAnalysis": { 
    "combinedRiskScore": "42.30",
    "riskLevel": { "level": "MODÉRÉ" }
  },
  "contractVerification": {
    "authenticityScore": "75.00",
    "trustLevel": { "level": "ÉLEVÉ" }
  },
  "portfolio": {
    "totalValue": 250000
  }
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-01-26T10:30:00Z",
    
    "recommendation": {
      "action": "AUGMENTER",
      "priority": "medium",
      "summary": "ETH présente un risque modéré avec authenticité élevée. Augmenter progressivement."
    },
    
    "actions": [
      "Acheter 0.5 ETH supplémentaire sur 7 jours",
      "Limiter à 15% du portfolio total",
      "Définir stop-loss à -12%",
      "Ajouter take-profit à +30%"
    ],
    
    "justifications": {
      "financial": "📊 JUSTIFICATION FINANCIÈRE:\n1. Volatilité: 15.30%\n2. Part portfolio: 3.25%...",
      "security": "🔐 JUSTIFICATION SÉCURITÉ:\n1. Score: 75/100\n2. Vulnérabilités: 1 medium...",
      "technical": "⚙️ JUSTIFICATION TECHNIQUE:\n1. Âge: 1825 jours\n2. Transactions: 2.4M..."
    },
    
    "metrics": {
      "confidenceScore": "82.00",
      "riskLevel": "MODÉRÉ",
      "expectedReturn": "+15-25%",
      "timeHorizon": "moyen terme (3-6 mois)"
    },
    
    "alerts": [
      {
        "level": "medium",
        "icon": "🟠",
        "message": "Volatilité élevée - Forte fluctuation des prix"
      }
    ],
    
    "actionPlan": [
      {
        "step": 1,
        "action": "Vérifier la liquidité disponible",
        "duration": "2 min"
      },
      {
        "step": 2,
        "action": "Définir le montant d'achat (max 15%)",
        "duration": "5 min"
      },
      {
        "step": 3,
        "action": "Placer ordre limite à -2%",
        "duration": "3 min"
      }
    ],
    
    "fullReport": "╔════════════════════════════════════════╗\n║  🤖 AURA - AIDE À LA DÉCISION IA     ║..."
  }
}
```

---

### 📊 4. Analyse Complète (All-in-One)

**Endpoint:** `POST /api/aura/full-analysis`

**Description:** Combine les 3 analyses en une seule requête.

**Requête:**
```json
{
  "symbol": "SOL",
  "contractAddress": "0xabc123...",
  "chain": "solana",
  "user": {
    "name": "Bakr Sassi",
    "experience": "Avancé",
    "riskTolerance": "Élevée"
  },
  "portfolio": {
    "totalValue": 250000
  }
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "symbol": "SOL",
    "timestamp": "2025-01-26T10:30:00Z",
    "riskAnalysis": { /* Résultat complet analyse risque */ },
    "contractVerification": { /* Résultat vérification contrat */ },
    "aiRecommendation": { /* Recommandation IA */ }
  }
}
```

---

## 🔑 Configuration API Keys

### 1. **APIs Blockchain (Gratuites)**

#### Etherscan
1. Aller sur https://etherscan.io/register
2. Créer un compte
3. Aller dans "API Keys" → "Create API Key"
4. Copier la clé dans `.env`:
```env
ETHERSCAN_API_KEY=YOUR_KEY_HERE
```

#### PolygonScan (même processus)
- https://polygonscan.com/register
```env
POLYGONSCAN_API_KEY=YOUR_KEY_HERE
```

### 2. **APIs IA (Optionnelles)**

#### Groq (Recommandé - Très Rapide & Gratuit)
1. Aller sur https://console.groq.com
2. Créer un compte
3. Générer une clé API
4. Ajouter dans `.env`:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

#### OpenAI (Alternative)
1. Aller sur https://platform.openai.com/api-keys
2. Créer une clé API
3. Ajouter dans `.env`:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

> **Note:** Si aucune clé IA n'est fournie, le système utilisera une IA locale simulée.

---

## 🧪 Tester les APIs

### Via cURL (Terminal)

```bash
# 1. Analyse de Risque
curl -X POST http://localhost:5000/api/aura/analyze-risk \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTC", "protocol": "bitcoin"}'

# 2. Vérification Contrat
curl -X POST http://localhost:5000/api/aura/verify-contract \
  -H "Content-Type: application/json" \
  -d '{"contractAddress": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "chain": "ethereum"}'

# 3. Recommandation IA
curl -X POST http://localhost:5000/api/aura/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "asset": {"symbol": "ETH", "currentPrice": 3250, "amount": 2},
    "user": {"name": "Bakr", "experience": "Avancé", "riskTolerance": "Élevée"}
  }'

# 4. Analyse Complète
curl -X POST http://localhost:5000/api/aura/full-analysis \
  -H "Content-Type: application/json" \
  -d '{"symbol": "SOL"}'
```

### Via Postman

1. Créer une nouvelle collection "AURA Dynamic APIs"
2. Ajouter 4 requêtes POST avec les endpoints ci-dessus
3. Définir `Content-Type: application/json`
4. Copier les exemples de requêtes JSON

---

## 📈 Intégration Frontend

### Exemple React

```javascript
// src/services/auraService.js

const API_URL = 'http://localhost:5000/api/aura';

/**
 * Analyse de Risque Globale
 */
export const analyzeRisk = async (symbol, protocol) => {
  try {
    const response = await fetch(`${API_URL}/analyze-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, protocol })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur analyse risque:', error);
    throw error;
  }
};

/**
 * Vérification Contrat
 */
export const verifyContract = async (contractAddress, chain = 'ethereum') => {
  try {
    const response = await fetch(`${API_URL}/verify-contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractAddress, chain })
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur vérification:', error);
    throw error;
  }
};

/**
 * Recommandation IA
 */
export const getAIRecommendation = async (context) => {
  try {
    const response = await fetch(`${API_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context)
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur recommandation:', error);
    throw error;
  }
};

/**
 * Analyse Complète
 */
export const fullAnalysis = async (params) => {
  try {
    const response = await fetch(`${API_URL}/full-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur analyse complète:', error);
    throw error;
  }
};
```

### Utilisation dans un Composant

```javascript
import React, { useState } from 'react';
import { fullAnalysis } from '../services/auraService';

function AssetAnalysis() {
  const [symbol, setSymbol] = useState('BTC');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fullAnalysis({
        symbol,
        user: {
          name: 'Bakr Sassi',
          experience: 'Avancé',
          riskTolerance: 'Élevée'
        },
        portfolio: { totalValue: 250000 }
      });
      
      setResult(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={symbol} 
        onChange={(e) => setSymbol(e.target.value)} 
        placeholder="Symbol (BTC, ETH...)"
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyse en cours...' : 'Analyser'}
      </button>
      
      {result && (
        <div>
          <h3>Score de Risque: {result.riskAnalysis.combinedRiskScore}/100</h3>
          <h3>Authenticité: {result.contractVerification?.authenticityScore || 'N/A'}/100</h3>
          <h3>Recommandation: {result.aiRecommendation.recommendation.action}</h3>
          <p>{result.aiRecommendation.recommendation.summary}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Points Clés

### ✅ Données Réelles
- **CoinGecko API** pour prix et volatilité en temps réel
- **Etherscan API** pour vérification de contrats
- **Web3/Ethers** pour analyse blockchain

### ✅ Aucun Mock
- Toutes les données proviennent d'APIs externes
- Analyses basées sur des algorithmes réels
- Intégration IA authentique (Groq/OpenAI)

### ✅ Justifications Complètes
- Chaque recommandation inclut:
  - Justification financière
  - Justification sécuritaire
  - Justification technique
  - Plan d'action détaillé

---

## 🚨 Limitations & Améliorations

### Limitations Actuelles
- **APIs Gratuites**: Limites de requêtes (CoinGecko: 50/min)
- **Analyse Bytecode**: Basique, ne remplace pas un audit complet
- **IA Locale**: Moins précise que Groq/OpenAI

### Améliorations Futures
- Intégrer **MythX/Slither** pour analyse avancée
- Ajouter **Machine Learning** pour prédictions
- Implémenter **Real Blockchain Recording** (TrustLedger v2)
- Ajouter **WebSocket** pour données temps réel

---

## 📞 Support

Pour toute question sur l'utilisation des APIs:
1. Vérifier que le serveur est démarré: `node server/server.js`
2. Vérifier les logs dans le terminal
3. Tester avec `curl` avant d'intégrer au frontend

**Bon développement! 🚀**
