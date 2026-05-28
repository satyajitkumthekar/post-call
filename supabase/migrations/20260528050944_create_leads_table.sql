/*
  # Create leads table

  ## Summary
  Creates a leads table to capture visitor information from the gated entry modal on the /book page.

  ## New Tables

  ### leads
  - `id` (uuid, primary key) - Auto-generated unique identifier
  - `first_name` (text, not null) - Visitor's first name from the modal form
  - `whatsapp_number` (text, not null) - Visitor's WhatsApp number with country code
  - `created_at` (timestamptz, default now()) - Timestamp of submission
  - `messaged` (boolean, default false) - Whether the admin has messaged this lead on WhatsApp

  ## Security
  - RLS enabled on leads table
  - Public INSERT policy: anyone (including unauthenticated visitors) can submit leads
  - Authenticated SELECT policy: only authenticated admins can read leads
  - Authenticated UPDATE policy: only authenticated admins can update leads (e.g., toggling messaged)

  ## Notes
  1. Public insert is intentional — this is a lead capture form for unauthenticated visitors
  2. No public read or delete to protect visitor data
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  whatsapp_number text NOT NULL,
  created_at timestamptz DEFAULT now(),
  messaged boolean DEFAULT false
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a lead"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
