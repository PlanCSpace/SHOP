/*
  # Disable Row Level Security for Products Table

  1. Security
    - Disable Row Level Security (RLS) on the `products` table.
    - Drop all existing RLS policies on the `products` table as they are no longer needed when RLS is disabled.
*/

-- Drop all existing policies on the products table
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Disable Row Level Security for the products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
