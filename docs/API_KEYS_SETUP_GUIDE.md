# 🔑 Guide Complet - Obtenir les API Keys (GRATUITES)

## 📌 APIs Requises vs Optionnelles

### ✅ Fonctionnement Sans Clés
Le système AURA fonctionne **sans aucune API key** avec:
- IA locale simulée (recommandations basiques)
- Données fallback pour analyse risque
- Vérification contrats limitée

### 🚀 Fonctionnement Optimal (APIs Gratuites)
Pour utiliser toutes les fonctionnalités dynamiques:
1. **Groq API** (IA) - GRATUIT ⭐ Recommandé
2. **Etherscan API** (Blockchain) - GRATUIT
3. **CoinGecko API** (Marché) - GRATUIT sans clé

---

## 1️⃣ Groq API (IA Recommandations) ⭐ PRIORITAIRE

### Pourquoi Groq?
- ✅ **100% GRATUIT**
- ✅ Ultra-rapide (Mixtral-8x7b)
- ✅ Pas de carte bancaire requise
- ✅ Rate limit généreux (~30 req/min)

### Étapes d'Inscription (2 minutes)

#### Étape 1: Créer un Compte
1. Aller sur https://console.groq.com
2. Cliquer **"Sign Up"**
3. Options:
   - Google Account (recommandé)
   - GitHub Account
   - Email + Password

#### Étape 2: Générer la Clé API
1. Une fois connecté, cliquer **"API Keys"** dans le menu gauche
2. Cliquer **"Create API Key"**
3. Nommer la clé: `AURA-Project`
4. Copier la clé (commence par `gsk_...`)

**⚠️ Important:** Copier la clé IMMÉDIATEMENT, elle ne sera affichée qu'une fois!

#### Étape 3: Ajouter à .env
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Test Rapide
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_your_key_here"
```

**Résultat attendu:** Liste des modèles disponibles (mixtral-8x7b-32768, etc.)

---

## 2️⃣ Etherscan API (Vérification Contrats)

### Pourquoi Etherscan?
- ✅ **GRATUIT** (5 req/sec)
- ✅ Vérification code source
- ✅ Historique transactions
- ✅ Réputation créateurs

### Étapes d'Inscription (3 minutes)

#### Étape 1: Créer un Compte
1. Aller sur https://etherscan.io/register
2. Remplir:
   - Username (ex: `bakr_aura`)
   - Email (votre email)
   - Password (sécurisé)
3. Vérifier l'email (cliquer lien reçu)

#### Étape 2: Créer une API Key
1. Se connecter sur https://etherscan.io/login
2. Aller dans **"API Keys"** (menu)
3. Cliquer **"Add"** (+ API Key Token)
4. Donner un nom: `AURA Project`
5. Copier la clé (chaîne alphanumérique)

#### Étape 3: Ajouter à .env
```env
ETHERSCAN_API_KEY=ABCDEFGHIJK1234567890ABCDEFGHIJK
```

### Test Rapide
```bash
curl "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YOUR_KEY"
```

**Résultat attendu:** Prix ETH en USD

---

## 3️⃣ PolygonScan API (Optionnel)

### Utilité
- Vérifier contrats sur Polygon (MATIC)
- Même processus qu'Etherscan

### Étapes
1. Aller sur https://polygonscan.com/register
2. Créer un compte (email + password)
3. Aller dans **"API-KEYs"**
4. Créer une clé: `AURA Polygon`
5. Copier la clé

```env
POLYGONSCAN_API_KEY=ABCDEFGHIJK1234567890ABCDEFGHIJK
```

---

## 4️⃣ BscScan API (Optionnel)

### Utilité
- Vérifier contrats sur Binance Smart Chain

### Étapes
1. Aller sur https://bscscan.com/register
2. Créer un compte
3. Aller dans **"API-KEYs"**
4. Créer une clé: `AURA BSC`
5. Copier la clé

```env
BSCSCAN_API_KEY=ABCDEFGHIJK1234567890ABCDEFGHIJK
```

---

## 5️⃣ CoinGecko API (Pas de Clé Requise!)

### Pourquoi Aucune Clé?
- ✅ API publique gratuite
- ✅ 50 requêtes/minute sans clé
- ✅ Données prix, volatilité, sentiment

### Utilisation dans AURA
Le code utilise déjà CoinGecko **sans authentification**:
```javascript
const response = await axios.get(
  'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
  { params: { vs_currency: 'usd', days: 30 } }
);
```

**Rien à faire!** ✅

### (Optionnel) Version Pro
Si vous dépassez 50 req/min:
1. Aller sur https://www.coingecko.com/en/api/pricing
2. Choisir **"Demo Plan"** (gratuit, 10,000 req/mois)
3. Générer une clé
4. Ajouter dans `.env`:
```env
COINGECKO_API_KEY=CG-xxxxxxxxxxxxxxxxx
```

---

## 6️⃣ OpenAI API (Alternative Payante)

### ⚠️ NON REQUIS si vous avez Groq

### Si Vous Voulez Quand Même
1. Aller sur https://platform.openai.com/signup
2. Créer un compte (email + téléphone)
3. Ajouter une carte bancaire (obligatoire)
4. Aller dans **"API Keys"**
5. Créer une clé: `AURA`
6. Copier (commence par `sk-proj-...`)

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Coût:** ~$0.50 par 1M tokens (GPT-4o-mini)

**💡 Recommandation:** Utiliser Groq (gratuit) au lieu d'OpenAI

---

## 📋 Configuration Finale .env

### Minimum Fonctionnel (Groq seul)
```env
# IA
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx

