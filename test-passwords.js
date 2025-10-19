/**
 * 🔐 Script de test de mot de passe
 * Vérifie si les mots de passe correspondent aux hash
 */

const bcrypt = require('bcryptjs');

// Mots de passe en clair
const passwords = {
  bakr_sassi: 'pass',
  john_doe: 'user123',
  jane_smith: 'user456',
  admin: 'admin'
};

// Hash actuels dans la base de données
const hashes = {
  bakr_sassi: '$2b$10$RDuLt8bkHojSh',
  john_doe: '$2b$10$wJ2XnMaAAMMA2',
  jane_smith: '$2b$10$KwnkW5v.0nvnj',
  admin: '$2b$10$Yh6D6fN/6Jffc'
};

console.log('\n🔐 TEST DES MOTS DE PASSE\n');
console.log('='.repeat(60));

// Note: Les hash affichés sont tronqués. On va tester avec bcrypt.hash
async function testPasswords() {
  for (const [username, password] of Object.entries(passwords)) {
    console.log(`\n👤 ${username}:`);
    console.log(`   Password: "${password}"`);
    
    // Générer un nouveau hash
    const newHash = await bcrypt.hash(password, 10);
    console.log(`   Hash généré: ${newHash}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Nouveaux hash générés ci-dessus\n');
}

testPasswords();
