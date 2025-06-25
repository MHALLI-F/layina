const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Order, User, Product } = require('../models');
const { auth } = require('../middleware/auth');
const { sendOrderEmails } = require('../services/emailService');

const router = express.Router();

// @route   POST /api/orders
// @desc    Créer une nouvelle commande
// @access  Private
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Au moins un produit est requis'),
  body('items.*.productId').isUUID().withMessage('ID de produit invalide'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantité invalide'),
  body('shippingAddress').isObject().withMessage('Adresse de livraison requise'),
  body('billingAddress').isObject().withMessage('Adresse de facturation requise'),
  body('paymentMethod').isIn(['stripe', 'paypal']).withMessage('Méthode de paiement invalide')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Récupérer les informations de l'utilisateur
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier que tous les produits existent et sont en stock
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Produit ${item.productId} non trouvé` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}` });
      }

      const price = product.getDiscountedPrice();
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0]?.url || '',
        sku: product.sku
      });

      // Mettre à jour le stock
      await product.updateStock(item.quantity);
    }

    // Calculer les frais de livraison (exemple simple)
    const shippingCost = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shippingCost;

    // Créer la commande
    const order = await Order.create({
      userId: req.user.userId,
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes,
      shippingMethod: {
        name: 'Livraison standard',
        estimatedDays: 3,
        cost: shippingCost
      }
    });

    // Envoyer les emails de confirmation (en arrière-plan)
    try {
      await sendOrderEmails(order, user);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      // Ne pas faire échouer la commande si l'email échoue
    }

    res.status(201).json({
      message: 'Commande créée avec succès',
      order: order.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/orders
// @desc    Récupérer les commandes de l'utilisateur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      orders: orders.map(order => order.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/orders/:id
// @desc    Récupérer une commande spécifique
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.userId 
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ order: order.toPublicJSON() });

  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Récupérer les commandes de l'utilisateur connecté
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      orders: orders.map(order => order.toPublicJSON())
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 