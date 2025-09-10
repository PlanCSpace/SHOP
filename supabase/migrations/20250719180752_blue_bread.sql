/*
  # Add product code and barcode fields to products table

  1. Table Updates
    - Add `product_code` column to `products` table (unique identifier)
    - Add `barcode` column to `products` table (barcode/SKU)
    - Add unique constraint on product_code

  2. Data Migration
    - Update existing products with generated product codes
*/

-- Add product_code and barcode columns to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'product_code'
  ) THEN
    ALTER TABLE products ADD COLUMN product_code TEXT UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'barcode'
  ) THEN
    ALTER TABLE products ADD COLUMN barcode TEXT;
  END IF;
END $$;

-- Generate product codes for existing products if they don't have them
UPDATE products 
SET product_code = 'PRD-' || LPAD(id::text, 6, '0')
WHERE product_code IS NULL;

-- Make product_code NOT NULL after setting values
ALTER TABLE products ALTER COLUMN product_code SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
