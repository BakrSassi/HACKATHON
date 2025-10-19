import React, { useState, useEffect } from 'react';
import './TwoFactorVerification.css';
import { verifyTwoFactorCode, resendTwoFactorCode, getCodeExpirationTime } from '../services/twoFactorService';

function TwoFactorVerification({ email, username, userId, onVerified, onCancel }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes par défaut
  const [canResend, setCanResend] = useState(false);

  // 🔴 DEBUG: Vérifier les props reçues
  useEffect(() => {
    console.log('🔴 TwoFactorVerification - Props reçues:', {
      email,
      username,
      userId,
      typeOfUserId: typeof userId
    });
    
    if (!userId) {
      console.error('❌ PROBLÈME: userId est', userId);
    }
  }, [email, username, userId]);

  // Mettre à jour le timer - Compte à rebours simple de 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setError('Code expiré. Veuillez demander un nouveau code.');
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-focus sur le premier input
  useEffect(() => {
    document.getElementById('code-0')?.focus();
  }, []);

  const handleInputChange = (index, value) => {
    // Accepter seulement les chiffres
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus sur le prochain input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }

    // Vérifier automatiquement quand tous les champs sont remplis
    if (newCode.every(digit => digit) && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Retour arrière
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);

    // Vérifier automatiquement si le code complet est collé
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify) => {
    setLoading(true);
    setError('');

    const codeValue = codeToVerify || code.join('');
    
    // Debug: vérifier les valeurs
    console.log('🔍 Vérification 2FA:', {
      userId,
      code: codeValue,
      email,
      username
    });

    if (!userId) {
      setError('Erreur: userId manquant. Veuillez vous reconnecter.');
      setLoading(false);
      return;
    }

    if (!codeValue || codeValue.length !== 6) {
      setError('Veuillez entrer un code à 6 chiffres.');
      setLoading(false);
      return;
    }

    // ⚡ Utiliser userId au lieu de email
    const result = await verifyTwoFactorCode(userId, codeValue);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        // Passer les données du backend (token, user)
        onVerified(result);
      }, 1000);
    } else {
      setError(result.error);
      if (result.remainingAttempts === 0) {
        setCanResend(true);
      }
    }

    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setCode(['', '', '', '', '', '']);

    const result = await resendTwoFactorCode(email, username);

    if (result.success) {
      setTimeRemaining(result.expiresIn);
      setCanResend(false);
      setError('');
      document.getElementById('code-0')?.focus();
    } else {
      setError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    }

    setLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="twofa-overlay">
      <div className="twofa-modal">
        <div className="twofa-header">
          <h2>🔐 Vérification en deux étapes</h2>
          <button className="twofa-close" onClick={onCancel}>✕</button>
        </div>

        <div className="twofa-content">
          {success ? (
            <div className="twofa-success">
              <div className="success-icon">✓</div>
              <h3>Vérification réussie!</h3>
              <p>Vous allez être redirigé...</p>
            </div>
          ) : (
            <>
              <div className="twofa-info">
                <p>Un code de vérification à 6 chiffres a été envoyé à:</p>
                <strong>{email}</strong>
                <p className="twofa-timer">
                  ⏱️ Expire dans: <span className={timeRemaining < 60 ? 'warning' : ''}>{formatTime(timeRemaining)}</span>
                </p>
              </div>

              <div className="twofa-code-inputs">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={error ? 'error' : success ? 'success' : ''}
                    disabled={loading || success}
                  />
                ))}
              </div>

              {error && (
                <div className="twofa-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="twofa-actions">
                <button
                  className="twofa-verify-btn"
                  onClick={() => handleVerify()}
                  disabled={code.some(d => !d) || loading || success}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> Vérification...
                    </>
                  ) : (
                    '✓ Vérifier le code'
                  )}
                </button>

                <button
                  className="twofa-resend-btn"
                  onClick={handleResend}
                  disabled={!canResend && timeRemaining > 0 || loading}
                >
                  📧 Renvoyer le code
                </button>
              </div>

              <div className="twofa-footer">
                <p>💡 Astuce: Vous pouvez coller le code complet</p>
                <p>Le code est visible dans la console (F12) pour la démo</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TwoFactorVerification;
