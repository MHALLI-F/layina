const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { User, Product, Order } = require('../models');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/admin/upload-images
// @desc    Upload d'images pour les produits
// @access  Private (Admin)
router.post('/upload-images', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    // Générer les URLs des images uploadées
    const imageUrls = req.files.map(file => {
      return `http://localhost:5000/uploads/${file.filename}`;
    });

    res.json({
      message: 'Images uploadées avec succès',
      images: imageUrls
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des images' });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Obtenir les statistiques du dashboard
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.count({ where: { role: 'client' } });
    const newUsersThisMonth = await User.count({
      where: {
        role: 'client',
        createdAt: {
          [require('sequelize').Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Statistiques des produits
    const totalProducts = await Product.count({ where: { isActive: true } });
    const lowStockProducts = await Product.count({
      where: {
        isActive: true,
        stock: {
          [require('sequelize').Op.lte]: 5
        }
      }
    });

    // Statistiques des commandes
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const completedOrders = await Order.count({ where: { status: 'delivered' } });

    // Chiffre d'affaires
    const totalRevenue = await Order.sum('total', {
      where: { paymentStatus: 'paid' }
    });

    const monthlyRevenue = await Order.sum('total', {
      where: {
        paymentStatus: 'paid',
        createdAt: {
          [require('sequelize').Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Commandes récentes
    const recentOrders = await Order.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    // Produits populaires
    const popularProducts = await Product.findAll({
      where: { isActive: true },
      order: [['ratings', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        revenue: {
          total: totalRevenue || 0,
          monthly: monthlyRevenue || 0
        }
      },
      recentOrders: recentOrders.map(order => order.toPublicJSON()),
      popularProducts: popularProducts.map(product => product.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/users
// @desc    Récupérer tous les utilisateurs
// @access  Private (Admin)
router.get('/users', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString(),
  query('role').optional().isIn(['client', 'admin'])
], async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;

    // Construire les conditions de filtrage
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[require('sequelize').Op.or] = [
        { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les utilisateurs
    const { count, rows: users } = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['password'] }
    });

    // Calculer les informations de pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      users: users.map(user => user.toPublicJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activer/désactiver un utilisateur
// @access  Private (Admin)
router.put('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('Statut invalide')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.update({ isActive });

    res.json({
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/orders
// @desc    Récupérer toutes les commandes (admin)
// @access  Private (Admin)
router.get('/orders', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('status').optional().isString(),
  query('paymentStatus').optional().isString()
], async (req, res) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    // Construire les conditions de filtrage
    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les commandes
    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    // Calculer les informations de pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      orders: orders.map(order => order.toPublicJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Mettre à jour le statut d'une commande
// @access  Private (Admin)
router.put('/orders/:id/status', adminAuth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Statut invalide'),
  body('note').optional().isString()
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, note } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    await order.updateStatus(status, note);

    res.json({
      message: 'Statut de commande mis à jour avec succès',
      order: order.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/stats
// @desc    Obtenir les statistiques générales
// @access  Private (Admin)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('total', { where: { paymentStatus: 'paid' } }) || 0;
    const totalCustomers = await User.count({ where: { role: 'client' } });
    const totalProducts = await Product.count({ where: { isActive: true } });

    res.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/products
// @desc    Récupérer tous les produits (admin)
// @access  Private (Admin)
router.get('/products', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const { page, limit, category, isActive } = req.query;

    // Construire les conditions de filtrage
    const where = {};
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive;

    // Si pas de pagination spécifiée, récupérer tous les produits
    if (!page && !limit) {
      const products = await Product.findAll({
        where,
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        products: products.map(product => product.toPublicJSON()),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: products.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: products.length
        }
      });
    }

    // Pagination si spécifiée
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Récupérer les produits avec pagination
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset
    });

    // Calculer les informations de pagination
    const totalPages = Math.ceil(count / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      products: products.map(product => product.toPublicJSON()),
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: count,
        hasNextPage,
        hasPrevPage,
        limit: limitNum
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/admin/products
// @desc    Créer un nouveau produit
// @access  Private (Admin)
router.post('/products', adminAuth, [
  body('name').notEmpty().withMessage('Le nom du produit est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('category').notEmpty().withMessage('La catégorie est requise'),
  body('stock').isInt({ min: 0 }).withMessage('Le stock doit être un nombre entier positif'),
  body('images').optional().isArray().withMessage('Les images doivent être un tableau')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stock, images = [] } = req.body;

    // Générer un SKU unique
    const generateSKU = () => {
      const prefix = category.substring(0, 3).toUpperCase();
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `${prefix}-${timestamp}-${random}`;
    };

    // Créer le produit
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      images,
      sku: generateSKU(),
      isActive: true
    });

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: product.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Mettre à jour un produit
// @access  Private (Admin)
router.put('/products/:id', adminAuth, [
  body('name').optional().notEmpty().withMessage('Le nom du produit ne peut pas être vide'),
  body('description').optional().notEmpty().withMessage('La description ne peut pas être vide'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('category').optional().notEmpty().withMessage('La catégorie ne peut pas être vide'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Le stock doit être un nombre entier positif'),
  body('isActive').optional().isBoolean().withMessage('Le statut doit être un booléen')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Mettre à jour le produit
    await product.update(req.body);

    res.json({
      message: 'Produit mis à jour avec succès',
      product: product.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Supprimer un produit
// @access  Private (Admin)
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Supprimer le produit (soft delete)
    await product.update({ isActive: false });

    res.json({
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/admin/customers
// @desc    Récupérer tous les clients
// @access  Private (Admin)
router.get('/customers', adminAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Construire les conditions de filtrage
    const where = { role: 'client' };
    if (search) {
      where[require('sequelize').Op.or] = [
        { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
        { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
      ];
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les clients avec leurs commandes
    const { count, rows: customers } = await User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: ['id', 'orderNumber', 'total', 'status', 'createdAt']
        }
      ]
    });

    // Calculer les informations de pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      customers: customers.map(customer => customer.toPublicJSON()),
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 