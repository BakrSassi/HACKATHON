# 🤖 Guide d'Intégration API IA pour AURA

## ✨ Nouvelle Fonctionnalité : Chatbot IA Dynamique

AURA peut maintenant répondre à **n'importe quelle question** grâce à l'intégration d'APIs d'Intelligence Artificielle !

---

## 🎯 Options d'API Disponibles

### ⚡ Option 1 : Groq (RECOMMANDÉ)

**Pourquoi Groq ?**
- ✅ **100% GRATUIT**
- ✅ **Ultra-rapide** (latence < 1 seconde)
- ✅ **Modèle puissant** (LLama 3.1 8B)
- ✅ **Pas de carte bancaire requise**
- ✅ **Quota généreux**

**Comment obtenir une clé :**

1. Allez sur **https://console.groq.com**
2. Créez un compte (email + mot de passe)
3. Cliquez sur "API Keys" dans le menu
4. Cliquez sur "Create API Key"
5. Copiez la clé (commence par `gsk_...`)

**Configuration dans AURA :**
- Méthode 1 : Cliquez sur ⚙️ dans le chat → Collez la clé dans "Groq API Key"
- Méthode 2 : Créez un fichier `.env` avec :
  ```
  REACT_APP_GROQ_API_KEY=gsk_votre_cle_ici
  ```

---

### 🤖 Option 2 : OpenAI (GPT)

**Pourquoi OpenAI ?**
- ✅ **Le plus performant** (GPT-3.5/GPT-4)
- ✅ **Compréhension exceptionnelle**
- ✅ **Réponses très naturelles**
- ⚠️ **Nécessite des crédits** (à partir de $5)

**Comment obtenir une clé :**

1. Allez sur **https://platform.openai.com**
2. Créez un compte OpenAI
3. Ajoutez des crédits (Billing → Add payment method)
4. Allez dans "API keys"
5. Créez une nouvelle clé secrète
6. Copiez la clé (commence par `sk-...`)

**Configuration dans AURA :**
- Méthode 1 : ⚙️ dans le chat → "OpenAI API Key"
- Méthode 2 : `.env` :
  ```
  REACT_APP_OPENAI_API_KEY=sk_votre_cle_ici
  ```

---

### 🎯 Option 3 : Hugging Face

**Pourquoi Hugging Face ?**
- ✅ **100% GRATUIT**
- ✅ **Open source**
- ✅ **Modèles variés**
- ⚠️ **Plus lent** (3-5 secondes)
- ⚠️ **Qualité variable**

**Comment obtenir un token :**

1. Allez sur **https://huggingface.co**
2. Créez un compte gratuit
3. Allez dans Settings → Access Tokens
4. Créez un nouveau token (Read access)
5. Copiez le token (commence par `hf_...`)

**Configuration dans AURA :**
- Méthode 1 : ⚙️ dans le chat → "Hugging Face"
- Méthode 2 : `.env` :
  ```
  REACT_APP_HUGGINGFACE_API_KEY=hf_votre_token_ici
  ```

---

## 🚀 Guide de Démarrage Rapide

### Étape 1 : Choisir votre API

**Pour commencer facilement :**
→ Utilisez **Groq** (gratuit, rapide, simple)

**Pour la meilleure qualité :**
→ Utilisez **OpenAI** (si budget disponible)

### Étape 2 : Obtenir la Clé

Suivez les instructions ci-dessus pour votre API choisie.

### Étape 3 : Configuration

**Méthode A : Interface (Plus Simple)**
1. Lancez AURA (`npm start`)
2. Allez dans le chat (💬 AURA Chat)
3. Cliquez sur ⚙️ en haut à droite
4. Collez votre clé dans la section appropriée
5. Cliquez sur "💾 Sauvegarder"
6. ✅ C'est fait !

**Méthode B : Fichier .env (Permanent)**
1. Copiez `.env.example` en `.env`
2. Ajoutez votre clé dans le fichier
3. Redémarrez l'application
4. ✅ Configuré !

### Étape 4 : Tester

Posez n'importe quelle question dans le chat :
- "Explique-moi la différence entre Bitcoin et Ethereum"
- "Quels sont les meilleurs investissements pour 2025 ?"
- "Comment fonctionne la blockchain exactement ?"
- "C'est quoi le minage de cryptomonnaies ?"

---

## 💡 Comparaison des APIs

| Critère | Groq | OpenAI | Hugging Face |
|---------|------|--------|--------------|
| **Prix** | Gratuit | $5-20/mois | Gratuit |
| **Vitesse** | ⚡⚡⚡ Très rapide | ⚡⚡ Rapide | ⚡ Lent |
| **Qualité** | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Exceptionnel | ⭐⭐⭐ Bon |
| **Modèle** | LLama 3.1 8B | GPT-3.5/4 | Mistral 7B |
| **Quota** | Généreux | Pay-per-use | Limité |
| **Setup** | ✅ Simple | ✅ Simple | ✅ Simple |

**Recommandation :** Commencez avec **Groq** !

---

## 🔒 Sécurité des Clés API

### Où sont stockées vos clés ?

**Méthode Interface (⚙️) :**
- Stockées dans le `localStorage` de votre navigateur
- Jamais envoyées à un serveur
- Restent sur votre machine

