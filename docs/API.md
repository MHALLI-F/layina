# Documentation API - Boutique Voilée

## Base URL
```
http://localhost:5000/api
```

## Authentification
L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans le header Authorization :
```
Authorization: Bearer <token>
```

## Endpoints

### 🔐 Authentification

#### Inscription Client
```http
POST /auth/register
```

**Body:**
```json
{
  "firstName": "Fatima",
  "lastName": "Al-Zahra",
  "email": "fatima@example.com",
  "password": "motdepasse123",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "message": "Compte créé avec succès",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "Fatima",
    "lastName": "Al-Zahra",
    "email": "fatima@example.com",
    "role": "client"
  }
}
```

#### Connexion Client
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "fatima@example.com",
  "password": "motdepasse123"
}
```

#### Connexion Admin
```http
POST /auth/admin/login
```

**Body:**
```json
{
  "email": "admin@boutique-voilee.com",
  "password": "admin123"
}
```

#### Profil Utilisateur
```http
GET /auth/profile
Authorization: Bearer <token>
```

### 🛍️ Produits

#### Liste des Produits
```http
GET /products?page=1&limit=12&category=abayas&search=soie&minPrice=50&maxPrice=100&sort=price_asc
```

**Paramètres:**
- `page` (number): Numéro de page (défaut: 1)
- `limit` (number): Nombre d'éléments par page (défaut: 12, max: 50)
- `category` (string): Catégorie (abayas, jilbabs, hijabs, niqabs, khimars, accessoires, chaussures, sacs)
- `search` (string): Recherche textuelle
- `minPrice` (number): Prix minimum
- `maxPrice` (number): Prix maximum
- `sort` (string): Tri (price_asc, price_desc, name_asc, name_desc, newest, oldest)
- `featured` (boolean): Produits en vedette
- `onSale` (boolean): Produits en promotion

**Response:**
```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Abaya Élégante Noire",
      "description": "Description du produit...",
      "price": 89.99,
      "discountedPrice": 67.49,
      "category": "abayas",
      "images": [...],
      "colors": [...],
      "sizes": [...],
      "stock": 45,
      "isInStock": true,
      "isOnSale": true,
      "discountPercentage": 25
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 12
  }
}
```

#### Détails d'un Produit
```http
GET /products/:id
```

#### Produits en Vedette
```http
GET /products/featured/featured
```

#### Nouveaux Produits
```http
GET /products/new/new
```

#### Produits en Promotion
```http
GET /products/sale/sale
```

### 🛒 Commandes

#### Créer une Commande
```http
POST /orders
Authorization: Bearer <token>
```

**Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "size": "M",
      "color": "Noir"
    }
  ],
  "shippingAddress": {
    "firstName": "Fatima",
    "lastName": "Al-Zahra",
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France",
    "phone": "0123456789"
  },
  "billingAddress": {
    "firstName": "Fatima",
    "lastName": "Al-Zahra",
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "shippingMethod": {
    "name": "Livraison standard"
  },
  "paymentMethod": "stripe",
  "notes": "Livraison en matinée si possible"
}
```

#### Mes Commandes
```http
GET /orders/my-orders?page=1&limit=10&status=confirmed
Authorization: Bearer <token>
```

#### Détails d'une Commande
```http
GET /orders/my-orders/:orderId
Authorization: Bearer <token>
```

### 💳 Paiement

#### Créer une Intention de Paiement
```http
POST /payment/create-payment-intent
Authorization: Bearer <token>
```

**Body:**
```json
{
  "orderId": "order_id"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

#### Confirmer le Paiement
```http
POST /payment/confirm-payment
Authorization: Bearer <token>
```

**Body:**
```json
{
  "orderId": "order_id",
  "paymentIntentId": "pi_xxx"
}
```

#### Méthodes de Paiement
```http
GET /payment/methods
```

#### Méthodes de Livraison
```http
GET /payment/shipping-methods
```

### ⚙️ Administration

#### Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Gestion des Produits (Admin)
```http
GET /admin/products?page=1&limit=20&category=abayas&stock=in_stock&status=active
Authorization: Bearer <admin_token>
```

#### Créer un Produit (Admin)
```http
POST /products
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "name": "Nouveau Produit",
  "description": "Description du produit...",
  "price": 99.99,
  "category": "abayas",
  "stock": 50,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Description de l'image",
      "isMain": true
    }
  ],
  "colors": [
    {
      "name": "Noir",
      "code": "#000000",
      "available": true
    }
  ],
  "sizes": [
    {
      "name": "M",
      "stock": 10,
      "available": true
    }
  ]
}
```

#### Modifier un Produit (Admin)
```http
PUT /products/:id
Authorization: Bearer <admin_token>
```

#### Supprimer un Produit (Admin)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

#### Gestion des Commandes (Admin)
```http
GET /admin/orders?page=1&limit=20&status=pending&paymentStatus=paid
Authorization: Bearer <admin_token>
```

#### Modifier le Statut d'une Commande (Admin)
```http
PUT /admin/orders/:orderId/status
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "status": "shipped",
  "note": "Commande expédiée",
  "trackingNumber": "TRK123456789",
  "carrier": "Colissimo"
}
```

#### Statistiques de Vente (Admin)
```http
GET /admin/stats/sales?period=30d
Authorization: Bearer <admin_token>
```

## Codes de Statut

- `200` : Succès
- `201` : Créé avec succès
- `400` : Données invalides
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## Gestion d'Erreurs

Toutes les erreurs retournent un format standard :

```json
{
  "message": "Description de l'erreur",
  "errors": [
    {
      "field": "email",
      "message": "Email invalide"
    }
  ]
}
```

## Rate Limiting

L'API limite les requêtes à 100 par IP par fenêtre de 15 minutes.

## Webhooks Stripe

```http
POST /payment/webhook
```

Gère les événements Stripe :
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded` 