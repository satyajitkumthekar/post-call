/*
  # Create site_settings table

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting identifier (e.g., 'vsl_video_url')
      - `value` (text) - The setting value
      - `updated_by` (uuid, nullable) - FK to auth.users
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for authenticated users to read settings
    - Add policy for authenticated users to update settings
    - Add policy for authenticated users to insert settings

  3. Seed Data
    - Insert default 'vsl_video_url' setting with empty value
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON site_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings"
  ON site_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert settings"
  ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO site_settings (key, value) VALUES ('vsl_video_url', '')
ON CONFLICT (key) DO NOTHING;