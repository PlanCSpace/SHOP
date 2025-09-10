import React, { useState, useEffect } from 'react';
import { FileText, Image, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BannerSettings {
  title_tr: string;
  title_en: string;
  subtitle_tr: string;
  subtitle_en: string;
  button_text_tr: string;
  button_text_en: string;
  image_url: string;
}

const AdminBannerSettings: React.FC = () => {
  const [settings, setSettings] = useState<BannerSettings>({
    title_tr: '',
    title_en: '',
    subtitle_tr: '',
    subtitle_en: '',
    button_text_tr: '',
    button_text_en: '',
    image_url: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banner_content')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          title_tr: data.title_tr,
          title_en: data.title_en,
          subtitle_tr: data.subtitle_tr,
          subtitle_en: data.subtitle_en,
          button_text_tr: data.button_text_tr,
          button_text_en: data.button_text_en,
          image_url: data.image_url,
        });
      }
    } catch (error) {
      console.error('Error loading banner settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('hero_banner_content')
        .upsert({
          id: '1',
          ...settings
        });

      if (error) throw error;

      alert('Banner settings updated successfully!');
    } catch (error) {
      console.error('Error updating banner settings:', error);
      alert('Error updating banner settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof BannerSettings) => {
    setSettings({ ...settings, [key]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Image className="mr-3" size={32} />
        Banner Settings
      </h2>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Title (Turkish)
            </label>
            <input
              type="text"
              value={settings.title_tr}
              onChange={(e) => handleChange(e, 'title_tr')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Title (English)
            </label>
            <input
              type="text"
              value={settings.title_en}
              onChange={(e) => handleChange(e, 'title_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Subtitle (Turkish)
            </label>
            <input
              type="text"
              value={settings.subtitle_tr}
              onChange={(e) => handleChange(e, 'subtitle_tr')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Subtitle (English)
            </label>
            <input
              type="text"
              value={settings.subtitle_en}
              onChange={(e) => handleChange(e, 'subtitle_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Button Text (Turkish)
            </label>
            <input
              type="text"
              value={settings.button_text_tr}
              onChange={(e) => handleChange(e, 'button_text_tr')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-2" />
              Button Text (English)
            </label>
            <input
              type="text"
              value={settings.button_text_en}
              onChange={(e) => handleChange(e, 'button_text_en')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Image size={16} className="inline mr-2" />
              Image URL
            </label>
            <input
              type="url"
              value={settings.image_url}
              onChange={(e) => handleChange(e, 'image_url')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBannerSettings;
