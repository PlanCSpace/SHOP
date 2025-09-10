/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_wallet` (text, not null)
      - `items` (jsonb, not null)
      - `shipping_address` (jsonb, not null)
      - `subtotal` (numeric, not null, default 0)
      - `shipping_cost` (numeric, not null, default 0)
      - `total` (numeric, not null, default 0)
      - `status` (text, not null, default 'pending', enum: 'pending', 'processing', 'shipped', 'delivered')
      - `created_at` (timestamp with time zone, default now())
      - `tracking_number` (text, nullable)
  2. Security
    - Enable RLS on `orders` table
    - Add policy for authenticated users to read their own orders
    - Add policy for authenticated users to create orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet text NOT NULL,
  items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  tracking_number text
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_wallet);

CREATE POLICY "Allow authenticated users to create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_wallet);
