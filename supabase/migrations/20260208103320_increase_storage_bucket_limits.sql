/*
  # Increase Storage Bucket Size Limits for Pro Tier

  1. Changes
    - Increase `main-videos` bucket limit from 500MB to 2GB (2147483648 bytes)
    - Increase `video-testimonials` bucket limit from 100MB to 2GB (2147483648 bytes)
    - Keep `text-testimonial-images` at 10MB (sufficient for images)
  
  2. Rationale
    - Supabase Pro supports up to 5GB per file
    - 2GB limit provides ample space for high-quality video content
    - Allows for 4K video uploads and longer-form content
*/

-- Update main-videos bucket to 2GB limit
UPDATE storage.buckets 
SET file_size_limit = 2147483648
WHERE id = 'main-videos';

-- Update video-testimonials bucket to 2GB limit
UPDATE storage.buckets 
SET file_size_limit = 2147483648
WHERE id = 'video-testimonials';
