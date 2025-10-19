/**
 * 🔐 Script de vérification des mots de passe
 * Teste si les hash de la DB correspondent aux mots de passe
 */

const bcrypt = require('bcryptjs');

// Hash actuels COMPLETS de la base de données
const users = [
  {
    username: 'bakr_sassi',
    password: 'pass',
    hash: '$2b$10$RDuLt8bkHojShTim5nepP.MN6lIjcOcEoIa0Rn6JYWoIUy1d7Qtf6'
  },
  {
    username: 'john_doe',
    password: 'user123',
    hash: '$2b$10$wJ2XnMaAAMMA2yWdadNRnOZ754B7O193y5EEZNks1czIztx9bY66C'
  },
  {
    username: 'jane_smith',
    password: 'user456',
    hash: '$2b$10$KwnkW5v.0nvnjVSRFQCHhuCY/gDpMIQUgg2X4T3iOeQ9xFTXQJ17S'
  },
  {
    username: 'admin',
    password: 'admin',
    hash: '$2b$10$Yh6D6fN/6JffcD2tH.X3zun6NU5VFfl9ZxYKyAlymqFqVt5UXnemG'
  }
];

console.log('\n🔐 VÉRIFICATION DES MOTS DE PASSE\n');
console.log('='.repeat(70));

async function verifyPasswords() {
  for (const user of users) {
    console.log(`\n👤 ${user.username}:`);
    console.log(`   Password: "${user.password}"`);
    console.log(`   Hash DB:  ${user.hash.substring(0, 30)}...`);
    
    // Vérifier si le mot de passe correspond au hash
    const isMatch = await bcrypt.compare(user.password, user.hash);
    
    if (isMatch) {
      console.log(`   ✅ MATCH - Le mot de passe est correct`);
    } else {
      console.log(`   ❌ NO MATCH - Le mot de passe ne correspond PAS au hash`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Résumé:\n');
  
  let allMatch = true;
  for (const user of users) {
    const isMatch = await bcrypt.compare(user.password, user.hash);
    if (!isMatch) allMatch = false;
    console.log(`   ${isMatch ? '✅' : '❌'} ${user.username} / ${user.password}`);
  }
  
  if (allMatch) {
    console.log('\n✅ TOUS LES MOTS DE PASSE SONT CORRECTS!\n');
  } else {
    console.log('\n❌ CERTAINS MOTS DE PASSE NE CORRESPONDENT PAS!\n');
  }
}

verifyPasswords().catch(console.error);
