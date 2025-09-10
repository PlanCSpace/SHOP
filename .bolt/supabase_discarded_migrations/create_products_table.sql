/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (serial, primary key)
      - `name` (text, not null)
      - `price` (numeric, not null, default 0)
      - `image` (text, not null)
      - `category` (text, not null, enum: 'skincare', 'makeup', 'fragrance')
      - `description` (text, not null)
      - `stock` (integer, not null, default 0)
      - `created_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `products` table
    - Add policy for all users to read products
    - Add policy for authenticated users to insert, update, and delete products (for admin purposes, typically this would be more restricted to a specific admin role)
*/

CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  image text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);
