import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount,
    clearCart 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <p className="text-gray-600 mb-6">
            Découvrez nos produits et commencez vos achats
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Panier</h1>
          <p className="text-gray-600 mt-2">
            {getCartCount()} article{getCartCount() > 1 ? 's' : ''} dans votre panier
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Liste des produits */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Articles ({getCartCount()})
                </h2>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Détails du produit */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.category}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {item.price.toFixed(2)}€
                        </p>
                      </div>

                      {/* Contrôles de quantité */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Prix total et suppression */}
                      <div className="flex flex-col items-end space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between items-center">
                  <Link
                    to="/shop"
                    className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Continuer mes achats
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Résumé de la commande
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sous-total ({getCartCount()} article{getCartCount() > 1 ? 's' : ''})</span>
                  <span>{getCartTotal().toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>TVA</span>
                  <span>{(getCartTotal() * 0.20).toFixed(2)}€</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{(getCartTotal() * 1.20).toFixed(2)}€</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    TTC, livraison incluse
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Passer la commande
                </Link>
                
                <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors">
                  Payer avec PayPal
                </button>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Livraison sécurisée</p>
                    <p>Livraison gratuite en France métropolitaine</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 mt-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Retours gratuits</p>
                    <p>30 jours pour changer d'avis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 