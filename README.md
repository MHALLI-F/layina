# 🏪 Boutique Voilée - E-commerce pour Femmes Voilées

Une plateforme e-commerce complète spécialement conçue pour les femmes voilées, offrant une large gamme de vêtements et accessoires modestes.

## ✨ Fonctionnalités

### 🛍️ Frontend Client
- **Page d'accueil** avec produits en vedette
- **Catalogue** avec filtres et recherche avancée
- **Détails produit** avec galerie d'images
- **Panier** avec gestion des quantités
- **Checkout** sécurisé avec Stripe
- **Compte utilisateur** avec historique des commandes
- **Design responsive** optimisé mobile

### ⚙️ Backend API
- **API REST** complète avec Node.js/Express
- **Base de données PostgreSQL** avec Sequelize ORM
- **Authentification JWT** sécurisée
- **Gestion des commandes** et paiements
- **Upload d'images** et gestion des fichiers
- **Validation des données** robuste

### 🔐 Interface Admin
- **Dashboard** avec statistiques en temps réel
- **Gestion des produits** (CRUD complet)
- **Gestion des commandes** avec suivi des statuts
- **Gestion des utilisateurs** et rôles
- **Analytics** et rapports de vente
- **Interface intuitive** avec React

### 💳 Paiements
- **Intégration Stripe** complète
- **Paiements sécurisés** avec 3D Secure
- **Webhooks** pour synchronisation
- **Gestion des remboursements**
- **Support multi-devises**

## 🛠️ Technologies

### Frontend
- **React 18** avec hooks et context
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **React Query** pour la gestion d'état
- **React Hook Form** pour les formulaires
- **Stripe Elements** pour les paiements

### Backend
- **Node.js** avec Express
- **PostgreSQL** base de données relationnelle
- **Sequelize** ORM pour la gestion des données
- **JWT** pour l'authentification
- **Stripe** pour les paiements
- **Multer** pour l'upload de fichiers
- **Express Validator** pour la validation

### Admin
- **React 18** avec hooks
- **Tailwind CSS** pour l'interface
- **Recharts** pour les graphiques
- **React Query** pour les données
- **React Hook Form** pour les formulaires

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd boutique
```

### 2. Configuration PostgreSQL
```sql
-- Créer la base de données
CREATE DATABASE boutique_voilee;
```

### 3. Configuration des variables d'environnement
```bash
cd backend
cp env.example .env
# Éditer le fichier .env avec vos paramètres
```

### 4. Installation et démarrage
```bash
# Backend
cd backend
npm install
npm run migrate
npm run seed
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev

# Admin (nouveau terminal)
cd admin
npm install
npm run dev
```

## 📱 Accès aux applications

- **Frontend Client** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Admin Interface** : http://localhost:3001

## 👤 Comptes de test

- **Admin** : admin@boutique-voilee.com / admin123
- **Client** : client@test.com / client123

## 📊 Structure de la base de données

### Tables principales
- **users** - Utilisateurs (clients et admins)
- **products** - Catalogue des produits
- **orders** - Commandes et historique

### Relations
- Un utilisateur peut avoir plusieurs commandes
- Chaque commande contient plusieurs produits
- Gestion des variantes (couleurs, tailles)

## 🔧 Configuration

### Variables d'environnement principales
```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boutique_voilee
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

# JWT
JWT_SECRET=votre_secret_jwt

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 📁 Architecture du projet

```
boutique/
├── frontend/          # Application React client
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── utils/         # Utilitaires
│   └── public/
├── backend/           # API Node.js/Express
│   ├── config/        # Configuration (DB, etc.)
│   ├── models/        # Modèles Sequelize
│   ├── routes/        # Routes API
│   ├── middleware/    # Middlewares Express
│   ├── scripts/       # Scripts (seed, migrate)
│   └── uploads/       # Fichiers uploadés
├── admin/             # Interface d'administration
│   ├── src/
│   │   ├── components/    # Composants admin
│   │   ├── pages/         # Pages admin
│   │   └── utils/         # Utilitaires admin
│   └── public/
└── docs/              # Documentation
```

## 🎯 Fonctionnalités avancées

### Gestion des produits
- **Catégories multiples** (Abayas, Jilbabs, Hijabs, etc.)
- **Variantes** (couleurs, tailles, stock)
- **Images multiples** avec galerie
- **Promotions** et réductions
- **Tags** et recherche avancée

### Gestion des commandes
- **Statuts multiples** (en attente, confirmée, expédiée, etc.)
- **Suivi des paiements** avec Stripe
- **Historique complet** des modifications
- **Notifications** par email
- **Factures** automatiques

### Sécurité
- **Authentification JWT** sécurisée
- **Validation** des données côté serveur
- **Rate limiting** pour prévenir les abus
- **CORS** configuré
- **Helmet** pour la sécurité HTTP

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Uploader le dossier dist/
```

### Backend (Heroku/Railway)
```bash
cd backend
npm start
```

### Base de données
- **PostgreSQL** sur service cloud (Heroku Postgres, Railway, etc.)
- **Migrations** automatiques au démarrage
- **Backup** automatique recommandé

## 📈 Performance

### Optimisations
- **Lazy loading** des images
- **Pagination** des résultats
- **Cache** des requêtes fréquentes
- **Compression** des réponses
- **CDN** pour les assets statiques

### Monitoring
- **Logs** structurés
- **Métriques** de performance
- **Alertes** en cas d'erreur
- **Health checks** automatiques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@boutique-voilee.com
- 📖 Documentation : `/docs`
- 🐛 Issues : GitHub Issues
- 💬 Discussions : GitHub Discussions

## 🙏 Remerciements

- **Stripe** pour l'intégration des paiements
- **Tailwind CSS** pour le framework CSS
- **React** pour l'écosystème frontend
- **PostgreSQL** pour la base de données robuste
- **Sequelize** pour l'ORM puissant

---

**Boutique Voilée** - Votre destination pour la mode modeste de qualité ✨ 