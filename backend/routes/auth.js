const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', [
  body('firstName', 'Le prénom est requis').notEmpty().isLength({ min: 2, max: 50 }),
  body('lastName', 'Le nom de famille est requis').notEmpty().isLength({ min: 2, max: 50 }),
  body('email', 'Veuillez entrer un email valide').isEmail().normalizeEmail(),
  body('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
  body('phone', 'Numéro de téléphone invalide').optional().matches(/^(\+33|0)[1-9](\d{8})$/)
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: 'client'
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/auth/login
// @desc    Connecter un utilisateur
// @access  Public
router.post('/login', [
  body('email', 'Veuillez entrer un email valide').isEmail(),
  body('password', 'Le mot de passe est requis').notEmpty()
], async (req, res) => {
  try {
    console.log('🔍 Tentative de connexion:', { email: req.body.email });
    console.log('📧 Email original:', req.body.email);
    console.log('📧 Email après validation:', req.body.email);
    
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Erreurs de validation:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('📧 Email final utilisé:', email);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Utilisateur non trouvé pour:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    console.log('✅ Utilisateur trouvé:', { id: user.id, role: user.role, isActive: user.isActive });

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      console.log('❌ Compte désactivé pour:', email);
      return res.status(400).json({ message: 'Compte désactivé' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Vérification mot de passe:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Connexion réussie pour:', email);

    res.json({
      message: 'Connexion réussie',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/auth/me
// @desc    Obtenir les informations de l'utilisateur connecté
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ user: user.toPublicJSON() });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Mettre à jour le profil utilisateur
// @access  Private
router.put('/profile', auth, [
  body('firstName', 'Le prénom est requis').optional().isLength({ min: 2, max: 50 }),
  body('lastName', 'Le nom de famille est requis').optional().isLength({ min: 2, max: 50 }),
  body('phone', 'Numéro de téléphone invalide').optional().matches(/^(\+33|0)[1-9](\d{8})$/)
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les champs autorisés
    const { firstName, lastName, phone } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: 'Profil mis à jour avec succès',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/auth/password
// @desc    Changer le mot de passe
// @access  Private
router.put('/password', auth, [
  body('currentPassword', 'Le mot de passe actuel est requis').notEmpty(),
  body('newPassword', 'Le nouveau mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 