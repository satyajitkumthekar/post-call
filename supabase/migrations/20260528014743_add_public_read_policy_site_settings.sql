/*
  # Add public read policy for site_settings

  1. Security Changes
    - Add policy for anonymous/public users to read site_settings
    - This allows the /book page to fetch the VSL video URL without authentication
*/

CREATE POLICY "Public can read settings"
  ON site_settings
  FOR SELECT
  TO anon
  USING (true);