# Blockchain (optionnel mais recommandé)
ETHERSCAN_API_KEY=ABCDEFGHIJK1234567890
```

### Configuration Complète
```env
# ========================================
# 🔐 AURA - Configuration APIs
# ========================================

# IA (Recommandé: Groq)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=                          # Vide si pas utilisé

# Blockchain Explorateurs
ETHERSCAN_API_KEY=ABCDEFGHIJK1234567890  # Ethereum
POLYGONSCAN_API_KEY=ABCDEFGHIJK1234567890 # Polygon (optionnel)
BSCSCAN_API_KEY=ABCDEFGHIJK1234567890     # BSC (optionnel)

# Marché Crypto
COINGECKO_API_KEY=                       # Vide = API publique (OK)

# RPC Endpoints (Défaut OK)
ETHEREUM_RPC_URL=https://eth.llamarpc.com
POLYGON_RPC_URL=https://polygon-rpc.com
BSC_RPC_URL=https://bsc-dataseed.binance.org

# ========================================
# 🗄️ Base de Données (Ne pas modifier)
# ========================================
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=aura_db
DB_PORT=3306

# ========================================
# 🔐 Sécurité (Ne pas modifier)
# ========================================
JWT_SECRET=aura_super_secret_key_2025_bakr_sassi_cryptoshield
JWT_EXPIRES_IN=8h
BCRYPT_ROUNDS=10
SESSION_SECRET=aura_session_secret_key_2025

# ========================================
# 🚀 Serveur (Ne pas modifier)
# ========================================
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Tester les Clés API

### Test 1: Groq
```bash
node -e "
const axios = require('axios');
axios.post('https://api.groq.com/openai/v1/chat/completions', {
  model: 'mixtral-8x7b-32768',
  messages: [{ role: 'user', content: 'Hello!' }]
}, {
  headers: { 'Authorization': 'Bearer gsk_YOUR_KEY' }
}).then(res => console.log('✅ Groq OK:', res.data.choices[0].message.content))
  .catch(err => console.log('❌ Groq Error:', err.message));
"
```

### Test 2: Etherscan
```bash
curl "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YOUR_KEY"
```

**Résultat attendu:**
```json
{
  "status": "1",
  "message": "OK",
  "result": {
    "ethbtc": "0.03456",
    "ethusd": "3250.50"
  }
}
```

