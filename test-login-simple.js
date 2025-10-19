/**
 * 🧪 Test autonome du login 2FA (sans démarrer le serveur)
 */

const http = require('http');

function testLogin() {
  const postData = JSON.stringify({
    username: 'bakr_sassi',
    password: 'pass'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('\n🔐 TEST LOGIN 2FA - BAKR_SASSI');
  console.log('================================\n');
  console.log('📝 Envoi de la requête à http://localhost:5000/api/auth/login\n');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`✅ Réponse reçue (Status: ${res.statusCode})\n`);
      
      try {
        const response = JSON.parse(data);
        console.log('📄 Données:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.requiresTwoFactor) {
          console.log('\n✅ 2FA requis (normal)');
          console.log(`📧 Email envoyé à: ${response.email}`);
          console.log(`\n💡 Vérifiez votre boîte mail: ${response.email}`);
          console.log('📧 Expéditeur: noreply.aura.tn@gmail.com');
          console.log('⏱️  Le code expire dans 5 minutes');
        }
      } catch (e) {
        console.error('❌ Erreur parsing JSON:', e.message);
        console.log('Raw data:', data);
      }
      
      console.log('\n================================\n');
    });
  });

  req.on('error', (error) => {
    console.error('\n❌ Erreur de connexion:', error.message);
    console.error('\n💡 Assurez-vous que le serveur est démarré:');
    console.error('   node server/server.js\n');
  });

  req.write(postData);
  req.end();
}

// Attendre un peu avant de lancer le test
setTimeout(testLogin, 1000);
