/*
  # Fix admin settings RLS policy

  1. Security Changes
    - Update RLS policy for `admin_settings` table to allow INSERT and UPDATE operations
    - Allow both anonymous and authenticated users to manage admin settings
    - This enables the admin panel to work properly

  Note: This is configured for demo/development purposes. In production, 
  you should implement proper authentication and role-based access control.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admin settings are viewable by everyone" ON admin_settings;
DROP POLICY IF EXISTS "Authenticated users can manage admin settings" ON admin_settings;

-- Create new policies that allow both anon and authenticated users
CREATE POLICY "Admin settings are viewable by everyone"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all users to manage admin settings"
  ON admin_settings
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
