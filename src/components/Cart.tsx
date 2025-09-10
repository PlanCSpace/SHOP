import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Wallet, Tag } from 'lucide-react';
import { CartItem, AdminSettings as AdminSettingsType, Language } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/currencyConverter';

interface CartProps {
  items: CartItem[];
  language: Language;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  total: number;
  isWalletConnected: boolean;
  walletAddress: string;
  onCheckout: () => void;
  adminSettings: AdminSettingsType;
}

const Cart: React.FC<CartProps> = ({
  items,
  language,
  onUpdateQuantity,
  onRemoveItem,
  total,
  isWalletConnected,
  walletAddress,
  onCheckout,
  adminSettings,
}) => {
  const t = (key: string) => translations[key]?.[language] || key;

  // State for coupon management
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const shippingCost = adminSettings.free_shipping_threshold && total >= adminSettings.free_shipping_threshold ? 0 : adminSettings.shipping_cost;
  
  let currentTotal = total;

  // Apply coupon discount if applicable
  if (appliedCoupon && couponDiscountPercent > 0) {
    const discountAmount = currentTotal * (couponDiscountPercent / 100);
    currentTotal -= discountAmount;
    // Update couponDiscount state to reflect the actual calculated discount
    if (couponDiscount !== discountAmount) {
      setCouponDiscount(discountAmount);
    }
  }

  const finalTotal = currentTotal + shippingCost;

  // Get coupon details from environment variables
  const envCouponCode = import.meta.env.VITE_COUPON_CODE?.toLowerCase();
  const envCouponDiscount = parseFloat(import.meta.env.VITE_COUPON_DISCOUNT || '0');

  const applyCoupon = () => {
    setCouponError(null); // Clear previous errors
    if (couponCode.toLowerCase() === envCouponCode) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponDiscountPercent(envCouponDiscount);
      // Recalculate discount based on current total
      const discountAmount = total * (envCouponDiscount / 100);
      setCouponDiscount(discountAmount);
    } else {
      setCouponError(t('invalidCouponCode'));
      setAppliedCoupon(null);
      setCouponDiscountPercent(0);
      setCouponDiscount(0);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('shoppingCart')}</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <ShoppingCart className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('yourCartIsEmpty')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('addItemsToCart')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  <div className="mt-1">
                    {item.discount_percentage > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(item.price, 'MEMEXSOL')}
                        </span>
                        <span className="text-pink-600 dark:text-pink-400 font-bold">
                          {formatCurrency(item.price * (1 - item.discount_percentage / 100), 'MEMEXSOL')}
                        </span>
                      </div>
                    ) : (
                      <p className="text-pink-600 dark:text-pink-400 font-bold">
                        {formatCurrency(item.price, 'MEMEXSOL')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('orderSummary')}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(total, 'MEMEXSOL')}</span>
              </div>
              
              {/* Coupon Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag size={16} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('couponCode')}</span>
                </div>
                
                {!appliedCoupon ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={t('enterCouponCode')}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors text-sm"
                    >
                      {t('apply')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Tag size={16} className="text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        {appliedCoupon} (-{couponDiscountPercent}%)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      {t('remove')}
                    </button>
                  </div>
                )}
                
                {couponError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{couponError}</p>
                )}
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                  <span>{t('couponDiscount')} ({appliedCoupon})</span>
                  <span className="font-semibold">-{formatCurrency(couponDiscount, 'MEMEXSOL')}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span>{t('shipping')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shippingCost === 0 ? t('free') : formatCurrency(shippingCost, 'MEMEXSOL')}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900 dark:text-white">{t('total')}</span>
                <span className="text-pink-600 dark:text-pink-400">{formatCurrency(finalTotal, 'MEMEXSOL')}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center space-x-3">
              <Wallet size={20} className="text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Phantom Wallet</p>
                <p className={`text-sm ${isWalletConnected ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {isWalletConnected ? walletAddress : t('notConnected')}
                </p>
              </div>
            </div>

            <button
              onClick={onCheckout}
              disabled={!isWalletConnected || items.length === 0}
              className="mt-6 w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!isWalletConnected ? t('connectWalletToCheckout') : t('checkout')}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              {t('securePaymentPoweredByPhantomWallet')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
