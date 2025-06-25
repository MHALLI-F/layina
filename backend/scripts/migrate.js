const { testConnection, syncDatabase } = require('../config/database');
require('dotenv').config();

async function runMigrations() {
  try {
    console.log('🔄 Début des migrations...');

    // Tester la connexion à PostgreSQL
    await testConnection();

    // Synchroniser les modèles avec la base de données (force = true pour recréer les tables)
    await syncDatabase(true);

    console.log('✅ Migrations terminées avec succès !');
    console.log('📋 Tables créées :');
    console.log('   - users');
    console.log('   - products');
    console.log('   - orders');

  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Exécuter les migrations
runMigrations(); 