**Méthode .env :**
- Fichier `.env` est dans `.gitignore`
- Ne sera jamais commité sur Git
- Reste local sur votre machine

### Bonnes Pratiques

✅ **À FAIRE :**
- Utilisez des clés API avec permissions minimales
- Surveillez votre usage sur les dashboards des providers
- Supprimez les clés inutilisées
- Ne partagez jamais vos clés

❌ **À NE PAS FAIRE :**
- Commiter le fichier `.env` sur Git
- Partager vos clés en public
- Utiliser la même clé partout
- Laisser une clé compromise active

### Si votre clé est compromise

1. Allez sur le dashboard du provider
2. Révoquéz immédiatement la clé compromise
3. Créez une nouvelle clé
4. Mettez à jour dans AURA

---

## 🎨 Capacités du Chatbot IA

Avec l'API activée, AURA peut :

### 💬 Questions Générales
- Expliquer n'importe quel concept financier
- Répondre à des questions sur la crypto
- Donner des conseils d'investissement
- Expliquer la blockchain, le minage, les NFTs

### 📊 Analyse Contextuelle
- Analyser votre portefeuille spécifique
- Expliquer pourquoi un actif est risqué
- Justifier les recommandations
- Comparer différents actifs

### 🛡️ Sécurité & Risques
- Identifier les menaces
- Expliquer les CVE et vulnérabilités
- Conseiller sur la protection
- Alerter sur les arnaques

### 🎓 Pédagogie
- Vulgariser des concepts complexes
- Donner des exemples concrets
- Recommander des ressources
- Répondre aux "pourquoi"

---

## 🔧 Dépannage

### Problème : "Aucune clé API détectée"

**Solution :**
1. Vérifiez que vous avez bien configuré une clé
2. Si méthode .env : redémarrez l'application
3. Si méthode interface : vérifiez le localStorage

### Problème : "API Error 401"

**Cause :** Clé API invalide ou expirée

**Solution :**
1. Vérifiez que vous avez copié la clé complète
2. Générez une nouvelle clé sur le dashboard
3. Reconfigurez dans AURA

### Problème : "API Error 429"

**Cause :** Quota dépassé

**Solution :**
1. Attendez un peu (les quotas se réinitialisent)
2. Vérifiez votre usage sur le dashboard
3. Passez à un autre provider

### Problème : Réponses lentes

**Solution :**
1. Si Hugging Face : c'est normal, essayez Groq
2. Vérifiez votre connexion internet
3. Les premiers appels sont plus lents (cold start)

### Problème : Mode local uniquement

**Cause :** Aucune API configurée

**Solution :**
- Configurez une clé API (voir Étape 2)
- Le mode local fonctionne mais avec capacités limitées

---

## 📈 Utilisation et Coûts

### Groq (Gratuit)
- **Quota :** ~6000 requêtes/jour
- **Coût :** $0
- **Idéal pour :** Usage personnel, tests, prototypes

### OpenAI
- **GPT-3.5-turbo :** ~$0.002 par 1000 tokens
- **Coût moyen :** ~$0.01 par conversation
- **$5 ≈ 500 conversations**
- **Idéal pour :** Production, qualité maximale

### Hugging Face (Gratuit)
- **Quota :** Limité mais suffisant
- **Coût :** $0
- **Idéal pour :** Tests, projets perso

---

## 🎯 Exemples de Questions à Poser

Une fois l'API configurée, essayez :

**Finance & Investissement**
- "Quelle est la différence entre une action et une obligation ?"
- "Comment diversifier un portefeuille de 10 000€ ?"
- "Explique-moi le concept de volatilité"

**Cryptomonnaies**
- "C'est quoi la différence entre Bitcoin et Ethereum ?"
- "Comment fonctionne le minage de cryptos ?"
- "Qu'est-ce qu'un smart contract ?"

**Sécurité**
- "Comment reconnaître un site de phishing ?"
- "C'est quoi une attaque de réentrance ?"
- "Comment protéger mes cryptos ?"

**Contexte Personnel**
- "Pourquoi mon actif ETHX est risqué ?"
- "Dois-je vendre mon Bitcoin maintenant ?"
- "Comment améliorer mon score AURA ?"

---

## 🚀 Prochaines Étapes

### Améliorations Futures
- [ ] Historique de conversation persistant
- [ ] Export des conversations en PDF
- [ ] Suggestions intelligentes de questions
- [ ] Multi-langue (EN, FR, ES, etc.)
- [ ] Mode vocal (speech-to-text)
- [ ] Intégration avec d'autres APIs (news, prix)

---

## 📞 Support

**Problème technique ?**
- Consultez la section Dépannage ci-dessus
- Vérifiez la console du navigateur (F12)
- Consultez la doc des providers

**Questions ?**
- Posez-les directement à AURA (même en mode local)
- Consultez le README.md du projet

---

## 🎉 C'est Parti !

Vous êtes maintenant prêt à utiliser AURA avec toute la puissance de l'IA !

**Récapitulatif en 3 étapes :**
1. 🔑 Obtenez une clé API Groq (gratuit)
2. ⚙️ Configurez-la dans AURA
3. 💬 Posez n'importe quelle question !

**Bon investissement intelligent ! 💰✨**
