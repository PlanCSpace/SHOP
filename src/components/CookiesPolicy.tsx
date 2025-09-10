import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LegalPageProps {
  language: Language;
  onBack: () => void;
}

const CookiesPolicy: React.FC<LegalPageProps> = ({ language, onBack }) => {
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

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('cookies')}</h1>

      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {language === 'en' && (
          <p>
            This Cookies Policy explains what cookies are, how we use them, and how you can manage them.
          </p>
        )}
        {language === 'tr' && (
          <p>
            Bu Çerez Politikası, çerezlerin ne olduğunu, bunları nasıl kullandığımızı ve nasıl yönetebileceğinizi açıklar.
          </p>
        )}
        {language === 'ar' && (
          <p>
            توضح سياسة ملفات تعريف الارتباط هذه ما هي ملفات تعريف الارتباط، وكيف نستخدمها، وكيف يمكنك إدارتها.
          </p>
        )}

        <h2>
          {language === 'en' && 'What are Cookies?'}
          {language === 'tr' && 'Çerezler Nedir?'}
          {language === 'ar' && 'ما هي ملفات تعريف الارتباط؟'}
        </h2>
        {language === 'en' && (
          <p>
            Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website. They are widely used to make websites work more efficiently, as well as to provide reporting information.
          </p>
        )}
        {language === 'tr' && (
          <p>
            Çerezler, bir web sitesini ziyaret ettiğinizde cihazınızda (bilgisayar veya mobil cihaz) depolanan küçük veri parçacıklarıdır. Web sitelerinin daha verimli çalışmasını sağlamak ve raporlama bilgileri sağlamak için yaygın olarak kullanılırlar.
          </p>
        )}
        {language === 'ar' && (
          <p>
            ملفات تعريف الارتباط هي أجزاء صغيرة من البيانات المخزنة على جهازك (الكمبيوتر أو الجهاز المحمول) عند زيارة موقع ويب. تُستخدم على نطاق واسع لجعل مواقع الويب تعمل بكفاءة أكبر، بالإضافة إلى توفير معلومات التقارير.
          </p>
        )}

        <h2>
          {language === 'en' && 'How We Use Cookies'}
          {language === 'tr' && 'Çerezleri Nasıl Kullanıyoruz'}
          {language === 'ar' && 'كيف نستخدم ملفات تعريف الارتباط'}
        </h2>
        {language === 'en' && (
          <p>
            We use cookies for several purposes:
          </p>
        )}
        {language === 'tr' && (
          <p>
            Çerezleri çeşitli amaçlarla kullanıyoruz:
          </p>
        )}
        {language === 'ar' && (
          <p>
            نحن نستخدم ملفات تعريف الارتباط لعدة أغراض:
          </p>
        )}
        <ul>
          <li>
            {language === 'en' && 'Essential Cookies: These cookies are strictly necessary to provide you with services available through our Website and to enable you to use some of its features.'}
            {language === 'tr' && 'Temel Çerezler: Bu çerezler, Web Sitemiz aracılığıyla size sunulan hizmetleri sağlamak ve bazı özelliklerini kullanmanızı sağlamak için kesinlikle gereklidir.'}
            {language === 'ar' && 'ملفات تعريف الارتباط الأساسية: هذه الملفات ضرورية للغاية لتزويدك بالخدمات المتاحة عبر موقعنا الإلكتروني ولتمكينك من استخدام بعض ميزاته.'}
          </li>
          <li>
            {language === 'en' && 'Performance and Functionality Cookies: These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use.'}
            {language === 'tr' && 'Performans ve İşlevsellik Çerezleri: Bu çerezler, Web Sitemizin performansını ve işlevselliğini artırmak için kullanılır, ancak kullanımları için temel değildir.'}
            {language === 'ar' && 'ملفات تعريف الارتباط الخاصة بالأداء والوظائف: تُستخدم هذه الملفات لتحسين أداء ووظائف موقعنا الإلكتروني ولكنها ليست ضرورية لاستخدامها.'}
          </li>
          <li>
            {language === 'en' && 'Analytics and Customization Cookies: These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.'}
            {language === 'tr' && 'Analiz ve Kişiselleştirme Çerezleri: Bu çerezler, Web Sitemizin nasıl kullanıldığını veya pazarlama kampanyalarımızın ne kadar etkili olduğunu anlamamıza yardımcı olmak için toplu biçimde kullanılan veya Web Sitemizi sizin için kişiselleştirmemize yardımcı olmak için kullanılan bilgileri toplar.'}
            {language === 'ar' && 'ملفات تعريف الارتباط الخاصة بالتحليلات والتخصيص: تجمع هذه الملفات معلومات تُستخدم إما بشكل مجمع لمساعدتنا في فهم كيفية استخدام موقعنا الإلكتروني أو مدى فعالية حملاتنا التسويقية، أو لمساعدتنا في تخصيص موقعنا الإلكتروني لك.'}
          </li>
        </ul>

        <h2>
          {language === 'en' && 'Your Choices Regarding Cookies'}
          {language === 'tr' && 'Çerezlerle İlgili Seçimleriniz'}
          {language === 'ar' && 'خياراتك بخصوص ملفات تعريف الارتباط'}
        </h2>
        {language === 'en' && (
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or in your browser settings.
          </p>
        )}
        {language === 'tr' && (
          <p>
            Çerezleri kabul edip etmeme konusunda karar verme hakkına sahipsiniz. Çerez tercihlerinizi, çerez bannerında veya tarayıcı ayarlarınızda sağlanan uygun devre dışı bırakma bağlantılarına tıklayarak kullanabilirsiniz.
          </p>
        )}
        {language === 'ar' && (
          <p>
            لديك الحق في تحديد ما إذا كنت ستقبل ملفات تعريف الارتباط أو ترفضها. يمكنك ممارسة تفضيلات ملفات تعريف الارتباط الخاصة بك عن طريق النقر على روابط إلغاء الاشتراك المناسبة المتوفرة في لافتة ملفات تعريف الارتباط أو في إعدادات متصفحك.
          </p>
        )}
      </div>
    </div>
  );
};

export default CookiesPolicy;
