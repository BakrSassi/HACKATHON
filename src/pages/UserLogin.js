import React, { useState } from 'react';
import { login, completeLogin } from '../services/authService';
import { verifyTwoFactorCode } from '../services/twoFactorService';
import { findUserById } from '../services/databaseService';
import TwoFactorVerification from '../components/TwoFactorVerification';
import './UserLogin.css';

const UserLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      
      console.log('📥 UserLogin - Réponse login complète:', result);
      
      if (result.requiresTwoFactor) {
        // 2FA requis - afficher le modal de vérification
        const twoFactorInfo = {
          email: result.email,
          username: result.username,
          userId: result.userId
        };
        
        console.log('✅ UserLogin - Configuration 2FA:', twoFactorInfo);
        
        setTwoFactorData(twoFactorInfo);
        setShowTwoFactor(true);
        setLoading(false);
      } else if (result.success) {
        // Vérifier que c'est bien un utilisateur standard (pas admin)
        if (result.user.role === 'user') {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        } else {
          setError('Veuillez utiliser l\'espace admin pour vous connecter');
          setLoading(false);
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
      
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } else {
      // Fallback mode local
      const user = findUserById(twoFactorData.userId);
      const loginResult = completeLogin(user);
      
      if (loginResult.success && onLoginSuccess) {
        onLoginSuccess(loginResult.user);
      }
    }
  };

  const handleTwoFactorCancel = () => {
    setShowTwoFactor(false);
    setTwoFactorData(null);
    setLoading(false);
  };

  const handleQuickLogin = async (user) => {
    setUsername(user.username);
    setPassword(user.password);
    
    setTimeout(async () => {
      const result = await login(user.username, user.password);
      
      console.log('📥 QuickLogin - Réponse:', result);
      
      if (result.requiresTwoFactor) {
        const twoFactorInfo = {
          email: result.email,
          username: result.username,
          userId: result.userId
        };
        
        console.log('✅ QuickLogin - Configuration 2FA:', twoFactorInfo);
        
        setTwoFactorData(twoFactorInfo);
        setShowTwoFactor(true);
      } else if (result.success && onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    }, 300);
  };

  return (
    <div className="user-login-page">
      <div className="user-login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="user-login-container">
        {/* Formulaire de connexion */}
        <div className="user-login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">✨</span>
              <h1>AURA</h1>
            </div>
            <h2>{isSignUp ? 'Créer un compte' : 'Connexion'}</h2>
            <p className="login-subtitle">
              {isSignUp 
                ? 'Rejoignez la communauté AURA' 
                : 'Accédez à votre portefeuille sécurisé'}
            </p>
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
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

            {!isSignUp && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#forgot" className="forgot-link">Mot de passe oublié?</a>
              </div>
            )}

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
                  <span>{isSignUp ? 'S\'inscrire' : 'Se connecter'}</span>
                  <span className="button-icon">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>OU</span>
          </div>

          {/* Connexions rapides pour démo */}
          <div className="demo-section">
            <p className="demo-title">🎯 Comptes de démonstration</p>
            <div className="quick-login">
              <button
                type="button"
                className="quick-login-btn user"
                onClick={() => handleQuickLogin({ username: 'john_doe', password: 'user123' })}
              >
                <span className="quick-icon">👨</span>
                <div className="quick-info">
                  <strong>John Doe</strong>
                  <small>Portfolio: $134,200</small>
                </div>
              </button>

              <button
                type="button"
                className="quick-login-btn user"
                onClick={() => handleQuickLogin({ username: 'jane_smith', password: 'user456' })}
              >
                <span className="quick-icon">👩</span>
                <div className="quick-info">
                  <strong>Jane Smith</strong>
                  <small>Portfolio: $89,500</small>
                </div>
              </button>

              <button
                type="button"
                className="quick-login-btn user"
                onClick={() => handleQuickLogin({ username: 'mike_wilson', password: 'user789' })}
              >
                <span className="quick-icon">👨‍💼</span>
                <div className="quick-info">
                  <strong>Mike Wilson</strong>
                  <small>Portfolio: $256,800</small>
                </div>
              </button>
            </div>
          </div>

          <div className="login-footer">
            <p className="toggle-mode">
              {isSignUp ? 'Déjà un compte? ' : 'Nouveau sur AURA? '}
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Se connecter' : 'Créer un compte'}
              </button>
            </p>
          </div>
        </div>

        {/* Panneau d'informations */}
        <div className="user-login-info">
          <h2>🛡️ Votre Gardien Financier Intelligent</h2>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">🧠</span>
              <div>
                <h3>Intelligence Artificielle</h3>
                <p>SmartBrain analyse votre portefeuille et vous donne des recommandations personnalisées</p>
              </div>
            </div>

            <div className="info-feature">
              <span className="feature-icon">🛡️</span>
              <div>
                <h3>Sécurité Proactive</h3>
                <p>CyberGuardian surveille 24/7 vos investissements contre les menaces</p>
              </div>
            </div>

            <div className="info-feature">
              <span className="feature-icon">⛓️</span>
              <div>
                <h3>Blockchain de Confiance</h3>
                <p>TrustLedger enregistre toutes vos décisions de manière immuable</p>
              </div>
            </div>

            <div className="info-feature">
              <span className="feature-icon">💬</span>
              <div>
                <h3>Assistant IA Personnel</h3>
                <p>AURA Chat répond à toutes vos questions sur vos investissements</p>
              </div>
            </div>

            <div className="info-feature">
              <span className="feature-icon">📊</span>
              <div>
                <h3>Analyse en Temps Réel</h3>
                <p>Suivez vos performances et votre score AURA en direct</p>
              </div>
            </div>
          </div>

          <div className="info-stats">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Utilisateurs actifs</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">$2.5M+</span>
              <span className="stat-label">Actifs protégés</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Taux de satisfaction</span>
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

export default UserLogin;
