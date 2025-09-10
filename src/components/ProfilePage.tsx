import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Calendar, Truck, Eye, ArrowLeft, Star, Heart, Settings } from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../utils/translations';
import { supabase } from '../lib/supabase';

interface ProfilePageProps {
  walletAddress: string;
  language: Language;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ walletAddress, language, onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'settings'>('orders');
  
  const t = (key: string) => translations[key]?.[language] || key;

  useEffect(() => {
    fetchUserOrders();
  }, [walletAddress]);

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_wallet', walletAddress.toString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders: Order[] = data.map(order => ({
        id: order.id,
        items: order.items,
        shippingAddress: order.shipping_address,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        total: order.total,
        status: order.status,
        walletAddress: order.user_wallet,
        createdAt: new Date(order.created_at),
        trackingNumber: order.tracking_number
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>{t('backToHome')}</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{t('myProfile')}</h1>
        <div></div>
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('welcomeBack')}</h2>
            <p className="text-pink-100 mb-2">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Package size={16} />
                <span>{orders.length} {t('orders')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} />
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'orders'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package size={16} />
          <span>{t('myOrders')}</span>
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart size={16} />
          <span>{t('favorites')}</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings size={16} />
          <span>{t('settings')}</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('noOrders')}</h3>
              <p className="text-gray-600">{t('noOrdersDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">#{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        {order.createdAt.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {t(order.status)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-pink-600">
                          {item.price * item.quantity} MEMEXSOL
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-500">
                        +{order.items.length - 2} {t('moreItems')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-lg font-bold text-pink-600">{order.total} MEMEXSOL</span>
                      <p className="text-xs text-gray-500">{order.items.length} {t('items')}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center space-x-1 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                    >
                      <Eye size={16} />
                      <span>{t('viewDetails')}</span>
                    </button>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Truck className="text-blue-600" size={16} />
                        <span className="text-sm font-medium text-blue-900">{t('trackingNumber')}:</span>
                        <span className="text-sm text-blue-700 font-mono">{order.trackingNumber}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('noFavorites')}</h3>
          <p className="text-gray-600">{t('noFavoritesDesc')}</p>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('accountSettings')}</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{t('walletAddress')}</h4>
              <p className="text-sm text-gray-600 font-mono break-all">{walletAddress}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{t('membershipStatus')}</h4>
              <p className="text-sm text-gray-600">Premium Member</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{t('totalOrders')}</h4>
              <p className="text-sm text-gray-600">{orders.length} {t('orders')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {t('orderDetails')} #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{t('orderStatus')}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)} {t(selectedOrder.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {t('orderPlaced')}: {selectedOrder.createdAt.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="mr-2" size={16} />
                  {t('shippingAddress')}
                </h4>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p className="mt-2">
                    <span className="font-medium">{t('phone')}:</span> {selectedOrder.shippingAddress.phone}
                  </p>
                  <p>
                    <span className="font-medium">{t('email')}:</span> {selectedOrder.shippingAddress.email}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="mr-2" size={16} />
                  {t('orderItems')}
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-600 capitalize">{t(item.category)}</p>
                        <p className="text-sm text-gray-600">{t('quantity')}: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-pink-600">
                        {item.price * item.quantity} MEMEXSOL
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t('orderSummary')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('subtotal')}:</span>
                    <span>{selectedOrder.subtotal} MEMEXSOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('shipping')}:</span>
                    <span>{selectedOrder.shippingCost === 0 ? t('free') : `${selectedOrder.shippingCost} MEMEXSOL`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>{t('total')}:</span>
                    <span className="text-pink-600">{selectedOrder.total} MEMEXSOL</span>
                  </div>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="text-blue-600" size={20} />
                    <span className="font-medium text-blue-900">{t('trackingNumber')}:</span>
                    <span className="text-blue-700 font-mono">{selectedOrder.trackingNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
