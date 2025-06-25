const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const { sequelize } = require('../config/database');

// Configuration Sequelize
const sequelizeConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
};

// Import des modèles
const User = require('./User')(sequelize, require('sequelize').DataTypes);
const Product = require('./Product')(sequelize, require('sequelize').DataTypes);
const Order = require('./Order')(sequelize, require('sequelize').DataTypes);

// Définition des associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export des modèles et de l'instance Sequelize
module.exports = {
  sequelize,
  User,
  Product,
  Order
}; 