/*
  # Remove RLS policies and disable RLS

  1. Security Changes
    - Disable RLS on all tables
    - Remove all existing policies
    - Make all tables publicly accessible

  2. Tables affected
    - products
    - orders  
    - admin_settings
    - hero_banner_content
    - categories
*/

-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banner_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on products table
DROP POLICY IF EXISTS "Allow authenticated users to manage products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Drop all existing policies on orders table
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;

-- Drop all existing policies on admin_settings table
DROP POLICY IF EXISTS "Admin settings are viewable by everyone" ON admin_settings;
DROP POLICY IF EXISTS "Allow all users to manage admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update admin settings" ON admin_settings;
DROP POLICY IF EXISTS "Allow public read access to admin settings" ON admin_settings;

-- Drop all existing policies on hero_banner_content table
DROP POLICY IF EXISTS "Allow all users to manage hero banner content" ON hero_banner_content;
DROP POLICY IF EXISTS "Allow authenticated users to update hero banner content" ON hero_banner_content;
DROP POLICY IF EXISTS "Allow public read access to hero banner content" ON hero_banner_content;
DROP POLICY IF EXISTS "Hero banner content is viewable by everyone" ON hero_banner_content;

-- Drop all existing policies on categories table
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
