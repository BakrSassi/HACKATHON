/**
 * 🧪 Test complet du flux de connexion 2FA
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testLogin2FA() {
  console.log('\n🔐 TEST CONNEXION 2FA - BAKR_SASSI\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Login avec bakr_sassi
    console.log('\n📝 Étape 1: Login avec bakr_sassi / pass');
    
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      username: 'bakr_sassi',
      password: 'pass'
    });

    console.log('✅ Réponse reçue:');
    console.log(JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.requiresTwoFactor) {
      console.log('\n✅ 2FA requis (normal)');
      console.log(`📧 Email devrait être envoyé à: ${loginResponse.data.email}`);
      console.log(`👤 User ID: ${loginResponse.data.userId}`);
      console.log(`📨 Message: ${loginResponse.data.message}`);
      
      console.log('\n🔍 Vérifiez votre email: bakrtn9@gmail.com');
      console.log('📧 Cherchez un email de: noreply.aura.tn@gmail.com');
      console.log('⏱️  Le code expire dans 5 minutes');
      
    } else if (loginResponse.data.success) {
      console.log('\n✅ Connexion directe réussie (pas de 2FA?)');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors du test:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('❌ Pas de réponse du serveur');
      console.error('💡 Vérifiez que le serveur est démarré: node server/server.js');
    } else {
      console.error('Error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// Vérifier que le serveur est accessible
async function checkServer() {
  try {
    const response = await axios.get(`${API_URL}/`);
    console.log('✅ Serveur accessible');
    return true;
  } catch (error) {
    console.error('❌ Serveur non accessible');
    console.error('💡 Démarrez le serveur: node server/server.js');
    return false;
  }
}

async function main() {
  console.log('\n🚀 Vérification du serveur...');
  const serverOk = await checkServer();
  
  if (serverOk) {
    await testLogin2FA();
  }
}

main().catch(console.error);
