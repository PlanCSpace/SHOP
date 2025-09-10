/*
  # Create admin settings table

  1. New Tables
    - `admin_settings`
      - `id` (text, primary key)
      - `shipping_cost` (numeric, not null, default 25)
      - `free_shipping_threshold` (numeric, not null, default 500)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - Enable RLS on `admin_settings` table
    - Add policy for public read access
    - Add policy for authenticated users to manage settings
*/

CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  shipping_cost NUMERIC NOT NULL DEFAULT 25 CHECK (shipping_cost >= 0),
  free_shipping_threshold NUMERIC NOT NULL DEFAULT 500 CHECK (free_shipping_threshold >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to admin settings
CREATE POLICY "Admin settings are viewable by everyone"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage admin settings
CREATE POLICY "Authenticated users can manage admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default admin settings
INSERT INTO admin_settings (id, shipping_cost, free_shipping_threshold)
VALUES ('1', 25, 500)
ON CONFLICT (id) DO NOTHING;
