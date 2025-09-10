/*
      # Add discount_percentage and is_new columns to products table

      1. Modified Tables
        - `products`
          - Added `discount_percentage` (numeric, default 0)
          - Added `is_new` (boolean, default false)
          - Ensured `created_at` (timestamptz, default now()) exists.
      2. Security
        - No new RLS policies needed, existing update policy for authenticated users will cover these new columns.
    */

    DO $$
    BEGIN
      -- Add discount_percentage column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'discount_percentage'
      ) THEN
        ALTER TABLE products ADD COLUMN discount_percentage numeric DEFAULT 0;
      END IF;

      -- Add is_new column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'is_new'
      ) THEN
        ALTER TABLE products ADD COLUMN is_new boolean DEFAULT false;
      END IF;

      -- Ensure created_at column exists and has a default value
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'products' AND column_name = 'created_at'
      ) THEN
        ALTER TABLE products ADD COLUMN created_at timestamptz DEFAULT now();
      END IF;
    END $$;
