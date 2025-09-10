/*
  # Refine RLS policies for products table - Fix existing policy error

  1. Security
    - Drop the broad "Allow authenticated users to manage products" policy.
    - Drop and re-create "Allow public read access to products" policy to prevent "already exists" error.
    - Add explicit RLS policies for authenticated users to insert, update, and delete products.
*/

-- Drop the broad 'FOR ALL' policy if it exists to avoid conflicts and allow more granular control
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;

-- Drop the public read access policy if it exists, to prevent "already exists" error on re-creation
DROP POLICY IF EXISTS "Allow public read access to products" ON products;

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
