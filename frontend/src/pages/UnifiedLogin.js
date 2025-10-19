import React, { useState } from 'react';
import { login, completeLogin } from '../services/authService';
import { findUserById } from '../services/databaseService';
import TwoFactorVerification from '../components/TwoFactorVerification';
import './UnifiedLogin.css';

const UnifiedLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [loginType, setLoginType] = useState('user'); // 'user' ou 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      
      console.log('📥 UnifiedLogin - Réponse login:', result);
      
      if (result.requiresTwoFactor) {
        // 2FA requis
        const twoFactorInfo = {
          email: result.email,
          username: result.username,
          userId: result.userId
        };
        
        console.log('✅ UnifiedLogin - Configuration 2FA:', twoFactorInfo);
        
        setTwoFactorData(twoFactorInfo);
        setShowTwoFactor(true);
        setLoading(false);
      } else if (result.success) {
        // Vérifier le type de connexion
        if (loginType === 'admin') {
          // Connexion admin - autoriser super_admin, admin, moderator
          if (['super_admin', 'admin', 'moderator'].includes(result.user.role)) {
            onLoginSuccess(result.user);
          } else {
            setError('Accès admin refusé. Veuillez utiliser la connexion utilisateur.');
            setLoading(false);
          }
        } else {
          // Connexion user - autoriser role 'user'
          if (result.user.role === 'user') {
            onLoginSuccess(result.user);
          } else {
            setError('Veuillez utiliser la connexion admin pour ce compte.');
            setLoading(false);
          }
        }
      } else {
        setError(result.message || 'Identifiants incorrects');
        setLoading(false);
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleTwoFactorVerified = (result) => {
    // Vérification 2FA réussie
    if (result && result.token && result.user) {
      // Sauvegarder la session
      const session = {
        user: result.user,
        token: result.token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem('aura_session', JSON.stringify(session));
      localStorage.setItem('aura_token', result.token);
      
      // Vérifier le type de compte
      if (loginType === 'admin' && ['super_admin', 'admin', 'moderator'].includes(result.user.role)) {
        onLoginSuccess(result.user);
      } else if (loginType === 'user' && result.user.role === 'user') {
        onLoginSuccess(result.user);
      } else {
        setError('Type de connexion incorrect pour ce compte');
        setShowTwoFactor(false);
        setTwoFactorData(null);
      }
    } else {
      // Fallback mode local
      const user = findUserById(twoFactorData.userId);
      const loginResult = completeLogin(user);
      
      if (loginResult.success) {
        onLoginSuccess(loginResult.user);
      }
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setTwoFactorData(null);
    setLoading(false);
  };

  const handleQuickLogin = (userType, username, password) => {
    setLoginType(userType);
    setUsername(username);
    setPassword(password);
    
    setTimeout(() => {
      const submitBtn = document.querySelector('.login-button');
      if (submitBtn) submitBtn.click();
    }, 100);
  };

  // Infos selon le type de connexion
  const loginInfo = loginType === 'admin' ? {
    title: 'Espace Administrateur',
    subtitle: 'Accès au panneau d\'administration AURA',
    icon: '🔐',
    features: [
      { icon: '👥', title: 'Gestion Utilisateurs', desc: 'Contrôlez les comptes' },
      { icon: '📊', title: 'Statistiques Globales', desc: 'Métriques en temps réel' },
      { icon: '🔗', title: 'Smart Contracts', desc: 'Gestion blockchain' },
      { icon: '🤖', title: 'Surveillance IA', desc: 'Performance des modèles' }
    ],
    quickLogins: [
      { username: 'bakr_sassi', password: 'pass', name: 'Bakr Sassi', role: 'Super Admin', icon: '👨‍💻' },
      { username: 'admin', password: 'Admin@2025', name: 'Admin AURA', role: 'Administrateur', icon: '👨‍💼' }
    ]
  } : {
    title: 'Connexion Utilisateur',
    subtitle: 'Accédez à votre portefeuille sécurisé',
    icon: '✨',
    features: [
      { icon: '🧠', title: 'Intelligence Artificielle', desc: 'Recommandations personnalisées' },
      { icon: '🛡️', title: 'Sécurité Proactive', desc: 'Surveillance 24/7' },
      { icon: '⛓️', title: 'Blockchain de Confiance', desc: 'Historique immuable' },
      { icon: '💬', title: 'Assistant IA Personnel', desc: 'AURA Chat répond' }
    ],
    quickLogins: [
      { username: 'john_doe', password: 'user123', name: 'John Doe', role: 'Portfolio: $134,200', icon: '👨' },
      { username: 'jane_smith', password: 'user456', name: 'Jane Smith', role: 'Portfolio: $89,500', icon: '👩' }
    ]
  };

  return (
    <div className="unified-login-page">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="unified-login-container">
        {/* Carte de connexion */}
        <div className="login-card">
          {/* Toggle User/Admin */}
          <div className="login-type-toggle">
            <button 
              className={`toggle-btn ${loginType === 'user' ? 'active' : ''}`}
              onClick={() => setLoginType('user')}
            >
              <span className="toggle-icon">👤</span>
              <span>Utilisateur</span>
            </button>
            <button 
              className={`toggle-btn ${loginType === 'admin' ? 'active' : ''}`}
              onClick={() => setLoginType('admin')}
            >
              <span className="toggle-icon">🔐</span>
              <span>Admin</span>
            </button>
          </div>

          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">{loginInfo.icon}</span>
              <h1>AURA</h1>
            </div>
            <h2>{loginInfo.title}</h2>
            <p className="login-subtitle">{loginInfo.subtitle}</p>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>
                <span className="label-icon">👤</span>
                <span>Nom d'utilisateur</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>
                <span className="label-icon">🔒</span>
                <span>Mot de passe</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Accès Rapide (Démo)</span>
          </div>

          <div className="quick-login">
            {loginInfo.quickLogins.map((user, index) => (
              <button
                key={index}
                className={`quick-login-btn ${loginType}`}
                onClick={() => handleQuickLogin(loginType, user.username, user.password)}
              >
                <span className="quick-icon">{user.icon}</span>
                <div className="quick-info">
                  <strong>{user.name}</strong>
                  <small>{user.role}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="login-footer">
            <p className="footer-note">
              🔒 Connexion sécurisée | Session de 8 heures
            </p>
          </div>
        </div>

        {/* Panneau d'informations */}
        <div className="login-info">
          <h2>{loginInfo.icon} {loginInfo.title}</h2>
          <div className="info-features">
            {loginInfo.features.map((feature, index) => (
              <div key={index} className="info-feature">
                <span className="feature-icon">{feature.icon}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal 2FA */}
      {showTwoFactor && twoFactorData && (
        <TwoFactorVerification
          email={twoFactorData.email}
          username={twoFactorData.username}
          userId={twoFactorData.userId}
          onVerified={handleTwoFactorVerified}
          onCancel={handleTwoFactorCancel}
        />
      )}
    </div>
  );
};

export default UnifiedLogin;
