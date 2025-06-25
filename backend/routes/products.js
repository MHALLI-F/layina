const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Product } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Récupérer tous les produits avec filtres
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest']),
  query('featured').optional().isBoolean(),
  query('onSale').optional().isBoolean()
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'newest',
      featured,
      onSale
    } = req.query;

    // Construire les conditions de filtrage
    const where = { isActive: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.overlap]: [search] } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }

    if (onSale !== undefined) {
      where.isOnSale = onSale === 'true';
    }

    // Construire l'ordre de tri
    let order = [];
    switch (sort) {
      case 'price_asc':
        order = [['price', 'ASC']];
        break;
      case 'price_desc':
        order = [['price', 'DESC']];
        break;
      case 'name_asc':
        order = [['name', 'ASC']];
        break;
      case 'name_desc':
        order = [['name', 'DESC']];
        break;
      case 'oldest':
        order = [['createdAt', 'ASC']];
        break;
      default: // newest
        order = [['createdAt', 'DESC']];
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Récupérer les produits
    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ['adminNotes'] }
    });

    // Calculer les informations de pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      products: products.map(product => product.toPublicJSON()),
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
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/products/:id
// @desc    Récupérer un produit par ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ product: product.toPublicJSON() });

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/products
// @desc    Créer un nouveau produit (Admin)
// @access  Private (Admin)
router.post('/', adminAuth, [
  body('name', 'Le nom du produit est requis').notEmpty().isLength({ min: 3, max: 100 }),
  body('description', 'La description est requise').notEmpty().isLength({ min: 10, max: 2000 }),
  body('price', 'Le prix doit être un nombre positif').isFloat({ min: 0 }),
  body('category', 'La catégorie est requise').isIn(['abayas', 'jilbabs', 'hijabs', 'niqabs', 'khimars', 'accessoires', 'chaussures', 'sacs']),
  body('stock', 'Le stock doit être un nombre entier positif').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: product.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/products/:id
// @desc    Mettre à jour un produit (Admin)
// @access  Private (Admin)
router.put('/:id', adminAuth, [
  body('name', 'Le nom du produit est requis').optional().isLength({ min: 3, max: 100 }),
  body('description', 'La description est requise').optional().isLength({ min: 10, max: 2000 }),
  body('price', 'Le prix doit être un nombre positif').optional().isFloat({ min: 0 }),
  body('category', 'La catégorie est requise').optional().isIn(['abayas', 'jilbabs', 'hijabs', 'niqabs', 'khimars', 'accessoires', 'chaussures', 'sacs']),
  body('stock', 'Le stock doit être un nombre entier positif').optional().isInt({ min: 0 })
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

    // Gestion spéciale pour les images :
    // Si req.body.images est fourni (tableau d'URLs), il remplace les images existantes.
    // Sinon, garder les images actuelles.
    let updateData = { ...req.body };
    if (req.body.images) {
      updateData.images = req.body.images;
    } else {
      // Ne pas écraser les images si non fournies
      delete updateData.images;
    }

    await product.update(updateData);

    res.json({
      message: 'Produit mis à jour avec succès',
      product: product.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Supprimer un produit (Admin)
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Suppression logique (désactiver le produit)
    await product.update({ isActive: false });

    res.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/products/categories
// @desc    Récupérer toutes les catégories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });

    const uniqueCategories = [...new Set(categories.map(cat => cat.category))];

    res.json({ categories: uniqueCategories });

  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/products/featured
// @desc    Récupérer les produits en vedette
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      order: [['createdAt', 'DESC']],
      limit: 8
    });

    res.json({
      products: products.map(product => product.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits en vedette:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/products/new
// @desc    Récupérer les nouveaux produits
// @access  Public
router.get('/new', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        isActive: true,
        isNew: true 
      },
      order: [['createdAt', 'DESC']],
      limit: 8
    });

    res.json({
      products: products.map(product => product.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des nouveaux produits:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/products/sale
// @desc    Récupérer les produits en promotion
// @access  Public
router.get('/sale', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        isActive: true,
        isOnSale: true 
      },
      order: [['discountPercentage', 'DESC']],
      limit: 8
    });

    res.json({
      products: products.map(product => product.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des produits en promotion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 