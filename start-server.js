/**
 * 🚀 Script simple pour démarrer le serveur
 */

require('./server/server.js');

console.log('\n💡 Serveur démarré. Appuyez sur Ctrl+C pour arrêter.\n');

// Garder le processus actif
process.on('SIGINT', () => {
  console.log('\n\n👋 Arrêt du serveur...\n');
  process.exit(0);
});
