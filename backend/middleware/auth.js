const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token d\'accès requis' });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware d'autorisation admin
const adminAuth = async (req, res, next) => {
  try {
    // Vérifier l'authentification d'abord
    await auth(req, res, (err) => {
      if (err) return next(err);
    });

    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Droits administrateur requis' });
    }

    next();

  } catch (error) {
    console.error('Erreur d\'autorisation admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Middleware pour vérifier si l'utilisateur est le propriétaire ou admin
const requireOwnerOrAdmin = (req, res, next) => {
  const { userId } = req.params;
  
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentification requise' 
    });
  }

  // Admin peut accéder à tout
  if (req.user.role === 'admin') {
    return next();
  }

  // Utilisateur peut accéder à ses propres données
  if (req.user.userId === userId) {
    return next();
  }

  return res.status(403).json({ 
    message: 'Accès refusé' 
  });
};

// Middleware optionnel pour récupérer l'utilisateur si connecté
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (user && user.isActive) {
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    }
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  requireOwnerOrAdmin,
  optionalAuth
}; 