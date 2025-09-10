/*
  # Create admin_settings table

  1. New Tables
    - `admin_settings`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `shipping_cost` (numeric, not null, default 0)
      - `free_shipping_threshold` (numeric, not null, default 0)
      - `updated_at` (timestamp with time zone, default now())
  2. Security
    - Enable RLS on `admin_settings` table
    - Add policy for all users to read settings
    - Add policy for authenticated users to update settings (for admin purposes)
*/

CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_cost numeric NOT NULL DEFAULT 0,
  free_shipping_threshold numeric NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to admin settings"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to update admin settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);
