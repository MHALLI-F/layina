const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payment/create-payment-intent
// @desc    Créer une intention de paiement Stripe
// @access  Private
router.post('/create-payment-intent', auth, [
  body('orderId').isUUID().withMessage('ID de commande invalide')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.body;

    // Récupérer la commande
    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId: req.user.userId 
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Cette commande a déjà été payée' });
    }

    // Créer l'intention de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe utilise les centimes
      currency: 'eur',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber
      }
    });

    // Mettre à jour la commande avec l'ID de l'intention de paiement
    await order.update({
      paymentIntentId: paymentIntent.id
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/payment/confirm-payment
// @desc    Confirmer un paiement
// @access  Private
router.post('/confirm-payment', auth, [
  body('orderId').isUUID().withMessage('ID de commande invalide'),
  body('paymentIntentId').notEmpty().withMessage('ID d\'intention de paiement requis')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId, paymentIntentId } = req.body;

    // Récupérer la commande
    const order = await Order.findOne({
      where: { 
        id: orderId,
        userId: req.user.userId 
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Mettre à jour le statut de la commande
      await order.update({
        paymentStatus: 'paid',
        status: 'confirmed'
      });

      res.json({
        message: 'Paiement confirmé avec succès',
        order: order.toPublicJSON()
      });
    } else {
      res.status(400).json({ message: 'Paiement non réussi' });
    }

  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/payment/webhook
// @desc    Webhook Stripe pour les événements de paiement
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur de signature webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Mettre à jour la commande
        const order = await Order.findOne({
          where: { paymentIntentId: paymentIntent.id }
        });

        if (order) {
          await order.update({
            paymentStatus: 'paid',
            status: 'confirmed'
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // Mettre à jour la commande
        const failedOrder = await Order.findOne({
          where: { paymentIntentId: failedPayment.id }
        });

        if (failedOrder) {
          await failedOrder.update({
            paymentStatus: 'failed'
          });
        }
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur lors du traitement du webhook:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les méthodes de paiement disponibles
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'stripe',
        name: 'Carte bancaire',
        description: 'Visa, Mastercard, American Express',
        icon: 'credit-card'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Paiement sécurisé via PayPal',
        icon: 'paypal'
      }
    ]
  });
});

// Obtenir les méthodes de livraison disponibles
router.get('/shipping-methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'standard',
        name: 'Livraison standard',
        description: 'Livraison sous 5-7 jours ouvrés',
        price: 8,
        estimatedDays: 5
      },
      {
        id: 'express',
        name: 'Livraison express',
        description: 'Livraison sous 2-3 jours ouvrés',
        price: 15,
        estimatedDays: 2
      }
    ]
  });
});

module.exports = router; 