import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Truck,
  Mail,
  Plus
} from 'lucide-react';
import axios from 'axios';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFiles, setEditImageFiles] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Début fetchDashboardData');
      
      // Récupérer les données individuellement pour éviter qu'une erreur bloque tout
      try {
        const productsRes = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('📦 Réponse produits:', productsRes.data);
        console.log('📦 Produits récupérés:', productsRes.data.products);
        console.log('📦 Nombre de produits:', productsRes.data.products?.length);
        setProducts(productsRes.data.products || []);
      } catch (error) {
        console.error('❌ Erreur produits:', error);
        setProducts([]);
      }

      try {
        const ordersRes = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(ordersRes.data.orders || []);
      } catch (error) {
        console.error('❌ Erreur commandes:', error);
        setOrders([]);
      }

      try {
        const customersRes = await axios.get('http://localhost:5000/api/admin/customers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCustomers(customersRes.data.customers || []);
      } catch (error) {
        console.error('❌ Erreur clients:', error);
        setCustomers([]);
      }

      try {
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(statsRes.data.stats || {});
      } catch (error) {
        console.error('❌ Erreur stats:', error);
        setStats({});
      }
      
      console.log('✅ State mis à jour');
    } catch (error) {
      console.error('❌ Erreur générale:', error);
    } finally {
      setLoading(false);
      console.log('🏁 fetchDashboardData terminé');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
    { id: 'orders', name: 'Commandes', icon: ShoppingBag },
    { id: 'products', name: 'Produits', icon: Package },
    { id: 'customers', name: 'Clients', icon: Users }
  ];

  const handleAddProduct = () => {
    setShowAddProductModal(true);
  };

  const handleFileChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrls = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach(file => formData.append('images', file));
        const res = await axios.post('http://localhost:5000/api/admin/upload-images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        imageUrls = res.data.images;
      }
      await axios.post('http://localhost:5000/api/admin/products', {
        ...newProduct,
        images: imageUrls
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: []
      });
      setImageFiles([]);
      setShowAddProductModal(false);
      fetchDashboardData();
      alert('Produit ajouté avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      alert('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setEditImageFiles([]);
    setShowEditProductModal(true);
  };

  const handleEditFileChange = (e) => {
    setEditImageFiles(Array.from(e.target.files));
  };

  const handleSubmitEditProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrls = editProduct.images || [];
      if (editImageFiles.length > 0) {
        const formData = new FormData();
        editImageFiles.forEach(file => formData.append('images', file));
        const res = await axios.post('http://localhost:5000/api/admin/upload-images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        imageUrls = res.data.images;
      }
      await axios.put(`http://localhost:5000/api/products/${editProduct.id}`, {
        ...editProduct,
        images: imageUrls
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowEditProductModal(false);
      setEditProduct(null);
      setEditImageFiles([]);
      fetchDashboardData();
      alert('Produit modifié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
      alert('Erreur lors de la modification du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDashboardData();
      alert('Produit supprimé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      alert('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-2">Gestion de la boutique Boutique Voilée</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Administrateur</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Commandes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Revenus</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue}€</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Clients</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Produits</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Commandes Récentes</h2>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">Aucune commande pour le moment</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                              <p className="text-sm text-gray-600">{order.user?.firstName} {order.user?.lastName}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <span className="font-medium text-gray-900">{order.total}€</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Gestion des Commandes</h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">
                                {order.user?.firstName} {order.user?.lastName} - {order.user?.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{order.total}€</p>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Adresse de livraison:</p>
                              <p className="text-sm text-gray-600">
                                {order.shippingAddress?.street}, {order.shippingAddress?.city}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Méthode de paiement:</p>
                              <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                className="flex items-center px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirmer
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                className="flex items-center px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Expédier
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="flex items-center px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-50 rounded"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Livré
                              </button>
                            </div>
                            <button className="flex items-center px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir détails
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Gestion des Produits</h2>
                  <button 
                    onClick={handleAddProduct}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un produit
                  </button>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {console.log('Rendu des produits:', products)}
                      {products.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">Aucun produit pour le moment</p>
                      ) : (
                        products.map((product) => {
                          console.log('Rendu produit:', product.name);
                          console.log('Images du produit:', product.images);
                          console.log('Première image:', product.images?.[0]);
                          
                          return (
                            <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  {product.images && product.images[0] ? (
                                    <div>
                                      <img 
                                        src={product.images[0] || product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover rounded-lg"
                                        onLoad={() => console.log('✅ Image chargée:', product.images[0])}
                                        onError={(e) => console.log('❌ Erreur image:', e.target.src)}
                                        style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                                      />
                                      <div style={{ fontSize: '8px', color: 'red' }}>
                                        Debug: {product.images[0] ? 'URL présente' : 'Pas d\'URL'}
                                      </div>
                                    </div>
                                  ) : (
                                    <Package className="h-8 w-8 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                  <p className="text-sm text-gray-600">{product.category}</p>
                                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900">{product.price}€</span>
                                <div className="flex space-x-2">
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" onClick={() => handleEditProduct(product)}>
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Gestion des Clients</h2>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              {customer.orders?.length || 0} commandes
                            </span>
                            <button className="flex items-center px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                              <Mail className="h-4 w-4 mr-1" />
                              Contacter
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un produit */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Ajouter un produit</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="abayas">Abayas</option>
                  <option value="hijabs">Hijabs</option>
                  <option value="jilbabs">Jilbabs</option>
                  <option value="niqabs">Niqabs</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (max 5)
                </label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {imageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imageFiles.map((file, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditProductModal && editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Modifier le produit</h3>
              <button
                onClick={() => setShowEditProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitEditProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input type="text" name="name" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} required rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                  <input type="number" name="price" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} required min="0" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" name="stock" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: e.target.value })} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select name="category" value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Sélectionner une catégorie</option>
                  <option value="abayas">Abayas</option>
                  <option value="hijabs">Hijabs</option>
                  <option value="jilbabs">Jilbabs</option>
                  <option value="niqabs">Niqabs</option>
                  <option value="accessoires">Accessoires</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 5)</label>
                <input type="file" name="images" multiple accept="image/*" onChange={handleEditFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {editProduct.images && editProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editProduct.images.map((url, idx) => (
                      <img key={idx} src={url} alt="img" className="w-12 h-12 object-cover rounded" />
                    ))}
                  </div>
                )}
                {editImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editImageFiles.map((file, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{file.name}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowEditProductModal(false)} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">{loading ? 'Modification...' : 'Modifier le produit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 