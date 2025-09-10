import React, { useState, useEffect } from 'react';
import { HeroBannerContent, Language } from '../types';
import { translations } from '../utils/translations';
import { supabase } from '../lib/supabase'; // Corrected import path
import { Plus, X, CheckCircle } from 'lucide-react';

interface AdminHeroBannerCarouselSettingsProps {
  language: Language;
}

const AdminHeroBannerCarouselSettings: React.FC<AdminHeroBannerCarouselSettingsProps> = ({ language }) => {
  const t = (key: string) => translations[key]?.[language] || key;
  const [banners, setBanners] = useState<HeroBannerContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<HeroBannerContent | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // New state for success alert

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_banner_content')
      .select('*')
      .order('slide_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      setError(error.message);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (banner: HeroBannerContent) => {
    let error;
    if (banner.id) {
      // Update existing banner
      const { error: updateError } = await supabase
        .from('hero_banner_content')
        .update({
          title_en: banner.title_en,
          subtitle_en: banner.subtitle_en,
          description_en: banner.description_en,
          button_text_en: banner.button_text_en,
          image_url: banner.image_url,
          title_tr: banner.title_tr,
          subtitle_tr: banner.subtitle_tr,
          description_tr: banner.description_tr,
          button_text_tr: banner.button_text_tr,
          title_ar: banner.title_ar,
          subtitle_ar: banner.subtitle_ar,
          description_ar: banner.description_ar,
          button_text_ar: banner.button_text_ar,
          slide_order: banner.slide_order,
        })
        .eq('id', banner.id);
      error = updateError;
    } else {
      // Insert new banner
      const { error: insertError } = await supabase
        .from('hero_banner_content')
        .insert({
          title_en: banner.title_en,
          subtitle_en: banner.subtitle_en,
          description_en: banner.description_en,
          button_text_en: banner.button_text_en,
          image_url: banner.image_url,
          title_tr: banner.title_tr,
          subtitle_tr: banner.subtitle_tr,
          description_tr: banner.description_tr,
          button_text_tr: banner.button_text_tr,
          title_ar: banner.title_ar,
          subtitle_ar: banner.subtitle_ar,
          description_ar: banner.description_ar,
          button_text_ar: banner.button_text_ar,
          slide_order: banners.length + 1, // Suggest next order
        });
      error = insertError;
    }

    if (error) {
      console.error('Error saving banner:', error);
      setError(error.message);
      setShowSuccessAlert(false);
    } else {
      fetchBanners();
      setIsModalOpen(false);
      setCurrentBanner(null);
      setError(null);
      setShowSuccessAlert(true); // Show success alert
      setTimeout(() => setShowSuccessAlert(false), 3000); // Hide after 3 seconds
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteBanner'))) {
      const { error } = await supabase
        .from('hero_banner_content')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner:', error);
        setError(error.message);
      } else {
        fetchBanners();
        setError(null);
        setShowSuccessAlert(true); // Show success alert
        setTimeout(() => setShowSuccessAlert(false), 3000); // Hide after 3 seconds
      }
    }
  };

  const openCreateModal = () => {
    setCurrentBanner({
      id: '',
      title_en: '',
      subtitle_en: '',
      description_en: '',
      button_text_en: '',
      image_url: '',
      title_tr: '',
      subtitle_tr: '',
      description_tr: '',
      button_text_tr: '',
      title_ar: '',
      subtitle_ar: '',
      description_ar: '',
      button_text_ar: '',
      slide_order: banners.length + 1, // Suggest next order
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBannerContent) => {
    setCurrentBanner({ ...banner });
    setIsModalOpen(true);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBanner(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleModalSave = () => {
    if (currentBanner) {
      handleSave(currentBanner);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600 dark:text-gray-300">{t('loading')}...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{t('error')}: {error}</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('heroBannerCarouselSettings')}</h2>

      {showSuccessAlert && (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-green-900 dark:text-green-200" role="alert">
          <CheckCircle className="w-5 h-5 mr-3" />
          <span className="font-medium">{t('dataSavedSuccessfully')}</span>
        </div>
      )}

      <button
        onClick={openCreateModal}
        className="mb-6 flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
      >
        <Plus size={20} />
        <span>{t('addNewSlide')}</span>
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">{t('order')}</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">{t('title')} (EN)</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">{t('image')}</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{banner.slide_order}</td>
                <td className="py-3 px-4 text-gray-900 dark:text-white">{banner.title_en}</td>
                <td className="py-3 px-4">
                  <img src={banner.image_url} alt={banner.title_en} className="w-20 h-12 object-cover rounded-md" />
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentBanner && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentBanner.id ? t('editSlide') : t('createSlide')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('slideOrder')}</label>
                <input
                  type="number"
                  name="slide_order"
                  value={currentBanner.slide_order}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('imageUrl')}</label>
                <input
                  type="text"
                  name="image_url"
                  value={currentBanner.image_url}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* English Fields */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">{t('englishContent')}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')}</label>
                <input
                  type="text"
                  name="title_en"
                  value={currentBanner.title_en}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subtitle')}</label>
                <input
                  type="text"
                  name="subtitle_en"
                  value={currentBanner.subtitle_en}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                <textarea
                  name="description_en"
                  value={currentBanner.description_en}
                  onChange={handleModalChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('buttonText')}</label>
                <input
                  type="text"
                  name="button_text_en"
                  value={currentBanner.button_text_en}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Turkish Fields */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">{t('turkishContent')}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')}</label>
                <input
                  type="text"
                  name="title_tr"
                  value={currentBanner.title_tr}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subtitle')}</label>
                <input
                  type="text"
                  name="subtitle_tr"
                  value={currentBanner.subtitle_tr}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                <textarea
                  name="description_tr"
                  value={currentBanner.description_tr}
                  onChange={handleModalChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('buttonText')}</label>
                <input
                  type="text"
                  name="button_text_tr"
                  value={currentBanner.button_text_tr}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Arabic Fields */}
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">{t('arabicContent')}</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('title')}</label>
                <input
                  type="text"
                  name="title_ar"
                  value={currentBanner.title_ar}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('subtitle')}</label>
                <input
                  type="text"
                  name="subtitle_ar"
                  value={currentBanner.subtitle_ar}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                <textarea
                  name="description_ar"
                  value={currentBanner.description_ar}
                  onChange={handleModalChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('buttonText')}</label>
                <input
                  type="text"
                  name="button_text_ar"
                  value={currentBanner.button_text_ar}
                  onChange={handleModalChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleModalSave}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroBannerCarouselSettings;
