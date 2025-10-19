import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    try {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      
      const globalStats = authService.getGlobalStats();
      setStats(globalStats);
      
      const allUsers = authService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du dashboard:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    if (onLogout) onLogout();
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(permission);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">AURA Admin</span>
          </div>
          <div className="user-info">
            <div className="user-avatar">{currentUser?.username?.[0].toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{currentUser?.username}</div>
              <div className="user-role">{currentUser?.role}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Vue d'ensemble</span>
          </button>

          {hasPermission('manage_users') && (
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Utilisateurs</span>
            </button>
          )}

          {hasPermission('monitor_security') && (
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🔐</span>
              <span className="nav-label">Sécurité</span>
            </button>
          )}

          {hasPermission('manage_contracts') && (
            <button
              className={`nav-item ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contracts')}
            >
              <span className="nav-icon">📜</span>
              <span className="nav-label">Smart Contracts</span>
            </button>
          )}

          {hasPermission('view_analytics') && (
            <button
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">Statistiques</span>
            </button>
          )}

          {hasPermission('monitor_ai') && (
            <button
              className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <span className="nav-icon">🤖</span>
              <span className="nav-label">IA & Modèles</span>
            </button>
          )}

          {hasPermission('moderate_community') && (
            <button
              className={`nav-item ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              <span className="nav-icon">🌐</span>
              <span className="nav-label">Communauté</span>
            </button>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="content-header">
          <h1>{getTabTitle(activeTab)}</h1>
          <div className="header-actions">
            <button className="action-btn notification-btn">
              <span>🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <button className="action-btn settings-btn">
              <span>⚙️</span>
            </button>
          </div>
        </header>

        <div className="content-body">
          {activeTab === 'overview' && <OverviewTab stats={stats} users={users} />}
          {activeTab === 'users' && <UsersTab users={users} onRefresh={initializeDashboard} />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'contracts' && <ContractsTab />}
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
          {activeTab === 'ai' && <AITab />}
          {activeTab === 'community' && <CommunityTab />}
        </div>
      </main>
    </div>
  );
};

// Helper function for tab titles
const getTabTitle = (tab) => {
  const titles = {
    overview: 'Vue d\'ensemble',
    users: 'Gestion des utilisateurs',
    security: 'Supervision de la sécurité',
    contracts: 'Smart Contracts',
    analytics: 'Statistiques globales',
    ai: 'Surveillance de l\'IA',
    community: 'Modération communauté'
  };
  return titles[tab] || 'Dashboard';
};

// Overview Tab Component
const OverviewTab = ({ stats, users }) => {
  return (
    <div className="overview-tab">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers || 0}</div>
            <div className="stat-label">Utilisateurs totaux</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeUsers || 0}</div>
            <div className="stat-label">Utilisateurs actifs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${stats.portfolioValue?.toLocaleString() || 0}</div>
            <div className="stat-label">Valeur portefeuille</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <div className="stat-value">{stats.avgAuraScore || 0}/100</div>
            <div className="stat-label">Score AURA moyen</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🔔 Activité récente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">🔐</span>
              <div className="activity-details">
                <div className="activity-title">Connexion administrateur</div>
                <div className="activity-time">Il y a 2 minutes</div>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">👤</span>
              <div className="activity-details">
                <div className="activity-title">Nouvel utilisateur: {users[0]?.username}</div>
                <div className="activity-time">Il y a 15 minutes</div>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🔍</span>
              <div className="activity-details">
                <div className="activity-title">Scan de sécurité terminé</div>
                <div className="activity-time">Il y a 1 heure</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>⚠️ Alertes système</h3>
          <div className="alerts-list">
            <div className="alert-item warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-title">Activité suspecte détectée</div>
                <div className="alert-message">3 tentatives de connexion échouées</div>
              </div>
            </div>
            <div className="alert-item info">
              <span className="alert-icon">ℹ️</span>
              <div className="alert-content">
                <div className="alert-title">Mise à jour disponible</div>
                <div className="alert-message">Version 2.1.0 prête à installer</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>⚡ Actions rapides</h3>
        <div className="actions-grid">
          <button className="quick-action-btn">
            <span className="action-icon">🔍</span>
            <span>Lancer un scan</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">📊</span>
            <span>Générer rapport</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">👥</span>
            <span>Ajouter utilisateur</span>
          </button>
          <button className="quick-action-btn">
            <span className="action-icon">⚙️</span>
            <span>Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component (Placeholder - will be detailed in next file)
const UsersTab = ({ users, onRefresh }) => {
  return (
    <div className="users-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">👥</span>
        <h2>Module de gestion des utilisateurs</h2>
        <p>Gérez les comptes utilisateurs, leurs droits d'accès et leurs activités.</p>
        <p className="user-count">Total: {users.length} utilisateurs</p>
      </div>
    </div>
  );
};

// Security Tab Component (Placeholder)
const SecurityTab = () => {
  return (
    <div className="security-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">🔐</span>
        <h2>Supervision de la sécurité</h2>
        <p>Surveillez l'état général du système et les menaces potentielles.</p>
      </div>
    </div>
  );
};

// Contracts Tab Component (Placeholder)
const ContractsTab = () => {
  return (
    <div className="contracts-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">📜</span>
        <h2>Gestion des Smart Contracts</h2>
        <p>Contrôlez et gérez les smart contracts et les intégrations externes.</p>
      </div>
    </div>
  );
};

// Analytics Tab Component (Placeholder)
const AnalyticsTab = ({ stats }) => {
  return (
    <div className="analytics-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">📈</span>
        <h2>Statistiques globales</h2>
        <p>Visualisez les statistiques détaillées et les logs de sécurité.</p>
      </div>
    </div>
  );
};

// AI Tab Component (Placeholder)
const AITab = () => {
  return (
    <div className="ai-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">🤖</span>
        <h2>Surveillance de l'IA</h2>
        <p>Surveillez la performance de l'IA et ajustez les modèles si nécessaire.</p>
      </div>
    </div>
  );
};

// Community Tab Component (Placeholder)
const CommunityTab = () => {
  return (
    <div className="community-tab">
      <div className="tab-placeholder">
        <span className="placeholder-icon">🌐</span>
        <h2>Modération de la communauté</h2>
        <p>Publiez ou retirez des informations dans le mode Communauté sécurisée.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
