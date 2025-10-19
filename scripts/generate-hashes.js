/**
 * 🔐 Script de Génération de Hash bcrypt
 * Génère les bons hashs pour les mots de passe
 */

const bcrypt = require('bcryptjs');

async function generatePasswordHashes() {
  console.log('\n🔐 Génération des hashs bcrypt...\n');

  const users = [
    { username: 'bakr_sassi', password: 'pass' },
    { username: 'john_doe', password: 'user123' },
    { username: 'jane_smith', password: 'user456' },
    { username: 'admin', password: 'admin' }
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`✅ ${user.username}:`);
    console.log(`   Password: "${user.password}"`);
    console.log(`   Hash: ${hash}\n`);
  }

  console.log('📋 Commandes SQL pour mettre à jour:\n');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE users SET password = '${hash}' WHERE username = '${user.username}';`);
  }
}

generatePasswordHashes();
