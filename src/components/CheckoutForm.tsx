import React, { useState } from 'react';
import { Wallet, CreditCard, Lock } from 'lucide-react';
import { CartItem, ShippingAddress, AdminSettings, Language } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/currencyConverter';
import { processPayment, getPaymentWalletAddress, checkPhantomConnection, checkMemexSolBalance } from '../utils/paymentService';

interface CheckoutFormProps {
  items: CartItem[];
  language: Language;
  subtotal: number;
  adminSettings: AdminSettings;
  onPlaceOrder: (shippingAddress: ShippingAddress, total: number) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  language,
  subtotal,
  adminSettings,
  onPlaceOrder,
  onCancel,
}) => {
  const t = (key: string) => translations[key]?.[language] || key;
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: '',
    phone: '',
  });

  const shippingCost = adminSettings.free_shipping_threshold && subtotal >= adminSettings.free_shipping_threshold ? 0 : adminSettings.shipping_cost;
  const total = subtotal + shippingCost;

  // Kullanıcının MEMEXSOL bakiyesini kontrol et
  React.useEffect(() => {
    const checkBalance = async () => {
      const connectionCheck = await checkPhantomConnection();
      if (connectionCheck.connected && connectionCheck.address) {
        setIsWalletConnected(true);
        setWalletAddress(connectionCheck.address);
        const balanceResult = await checkMemexSolBalance(connectionCheck.address);
        if (!balanceResult.error) {
          setUserBalance(balanceResult.balance);
        }
      } else {
        setIsWalletConnected(false);
        setWalletAddress('');
        setUserBalance(0);
      }
    };

    checkBalance();
    
    // Her 30 saniyede bir bakiyeyi güncelle
    const interval = setInterval(checkBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Phantom Wallet bağlantı kontrolü
    if (!isWalletConnected) {
      setPaymentError(
        language === 'tr' 
          ? 'Lütfen önce Phantom Wallet\'ınızı bağlayın.' 
          : language === 'ar'
          ? 'يرجى ربط محفظة Phantom أولاً.'
          : 'Please connect your Phantom Wallet first.'
      );
      return;
    }
    
    // Basic validation
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.zipCode || !formData.country || !formData.email || !formData.phone) {
      setPaymentError(
        language === 'tr' 
          ? 'Lütfen tüm gerekli alanları doldurun.' 
          : language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة.'
          : 'Please fill in all required fields.'
      );
      return;
    }
    
    // Bakiye kontrolü
    if (userBalance < total) {
      setPaymentError(
        language === 'tr' 
          ? `Yetersiz MEMEXSOL bakiyesi. Mevcut: ${userBalance.toFixed(2)}, Gerekli: ${total.toFixed(2)}` 
          : `Insufficient MEMEXSOL balance. Available: ${userBalance.toFixed(2)}, Required: ${total.toFixed(2)}`
      );
      return;
    }
    
    handlePayment();
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // Önce Phantom Wallet bağlantısını kontrol et
      const connectionCheck = await checkPhantomConnection();
      if (!connectionCheck.connected) {
        setPaymentError(
          language === 'tr' 
            ? `Phantom Wallet hatası: ${connectionCheck.error}` 
            : language === 'ar' 
            ? `خطأ في محفظة Phantom: ${connectionCheck.error}`
            : `Phantom Wallet error: ${connectionCheck.error}`
        );
        setIsProcessingPayment(false);
        return;
      }

      // Bakiye kontrolü
      if (userBalance < total) {
        setPaymentError(
          language === 'tr' 
            ? `Yetersiz MEMEXSOL bakiyesi. Mevcut: ${userBalance.toFixed(2)}, Gerekli: ${total.toFixed(2)}` 
            : `Insufficient MEMEXSOL balance. Available: ${userBalance.toFixed(2)}, Required: ${total.toFixed(2)}`
        );
        setIsProcessingPayment(false);
        return;
      }

      const paymentWalletAddress = getPaymentWalletAddress();
      const orderId = `ORD-${Date.now().toString().slice(-6)}`;

      console.log('Ödeme bilgileri:', {
        amount: total,
        from: connectionCheck.address,
        to: paymentWalletAddress,
        orderId: orderId
      });

      const paymentResult = await processPayment({
        amount: total,
        recipient: paymentWalletAddress,
        orderId: orderId
      });

      if (paymentResult.success) {
        console.log('✅ Ödeme başarılı!', {
          transactionId: paymentResult.transactionId,
          amount: total,
          orderId: orderId
        });
        
        // Ödeme başarılı, siparişi oluştur
        onPlaceOrder(formData, total);
      } else {
        setPaymentError(
          paymentResult.error || 
          (language === 'tr' ? 'Ödeme işlemi başarısız oldu.' 
           : language === 'ar' ? 'فشل في معالجة الدفع.'
           : 'Payment processing failed.')
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(
        language === 'tr' ? `Ödeme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
        : language === 'ar' ? 'حدث خطأ أثناء معالجة الدفع.'
        : `Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t('checkout')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('shippingInformation')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('fullName')}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('addressLine1')}
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('addressLine2')} ({t('optional')})
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('city')}
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('state')} ({t('optional')})
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('zipCode')}
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('country')}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('orderSummary')}</h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-200">{item.name} ({item.quantity}x)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity, 'MEMEXSOL')}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
                <span>{t('subtotal')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subtotal, 'MEMEXSOL')}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-200">
                <span>{t('shipping')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shippingCost === 0 ? t('free') : formatCurrency(shippingCost, 'MEMEXSOL')}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
                <span className="text-gray-900 dark:text-white">{t('total')}</span>
                <span className="text-pink-600 dark:text-pink-400">{formatCurrency(total, 'MEMEXSOL')}</span>
              </div>
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 space-y-4 mt-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 flex items-center">
              <Wallet className="mr-2" size={20} />
              {language === 'tr' ? 'Ödeme Bilgileri' : language === 'ar' ? 'معلومات الدفع' : 'Payment Information'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <CreditCard className="text-blue-600 dark:text-blue-400" size={16} />
                <span className="text-blue-800 dark:text-blue-200">
                  {language === 'tr' 
                    ? 'Phantom Wallet ile MEMEXSOL ödemesi' 
                    : language === 'ar' 
                    ? 'دفع MEMEXSOL عبر محفظة Phantom' 
                    : 'MEMEXSOL payment via Phantom Wallet'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="text-green-600 dark:text-green-400" size={16} />
                <span className="text-blue-800 dark:text-blue-200">
                  {language === 'tr' 
                    ? 'Güvenli blockchain ödemesi' 
                    : language === 'ar' 
                    ? 'دفع آمن عبر البلوك تشين' 
                    : 'Secure blockchain payment'
                  }
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-3 border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {language === 'tr' 
                    ? 'Ödeme Adresi:' 
                    : language === 'ar' 
                    ? 'عنوان الدفع:' 
                    : 'Payment Address:'
                  }
                </p>
                <p className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {getPaymentWalletAddress()}
                </p>
              </div>
              {userBalance > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 border border-green-200 dark:border-green-700">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    {language === 'tr' 
                      ? `✅ MEMEXSOL Bakiyeniz: ${userBalance.toFixed(2)}` 
                      : language === 'ar' 
                      ? `✅ رصيد MEMEXSOL الخاص بك: ${userBalance.toFixed(2)}`
                      : `✅ Your MEMEXSOL Balance: ${userBalance.toFixed(2)}`
                    }
                  </p>
                </div>
              )}
              {!isWalletConnected && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded p-3 border border-red-200 dark:border-red-700">
                <p className="text-xs text-red-800 dark:text-red-200">
                  {language === 'tr' 
                    ? '❌ Phantom Wallet bağlı değil! Lütfen önce cüzdanınızı bağlayın.' 
                    : language === 'ar' 
                    ? '❌ محفظة Phantom غير متصلة! يرجى ربط محفظتك أولاً.'
                    : '❌ Phantom Wallet not connected! Please connect your wallet first.'
                  }
                </p>
              </div>
              )}
              {isWalletConnected && userBalance === 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-3 border border-yellow-200 dark:border-yellow-700">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  {language === 'tr' 
                    ? '⚠️ Ödeme yapmadan önce Phantom Wallet\'ınızda yeterli MEMEXSOL bakiyesi olduğundan emin olun.' 
                    : language === 'ar' 
                    ? '⚠️ تأكد من وجود رصيد MEMEXSOL كافٍ في محفظة Phantom قبل الدفع.'
                    : '⚠️ Make sure you have sufficient MEMEXSOL balance in your Phantom Wallet before payment.'
                  }
                </p>
              </div>
              )}
              {userBalance > 0 && userBalance < total && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded p-3 border border-red-200 dark:border-red-700">
                  <p className="text-xs text-red-800 dark:text-red-200">
                    ⚠️ {language === 'tr' 
                      ? `Yetersiz bakiye! Gerekli: ${total.toFixed(2)} MEMEXSOL` 
                      : `Insufficient balance! Required: ${total.toFixed(2)} MEMEXSOL`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {paymentError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mt-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                {paymentError}
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessingPayment}
              className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isProcessingPayment || !isWalletConnected || userBalance < total}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isProcessingPayment || !isWalletConnected || userBalance < total
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
              } text-white`}
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {language === 'tr' 
                      ? 'Ödeme İşleniyor...' 
                      : language === 'ar' 
                      ? 'جاري معالجة الدفع...' 
                      : 'Processing Payment...'
                    }
                  </span>
                </>
              ) : (
                <>
                  <Wallet size={20} />
                  <span>
                    {!isWalletConnected 
                      ? (language === 'tr' ? 'Cüzdan Bağlayın' : 'Connect Wallet')
                      : userBalance < total 
                      ? (language === 'tr' ? 'Yetersiz Bakiye' : 'Insufficient Balance')
                      : t('payAndPlaceOrder')
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
