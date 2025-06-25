import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// Données de produits temporaires
const mockProducts = [
  {
    id: 1,
    name: "Abaya Classique Noire",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
    category: "Abayas",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: true
  },
  {
    id: 2,
    name: "Jilbab Élégant Marron",
    price: 75.50,
    originalPrice: 95.00,
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=500&fit=crop",
    category: "Jilbabs",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: false
  },
  {
    id: 3,
    name: "Hijab Soie Premium",
    price: 45.00,
    originalPrice: 45.00,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=500&fit=crop",
    category: "Hijabs",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    isNew: true
  },
  {
    id: 4,
    name: "Abaya Moderne Bleue",
    price: 95.00,
    originalPrice: 125.00,
    image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=400&h=500&fit=crop",
    category: "Abayas",
    rating: 4.7,
    reviews: 67,
    inStock: false,
    isNew: false
  },
  {
    id: 5,
    name: "Niqab Confortable",
    price: 35.00,
    originalPrice: 35.00,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    category: "Niqabs",
    rating: 4.5,
    reviews: 45,
    inStock: true,
    isNew: false
  },
  {
    id: 6,
    name: "Khimar Longueur Complète",
    price: 65.00,
    originalPrice: 85.00,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    category: "Khimars",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    isNew: false
  }
];

const categories = [
  { id: 'all', name: 'Tous les produits' },
  { id: 'abayas', name: 'Abayas' },
  { id: 'jilbabs', name: 'Jilbabs' },
  { id: 'hijabs', name: 'Hijabs' },
  { id: 'niqabs', name: 'Niqabs' },
  { id: 'khimars', name: 'Khimars' }
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  
  const { addToCart } = useCart();

  // Récupérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Filtrer et trier les produits
  useEffect(() => {
    let filtered = [...products];

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory
      );
    }

    // Filtre par prix
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Tri
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        // Tri par défaut (featured)
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    }
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Nouveau
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Rupture
          </span>
        )}
        <button
          onClick={() => handleAddToCart(product)}
          disabled={!product.inStock}
          className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {product.price.toFixed(2)}€
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {product.originalPrice.toFixed(2)}€
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la boutique */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Notre Boutique</h1>
          <p className="text-gray-600 mb-6">
            Découvrez notre collection de vêtements modestes et élégants
          </p>
          
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </h3>
              
              {/* Catégories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Catégories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Prix</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0€</span>
                    <span>{priceRange[1]}€</span>
                  </div>
                </div>
              </div>

              {/* Tri */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Trier par</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="featured">Recommandés</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="newest">Nouveautés</option>
                </select>
              </div>
            </div>
          </div>

          {/* Produits */}
          <div className="flex-1">
            {/* En-tête des produits */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                    <div className="bg-gray-200 h-64 rounded mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                <p className="text-gray-400">Essayez de modifier vos filtres</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 