### Test 3: CoinGecko (Pas de Clé)
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
```

**Résultat attendu:**
```json
{
  "bitcoin": {
    "usd": 45280
  }
}
```

---

## 🚨 Problèmes Courants

### ❌ Erreur: "Invalid API Key"
**Solution:**
1. Vérifier que la clé est bien copiée (sans espaces)
2. Vérifier qu'elle commence par le bon préfixe:
   - Groq: `gsk_`
   - OpenAI: `sk-proj-`
   - Etherscan: Alphanumérique

### ❌ Erreur: "Rate Limit Exceeded"
**Solution:**
1. Groq: Attendre 1 minute
2. Etherscan: Réduire fréquence requêtes
3. CoinGecko: Limiter à 50 req/min

### ❌ Erreur: "API Key Not Found"
**Solution:**
1. Vérifier le fichier `.env` existe à la racine
2. Vérifier que le serveur a été **redémarré**:
```bash
# Ctrl+C pour arrêter
node server/server.js  # Relancer
```

### ❌ Groq: "Account Not Activated"
**Solution:**
1. Vérifier l'email de confirmation
2. Cliquer sur le lien d'activation
3. Se reconnecter et régénérer une clé

---

## 📊 Récapitulatif

| API | Priorité | Coût | Inscription | Carte Bancaire | Temps |
|-----|----------|------|-------------|----------------|-------|
| **Groq** | ⭐ HAUTE | GRATUIT | Email/Google | ❌ Non | 2 min |
| **Etherscan** | 🟡 MOYENNE | GRATUIT | Email | ❌ Non | 3 min |
| **PolygonScan** | 🟢 BASSE | GRATUIT | Email | ❌ Non | 3 min |
| **BscScan** | 🟢 BASSE | GRATUIT | Email | ❌ Non | 3 min |
| **CoinGecko** | ✅ AUTO | GRATUIT | Aucune | ❌ Non | 0 min |
| **OpenAI** | 🔴 OPTIONNEL | PAYANT | Email+Tél | ✅ Oui | 5 min |

---

## ✅ Checklist Finale

- [ ] Groq API key obtenue et ajoutée dans `.env`
- [ ] Etherscan API key obtenue et ajoutée dans `.env`
- [ ] PolygonScan API key (optionnel)
- [ ] BscScan API key (optionnel)
- [ ] Fichier `.env` sauvegardé
- [ ] Serveur redémarré: `node server/server.js`
- [ ] Tests APIs réussis: `node test-apis.js`

---

## 🎉 Une Fois Toutes les Clés Configurées

### Démarrer AURA
```bash
# Terminal 1: Backend
node server/server.js

# Terminal 2: Tests
node test-apis.js

# Terminal 3: Frontend (optionnel)
npm start
```

### Résultat Attendu
```
╔═══════════════════════════════════════════════════════════╗
║        🧪 AURA - Tests APIs Dynamiques               ║
╚═══════════════════════════════════════════════════════════╝

✅ Test 1 - Analyse de Risque:     ✅ PASS
✅ Test 2 - Vérification Contrat:  ✅ PASS
✅ Test 3 - Recommandation IA:     ✅ PASS
✅ Test 4 - Analyse Complète:      ✅ PASS

🎉 TOUS LES TESTS RÉUSSIS! (4/4)
✅ Les 3 fonctionnalités du cahier des charges sont opérationnelles!
```

---

## 💡 Conseils Finaux

### Sécurité
- ❌ **NE JAMAIS** commit le fichier `.env` sur GitHub
- ✅ Ajouter `.env` dans `.gitignore`
- ✅ Utiliser des clés séparées par environnement (dev/prod)

### Performance
- ✅ **Groq** est 10x plus rapide qu'OpenAI (recommandé)
- ✅ CoinGecko sans clé suffit pour <50 req/min
- ✅ Rate limiting automatique dans le code

### Coûts
- **GRATUIT:** Groq + Etherscan + CoinGecko = **$0/mois** ✅
- **Payant:** OpenAI = ~$5-10/mois (optionnel)

---

**Temps Total pour Toutes les Clés: ~10 minutes** ⚡

**Prêt à lancer AURA! 🚀**
