/*
  # Ensure product price and stock types and add RLS update policy

  1. Modified Tables
    - `products`
      - Ensure `price` column is `numeric`
      - Ensure `stock` column is `integer`
      - Add `product_code` (text, unique, not null)
      - Add `barcode` (text)
      - Add `cost_usd` (numeric)
  2. Security
    - Add RLS policy for `products` table to allow authenticated users to update product data.
*/

-- Add product_code column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_code'
  ) THEN
    ALTER TABLE products ADD COLUMN product_code text UNIQUE NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add barcode column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'barcode'
  ) THEN
    ALTER TABLE products ADD COLUMN barcode text;
  END IF;
END $$;

-- Add cost_usd column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'cost_usd'
  ) THEN
    ALTER TABLE products ADD COLUMN cost_usd numeric;
  END IF;
END $$;

-- Ensure price column is numeric
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'price' AND data_type != 'numeric'
  ) THEN
    ALTER TABLE products ALTER COLUMN price TYPE numeric USING price::numeric;
  END IF;
END $$;

-- Ensure stock column is integer
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock' AND data_type != 'integer'
  ) THEN
    ALTER TABLE products ALTER COLUMN stock TYPE integer USING stock::integer;
  END IF;
END $$;

-- Add RLS policy for authenticated users to update products
-- This policy assumes any authenticated user can update any product.
-- If products are owned by specific users, this policy needs to be adjusted.
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true); -- Allows any authenticated user to update any row
