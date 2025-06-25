const { testConnection, syncDatabase } = require('../config/database');
const { User, Product, Order } = require('../models');
require('dotenv').config();

// Données de test pour les produits
const productsData = [
  {
    name: 'Abaya Élégante Noire',
    description: 'Abaya traditionnelle en soie noire avec broderies dorées délicates. Parfaite pour les occasions spéciales et les cérémonies religieuses. Coupe fluide et élégante qui respecte les codes vestimentaires islamiques.',
    shortDescription: 'Abaya traditionnelle en soie noire avec broderies dorées',
    price: 89.99,
    originalPrice: 120.00,
    category: 'abayas',
    subcategory: 'traditionnelle',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Abaya Élégante Noire',
        isMain: true
      },
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Abaya Élégante Noire - Vue arrière'
      }
    ],
    colors: [
      { name: 'Noir', code: '#000000', available: true },
      { name: 'Bordeaux', code: '#800020', available: true }
    ],
    sizes: [
      { name: 'S', stock: 10, available: true },
      { name: 'M', stock: 15, available: true },
      { name: 'L', stock: 12, available: true },
      { name: 'XL', stock: 8, available: true }
    ],
    stock: 45,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    discountPercentage: 25,
    tags: ['abaya', 'traditionnelle', 'soie', 'broderies', 'élégante'],
    specifications: {
      material: 'Soie 100%',
      care: 'Lavage à la main, repassage à basse température',
      weight: 0.8,
      dimensions: { length: 140, width: 60, height: 5 }
    },
    ratings: { average: 4.8, count: 24 }
  },
  {
    name: 'Jilbab Moderne Gris',
    description: 'Jilbab contemporain en tissu léger et respirant. Design moderne avec des détails subtils et une coupe confortable. Idéal pour un usage quotidien tout en respectant les principes de modestie.',
    shortDescription: 'Jilbab contemporain en tissu léger et respirant',
    price: 65.00,
    category: 'jilbabs',
    subcategory: 'moderne',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Jilbab Moderne Gris',
        isMain: true
      }
    ],
    colors: [
      { name: 'Gris', code: '#808080', available: true },
      { name: 'Beige', code: '#F5F5DC', available: true }
    ],
    sizes: [
      { name: 'S', stock: 8, available: true },
      { name: 'M', stock: 12, available: true },
      { name: 'L', stock: 10, available: true }
    ],
    stock: 30,
    isActive: true,
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    tags: ['jilbab', 'moderne', 'quotidien', 'confortable'],
    specifications: {
      material: 'Polyester 95%, Élasthanne 5%',
      care: 'Lavage machine 30°C',
      weight: 0.6,
      dimensions: { length: 130, width: 55, height: 3 }
    },
    ratings: { average: 4.6, count: 18 }
  },
  {
    name: 'Hijab Soie Premium',
    description: 'Hijab en soie naturelle de haute qualité. Texture douce et légère, parfait pour toutes les saisons. Disponible dans une large gamme de couleurs élégantes.',
    shortDescription: 'Hijab en soie naturelle de haute qualité',
    price: 45.00,
    category: 'hijabs',
    subcategory: 'soie',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Hijab Soie Premium',
        isMain: true
      }
    ],
    colors: [
      { name: 'Bleu Marine', code: '#000080', available: true },
      { name: 'Rose Poudré', code: '#FFE4E1', available: true },
      { name: 'Vert Émeraude', code: '#50C878', available: true },
      { name: 'Violet Royal', code: '#7851A9', available: true }
    ],
    sizes: [
      { name: 'Unique', stock: 25, available: true }
    ],
    stock: 25,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isOnSale: false,
    tags: ['hijab', 'soie', 'premium', 'élégant'],
    specifications: {
      material: 'Soie 100%',
      care: 'Lavage à la main, repassage à basse température',
      weight: 0.3,
      dimensions: { length: 180, width: 90, height: 2 }
    },
    ratings: { average: 4.9, count: 32 }
  },
  {
    name: 'Niqab Classique',
    description: 'Niqab traditionnel en tissu respirant et confortable. Design simple et élégant, parfait pour un usage quotidien. Respecte les traditions tout en offrant un confort optimal.',
    shortDescription: 'Niqab traditionnel en tissu respirant',
    price: 35.00,
    category: 'niqabs',
    subcategory: 'classique',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Niqab Classique',
        isMain: true
      }
    ],
    colors: [
      { name: 'Noir', code: '#000000', available: true },
      { name: 'Gris Foncé', code: '#404040', available: true }
    ],
    sizes: [
      { name: 'Unique', stock: 20, available: true }
    ],
    stock: 20,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isOnSale: true,
    discountPercentage: 15,
    tags: ['niqab', 'traditionnel', 'quotidien', 'confortable'],
    specifications: {
      material: 'Coton 100%',
      care: 'Lavage machine 30°C',
      weight: 0.4,
      dimensions: { length: 60, width: 40, height: 2 }
    },
    ratings: { average: 4.7, count: 15 }
  },
  {
    name: 'Khimar Élégant',
    description: 'Khimar moderne avec des détails brodés subtils. Coupe fluide et élégante, parfait pour les occasions spéciales. Tissu de qualité supérieure pour un rendu professionnel.',
    shortDescription: 'Khimar moderne avec broderies subtiles',
    price: 75.00,
    category: 'khimars',
    subcategory: 'moderne',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Khimar Élégant',
        isMain: true
      }
    ],
    colors: [
      { name: 'Bordeaux', code: '#800020', available: true },
      { name: 'Vert Forêt', code: '#228B22', available: true }
    ],
    sizes: [
      { name: 'S', stock: 6, available: true },
      { name: 'M', stock: 8, available: true },
      { name: 'L', stock: 6, available: true }
    ],
    stock: 20,
    isActive: true,
    isFeatured: true,
    isNew: true,
    isOnSale: false,
    tags: ['khimar', 'moderne', 'broderies', 'élégant'],
    specifications: {
      material: 'Polyester 90%, Coton 10%',
      care: 'Lavage à la main, repassage à basse température',
      weight: 0.7,
      dimensions: { length: 150, width: 70, height: 4 }
    },
    ratings: { average: 4.8, count: 12 }
  },
  {
    name: 'Broche Décorative Or',
    description: 'Broche élégante en métal doré avec des motifs islamiques traditionnels. Parfaite pour personnaliser vos vêtements et ajouter une touche d\'élégance.',
    shortDescription: 'Broche élégante avec motifs islamiques',
    price: 25.00,
    category: 'accessoires',
    subcategory: 'broches',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Broche Décorative Or',
        isMain: true
      }
    ],
    colors: [
      { name: 'Or', code: '#FFD700', available: true },
      { name: 'Argent', code: '#C0C0C0', available: true }
    ],
    sizes: [
      { name: 'Unique', stock: 30, available: true }
    ],
    stock: 30,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    tags: ['broche', 'décoratif', 'motifs', 'élégant'],
    specifications: {
      material: 'Métal doré',
      care: 'Nettoyage à sec',
      weight: 0.1,
      dimensions: { length: 3, width: 2, height: 1 }
    },
    ratings: { average: 4.5, count: 28 }
  },
  {
    name: 'Chaussures Modestes Noires',
    description: 'Chaussures fermées élégantes et confortables. Design modeste parfait pour accompagner vos tenues traditionnelles. Semelle antidérapante et matériaux de qualité.',
    shortDescription: 'Chaussures fermées élégantes et confortables',
    price: 55.00,
    category: 'chaussures',
    subcategory: 'fermées',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Chaussures Modestes Noires',
        isMain: true
      }
    ],
    colors: [
      { name: 'Noir', code: '#000000', available: true },
      { name: 'Marron', code: '#8B4513', available: true }
    ],
    sizes: [
      { name: '36', stock: 8, available: true },
      { name: '37', stock: 10, available: true },
      { name: '38', stock: 12, available: true },
      { name: '39', stock: 10, available: true },
      { name: '40', stock: 8, available: true }
    ],
    stock: 48,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isOnSale: true,
    discountPercentage: 20,
    tags: ['chaussures', 'modestes', 'confortables', 'élégantes'],
    specifications: {
      material: 'Cuir synthétique',
      care: 'Nettoyage avec chiffon humide',
      weight: 0.8,
      dimensions: { length: 25, width: 8, height: 12 }
    },
    ratings: { average: 4.6, count: 35 }
  },
  {
    name: 'Sac à Main Modeste',
    description: 'Sac à main spacieux et élégant, parfait pour accompagner vos tenues traditionnelles. Design modeste avec des compartiments organisés et des matériaux durables.',
    shortDescription: 'Sac à main spacieux et élégant',
    price: 85.00,
    category: 'sacs',
    subcategory: 'sacs à main',
    brand: 'Boutique Voilée',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        alt: 'Sac à Main Modeste',
        isMain: true
      }
    ],
    colors: [
      { name: 'Noir', code: '#000000', available: true },
      { name: 'Bordeaux', code: '#800020', available: true },
      { name: 'Gris', code: '#808080', available: true }
    ],
    sizes: [
      { name: 'Unique', stock: 15, available: true }
    ],
    stock: 15,
    isActive: true,
    isFeatured: true,
    isNew: false,
    isOnSale: false,
    tags: ['sac', 'modeste', 'spacieux', 'élégant'],
    specifications: {
      material: 'Cuir synthétique',
      care: 'Nettoyage avec chiffon humide',
      weight: 1.2,
      dimensions: { length: 35, width: 15, height: 25 }
    },
    ratings: { average: 4.7, count: 22 }
  }
];

