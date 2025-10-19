/**
 * 🤖 Service API pour l'Intelligence Artificielle
 * Intégration avec OpenAI GPT, Hugging Face, ou Groq
 */

// Configuration des APIs disponibles
const API_CONFIGS = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    requiresKey: true
  },
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant',
    requiresKey: true
  },
  huggingface: {
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    requiresKey: true
  },
  local: {
    // Fallback sur logique locale si pas d'API
    endpoint: null,
    requiresKey: false
  }
};

// Récupérer la clé API depuis les variables d'environnement ou localStorage
const getApiKey = (provider) => {
  // Priorité 1: Variables d'environnement
  if (provider === 'openai' && process.env.REACT_APP_OPENAI_API_KEY) {
    return process.env.REACT_APP_OPENAI_API_KEY;
  }
  if (provider === 'groq' && process.env.REACT_APP_GROQ_API_KEY) {
    return process.env.REACT_APP_GROQ_API_KEY;
  }
  if (provider === 'huggingface' && process.env.REACT_APP_HUGGINGFACE_API_KEY) {
    return process.env.REACT_APP_HUGGINGFACE_API_KEY;
  }
  
  // Priorité 2: localStorage (pour les tests)
  const storageKey = `${provider}_api_key`;
  return localStorage.getItem(storageKey);
};

// Système de prompts pour contextualiser AURA
const SYSTEM_PROMPT = `Tu es AURA, un assistant financier intelligent spécialisé dans la gestion de patrimoine et la cybersécurité.

Tu combines trois expertises :
1. 🧠 ANALYSE FINANCIÈRE : Tu analyses les performances, la volatilité, la liquidité des actifs
2. 🛡️ CYBERSÉCURITÉ : Tu détectes les menaces, vulnérabilités, phishing, et CVE
3. ⛓️ BLOCKCHAIN : Tu garantis la traçabilité et l'authenticité via blockchain

TON RÔLE :
- Expliquer les concepts financiers simplement
- Alerter sur les risques de sécurité
- Donner des recommandations actionnables
- Être pédagogue et rassurant
- Utiliser des emojis pour la clarté

TON STYLE :
- Professionnel mais accessible
- Précis et factuel
- Orienté action
- Empathique

IMPORTANT :
- Réponds TOUJOURS en français
- Sois concis (max 200 mots)
- Structure tes réponses avec des titres et listes
- Utilise des emojis pertinents`;

/**
 * Appel API vers OpenAI (GPT)
 */
