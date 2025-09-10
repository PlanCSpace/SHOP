/*
  # Create hero banner content table

  1. New Tables
    - `hero_banner_content`
      - `id` (text, primary key)
      - `title_tr` (text, not null)
      - `title_en` (text, not null)
      - `subtitle_tr` (text, not null)
      - `subtitle_en` (text, not null)
      - `button_text_tr` (text, not null)
      - `button_text_en` (text, not null)
      - `image_url` (text, not null)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `hero_banner_content` table
    - Add policy for public read access
    - Add policy for authenticated users to manage content
*/

CREATE TABLE IF NOT EXISTS hero_banner_content (
  id TEXT PRIMARY KEY DEFAULT '1',
  title_tr TEXT NOT NULL DEFAULT 'Doğal Güzelliğinizi',
  title_en TEXT NOT NULL DEFAULT 'Discover Your',
  subtitle_tr TEXT NOT NULL DEFAULT 'Keşfedin',
  subtitle_en TEXT NOT NULL DEFAULT 'Natural Beauty',
  button_text_tr TEXT NOT NULL DEFAULT 'Koleksiyonu İncele',
  button_text_en TEXT NOT NULL DEFAULT 'Shop Collection',
  image_url TEXT NOT NULL DEFAULT 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_banner_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access to hero banner content
CREATE POLICY "Hero banner content is viewable by everyone"
  ON hero_banner_content
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage hero banner content
CREATE POLICY "Authenticated users can manage hero banner content"
  ON hero_banner_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default hero banner content
INSERT INTO hero_banner_content (
  id, 
  title_tr, 
  title_en, 
  subtitle_tr, 
  subtitle_en, 
  button_text_tr, 
  button_text_en, 
  image_url
)
VALUES (
  '1',
  'Doğal Güzelliğinizi',
  'Discover Your',
  'Keşfedin',
  'Natural Beauty',
  'Koleksiyonu İncele',
  'Shop Collection',
  'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800'
)
ON CONFLICT (id) DO NOTHING;
