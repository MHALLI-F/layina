const { User } = require('./models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Synchroniser les modèles
    await sequelize.sync();
    console.log('✅ Modèles synchronisés');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({
      where: { email: 'mhalli.it@gmail.com' }
    });

    if (existingAdmin) {
      console.log('✅ L\'utilisateur admin existe déjà');
      console.log('Email:', existingAdmin.email);
      console.log('Rôle:', existingAdmin.role);
      return;
    }

    // Créer l'utilisateur admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Boutique',
      email: 'mhalli.it@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('✅ Utilisateur admin créé avec succès');
    console.log('Email:', admin.email);
    console.log('Mot de passe: admin123');
    console.log('Rôle:', admin.role);

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
  } finally {
    await sequelize.close();
  }
}

createAdmin(); 