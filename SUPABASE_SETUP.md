# Supabase Setup Instructions

## Step 1: Create Database Tables

Go to your Supabase Dashboard > SQL Editor and run this query:

```sql
-- Create video testimonials table
CREATE TABLE IF NOT EXISTS video_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  result text NOT NULL,
  video_url text,
  thumbnail_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create text testimonials table
CREATE TABLE IF NOT EXISTS text_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create message testimonials table
CREATE TABLE IF NOT EXISTS message_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  name text NOT NULL,
  screenshot_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE video_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view active testimonials
CREATE POLICY "Anyone can view active video testimonials"
  ON video_testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active text testimonials"
  ON text_testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active message testimonials"
  ON message_testimonials FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage testimonials
CREATE POLICY "Authenticated users can insert video testimonials"
  ON video_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update video testimonials"
  ON video_testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete video testimonials"
  ON video_testimonials FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert text testimonials"
  ON text_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update text testimonials"
  ON text_testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete text testimonials"
  ON text_testimonials FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert message testimonials"
  ON message_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update message testimonials"
  ON message_testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete message testimonials"
  ON message_testimonials FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_video_testimonials_active_order
  ON video_testimonials(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_text_testimonials_active_order
  ON text_testimonials(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_message_testimonials_active
  ON message_testimonials(is_active);
```

## Step 2: Create Storage Buckets

1. Go to your Supabase Dashboard > Storage
2. Create two new buckets:
   - `testimonial-videos` (for video files)
   - `testimonial-images` (for thumbnails and screenshots)

3. For each bucket, set these policies:

### For `testimonial-images`:

**SELECT (Public Read):**
```sql
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-images');
```

**INSERT (Authenticated Upload):**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-images');
```

**DELETE (Authenticated Delete):**
```sql
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-images');
```

### For `testimonial-videos`:

**SELECT (Public Read):**
```sql
CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonial-videos');
```

**INSERT (Authenticated Upload):**
```sql
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'testimonial-videos');
```

**DELETE (Authenticated Delete):**
```sql
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'testimonial-videos');
```

## Step 3: Access Admin Panel

Navigate to `/admin` in your app to access the admin panel where you can:
- Upload video testimonials with thumbnails
- Add text testimonials
- Add message testimonials with screenshots
- Toggle visibility of testimonials
- Delete testimonials

## Notes

- Make sure both storage buckets are set to **Public** in the bucket settings
- You'll need to be authenticated to upload content (the admin panel requires login)
- Videos and images are automatically uploaded to Supabase Storage
- All testimonials can be toggled active/inactive without deleting them
