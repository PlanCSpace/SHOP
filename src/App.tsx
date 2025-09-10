import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Package, Settings, Home, Plus, Edit, Trash2, Wallet, Calendar, Truck, Globe, Image, Upload } from 'lucide-react';
import ThemeToggle from './components/ThemeToggle';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import WalletConnection from './components/WalletConnection';
import HeroBanner from './components/HeroBanner';
import CheckoutForm from './components/CheckoutForm';
import AdminLogin from './components/AdminLogin';
import OrderManagement from './components/OrderManagement';
import AdminSettings from './components/AdminSettings';
import LanguageSelector from './components/LanguageSelector';
import ProductDetail from './components/ProductDetail';
import PrivacyPolicy from './components/PrivacyPolicy'; // Import new components
import TermsOfService from './components/TermsOfService';
import CookiesPolicy from './components/CookiesPolicy';
import { supabase } from './lib/supabase';
import { Product, CartItem, Order, ShippingAddress, AdminSettings as AdminSettingsType, Language, Category, AppView } from './types'; // Update AppView type
import { translations } from './utils/translations';
import AdminHeroBannerCarouselSettings from './components/AdminHeroBannerCarouselSettings'; // Renamed import
import ProfilePage from './components/ProfilePage';
import Footer from './components/Footer';
import BulkProductImport from './components/BulkProductImport';
import ScrollToTopButton from './components/ScrollToTopButton'; // Import the new component
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';
import { useCategories } from './hooks/useCategories';
import { useAdminSettings } from './hooks/useAdminSettings';

