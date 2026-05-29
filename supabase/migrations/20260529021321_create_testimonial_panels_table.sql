/*
  # Create testimonial_panels table

  1. New Tables
    - `testimonial_panels`
      - `id` (uuid, primary key, auto-generated)
      - `video_url` (text, required - URL of the uploaded video)
      - `client_name` (text, required - e.g. "Sid")
      - `context_line` (text, required - one-line caption shown over video)
      - `sequence_order` (integer, required - determines render order)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-set on update)

  2. Security
    - Enable RLS on `testimonial_panels` table
    - Add policy for public read access (panels are displayed on public pages)
    - Add policy for authenticated users to manage panels

  3. Notes
    - sequence_order determines the order testimonials appear on /schedule
    - Lower numbers render first
    - context_line is the one-line caption overlaid on the video
*/

CREATE TABLE IF NOT EXISTS testimonial_panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  client_name text NOT NULL,
  context_line text NOT NULL,
  sequence_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE testimonial_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view testimonial panels"
  ON testimonial_panels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonial panels"
  ON testimonial_panels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonial panels"
  ON testimonial_panels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonial panels"
  ON testimonial_panels FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_testimonial_panels_sequence_order ON testimonial_panels (sequence_order ASC);
