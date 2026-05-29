/*
  # Create storage bucket for story panel images

  1. New Buckets
    - `story-images` - For story panel images displayed on /schedule (max 10MB)

  2. Security
    - Public read access for displaying images on the page
    - Authenticated users can upload, update, and delete images
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('story-images', 'story-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view story images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'story-images');

CREATE POLICY "Authenticated users can upload story images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'story-images');

CREATE POLICY "Authenticated users can update story images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'story-images')
  WITH CHECK (bucket_id = 'story-images');

CREATE POLICY "Authenticated users can delete story images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'story-images');
