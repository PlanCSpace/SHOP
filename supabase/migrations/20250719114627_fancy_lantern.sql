/*
  # Add categories table and product cost tracking

  1. New Tables
    - `categories`
      - `id` (serial, primary key)
      - `name_tr` (text, not null)
      - `name_en` (text, not null)
      - `slug` (text, unique, not null)
      - `created_at` (timestamp, default now)

  2. Table Updates
    - Add `cost_usd` column to `products` table
    - Add `category_id` foreign key to `products` table

  3. Security
    - Enable RLS on `categories` table
    - Add policies for public read and authenticated manage
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add cost tracking to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'cost_usd'
  ) THEN
    ALTER TABLE products ADD COLUMN cost_usd NUMERIC DEFAULT 0 CHECK (cost_usd >= 0);
  END IF;
END $$;

-- Add category_id to products (optional, keeping existing category field for compatibility)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE products ADD COLUMN category_id INTEGER REFERENCES categories(id);
  END IF;
END $$;

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Authenticated users can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name_tr, name_en, slug) VALUES
('Cilt Bakımı', 'Skincare', 'skincare'),
('Makyaj', 'Makeup', 'makeup'),
('Parfüm', 'Fragrance', 'fragrance')
ON CONFLICT (slug) DO NOTHING;
