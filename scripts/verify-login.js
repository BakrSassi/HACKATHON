/**
 * 🔍 Vérification des identifiants de connexion
 */

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyLogin(username, password) {
  let connection;
  
  try {
    console.log('\n🔐 VÉRIFICATION DES IDENTIFIANTS');
    console.log('================================\n');
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: ${password}\n`);

    // Connexion DB
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connexion DB OK\n');

    // Récupérer l'utilisateur
    const [users] = await connection.execute(
      'SELECT id, username, password, email, role, two_factor_enabled, status FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      console.log('❌ UTILISATEUR INTROUVABLE');
      console.log(`💡 Aucun utilisateur avec le username: "${username}"\n`);
      return;
    }

    const user = users[0];
    console.log('✅ UTILISATEUR TROUVÉ:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - 2FA: ${user.two_factor_enabled ? 'Activé' : 'Désactivé'}`);
    console.log(`   - Status: ${user.status}`);
    console.log(`   - Hash: ${user.password.substring(0, 20)}...\n`);

    // Vérifier le mot de passe
    console.log('🔍 Vérification du mot de passe...');
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      console.log('✅ MOT DE PASSE CORRECT!\n');
      
      if (user.status !== 'active') {
        console.log('⚠️  ATTENTION: Compte suspendu');
        console.log(`   Status: ${user.status}\n`);
        return;
      }

      if (user.two_factor_enabled) {
        console.log('🔐 2FA REQUIS pour cet utilisateur');
        console.log(`   Email 2FA: ${user.email}\n`);
      } else {
        console.log('✅ CONNEXION DIRECTE (pas de 2FA)\n');
      }
    } else {
      console.log('❌ MOT DE PASSE INCORRECT!\n');
      console.log('💡 Vérifiez:');
      console.log('   - Le mot de passe est-il bien: "' + password + '"?');
      console.log('   - Pas d\'espaces avant/après?');
      console.log('   - Majuscules/minuscules correctes?\n');
    }

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Lire les arguments de ligne de commande
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('\n📖 USAGE:');
  console.log('   node verify-login.js <username> <password>\n');
  console.log('📝 EXEMPLES:');
  console.log('   node verify-login.js bakr_sassi pass');
  console.log('   node verify-login.js john_doe user123');
  console.log('   node verify-login.js admin admin\n');
  process.exit(0);
}

const [username, password] = args;
verifyLogin(username, password);
