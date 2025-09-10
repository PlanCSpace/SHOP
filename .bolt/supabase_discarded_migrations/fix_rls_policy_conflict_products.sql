/*
  # Fix RLS Policy Conflict for Products Table

  1. Security
    - Drop all existing RLS policies on the `products` table to resolve "already exists" errors.
    - Re-create the necessary RLS policies for `products` table:
      - Allow public read access (SELECT)
      - Allow authenticated users to insert (INSERT)
      - Allow authenticated users to update (UPDATE)
      - Allow authenticated users to delete (DELETE)
*/

-- Drop all existing policies on the products table to prevent "already exists" errors
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products; -- This was a broad policy, dropping it
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update products
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for authenticated users to delete products
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);
