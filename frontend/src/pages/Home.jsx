import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingBag, Truck, Shield, Users, Award } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products?featured=true&limit=4');
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const testimonials = [
    {
      name: "Amina B.",
      role: "Cliente fidèle",
      content: "Les abayas de cette boutique sont magnifiques et de très bonne qualité. Je recommande vivement !",
      rating: 5
    },
    {
      name: "Fatima Z.",
      role: "Nouvelle cliente",
      content: "Service client exceptionnel et livraison rapide. Les vêtements correspondent parfaitement à mes attentes.",
      rating: 5
    },
    {
      name: "Khadija M.",
      role: "Cliente satisfaite",
      content: "Design élégant et respectueux de nos valeurs. Je suis très satisfaite de mes achats.",
      rating: 5
    }
  ];

  const stats = [
    { number: "1000+", label: "Clients satisfaits" },
    { number: "500+", label: "Produits disponibles" },
    { number: "24h", label: "Livraison express" },
    { number: "100%", label: "Qualité garantie" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mode Modeste & Élégante
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Découvrez notre collection exclusive de vêtements pour femmes musulmanes. 
              Élégance, modestie et qualité au service de votre style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Découvrir la collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Boutique Voilée ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nous nous engageons à offrir des vêtements de qualité, respectueux de vos valeurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Premium</h3>
              <p className="text-gray-600">
                Des matériaux de première qualité pour un confort et une durabilité optimaux
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Modeste</h3>
              <p className="text-gray-600">
                Des créations élégantes qui respectent les principes de la modestie
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">
                Livraison gratuite en France métropolitaine pour toute commande supérieure à 50€
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Satisfaction Garantie</h3>
              <p className="text-gray-600">
                Retours gratuits sous 30 jours et service client disponible 7j/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produits en Vedette
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos nouveautés et best-sellers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <ShoppingBag className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-primary-600 font-bold mt-2">
                      {product.price}€
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Voir tous les produits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Catégories
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez notre gamme complète de vêtements
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Abayas', image: '/images/abaya.jpg', count: '50+ produits', color: 'from-purple-400 to-purple-600' },
              { name: 'Jilbabs', image: '/images/jilbab.jpg', count: '30+ produits', color: 'from-blue-400 to-blue-600' },
              { name: 'Hijabs', image: '/images/hijab.jpg', count: '100+ produits', color: 'from-pink-400 to-pink-600' },
              { name: 'Accessoires', image: '/images/accessories.jpg', count: '25+ produits', color: 'from-green-400 to-green-600' }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name.toLowerCase()}`}
                className="group block"
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-lg p-6 text-center text-white hover:scale-105 transition-transform duration-300`}>
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="font-semibold text-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos clientes
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les avis de nos clientes satisfaites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                À propos de Boutique Voilée
              </h2>
              <p className="text-lg mb-6 text-primary-100">
                Fondée avec la passion de la mode modeste, notre boutique s'engage à offrir des vêtements 
                élégants et respectueux des valeurs islamiques. Nous sélectionnons avec soin chaque pièce 
                pour vous garantir qualité et style.
              </p>
              <p className="text-lg mb-8 text-primary-100">
                Notre équipe dédiée est là pour vous accompagner dans vos choix et vous offrir 
                une expérience d'achat exceptionnelle.
              </p>
              <Link
                to="/about"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <p className="text-xl font-semibold">Plus de 1000 clientes satisfaites</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à découvrir votre style ?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Rejoignez notre communauté et bénéficiez d'offres exclusives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
            >
              Créer un compte
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Commencer à magasiner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 