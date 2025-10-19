/**
 * 📧 Script de test pour la configuration email 2FA
 */

const { sendTwoFactorEmail, testEmailConfiguration } = require('./server/emailService');
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`)
};

async function testEmailSetup() {
  console.log('\n' + '='.repeat(60));
  console.log('📧 TEST DE CONFIGURATION EMAIL 2FA - AURA');
  console.log('='.repeat(60) + '\n');

  // Test 1: Vérifier les variables d'environnement
  log.test('Test 1: Vérification des variables d\'environnement');
  console.log('─'.repeat(60));
  
  const envVars = {
    'EMAIL_PROVIDER': process.env.EMAIL_PROVIDER || 'gmail (défaut)',
    'EMAIL_USER': process.env.EMAIL_USER || '❌ MANQUANT',
    'EMAIL_PASSWORD': process.env.EMAIL_PASSWORD ? '✅ Configuré (masqué)' : '❌ MANQUANT',
    'EMAIL_FROM_NAME': process.env.EMAIL_FROM_NAME || 'AURA CryptoShield (défaut)'
  };

  let allConfigured = true;
  Object.entries(envVars).forEach(([key, value]) => {
    const status = value.includes('❌') ? colors.red : colors.green;
    console.log(`  ${key}: ${status}${value}${colors.reset}`);
    if (value.includes('❌')) allConfigured = false;
  });

  if (!allConfigured) {
    log.warning('Configuration incomplète - Mode simulation activé');
    log.info('Consultez EMAIL_2FA_SETUP_GUIDE.md pour la configuration');
  } else {
    log.success('Configuration complète détectée');
  }
  console.log();

  // Test 2: Test de connexion au serveur email
  log.test('Test 2: Test de connexion au serveur email');
  console.log('─'.repeat(60));
  
  try {
    const result = await testEmailConfiguration();
    
    if (result.success) {
      log.success('Connexion au serveur email réussie!');
      console.log(`  Provider: ${colors.cyan}${result.provider}${colors.reset}`);
      console.log(`  Email: ${colors.cyan}${result.user}${colors.reset}`);
    } else {
      log.error('Échec de connexion au serveur email');
      console.log(`  Erreur: ${result.error}`);
      if (result.hint) {
        log.info(result.hint);
      }
    }
  } catch (error) {
    log.error(`Erreur inattendue: ${error.message}`);
  }
  console.log();

  // Test 3: Envoi d'un email de test
  log.test('Test 3: Envoi d\'un email de test');
  console.log('─'.repeat(60));

  const testEmail = process.env.EMAIL_USER || 'test@example.com';
  const testCode = '123456';
  const testUsername = 'Test User';

  try {
    log.info(`Envoi d'un email de test à: ${testEmail}`);
    const result = await sendTwoFactorEmail(testEmail, testCode, testUsername);

    if (result.success && !result.simulated) {
      log.success('Email envoyé avec succès!');
      console.log(`  Destinataire: ${colors.cyan}${result.email}${colors.reset}`);
      console.log(`  Message ID: ${colors.cyan}${result.messageId}${colors.reset}`);
      console.log(`  Timestamp: ${colors.cyan}${result.timestamp}${colors.reset}`);
      log.info('Vérifiez votre boîte email (et les spams)');
    } else if (result.simulated) {
      log.warning('Mode simulation - Email non envoyé réellement');
      console.log(`  Le code aurait été: ${colors.yellow}${testCode}${colors.reset}`);
      log.info('Configurez EMAIL_USER et EMAIL_PASSWORD dans .env');
    } else {
      log.error('Échec de l\'envoi de l\'email');
    }
  } catch (error) {
    log.error(`Erreur lors de l'envoi: ${error.message}`);
  }
  console.log();

  // Résumé final
  console.log('='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  
  if (allConfigured) {
    log.success('Configuration email opérationnelle');
    log.info('Les emails 2FA seront envoyés réellement');
    console.log('\n🎯 Actions suggérées:');
    console.log('  1. Vérifiez votre boîte email');
    console.log('  2. Testez une vraie connexion 2FA');
    console.log('  3. Ajoutez l\'expéditeur à vos contacts');
  } else {
    log.warning('Configuration email manquante');
    log.info('Le système utilisera le mode simulation');
    console.log('\n🎯 Pour activer l\'envoi réel d\'emails:');
    console.log('  1. Consultez: EMAIL_2FA_SETUP_GUIDE.md');
    console.log('  2. Configurez EMAIL_USER et EMAIL_PASSWORD dans .env');
    console.log('  3. Relancez ce test');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Exécuter les tests
testEmailSetup().catch(error => {
  log.error(`Erreur fatale: ${error.message}`);
  process.exit(1);
});
