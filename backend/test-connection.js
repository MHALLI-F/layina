const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion à PostgreSQL réussie');
    
    // Synchronisation des modèles
    await sequelize.sync({ force: false });
    console.log('✅ Modèles synchronisés');
    
    // Créer l'administrateur
    console.log('🔧 Création du compte administrateur...');
    
    const existingAdmin = await User.findOne({ 
      where: { email: 'mhalli.it@gmail.com' } 
    });
    
    if (existingAdmin) {
      console.log('✅ L\'administrateur existe déjà');
      console.log('📧 Email:', existingAdmin.email);
      console.log('🔑 Mot de passe: admin123');
      console.log('👤 Rôle:', existingAdmin.role);
    } else {
      // Créer le mot de passe hashé
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      // Créer l'administrateur
      const admin = await User.create({
        firstName: 'Fatima Zahra',
        lastName: "M'HALLI",
        email: 'mhalli.it@gmail.com',
        password: hashedPassword,
        role: 'admin',
        phone: '0675356045',
        isActive: true,
        emailVerified: true
      });
      
      console.log('✅ Administrateur créé avec succès !');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Mot de passe: admin123');
      console.log('🆔 ID:', admin.id);
    }
    
    console.log('🎉 Test terminé avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testConnection(); 