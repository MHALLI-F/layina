const { User } = require('./models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');

async function updateAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Trouver l'admin existant
    const admin = await User.findOne({
      where: { email: 'mhalli.it@gmail.com' }
    });

    if (!admin) {
      console.log('❌ Admin non trouvé');
      return;
    }

    console.log('✅ Admin trouvé:', { id: admin.id, email: admin.email, role: admin.role });

    // Mettre à jour le mot de passe
    const newHashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = newHashedPassword;
    await admin.save();

    console.log('✅ Mot de passe admin mis à jour avec succès');
    console.log('Email:', admin.email);
    console.log('Nouveau mot de passe: admin123');
    console.log('Rôle:', admin.role);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
  } finally {
    await sequelize.close();
  }
}

updateAdminPassword(); 