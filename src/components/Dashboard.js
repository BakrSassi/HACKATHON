import React from 'react';
import './Dashboard.css';

const Dashboard = ({ portfolio, onSelectAsset }) => {
  if (!portfolio) {
    return (
      <div className="dashboard loading">
        <p>Chargement de votre portefeuille...</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-medium';
    return 'score-poor';
  };

  const getRiskBadge = (level) => {
    const badges = {
      low: { text: 'FAIBLE', color: 'risk-low' },
      moderate: { text: 'MODÉRÉ', color: 'risk-moderate' },
      high: { text: 'ÉLEVÉ', color: 'risk-high' },
      critical: { text: 'CRITIQUE', color: 'risk-critical' }
    };
    return badges[level] || badges.moderate;
  };

  return (
    <div className="dashboard">
      {/* En-tête du Dashboard */}
      <div className="dashboard-header">
        <div className="aura-score-main">
          <div className={`score-circle ${getScoreColor(portfolio.portfolioAuraScore)}`}>
            <span className="score-value">{portfolio.portfolioAuraScore}</span>
            <span className="score-label">SCORE AURA</span>
          </div>
          <div className="portfolio-summary">
            <h2>Votre Portefeuille</h2>
            <p className="total-value">${portfolio.totalValue.toLocaleString()}</p>
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">Diversification</span>
                <span className="metric-value">{portfolio.diversificationScore}/100</span>
              </div>
              <div className="metric">
                <span className="metric-label">Risque Global</span>
                <span className={`risk-badge ${getRiskBadge(portfolio.riskLevel).color}`}>
                  {getRiskBadge(portfolio.riskLevel).text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations urgentes */}
      {portfolio.recommendations && portfolio.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>⚡ Actions Recommandées</h3>
          <div className="recommendations-list">
            {portfolio.recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.type}`}>
                <div className="rec-priority">{rec.priority.toUpperCase()}</div>
                <p className="rec-message">{rec.message}</p>
                {rec.assets && (
                  <div className="rec-assets">
                    Actifs concernés : {rec.assets.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des actifs */}
      <div className="assets-section">
        <h3>📊 Vos Actifs ({portfolio.assets.length})</h3>
        <div className="assets-grid">
          {portfolio.assets.map((asset, index) => (
            <div 
              key={index} 
              className="asset-card"
              onClick={() => onSelectAsset(asset)}
            >
              <div className="asset-header">
                <div className="asset-info">
                  <h4>{asset.name}</h4>
                  <span className="asset-type">{asset.type}</span>
                </div>
                <div className={`asset-score ${getScoreColor(asset.analysis.auraScore)}`}>
                  {asset.analysis.auraScore}
                </div>
              </div>
              
              <div className="asset-value">
                <span className="value-label">Valeur</span>
                <span className="value-amount">${asset.value.toLocaleString()}</span>
              </div>

              <div className="asset-performance">
                <div className="perf-item">
                  <span className="perf-label">24h</span>
                  <span className={`perf-value ${asset.performance24h >= 0 ? 'positive' : 'negative'}`}>
                    {asset.performance24h > 0 ? '+' : ''}{asset.performance24h}%
                  </span>
                </div>
                <div className="perf-item">
                  <span className="perf-label">7j</span>
                  <span className={`perf-value ${asset.performance7d >= 0 ? 'positive' : 'negative'}`}>
                    {asset.performance7d > 0 ? '+' : ''}{asset.performance7d}%
                  </span>
                </div>
              </div>

              <div className="asset-scores">
                <div className="score-bar">
                  <span className="score-bar-label">Performance</span>
                  <div className="score-bar-track">
                    <div 
                      className="score-bar-fill performance"
                      style={{ width: `${(asset.analysis.performanceScore / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-bar">
                  <span className="score-bar-label">Sécurité</span>
                  <div className="score-bar-track">
                    <div 
                      className="score-bar-fill security"
                      style={{ width: `${(asset.analysis.securityScore / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {asset.analysis.recommendations && asset.analysis.recommendations.length > 0 && (
                <div className={`asset-alert ${asset.analysis.recommendations[0].type}`}>
                  {asset.analysis.recommendations[0].message.substring(0, 60)}...
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
