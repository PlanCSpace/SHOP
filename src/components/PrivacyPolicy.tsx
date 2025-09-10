import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LegalPageProps {
  language: Language;
  onBack: () => void;
}

const PrivacyPolicy: React.FC<LegalPageProps> = ({ language, onBack }) => {
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

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('privacyPolicy')}</h1>

      <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>
          {language === 'en' && (
            <>
              This Privacy Policy describes how Shop Memex collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
            </>
          )}
          {language === 'tr' && (
            <>
              Bu Gizlilik Politikası, Shop Memex'in Siteyi ziyaret ettiğinizde veya alışveriş yaptığınızda Kişisel Bilgilerinizi nasıl topladığını, kullandığını ve ifşa ettiğini açıklar.
            </>
          )}
          {language === 'ar' && (
            <>
              تصف سياسة الخصوصية هذه كيف يقوم Shop Memex بجمع واستخدام والكشف عن معلوماتك الشخصية عند زيارتك أو قيامك بعملية شراء من الموقع.
            </>
          )}
        </p>

        <h2>
          {language === 'en' && 'Collection of Personal Information'}
          {language === 'tr' && 'Kişisel Bilgilerin Toplanması'}
          {language === 'ar' && 'جمع المعلومات الشخصية'}
        </h2>
        <p>
          {language === 'en' && (
            <>
              When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as “Personal Information”. See the list below for more information about what Personal Information we collect and why.
            </>
          )}
          {language === 'tr' && (
            <>
              Siteyi ziyaret ettiğinizde, cihazınız hakkında belirli bilgileri, Site ile etkileşiminizi ve satın alımlarınızı işlemek için gerekli bilgileri toplarız. Müşteri desteği için bizimle iletişime geçerseniz ek bilgiler de toplayabiliriz. Bu Gizlilik Politikasında, bir kişiyi benzersiz bir şekilde tanımlayabilen herhangi bir bilgiyi (aşağıdaki bilgiler dahil) "Kişisel Bilgi" olarak adlandırırız. Hangi Kişisel Bilgileri topladığımız ve neden topladığımız hakkında daha fazla bilgi için aşağıdaki listeye bakın.
            </>
          )}
          {language === 'ar' && (
            <>
              عند زيارتك للموقع، نقوم بجمع معلومات معينة حول جهازك، وتفاعلك مع الموقع، والمعلومات الضرورية لمعالجة مشترياتك. قد نقوم أيضًا بجمع معلومات إضافية إذا اتصلت بنا للحصول على دعم العملاء. في سياسة الخصوصية هذه، نشير إلى أي معلومات يمكن أن تحدد هوية فرد بشكل فريد (بما في ذلك المعلومات أدناه) باسم "المعلومات الشخصية". انظر القائمة أدناه لمزيد من المعلومات حول المعلومات الشخصية التي نجمعها ولماذا.
            </>
          )}
        </p>
        <h3>
          {language === 'en' && 'Device information'}
          {language === 'tr' && 'Cihaz bilgileri'}
          {language === 'ar' && 'معلومات الجهاز'}
        </h3>
        <ul>
          <li>
            {language === 'en' && 'Examples of Personal Information collected: version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.'}
            {language === 'tr' && 'Toplanan Kişisel Bilgi örnekleri: web tarayıcısı sürümü, IP adresi, saat dilimi, çerez bilgileri, hangi siteleri veya ürünleri görüntülediğiniz, arama terimleri ve Site ile nasıl etkileşim kurduğunuz.'}
            {language === 'ar' && 'أمثلة على المعلومات الشخصية التي تم جمعها: إصدار متصفح الويب، عنوان IP، المنطقة الزمنية، معلومات ملفات تعريف الارتباط، المواقع أو المنتجات التي تشاهدها، مصطلحات البحث، وكيف تتفاعل مع الموقع.'}
          </li>
          <li>
            {language === 'en' && 'Purpose of collection: to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.'}
            {language === 'tr' && 'Toplama amacı: Siteyi sizin için doğru bir şekilde yüklemek ve Sitemizi optimize etmek için Site kullanımına ilişkin analizler yapmak.'}
            {language === 'ar' && 'الغرض من الجمع: تحميل الموقع بدقة لك، وإجراء تحليلات على استخدام الموقع لتحسين موقعنا.'}
          </li>
          <li>
            {language === 'en' && 'Source of collection: Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.'}
            {language === 'tr' && 'Toplama kaynağı: Çerezler, günlük dosyaları, web işaretçileri, etiketler veya pikseller kullanılarak Sitemize eriştiğinizde otomatik olarak toplanır.'}
            {language === 'ar' && 'مصدر الجمع: يتم جمعها تلقائيًا عند وصولك إلى موقعنا باستخدام ملفات تعريف الارتباط، ملفات السجل، إشارات الويب، العلامات، أو البكسلات.'}
          </li>
        </ul>

        <h2>
          {language === 'en' && 'Sharing Personal Information'}
          {language === 'tr' && 'Kişisel Bilgilerin Paylaşılması'}
          {language === 'ar' && 'مشاركة المعلومات الشخصية'}
        </h2>
        <p>
          {language === 'en' && (
            <>
              We share your Personal Information with service providers to help us provide our services and fulfill our contracts with you, as described above. For example:
            </>
          )}
          {language === 'tr' && (
            <>
              Yukarıda açıklandığı gibi, hizmetlerimizi sunmamıza ve sizinle olan sözleşmelerimizi yerine getirmemize yardımcı olmak için Kişisel Bilgilerinizi hizmet sağlayıcılarla paylaşırız. Örneğin:
            </>
          )}
          {language === 'ar' && (
            <>
              نشارك معلوماتك الشخصية مع مزودي الخدمة لمساعدتنا في تقديم خدماتنا والوفاء بعقودنا معك، كما هو موضح أعلاه. على سبيل المثال:
            </>
          )}
        </p>
        <ul>
          <li>
            {language === 'en' && 'We use Supabase to power our online store. You can read more about how Supabase uses your Personal Information here: [Supabase Privacy Policy Link].'}
            {language === 'tr' && 'Çevrimiçi mağazamızı güçlendirmek için Supabase kullanıyoruz. Supabase\'in Kişisel Bilgilerinizi nasıl kullandığı hakkında daha fazla bilgiyi buradan okuyabilirsiniz: [Supabase Gizlilik Politikası Bağlantısı].'}
            {language === 'ar' && 'نحن نستخدم Supabase لتشغيل متجرنا عبر الإنترنت. يمكنك قراءة المزيد حول كيفية استخدام Supabase لمعلوماتك الشخصية هنا: [رابط سياسة خصوصية Supabase].'}
          </li>
          <li>
            {language === 'en' && 'We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.'}
            {language === 'tr' && 'Geçerli yasalara ve düzenlemelere uymak, aldığımız bir mahkeme celbi, arama emri veya diğer yasal bilgi taleplerine yanıt vermek veya haklarımızı başka bir şekilde korumak için Kişisel Bilgilerinizi paylaşabiliriz.'}
            {language === 'ar' && 'قد نشارك معلوماتك الشخصية للامتثال للقوانين واللوائح المعمول بها، أو للرد على أمر استدعاء أو أمر تفتيش أو أي طلب قانوني آخر للمعلومات التي نتلقاها، أو لحماية حقوقنا بأي طريقة أخرى.'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
