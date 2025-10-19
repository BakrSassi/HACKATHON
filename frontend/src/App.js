import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AuraChat from './components/AuraChat';
import UnifiedLogin from './pages/UnifiedLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import { analyzePortfolio } from './services/smartBrain';
import { performSecurityScan } from './services/cyberGuardian';
import { mockAssets } from './utils/mockData';
import authService from './services/authService';

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    }
    
    // Initialiser le portefeuille avec analyse complète
    initializePortfolio();
  }, []);

  const initializePortfolio = async () => {
    setLoading(true);
    
    // Effectuer un scan de sécurité pour chaque actif
    const assetsWithSecurity = mockAssets.map(asset => ({
      ...asset,
      securityScan: performSecurityScan(asset)
    }));

    // Analyser le portefeuille complet
    const portfolioAnalysis = analyzePortfolio(assetsWithSecurity);
    
    setPortfolio(portfolioAnalysis);
    setLoading(false);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('chat');
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const chatContext = {
    portfolio,
    asset: selectedAsset
  };

  // Si on affiche la page de connexion unifiée
  if (showLogin && !isAuthenticated) {
    return <UnifiedLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Si l'utilisateur est authentifié, afficher le dashboard correspondant
  if (isAuthenticated && currentUser) {
    // Dashboard admin pour super_admin et moderator
    if (currentUser.role === 'super_admin' || currentUser.role === 'moderator') {
      return <AdminDashboard onLogout={handleLogout} />;
    }
    
    // Dashboard utilisateur pour role 'user'
    if (currentUser.role === 'user') {
      return <UserDashboard onLogout={handleLogout} />;
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo">
            <h1>✨ AURA</h1>
            <p className="tagline">Votre Gardien Financier Intelligent</p>
          </div>
          <nav className="main-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'smartbrain' ? 'active' : ''}`}
              onClick={() => setActiveTab('smartbrain')}
            >
              🧠 SmartBrain
            </button>
            <button 
              className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🛡️ CyberGuardian
            </button>
            <button 
              className={`nav-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
              onClick={() => setActiveTab('blockchain')}
            >
              ⛓️ TrustLedger
            </button>
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 AURA Chat
            </button>
            <button 
              className="nav-btn login-btn"
              onClick={() => setShowLogin(true)}
            >
              � Connexion
            </button>
          </nav>
        </div>
      </header>

      <main className="App-main">
        {loading ? (
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Analyse de votre portefeuille en cours...</p>
            <p className="loading-detail">🧠 SmartBrain analyse vos actifs...</p>
            <p className="loading-detail">🛡️ CyberGuardian vérifie la sécurité...</p>
            <p className="loading-detail">⛓️ TrustLedger valide les données...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                portfolio={portfolio} 
                onSelectAsset={handleSelectAsset}
              />
            )}

            {activeTab === 'smartbrain' && (
              <div className="module-page">
                <div className="module-header">
                  <h2>🧠 SmartBrain - Intelligence Artificielle</h2>
                  <p>Analyse avancée de votre portefeuille par IA</p>
                </div>
                <div className="smartbrain-content">
                  <div className="info-card">
                    <h3>Score AURA Global</h3>
                    <div className="big-score">
                      {portfolio.portfolioAuraScore}/100
                    </div>
                    <p>
                      Calculé en analysant la performance, la fiabilité et la sécurité 
                      de tous vos actifs
                    </p>
                  </div>
                  <div className="info-card">
                    <h3>Algorithmes Actifs</h3>
                    <ul className="algorithm-list">
                      <li>✅ Analyse de performance multi-temporelle</li>
                      <li>✅ Détection d'anomalies de marché</li>
                      <li>✅ Évaluation de la liquidité</li>
                      <li>✅ Scoring de fiabilité des protocoles</li>
                      <li>✅ Prédiction de risques</li>
                    </ul>
                  </div>
                  <div className="info-card">
                    <h3>Recommandations IA</h3>
                    {portfolio.recommendations.length > 0 ? (
                      <ul className="recommendations-simple">
                        {portfolio.recommendations.map((rec, i) => (
                          <li key={i}>{rec.message}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>✅ Votre portefeuille est optimisé</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="module-page">
                <div className="module-header">
                  <h2>🛡️ CyberGuardian - Sécurité Proactive</h2>
                  <p>Protection en temps réel de vos investissements</p>
                </div>
                <div className="security-grid">
                  {portfolio.assets.map((asset, index) => (
                    <div key={index} className="security-card">
                      <h4>{asset.name}</h4>
                      <div className="security-score-display">
                        Score: {asset.securityScan.securityScore}/100
                      </div>
                      
                      {asset.securityScan.threats.length > 0 && (
                        <div className="threats-section">
                          <strong>⚠️ Menaces ({asset.securityScan.threats.length})</strong>
                          {asset.securityScan.threats.map((threat, i) => (
                            <div key={i} className={`threat-item ${threat.severity}`}>
                              {threat.message}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {asset.securityScan.vulnerabilities.length > 0 && (
                        <div className="vulnerabilities-section">
                          <strong>🔍 Vulnérabilités ({asset.securityScan.vulnerabilities.length})</strong>
                          {asset.securityScan.vulnerabilities.map((vuln, i) => (
                            <div key={i} className={`vuln-item ${vuln.severity}`}>
                              {vuln.message}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {asset.securityScan.threats.length === 0 && 
                       asset.securityScan.vulnerabilities.length === 0 && (
                        <div className="security-ok">
                          ✅ Aucune menace détectée
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blockchain' && (
              <div className="module-page">
                <div className="module-header">
                  <h2>⛓️ TrustLedger - Blockchain de Confiance</h2>
                  <p>Historique immuable de toutes vos décisions</p>
                </div>
                <div className="blockchain-content">
                  <div className="blockchain-info">
                    <h3>📊 Statistiques de la Blockchain</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">Blocs</span>
                        <span className="stat-value">12</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Transactions</span>
                        <span className="stat-value">47</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Intégrité</span>
                        <span className="stat-value">✅ 100%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="blockchain-history">
                    <h3>📜 Historique des Transactions</h3>
                    <div className="transaction-list">
                      <div className="transaction-item">
                        <div className="tx-icon">🧠</div>
                        <div className="tx-details">
                          <strong>Recommandation IA - ETHX</strong>
                          <p>Action de rééquilibrage suggérée</p>
                          <small>17/10/2025 à 14:22</small>
                        </div>
                        <div className="tx-hash">hash_abc123...</div>
                      </div>
                      
                      <div className="transaction-item">
                        <div className="tx-icon">🛡️</div>
                        <div className="tx-details">
                          <strong>Alerte Sécurité - ETHX</strong>
                          <p>CVE-2025-2312 détectée</p>
                          <small>17/10/2025 à 15:45</small>
                        </div>
                        <div className="tx-hash">hash_def456...</div>
                      </div>
                      
                      <div className="transaction-item">
                        <div className="tx-icon">💰</div>
                        <div className="tx-details">
                          <strong>Transaction Utilisateur - Bitcoin</strong>
                          <p>Achat de 0.5 BTC à $45,000</p>
                          <small>18/10/2025 à 09:30</small>
                        </div>
                        <div className="tx-hash">hash_ghi789...</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="blockchain-verification">
                    <h3>🔍 Vérification d'Authenticité</h3>
                    <p>
                      Toutes les transactions sont signées cryptographiquement et 
                      horodatées de manière immuable. Vous pouvez vérifier l'authenticité 
                      de n'importe quelle décision ou recommandation.
                    </p>
                    <button className="verify-btn">Vérifier une Transaction</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="chat-container">
                <AuraChat context={chatContext} />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>AURA © 2025 - Votre aura numérique de protection financière</p>
        <p className="footer-note">
          🔒 Toutes les données sont cryptées | ⛓️ Historique vérifiable sur blockchain
        </p>
      </footer>
    </div>
  );
}

export default App;