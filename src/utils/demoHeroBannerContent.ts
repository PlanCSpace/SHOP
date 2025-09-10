import { faker } from '@faker-js/faker';
import { HeroBannerContent } from '../types';

export const generateDemoHeroBannerContent = (): Omit<HeroBannerContent, 'id' | 'updated_at'> => {
  return {
    title_tr: 'Doğal Güzelliğinizi Keşfedin',
    title_en: 'Discover Your Natural Beauty',
    subtitle_tr: 'Modern kadın için özenle seçilmiş premium kozmetik ve cilt bakım ürünleri',
    subtitle_en: 'Premium cosmetics and skincare products curated for the modern woman',
    button_text_tr: 'Koleksiyonu İncele',
    button_text_en: 'Shop Collection',
    image_url: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
  };
};
