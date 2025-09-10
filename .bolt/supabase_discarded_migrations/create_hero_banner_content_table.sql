/*
  # Create hero_banner_content table

  1. New Tables
    - `hero_banner_content`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `title_tr` (text, not null)
      - `subtitle_tr` (text, not null)
      - `button_text_tr` (text, not null)
      - `title_en` (text, not null)
      - `subtitle_en` (text, not null)
      - `button_text_en` (text, not null)
      - `image_url` (text, not null)
      - `updated_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `hero_banner_content` table
    - Add policy for all users to read content
    - Add policy for authenticated users to update content (for admin purposes)
*/

CREATE TABLE IF NOT EXISTS hero_banner_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  subtitle_tr text NOT NULL,
  button_text_tr text NOT NULL,
  title_en text NOT NULL,
  subtitle_en text NOT NULL,
  button_text_en text NOT NULL,
  image_url text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_banner_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hero banner content"
  ON hero_banner_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update hero banner content"
  ON hero_banner_content
  FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);
