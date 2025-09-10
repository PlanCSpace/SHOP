/*
      # Add product details to products table

      1. Modified Tables
        - `products`
          - Add `product_code` (text, unique, not null)
          - Add `barcode` (text, nullable)
          - Add `cost_usd` (numeric, nullable)
      2. Security
        - No changes to RLS policies.
    */

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'product_code'
      ) THEN
        ALTER TABLE products ADD COLUMN product_code text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'barcode'
      ) THEN
        ALTER TABLE products ADD COLUMN barcode text;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'cost_usd'
      ) THEN
        ALTER TABLE products ADD COLUMN cost_usd numeric;
      END IF;
    END $$;

    -- Add NOT NULL constraint to product_code
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'product_code' AND is_nullable = 'YES'
      ) THEN
        -- Update existing rows to have a default value if they are NULL
        UPDATE products SET product_code = 'TEMP_' || id::text WHERE product_code IS NULL;
        ALTER TABLE products ALTER COLUMN product_code SET NOT NULL;
      END IF;
    END $$;

    -- Add UNIQUE constraint to product_code
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'product_code'
      ) AND NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'products'::regclass AND contype = 'u' AND conname = 'products_product_code_key'
      ) THEN
        ALTER TABLE products ADD CONSTRAINT products_product_code_key UNIQUE (product_code);
      END IF;
    END $$;
