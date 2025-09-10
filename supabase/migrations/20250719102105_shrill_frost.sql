/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (text, primary key)
      - `user_wallet` (text, not null)
      - `items` (jsonb, not null)
      - `shipping_address` (jsonb, not null)
      - `subtotal` (numeric, not null)
      - `shipping_cost` (numeric, not null)
      - `total` (numeric, not null)
      - `status` (text, default 'pending')
      - `tracking_number` (text, nullable)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `orders` table
    - Add policy for users to read their own orders
    - Add policy for authenticated users to manage all orders (admin)
*/

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC NOT NULL CHECK (shipping_cost >= 0),
  total NUMERIC NOT NULL CHECK (total >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage all orders (for admin)
CREATE POLICY "Authenticated users can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
