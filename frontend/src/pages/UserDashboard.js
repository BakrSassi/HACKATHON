import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import Dashboard from '../components/Dashboard';
import AuraChat from '../components/AuraChat';
import { analyzePortfolio } from '../services/smartBrain';
import { performSecurityScan } from '../services/cyberGuardian';
import { mockAssets } from '../utils/mockData';
import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUserDashboard();
  }, []);

  const initializeUserDashboard = async () => {
    setLoading(true);
    
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    // Simuler le chargement du portefeuille de l'utilisateur
    // En production, cela viendrait d'une API avec les données réelles de l'utilisateur
    const assetsWithSecurity = mockAssets.map(asset => ({
      ...asset,
      securityScan: performSecurityScan(asset)
    }));

    const portfolioAnalysis = analyzePortfolio(assetsWithSecurity);
    setPortfolio(portfolioAnalysis);
    
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setActiveTab('chat');
  };

  const chatContext = {
    portfolio,
    asset: selectedAsset
  };

  if (loading) {
    return (
      <div className="user-loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Bienvenue {currentUser?.username || 'utilisateur'} !</h2>
          <p>Analyse de votre portefeuille en cours...</p>
          <div className="loading-steps">
            <div className="loading-step">🧠 SmartBrain analyse vos actifs...</div>
            <div className="loading-step">🛡️ CyberGuardian vérifie la sécurité...</div>
            <div className="loading-step">⛓️ TrustLedger valide les données...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header Utilisateur */}
      <header className="user-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">AURA</span>
            </div>
            <div className="user-welcome">
              <span className="welcome-text">Bonjour,</span>
              <span className="user-name">{currentUser?.username || 'Utilisateur'}</span>
            </div>
          </div>

          <nav className="user-nav">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'smartbrain' ? 'active' : ''}`}
              onClick={() => setActiveTab('smartbrain')}
            >
              <span className="nav-icon">🧠</span>
              <span>SmartBrain</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🛡️</span>
              <span>Sécurité</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
              onClick={() => setActiveTab('blockchain')}
            >
              <span className="nav-icon">⛓️</span>
              <span>Blockchain</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <span className="nav-icon">💬</span>
              <span>AURA Chat</span>
            </button>
          </nav>

          <div className="header-actions">
            <button className="action-btn notification-btn">
              <span>🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <button className="action-btn settings-btn">
              <span>⚙️</span>
            </button>
            <button className="action-btn logout-btn" onClick={handleLogout}>
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="user-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <div className="dashboard-welcome">
              <h1>Votre Portfolio</h1>
              <p>Score AURA: <span className="aura-score">{portfolio.portfolioAuraScore}/100</span></p>
            </div>
            <Dashboard 
              portfolio={portfolio} 
              onSelectAsset={handleSelectAsset}
            />
          </div>
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
          <div className="chat-section">
            <AuraChat context={chatContext} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="user-footer">
        <p>AURA © 2025 - Votre aura numérique de protection financière</p>
        <p className="footer-note">
          🔒 Toutes les données sont cryptées | ⛓️ Historique vérifiable sur blockchain
        </p>
      </footer>
    </div>
  );
};

export default UserDashboard;
