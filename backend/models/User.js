const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 15]
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'client'),
      defaultValue: 'user'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    preferences: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('preferences');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('preferences', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  // Méthodes d'instance
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generateToken = function() {
    return jwt.sign(
      { 
        userId: this.id, 
        email: this.email, 
        role: this.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  };

  User.prototype.toPublicJSON = function() {
    const user = this.toJSON();
    delete user.password;
    return user;
  };

  // Méthodes statiques
  User.createDefaultAdmin = async function() {
    try {
      const adminExists = await this.findOne({ where: { role: 'admin' } });
      if (!adminExists) {
        await this.create({
          firstName: 'Admin',
          lastName: 'Boutique',
          email: 'admin@boutique-voilee.com',
          password: 'admin123',
          role: 'admin',
          emailVerified: true
        });
        console.log('✅ Administrateur par défaut créé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'admin:', error);
    }
  };

  return User;
}; 