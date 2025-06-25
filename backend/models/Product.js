const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sizes: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('sizes');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('sizes', JSON.stringify(value));
      }
    },
    colors: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('colors');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('colors', JSON.stringify(value));
      }
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('images');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('tags');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('tags', JSON.stringify(value));
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    dimensions: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('dimensions');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('dimensions', JSON.stringify(value));
      }
    }
  }, {
    tableName: 'products',
    timestamps: true
  });

  // Méthodes d'instance
  Product.prototype.getDiscountedPrice = function() {
    if (this.discountPercentage > 0) {
      return this.price * (1 - this.discountPercentage / 100);
    }
    return this.price;
  };

  Product.prototype.updateStock = async function(quantity) {
    this.stock -= quantity;
    if (this.stock < 0) this.stock = 0;
    await this.save();
  };

  Product.prototype.toPublicJSON = function() {
    const product = this.toJSON();
    product.discountedPrice = this.getDiscountedPrice();
    return product;
  };

  return Product;
}; 