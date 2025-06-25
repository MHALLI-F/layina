# Guide d'Installation - Boutique Voilée

## Prérequis

### 1. Node.js et npm
- Node.js version 18 ou supérieure
- npm version 9 ou supérieure

### 2. PostgreSQL
- PostgreSQL version 14 ou supérieure
- pgAdmin (optionnel, pour la gestion graphique)

### 3. Git
- Git pour cloner le projet

## Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd boutique
```

### 2. Configuration de PostgreSQL

#### Créer la base de données
```sql
-- Se connecter à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE boutique_voilee;

-- Créer un utilisateur (optionnel)
CREATE USER boutique_user WITH PASSWORD 'votre_mot_de_passe';

-- Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE boutique_voilee TO boutique_user;

-- Se connecter à la base de données
\c boutique_voilee

-- Quitter psql
\q
```

### 3. Configuration des variables d'environnement

#### Backend
```bash
cd backend
cp env.example .env
```

Éditer le fichier `.env` :
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boutique_voilee
DB_USER=postgres
DB_PASSWORD=1234
DATABASE_URL=postgresql://postgres:1234@localhost:5432/boutique_voilee

# JWT Secret
JWT_SECRET=votre_secret_jwt_super_securise_changez_cela_en_production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret

# URLs des applications
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Configuration des uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Installation des dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### Admin Interface
```bash
cd admin
npm install
```

### 5. Initialisation de la base de données

#### Créer les tables
```bash
cd backend
npm run migrate
```

#### Peupler avec des données de test
```bash
npm run seed
```

### 6. Démarrer les applications

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

#### Admin Interface (Terminal 3)
```bash
cd admin
npm run dev
```

## Vérification de l'installation

### 1. Backend
- URL: http://localhost:5000
- Test: http://localhost:5000/api/health
- Devrait retourner: `{"status":"OK","message":"Boutique Voilée API is running"}`

### 2. Frontend
- URL: http://localhost:3000
- Devrait afficher la page d'accueil de la boutique

### 3. Admin Interface
- URL: http://localhost:3001
- Devrait afficher la page de connexion admin

## Comptes de test

### Administrateur
- Email: `admin@boutique-voilee.com`
- Mot de passe: `admin123`

### Client
- Email: `client@test.com`
- Mot de passe: `client123`

## Structure de la base de données

### Tables créées
- `users` - Utilisateurs (clients et admins)
- `products` - Produits de la boutique
- `orders` - Commandes des clients

### Relations
- Un utilisateur peut avoir plusieurs commandes
- Une commande appartient à un utilisateur

## Dépannage

### Erreur de connexion PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
sudo systemctl status postgresql

# Démarrer PostgreSQL si nécessaire
sudo systemctl start postgresql

# Vérifier la connexion
psql -U postgres -d boutique_voilee
```

### Erreur de permissions
```bash
# Donner les permissions à l'utilisateur
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE boutique_voilee TO votre_utilisateur;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO votre_utilisateur;
```

### Erreur de port déjà utilisé
```bash
# Vérifier les ports utilisés
lsof -i :5000
lsof -i :3000
lsof -i :3001

# Tuer le processus si nécessaire
kill -9 <PID>
```

### Erreur de modules Node.js
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## Commandes utiles

### Backend
```bash
# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start

# Créer les tables
npm run migrate

# Peupler avec des données de test
npm run seed

# Vérifier la syntaxe
npm run lint
```

### Frontend
```bash
# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Admin
```bash
# Démarrer en mode développement
npm run dev

# Build pour production
npm run build
```

## Configuration de production

### Variables d'environnement
- Changer `NODE_ENV=production`
- Utiliser des secrets JWT forts
- Configurer les URLs de production
- Configurer Stripe en mode production

### Base de données
- Utiliser une instance PostgreSQL dédiée
- Configurer les sauvegardes
- Optimiser les performances

### Sécurité
- Configurer HTTPS
- Mettre en place un firewall
- Configurer les CORS pour les domaines de production
- Utiliser des variables d'environnement sécurisées

## Support

Pour toute question ou problème :
1. Vérifier les logs dans la console
2. Consulter la documentation API
3. Vérifier la configuration de la base de données
4. Contacter l'équipe de développement 