const callOpenAI = async (messages, apiKey) => {
  const response = await fetch(API_CONFIGS.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIGS.openai.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * Appel API vers Groq (LLama ultra-rapide)
 */
const callGroq = async (messages, apiKey) => {
  const response = await fetch(API_CONFIGS.groq.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIGS.groq.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * Appel API vers Hugging Face
 */
const callHuggingFace = async (messages, apiKey) => {
  // Convertir les messages en un seul prompt
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  
  const response = await fetch(API_CONFIGS.huggingface.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: `${SYSTEM_PROMPT}\n\n${prompt}`,
      parameters: {
        max_length: 500,
        temperature: 0.7,
        return_full_text: false
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API Error: ${response.status}`);
  }

  const data = await response.json();
  return data[0].generated_text;
};

/**
 * Préparer le contexte pour l'IA
 */
const prepareContext = (context) => {
  let contextStr = '';
  
  if (context.portfolio) {
    contextStr += `\n📊 PORTEFEUILLE GLOBAL:
- Score AURA: ${context.portfolio.portfolioAuraScore}/100
- Valeur totale: $${context.portfolio.totalValue.toLocaleString()}
- Niveau de risque: ${context.portfolio.riskLevel}
- Diversification: ${context.portfolio.diversificationScore}/100
- Nombre d'actifs: ${context.portfolio.assets.length}`;
  }
  
  if (context.asset) {
    contextStr += `\n\n💼 ACTIF SÉLECTIONNÉ: ${context.asset.name} (${context.asset.symbol})
- Type: ${context.asset.type}
- Valeur: $${context.asset.value.toLocaleString()}
- Score AURA: ${context.asset.analysis.auraScore}/100
- Performance 24h: ${context.asset.performance24h > 0 ? '+' : ''}${context.asset.performance24h}%
- Performance 7j: ${context.asset.performance7d > 0 ? '+' : ''}${context.asset.performance7d}%
- Volatilité: ${context.asset.volatility}%`;

    if (context.asset.securityScan) {
      contextStr += `\n- Score sécurité: ${context.asset.securityScan.securityScore}/100`;
      if (context.asset.securityScan.threats.length > 0) {
        contextStr += `\n- ⚠️ ${context.asset.securityScan.threats.length} menace(s) détectée(s)`;
      }
      if (context.asset.securityScan.vulnerabilities.length > 0) {
        contextStr += `\n- 🔍 ${context.asset.securityScan.vulnerabilities.length} vulnérabilité(s)`;
      }
    }

    if (context.asset.analysis.recommendations.length > 0) {
      contextStr += `\n- Recommandation: ${context.asset.analysis.recommendations[0].action}`;
    }
  }
  
  return contextStr;
};

/**
 * FONCTION PRINCIPALE : Obtenir une réponse de l'IA
 */
export const getAIResponse = async (userMessage, context, conversationHistory = []) => {
  // Déterminer quel provider utiliser
  let provider = 'local';
  let apiKey = null;

  // Essayer Groq en priorité (gratuit et rapide)
  apiKey = getApiKey('groq');
  if (apiKey) {
    provider = 'groq';
  } else {
    // Sinon essayer OpenAI
    apiKey = getApiKey('openai');
    if (apiKey) {
      provider = 'openai';
    } else {
      // Sinon Hugging Face
      apiKey = getApiKey('huggingface');
      if (apiKey) {
        provider = 'huggingface';
      }
    }
  }

  // Si aucune clé API, utiliser la logique locale
  if (provider === 'local') {
    console.warn('⚠️ Aucune clé API détectée. Utilisation du mode local.');
    return {
      response: `Je fonctionne actuellement en mode local (sans API externe).

Pour débloquer mes capacités complètes :

1. **Option 1 : Groq (GRATUIT et RAPIDE)** ⚡
   - Inscrivez-vous sur https://console.groq.com
   - Copiez votre clé API
   - Collez-la dans les paramètres

2. **Option 2 : OpenAI (GPT)**
   - Créez un compte sur https://platform.openai.com
   - Générez une clé API
   - Ajoutez-la dans les paramètres

En attendant, je peux répondre à des questions basiques sur votre portefeuille !`,
      provider: 'local',
      error: 'no_api_key'
    };
  }

  try {
    // Préparer le contexte
    const contextInfo = prepareContext(context);
    
    // Construire les messages
    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        content: `CONTEXTE:${contextInfo}\n\nQUESTION: ${userMessage}`
      }
    ];

    // Appeler l'API appropriée
    let response;
    if (provider === 'groq') {
      response = await callGroq(messages, apiKey);
    } else if (provider === 'openai') {
      response = await callOpenAI(messages, apiKey);
    } else if (provider === 'huggingface') {
      response = await callHuggingFace(messages, apiKey);
    }

    return {
      response,
      provider,
      success: true
    };

  } catch (error) {
    console.error('❌ Erreur API:', error);
    
    return {
      response: `⚠️ Erreur de connexion à l'API ${provider}.

**Erreur:** ${error.message}

**Solutions:**
1. Vérifiez votre clé API
2. Vérifiez votre connexion internet
3. Essayez un autre provider

En attendant, posez-moi des questions basiques sur votre portefeuille et j'utiliserai ma logique locale.`,
      provider,
      success: false,
      error: error.message
    };
  }
};

/**
 * Sauvegarder une clé API
 */
export const saveApiKey = (provider, key) => {
  localStorage.setItem(`${provider}_api_key`, key);
  console.log(`✅ Clé API ${provider} sauvegardée`);
};

/**
 * Supprimer une clé API
 */
export const removeApiKey = (provider) => {
  localStorage.removeItem(`${provider}_api_key`);
  console.log(`🗑️ Clé API ${provider} supprimée`);
};

/**
 * Vérifier si une clé API est configurée
 */
export const hasApiKey = (provider) => {
  return !!getApiKey(provider);
};

/**
 * Obtenir le statut des APIs
 */
export const getApiStatus = () => {
  return {
    groq: hasApiKey('groq'),
    openai: hasApiKey('openai'),
    huggingface: hasApiKey('huggingface'),
    active: hasApiKey('groq') || hasApiKey('openai') || hasApiKey('huggingface')
  };
};

export default {
  getAIResponse,
  saveApiKey,
  removeApiKey,
  hasApiKey,
  getApiStatus
};
