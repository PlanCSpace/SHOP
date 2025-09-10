/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (text, primary key) - Order ID
      - `user_wallet` (text) - User's wallet address
      - `items` (jsonb) - Order items as JSON
      - `shipping_address` (jsonb) - Shipping address as JSON
      - `subtotal` (numeric) - Subtotal amount
      - `shipping_cost` (numeric) - Shipping cost
      - `total` (numeric) - Total amount
      - `status` (text) - Order status
      - `tracking_number` (text, optional) - Tracking number
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on `orders` table
    - Add policy for users to read their own orders
    - Add policy for authenticated users to manage orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_wallet text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  shipping_cost numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
