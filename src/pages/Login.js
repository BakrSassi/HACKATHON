import React, { useState } from 'react';
import { login, completeLogin } from '../services/authService';
import { verifyTwoFactorCode } from '../services/twoFactorService';
import { findUserById } from '../services/databaseService';
import TwoFactorVerification from '../components/TwoFactorVerification';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simuler un délai réseau
    setTimeout(async () => {
      const result = await login(username, password);
      
      console.log('📥 Réponse login complète:', result);
      
      if (result.requiresTwoFactor) {
        // 2FA requis
        const twoFactorInfo = {
          email: result.email,
          username: result.username,
          userId: result.userId
        };
        
        console.log('✅ Configuration 2FA:', twoFactorInfo);
        
        setTwoFactorData(twoFactorInfo);
        setShowTwoFactor(true);
        setLoading(false);
      } else if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  const handleTwoFactorVerified = (result) => {
    // Vérification 2FA réussie - le backend a renvoyé le token et user
    if (result && result.token && result.user) {
      // Sauvegarder la session
      const session = {
        user: result.user,
        token: result.token,
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
      };
      
      localStorage.setItem('aura_session', JSON.stringify(session));
      localStorage.setItem('aura_token', result.token);
      
      onLoginSuccess(result.user);
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

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('Admin@2025');
    } else {
      setUsername('moderator');
      setPassword('Mod@2025');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">✨</span>
              <h1>AURA</h1>
            </div>
            <p className="login-subtitle">Panneau d'Administration</p>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Connexion...
                </>
              ) : (
                <>
                  <span>Connexion</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Accès Rapide (Démo)</span>
          </div>

          <div className="quick-login">
            <button 
              className="quick-login-btn admin"
              onClick={() => handleQuickLogin('admin')}
            >
              <span className="quick-icon">👑</span>
              <div className="quick-info">
                <strong>Super Admin</strong>
                <small>Tous les droits</small>
              </div>
            </button>
            <button 
              className="quick-login-btn moderator"
              onClick={() => handleQuickLogin('moderator')}
            >
              <span className="quick-icon">🛡️</span>
              <div className="quick-info">
                <strong>Modérateur</strong>
                <small>Droits limités</small>
              </div>
            </button>
          </div>

          <div className="login-footer">
            <p className="footer-note">
              🔒 Connexion sécurisée | Session de 8 heures
            </p>
            <p className="footer-demo">
              <strong>Démo :</strong> admin / Admin@2025 ou moderator / Mod@2025
            </p>
          </div>
        </div>

        <div className="login-info">
          <h2>🛡️ Panneau d'Administration AURA</h2>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">👥</span>
              <div>
                <h3>Gestion des Utilisateurs</h3>
                <p>Contrôlez les comptes et les droits d'accès</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Statistiques Globales</h3>
                <p>Visualisez les métriques en temps réel</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🔗</span>
              <div>
                <h3>Smart Contracts</h3>
                <p>Gérez les intégrations blockchain</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🤖</span>
              <div>
                <h3>Surveillance IA</h3>
                <p>Monitorez la performance des modèles</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🌐</span>
              <div>
                <h3>Communauté</h3>
                <p>Modérez et gérez le contenu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de vérification 2FA */}
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

export default Login;
