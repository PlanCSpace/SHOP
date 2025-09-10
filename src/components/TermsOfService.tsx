import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LegalPageProps {
  language: Language;
  onBack: () => void;
}

const TermsOfService: React.FC<LegalPageProps> = ({ language, onBack }) => {
  const t = (key: string) => translations[key]?.[language] || key;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>{t('goBack')}</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('termsOfService')}</h1>

      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>
          {language === 'en' && (
            <>
              Welcome to Shop Memex! These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
            </>
          )}
          {language === 'tr' && (
            <>
              Shop Memex'e hoş geldiniz! Bu Hizmet Şartları ("Şartlar"), web sitemizi ve hizmetlerimizi kullanımınızı düzenler. Web sitemize erişerek veya kullanarak bu Şartlara bağlı kalmayı kabul etmiş olursunuz.
            </>
          )}
          {language === 'ar' && (
            <>
              مرحبًا بك في Shop Memex! تحكم شروط الخدمة هذه ("الشروط") استخدامك لموقعنا وخدماتنا. من خلال الوصول إلى موقعنا أو استخدامه، فإنك توافق على الالتزام بهذه الشروط.
            </>
          )}
        </p>

        <h2>
          {language === 'en' && '1. Acceptance of Terms'}
          {language === 'tr' && '1. Şartların Kabulü'}
          {language === 'ar' && '1. قبول الشروط'}
        </h2>
        <p>
          {language === 'en' && (
            <>
              By using our website, you confirm that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
            </>
          )}
          {language === 'tr' && (
            <>
              Web sitemizi kullanarak, ikamet ettiğiniz eyalet veya ilde reşit olduğunuzu veya ikamet ettiğiniz eyalet veya ilde reşit olduğunuzu ve küçük bağımlılarınızın bu siteyi kullanmasına izin vermemiz için bize onay verdiğinizi onaylarsınız.
            </>
          )}
          {language === 'ar' && (
            <>
              باستخدام موقعنا، فإنك تؤكد أنك على الأقل في سن الرشد في ولايتك أو مقاطعتك التي تقيم فيها، أو أنك في سن الرشد في ولايتك أو مقاطعتك التي تقيم فيها وقد منحتنا موافقتك للسماح لأي من تابعيك القصر باستخدام هذا الموقع.
            </>
          )}
        </p>

        <h2>
          {language === 'en' && '2. General Conditions'}
          {language === 'tr' && '2. Genel Koşullar'}
          {language === 'ar' && '2. الشروط العامة'}
        </h2>
        <p>
          {language === 'en' && (
            <>
              We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
            </>
          )}
          {language === 'tr' && (
            <>
              Herhangi bir zamanda herhangi bir nedenle hizmeti reddetme hakkını saklı tutarız. İçeriğinizin (kredi kartı bilgileri hariç) şifrelenmemiş olarak aktarılabileceğini ve (a) çeşitli ağlar üzerinden iletimleri; ve (b) bağlanan ağların veya cihazların teknik gereksinimlerine uyum sağlamak ve adapte olmak için değişiklikleri içerebileceğini anlarsınız. Kredi kartı bilgileri ağlar üzerinden aktarım sırasında her zaman şifrelenir.
            </>
          )}
          {language === 'ar' && (
            <>
              نحتفظ بالحق في رفض الخدمة لأي شخص لأي سبب في أي وقت. أنت تدرك أن محتواك (باستثناء معلومات بطاقة الائتمان) قد يتم نقله غير مشفر ويتضمن (أ) عمليات نقل عبر شبكات مختلفة؛ و (ب) تغييرات للتوافق والتكيف مع المتطلبات التقنية لربط الشبكات أو الأجهزة. يتم تشفير معلومات بطاقة الائتمان دائمًا أثناء النقل عبر الشبكات.
            </>
          )}
        </p>

        <h2>
          {language === 'en' && '3. Accuracy, Completeness and Timeliness of Information'}
          {language === 'tr' && '3. Bilgilerin Doğruluğu, Eksiksizliği ve Güncelliği'}
          {language === 'ar' && '3. دقة المعلومات واكتمالها وتوقيتها'}
        </h2>
        <p>
          {language === 'en' && (
            <>
              We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.
            </>
          )}
          {language === 'tr' && (
            <>
              Bu sitede sunulan bilgilerin doğru, eksiksiz veya güncel olmamasından sorumlu değiliz. Bu sitedeki materyal yalnızca genel bilgi amaçlıdır ve birincil, daha doğru, daha eksiksiz veya daha güncel bilgi kaynaklarına danışmadan karar vermek için tek temel olarak kullanılmamalıdır. Bu sitedeki materyale güvenmek kendi sorumluluğunuzdadır.
            </>
          )}
          {language === 'ar' && (
            <>
              نحن لسنا مسؤولين إذا كانت المعلومات المتاحة على هذا الموقع غير دقيقة أو كاملة أو حديثة. المواد الموجودة على هذا الموقع مقدمة للمعلومات العامة فقط ولا ينبغي الاعتماد عليها أو استخدامها كأساس وحيد لاتخاذ القرارات دون استشارة مصادر معلومات أولية أو أكثر دقة أو أكثر اكتمالًا أو أكثر حداثة. أي اعتماد على المواد الموجودة على هذا الموقع هو على مسؤوليتك الخاصة.
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
