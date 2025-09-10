/*
  # Insert default hero banner content

  1. Data
    - Insert default banner content with id '1'
    - Provides fallback content for both Turkish and English
*/

INSERT INTO hero_banner_content (
  id,
  title_tr,
  title_en,
  subtitle_tr,
  subtitle_en,
  button_text_tr,
  button_text_en,
  image_url
) VALUES (
  '1',
  'Doğal Güzelliğinizi',
  'Discover Your',
  'Keşfedin',
  'Natural Beauty',
  'Koleksiyonu İncele',
  'Shop Collection',
  'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
) ON CONFLICT (id) DO UPDATE SET
  title_tr = EXCLUDED.title_tr,
  title_en = EXCLUDED.title_en,
  subtitle_tr = EXCLUDED.subtitle_tr,
  subtitle_en = EXCLUDED.subtitle_en,
  button_text_tr = EXCLUDED.button_text_tr,
  button_text_en = EXCLUDED.button_text_en,
  image_url = EXCLUDED.image_url,
  updated_at = now();
