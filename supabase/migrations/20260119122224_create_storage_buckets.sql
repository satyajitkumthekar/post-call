/*
  # Create Storage Buckets for Media Uploads

  1. New Buckets
    - `main-videos` - For main/hero video content (max 500MB)
    - `video-testimonials` - For customer video testimonials (max 100MB)
    - `text-testimonial-images` - For images associated with text testimonials (max 10MB)
  
  2. Security
    - Enable public access for viewing (SELECT)
    - Restrict uploads (INSERT) to authenticated users only
    - Allow authenticated users to delete their own uploads
    - Set file size limits and allowed MIME types
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('main-videos', 'main-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/ogg']::text[]),
  ('video-testimonials', 'video-testimonials', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg']::text[]),
  ('text-testimonial-images', 'text-testimonial-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
ON CONFLICT (id) DO NOTHING;

-- Main Videos Bucket Policies
CREATE POLICY "Public can view main videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'main-videos');

CREATE POLICY "Authenticated users can upload main videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'main-videos');

CREATE POLICY "Authenticated users can update own main videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'main-videos' AND owner_id = auth.uid()::text)
  WITH CHECK (bucket_id = 'main-videos' AND owner_id = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own main videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'main-videos' AND owner_id = auth.uid()::text);

-- Video Testimonials Bucket Policies
CREATE POLICY "Public can view video testimonials"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'video-testimonials');

CREATE POLICY "Authenticated users can upload video testimonials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'video-testimonials');

CREATE POLICY "Authenticated users can update own video testimonials"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'video-testimonials' AND owner_id = auth.uid()::text)
  WITH CHECK (bucket_id = 'video-testimonials' AND owner_id = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own video testimonials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'video-testimonials' AND owner_id = auth.uid()::text);

-- Text Testimonial Images Bucket Policies
CREATE POLICY "Public can view text testimonial images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'text-testimonial-images');

CREATE POLICY "Authenticated users can upload text testimonial images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'text-testimonial-images');

CREATE POLICY "Authenticated users can update own text testimonial images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'text-testimonial-images' AND owner_id = auth.uid()::text)
  WITH CHECK (bucket_id = 'text-testimonial-images' AND owner_id = auth.uid()::text);

CREATE POLICY "Authenticated users can delete own text testimonial images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'text-testimonial-images' AND owner_id = auth.uid()::text);