/**
 * 📧 Email Service pour l'envoi d'emails (2FA, notifications, etc.)
 * Utilise Nodemailer pour l'envoi réel d'emails
 */

const nodemailer = require('nodemailer');

// ================================================
// 🔧 CONFIGURATION EMAIL
// ================================================

/**
 * Créer un transporteur email selon la configuration
 */
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';

  if (emailProvider === 'gmail') {
    // Configuration Gmail
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App Password de Gmail
      }
    });
  } else if (emailProvider === 'outlook') {
    // Configuration Outlook/Hotmail
    return nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else if (emailProvider === 'smtp') {
    // Configuration SMTP personnalisée
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true pour port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else if (emailProvider === 'sendgrid') {
    // Configuration SendGrid
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    throw new Error(`Provider email non supporté: ${emailProvider}`);
  }
};

// ================================================
// 📧 TEMPLATES EMAIL
// ================================================

/**
 * Template HTML pour code 2FA
 */
const getTwoFactorEmailTemplate = (username, code) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de vérification AURA</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .message {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .code-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: 8px;
            color: white;
            margin: 0;
            font-family: 'Courier New', monospace;
        }
        .code-label {
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            margin-top: 10px;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-title {
            font-weight: 600;
            color: #856404;
            margin: 0 0 5px;
        }
        .warning-text {
            color: #856404;
            margin: 0;
            font-size: 14px;
        }
        .info-box {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .info-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            color: #666;
        }
        .info-icon {
            font-size: 20px;
            margin-right: 10px;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .footer-links {
            margin: 15px 0;
        }
        .footer-link {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
        }
        .social-icons {
            margin: 20px 0;
        }
        .social-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            margin: 0 5px;
            background: #667eea;
            border-radius: 50%;
            line-height: 40px;
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 AURA CryptoShield</h1>
            <p>Sécurité & Intelligence Artificielle</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Bonjour <strong>${username}</strong>,
            </div>
            
            <div class="message">
                Vous avez demandé un code de vérification à deux facteurs pour accéder à votre compte AURA.
                Utilisez le code ci-dessous pour compléter votre connexion :
            </div>
            
            <div class="code-container">
                <div class="code">${code}</div>
                <div class="code-label">Votre code de vérification</div>
            </div>
            
            <div class="info-box">
                <div class="info-item">
                    <span class="info-icon">⏱️</span>
                    <span>Ce code est valide pendant <strong>5 minutes</strong></span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🔢</span>
                    <span>Vous avez <strong>3 tentatives</strong> pour entrer le code correct</span>
                </div>
                <div class="info-item">
                    <span class="info-icon">🔒</span>
                    <span>Ne partagez jamais ce code avec qui que ce soit</span>
                </div>
            </div>
            
            <div class="warning">
                <div class="warning-title">⚠️ Vous n'avez pas demandé ce code ?</div>
                <div class="warning-text">
                    Si vous n'avez pas initié cette connexion, ignorez cet email et assurez-vous que votre compte est sécurisé.
                    Nous vous recommandons de changer votre mot de passe immédiatement.
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>AURA CryptoShield</strong> - Votre assistant crypto intelligent</p>
            <div class="footer-links">
                <a href="#" class="footer-link">Centre d'aide</a>
                <a href="#" class="footer-link">Politique de confidentialité</a>
                <a href="#" class="footer-link">Conditions d'utilisation</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br>
                © 2025 AURA CryptoShield. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Template texte simple pour code 2FA (fallback)
 */
const getTwoFactorEmailText = (username, code) => {
  return `
Bonjour ${username},

Vous avez demandé un code de vérification à deux facteurs pour accéder à votre compte AURA.

Votre code de vérification est: ${code}

Ce code est valide pendant 5 minutes.
Vous avez 3 tentatives pour entrer le code correct.

Si vous n'avez pas demandé ce code, ignorez cet email.

Cordialement,
L'équipe AURA CryptoShield

---
Cet email a été envoyé automatiquement, merci de ne pas y répondre.
© 2025 AURA CryptoShield. Tous droits réservés.
  `;
};

// ================================================
// 📨 FONCTIONS D'ENVOI
// ================================================

/**
 * Envoyer un email de code 2FA
 * @param {string} email - Email du destinataire
 * @param {string} code - Code 2FA à 6 chiffres
 * @param {string} username - Nom d'utilisateur
 * @returns {Promise<Object>} Résultat de l'envoi
 */
const sendTwoFactorEmail = async (email, code, username) => {
  try {
    // Vérifier la configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️  Configuration email manquante - Mode simulation activé');
      return simulateTwoFactorEmail(email, code, username);
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || 'AURA CryptoShield',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Code de vérification AURA - Ne pas partager',
      text: getTwoFactorEmailText(username, code),
      html: getTwoFactorEmailTemplate(username, code)
    };

    // Tester la connexion avant d'envoyer
    await transporter.verify();
    
    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email 2FA envoyé à ${email} (ID: ${info.messageId})`);
    
    return {
      success: true,
      messageId: info.messageId,
      email: email,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Erreur envoi email 2FA:', error.message);
    
    // En cas d'erreur, basculer en mode simulation
    console.warn('⚠️  Basculement en mode simulation');
    return simulateTwoFactorEmail(email, code, username);
  }
};

/**
 * Simuler l'envoi d'un email 2FA (mode développement)
 */
const simulateTwoFactorEmail = (email, code, username) => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║           📧 EMAIL 2FA SIMULÉ (MODE DEV)                  ║`);
  console.log(`╠════════════════════════════════════════════════════════════╣`);
  console.log(`║  To: ${email.padEnd(54)}║`);
  console.log(`║  User: ${username.padEnd(52)}║`);
  console.log(`║  Code: ${code.padEnd(52)}║`);
  console.log(`║  Status: Mode simulation - Email non envoyé               ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);

  return {
    success: true,
    simulated: true,
    email: email,
    code: code,
    message: 'Mode simulation - Vérifiez la console du serveur pour le code',
    timestamp: new Date().toISOString()
  };
};

/**
 * Tester la configuration email
 */
const testEmailConfiguration = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return {
        success: false,
        error: 'Configuration email manquante dans .env',
        details: {
          EMAIL_USER: !!process.env.EMAIL_USER,
          EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
          EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'gmail (défaut)'
        }
      };
    }

    const transporter = createTransporter();
    await transporter.verify();

    return {
      success: true,
      message: 'Configuration email valide',
      provider: process.env.EMAIL_PROVIDER || 'gmail',
      user: process.env.EMAIL_USER
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      hint: 'Vérifiez vos identifiants email et la configuration du provider'
    };
  }
};

// ================================================
// 📧 AUTRES TYPES D'EMAILS (extensibilité future)
// ================================================

/**
 * Envoyer un email de bienvenue
 */
const sendWelcomeEmail = async (email, username) => {
  // TODO: Implémenter template de bienvenue
  console.log(`📧 Email de bienvenue à envoyer à ${username} (${email})`);
};

/**
 * Envoyer un email de réinitialisation de mot de passe
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  // TODO: Implémenter template de reset password
  console.log(`📧 Email de réinitialisation à envoyer à ${email}`);
};

/**
 * Envoyer une alerte de sécurité
 */
const sendSecurityAlertEmail = async (email, alertType, details) => {
  // TODO: Implémenter template d'alerte sécurité
  console.log(`🚨 Alerte de sécurité ${alertType} à envoyer à ${email}`);
};

// ================================================
// 📤 EXPORTS
// ================================================

module.exports = {
  sendTwoFactorEmail,
  simulateTwoFactorEmail,
  testEmailConfiguration,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail
};