type ProductTab = 'all' | 'featured' | 'best-selling' | 'discounted';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home'); // Use AppView type
  const [adminView, setAdminView] = useState<'products' | 'orders' | 'settings' | 'bulk'>('products'); // Removed 'banner'
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductTab, setSelectedProductTab] = useState<ProductTab>('all'); // New state for product tabs
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>(''); // FIX: Correctly initialize walletAddress state

  // Use custom hooks for data management
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct, bulkAddProducts } = useProducts();
  const { orders, loading: ordersLoading, createOrder, updateOrderStatus } = useOrders(walletAddress);
  const { categories: categoriesData, addCategory, updateCategory, deleteCategory } = useCategories();
  const { settings: adminSettings, updateSettings: updateAdminSettings } = useAdminSettings();
  
  const t = (key: string) => translations[key]?.[language] || key;

  const categoryOptions = [
    { id: 'all', name: t('allProducts') },
    ...categoriesData.map(cat => ({
      id: cat.slug,
      name: language === 'tr' ? cat.name_tr : cat.name_en
    }))
  ];

  const filteredProducts = products.filter(product => {
    // Add defensive checks for product and its properties
    if (!product || typeof product.name === 'undefined' || product.name === null ||
        typeof product.description === 'undefined' || product.description === null) {
      console.warn('Skipping product due to missing name or description:', product);
      return false;
    }

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesTab = true;
    if (selectedProductTab === 'featured') {
      matchesTab = product.is_new === true; // Assuming 'new' products are 'featured'
    } else if (selectedProductTab === 'best-selling') {
      matchesTab = (product.rating || 0) >= 4.5; // Assuming high-rated products are 'best-selling'
    } else if (selectedProductTab === 'discounted') {
      matchesTab = (product.discount_percentage || 0) > 0;
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleAddToFavorites = (product: Product) => {
    console.log('Added to favorites:', product.name);
    // Here you would implement the actual logic to add to a favorites list
    // For now, it just logs to console.
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleAdminLogin = (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handlePlaceOrder = async (shippingAddress: ShippingAddress, total: number) => {
    try {
      const newOrder = await createOrder(cartItems, shippingAddress, total, walletAddress);
      
      setCartItems([]);
      setCurrentView('home');
      
      alert(`${t('orderPlacedSuccessfully')} ${newOrder.id}`);
    } catch (error) {
      console.error('Error saving order:', error);
      alert(t('errorPlacingOrder'));
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Show loading state while data is being fetched
  if (productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('loading')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('pleaseWait')}</p>
        </div>
      </div>
    );
  }

  // Admin view without authentication
  if (currentView === 'admin' && !isAdminAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable to go to homepage */}
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="flex items-center">
                <img
                  src="https://apricot-rational-booby-281.mypinata.cloud/ipfs/bafkreic3xn3bc43ziabhzdqjj3v5e6f7w6r2yl64fuezsz3frkowa2e3di"
                  alt="Shop Memex Logo"
                  className="h-8 w-auto"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ml-2">
                  Shop Memex
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <Home size={16} />
                <span>{t('home')}</span>
              </button>
              <button
                onClick={() => setCurrentView('cart')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  currentView === 'cart'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{t('cart')}</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsAdminAuthenticated(false);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <Settings size={16} />
                <span>{t('admin')}</span>
              </button>
            </nav>

            {/* Right Side - Language & Wallet */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector 
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              {/* WalletConnection is specifically for Phantom Wallet. If you encounter MetaMask errors,
                  please ensure no other parts of your application or browser extensions are attempting
                  to connect to MetaMask (window.ethereum). */}
              <WalletConnection 
                isConnected={isWalletConnected}
                walletAddress={walletAddress}
                onConnect={setIsWalletConnected}
                onAddressChange={setWalletAddress}
              />
              {isWalletConnected && (
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'profile'
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <User size={16} />
                  <span>{t('myProfile')}</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentView === 'home'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <Home size={16} />
                <span>{t('home')}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('cart');
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors relative ${
                  currentView === 'cart'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <ShoppingCart size={16} />
                <span>{t('cart')}</span>
                {cartItemsCount > 0 && (
                  <span className="bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsAdminAuthenticated(false);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentView === 'admin'
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                }`}
              >
                <Settings size={16} />
                <span>{t('admin')}</span>
              </button>
              <div className="px-3 py-2 space-y-2">
                <LanguageSelector 
                  currentLanguage={language}
                  onLanguageChange={setLanguage}
                />
                <WalletConnection 
                  isConnected={isWalletConnected}
                  walletAddress={walletAddress}
                  onConnect={setIsWalletConnected}
                  onAddressChange={setWalletAddress}
                />
                {isWalletConnected && (
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentView === 'profile'
                        ? 'text-pink-600 bg-pink-50'
                        : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <User size={16} />
                    <span>{t('myProfile')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div>
            {/* Hero Banner */}
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-12">
              <HeroBanner language={language} />
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('searchProducts')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categoryOptions.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Tabs */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setSelectedProductTab('all')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedProductTab === 'all'
                      ? 'bg-white text-pink-600 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span>{t('allProducts')}</span>
                </button>
                <button
                  onClick={() => setSelectedProductTab('featured')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedProductTab === 'featured'
                      ? 'bg-white text-pink-600 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span>{t('featuredProducts')}</span>
                </button>
                <button
                  onClick={() => setSelectedProductTab('best-selling')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedProductTab === 'best-selling'
                      ? 'bg-white text-pink-600 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span>{t('bestSellingProducts')}</span>
                </button>
                <button
                  onClick={() => setSelectedProductTab('discounted')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedProductTab === 'discounted'
                      ? 'bg-white text-pink-600 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span>{t('discountedProducts')}</span>
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onAddToFavorites={handleAddToFavorites} // Pass the new handler
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('noProductsFound')}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t('tryAdjustingSearch')}</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'cart' && (
          <Cart
            items={cartItems}
            language={language}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            total={cartTotal}
            isWalletConnected={isWalletConnected}
            walletAddress={walletAddress}
            onCheckout={() => setCurrentView('checkout')}
            adminSettings={adminSettings}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutForm
            items={cartItems}
            language={language}
            subtotal={cartTotal}
            adminSettings={adminSettings}
            onPlaceOrder={handlePlaceOrder}
            onCancel={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'profile' && isWalletConnected && (
          <ProfilePage
            walletAddress={walletAddress}
            language={language}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            language={language}
            onAddToCart={(product, quantity) => {
              addToCart(product, quantity);
              alert(t('productAddedToCart').replace('{quantity}', quantity.toString()).replace('{productName}', product.name));
            }}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin' && isAdminAuthenticated && (
          <div>
            {/* Admin Navigation */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setAdminView('products')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    adminView === 'products'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Package size={16} />
                  <span>{t('products')}</span>
                </button>
                <button
                  onClick={() => setAdminView('orders')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    adminView === 'orders'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar size={16} />
                  <span>{t('orders')}</span>
                </button>
                <button
                  onClick={() => setAdminView('settings')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    adminView === 'settings'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings size={16} />
                  <span>{t('settings')}</span>
                </button>
                {/* Removed Banner button */}
                <button
                  onClick={() => setAdminView('bulk')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    adminView === 'bulk'
                      ? 'bg-white text-pink-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Upload size={16} />
                  <span>{t('bulkImportExport')}</span>
                </button>
              </div>
            </div>

            {/* Admin Content */}
            {adminView === 'products' && (
              <AdminPanel
                products={products}
                categories={categoriesData}
                language={language}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                onBulkAddProducts={bulkAddProducts}
              />
            )}

            {adminView === 'orders' && (
              <OrderManagement
                orders={orders}
                language={language}
                onUpdateOrderStatus={updateOrderStatus}
              />
            )}

            {adminView === 'settings' && (
              <AdminSettings
                settings={adminSettings}
                onUpdateSettings={updateAdminSettings}
              />
            )}
            {adminView === 'bulk' && (
              <BulkProductImport
                categories={categoriesData}
                onBulkAddProducts={bulkAddProducts}
              />
            )}
            {/* Removed AdminBannerSettings component */}
          </div>
        )}

        {currentView === 'privacyPolicy' && (
          <PrivacyPolicy language={language} onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'termsOfService' && (
          <TermsOfService language={language} onBack={() => setCurrentView('home')} />
        )}

        {currentView === 'cookies' && (
          <CookiesPolicy language={language} onBack={() => setCurrentView('home')} />
        )}
      </main>

      <Footer language={language} setCurrentView={setCurrentView} />
      <ScrollToTopButton /> {/* Add the ScrollToTopButton component here */}
    </div>
  );
}

export default App;
