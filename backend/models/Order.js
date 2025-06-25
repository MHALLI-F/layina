const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('items');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('items', JSON.stringify(value));
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    shippingCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('shippingAddress');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('shippingAddress', JSON.stringify(value));
      }
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('billingAddress');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('billingAddress', JSON.stringify(value));
      }
    },
    shippingMethod: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('shippingMethod');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('shippingMethod', JSON.stringify(value));
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statusHistory: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    emailSent: {
      type: DataTypes.JSON,
      defaultValue: {
        confirmation: false,
        shipping: false,
        delivery: false
      }
    },
    estimatedDelivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    hooks: {
      beforeCreate: (order) => {
        if (!order.orderNumber) {
          order.orderNumber = `BV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        }
      },
      beforeSave: (order) => {
        if (order.changed('items') || order.changed('shippingCost') || order.changed('discount')) {
          order.calculateTotal();
        }
      }
    }
  });

  // Méthodes d'instance
  Order.prototype.calculateTotal = function() {
    const subtotal = this.subtotal || 0;
    const shippingCost = this.shippingCost || 0;
    const discount = this.discount || 0;
    this.total = subtotal + shippingCost - discount;
  };

  Order.prototype.updateStatus = async function(newStatus, note = null) {
    this.status = newStatus;
    if (note) {
      this.adminNotes = this.adminNotes ? `${this.adminNotes}\n${note}` : note;
    }
    
    if (newStatus === 'delivered') {
      this.deliveredAt = new Date();
    }
    
    await this.save();
  };

  Order.prototype.toPublicJSON = function() {
    const order = this.toJSON();
    return order;
  };

  return Order;
}; 