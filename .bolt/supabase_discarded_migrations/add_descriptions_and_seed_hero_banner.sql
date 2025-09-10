/*
  # Add descriptions to hero_banner_content, add unique constraint, and seed initial data

  1. Modified Tables
    - `hero_banner_content`
      - Added `description_tr` (text, not null)
      - Added `description_en` (text, not null)
      - Added `UNIQUE` constraint on `title_tr` to ensure content uniqueness.
  2. Data Seeding
    - Inserted 3 initial rows into `hero_banner_content` for carousel slides.
    - Uses `ON CONFLICT (title_tr) DO NOTHING` for idempotent inserts.
    - Explicitly calls `gen_random_uuid()` for the `id` column to ensure unique UUID generation.
  3. Security
    - No changes to RLS policies, existing policies remain.
*/

DO $$
BEGIN
  -- Add description_tr column if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_banner_content' AND column_name = 'description_tr'
  ) THEN
    ALTER TABLE hero_banner_content ADD COLUMN description_tr text NOT NULL DEFAULT '';
  END IF;

  -- Add description_en column if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_banner_content' AND column_name = 'description_en'
  ) THEN
    ALTER TABLE hero_banner_content ADD COLUMN description_en text NOT NULL DEFAULT '';
  END IF;

  -- Add unique constraint on title_tr if it does not exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hero_banner_content_title_tr_key'
  ) THEN
    ALTER TABLE hero_banner_content ADD CONSTRAINT hero_banner_content_title_tr_key UNIQUE (title_tr);
  END IF;
END $$;

-- Insert initial data, on conflict do nothing
INSERT INTO hero_banner_content (id, title_tr, subtitle_tr, button_text_tr, title_en, subtitle_en, button_text_en, image_url, description_tr, description_en)
VALUES
(gen_random_uuid(), 'Doğal Güzelliğinizi', 'Keşfedin', 'Koleksiyonu İncele', 'Discover Your', 'Natural Beauty', 'Shop Collection', 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Modern kadın için özenle seçilmiş premium kozmetik ve cilt bakım ürünleri.', 'Premium cosmetics and skincare products curated for the modern woman.'),
(gen_random_uuid(), 'Lüks Parfüm', 'Koleksiyonu', 'Şimdi Keşfet', 'Luxury Fragrance', 'Collection', 'Explore Now', 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Eşsiz notalarla hazırlanmış özel parfüm koleksiyonumuz.', 'Exclusive perfume collection crafted with unique notes.'),
(gen_random_uuid(), 'Profesyonel', 'Makyaj', 'Ürünleri Gör', 'Professional', 'Makeup', 'View Products', 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1200', 'Uzun süre dayanıklı ve yüksek pigmentli makyaj ürünleri.', 'Long-lasting and highly pigmented makeup products.')
ON CONFLICT (title_tr) DO NOTHING;
