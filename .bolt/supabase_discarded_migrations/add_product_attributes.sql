/*
  # Add is_new, discount_percentage, and rating columns to products table

  1. Modified Tables
    - `products`
      - Add `is_new` (boolean, default false)
      - Add `discount_percentage` (numeric, default 0)
      - Add `rating` (numeric, default 0)
  2. Security
    - No changes to RLS policies for `products` table, as existing policies cover new columns.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_new'
  ) THEN
    ALTER TABLE products ADD COLUMN is_new boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'discount_percentage'
  ) THEN
    ALTER TABLE products ADD COLUMN discount_percentage numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'rating'
  ) THEN
    ALTER TABLE products ADD COLUMN rating numeric DEFAULT 0;
  END IF;
END $$;
