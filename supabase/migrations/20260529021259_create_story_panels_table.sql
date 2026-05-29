/*
  # Create story_panels table

  1. New Tables
    - `story_panels`
      - `id` (uuid, primary key, auto-generated)
      - `image_url` (text, required - URL of the uploaded image)
      - `sequence_order` (integer, required - determines render order)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-set on update)

  2. Security
    - Enable RLS on `story_panels` table
    - Add policy for public read access (panels are displayed on public pages)
    - Add policy for authenticated users to manage panels

  3. Notes
    - sequence_order determines the order panels appear on /schedule
    - Lower numbers render first
*/

CREATE TABLE IF NOT EXISTS story_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  sequence_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE story_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view story panels"
  ON story_panels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert story panels"
  ON story_panels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update story panels"
  ON story_panels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete story panels"
  ON story_panels FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_story_panels_sequence_order ON story_panels (sequence_order ASC);