// Fonction pour créer un client de test
async function createTestClient() {
  try {
    const existingClient = await User.findOne({ where: { email: 'client@test.com' } });
    if (!existingClient) {
      await User.create({
        firstName: 'Test',
        lastName: 'Client',
        email: 'client@test.com',
        password: 'client123',
        phone: '0123456789',
        role: 'client'
      });
      console.log('✅ Client de test créé');
    } else {
      console.log('✅ Client de test déjà existant');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du client de test:', error);
  }
}

// Fonction pour créer les produits
async function createProducts() {
  try {
    // Supprimer tous les produits existants
    await Product.destroy({ where: {} });
    console.log('🗑️  Produits existants supprimés');

    // Créer les nouveaux produits
    const products = await Product.bulkCreate(productsData);
    console.log(`✅ ${products.length} produits créés avec succès`);

    return products;
  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error);
    throw error;
  }
}

// Fonction principale de seeding
async function seedDatabase() {
  try {
    console.log('🌱 Début du seeding de la base de données...');

    // Tester la connexion à PostgreSQL
    await testConnection();

    // Créer l'administrateur par défaut
    await User.createDefaultAdmin();

    // Créer le client de test
    await createTestClient();

    // Créer les produits
    await createProducts();

    console.log('✅ Seeding terminé avec succès !');
    console.log('\n📋 Comptes créés :');
    console.log('   Admin: admin@boutique-voilee.com / admin123');
    console.log('   Client: client@test.com / client123');
    console.log('\n🛍️  Produits créés : 8 produits de test');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  } finally {
    // Fermer la connexion Sequelize
    process.exit(0);
  }
}

// Exécuter le seeding
seedDatabase(); 