/*
  # Fix hero banner content RLS policies

  1. Security
    - Drop existing restrictive policies
    - Add policies for anonymous and authenticated users to manage banner content
    - Allow full CRUD operations for admin functionality
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can manage hero banner content" ON hero_banner_content;
DROP POLICY IF EXISTS "Hero banner content is viewable by everyone" ON hero_banner_content;

-- Create new policies that allow both anonymous and authenticated users
CREATE POLICY "Allow all users to manage hero banner content"
  ON hero_banner_content
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Hero banner content is viewable by everyone"
  ON hero_banner_content
  FOR SELECT
  TO public
  USING (true);
