import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      // Données de démonstration
      setProduct({
        id: '1',
        name: 'Abaya Classique Noire',
        description: 'Une abaya élégante et confortable, parfaite pour toutes les occasions. Fabriquée en matériaux de qualité premium.',
        price: 89.99,
        discountedPrice: 79.99,
        images: ['https://via.placeholder.com/500x600?text=Abaya'],
        category: 'abayas',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Noir', 'Marron', 'Gris'],
        stock: 15,
        isActive: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    if (!selectedColor && product.colors?.length > 0) {
      alert('Veuillez sélectionner une couleur');
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    alert('Produit ajouté au panier !');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Produit non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[selectedImageIdx]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg mb-4"
                  />
                  <div className="flex space-x-2">
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={product.name + ' ' + (idx + 1)}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${selectedImageIdx === idx ? 'border-primary-600' : 'border-gray-200'}`}
                        onClick={() => setSelectedImageIdx(idx)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src={product.image || 'https://via.placeholder.com/500x600?text=Produit'}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Price */}
              <div className="flex items-center space-x-2 mb-6">
                {product.discountedPrice && product.discountedPrice < product.price ? (
                  <>
                    <span className="text-3xl font-bold text-primary-600">
                      {product.discountedPrice.toFixed(2)}€
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {product.price.toFixed(2)}€
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary-600">
                    {product.price.toFixed(2)}€
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Taille</h3>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedSize === size
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Couleur</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg ${
                          selectedColor === color
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quantité</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Stock disponible : <span className="font-semibold">{product.stock} unités</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 