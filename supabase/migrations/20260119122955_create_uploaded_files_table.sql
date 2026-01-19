/*
  # Create Uploaded Files Metadata Table

  1. New Tables
    - `uploaded_files`
      - `id` (uuid, primary key) - Unique identifier for each file record
      - `bucket_id` (text) - The storage bucket where the file is stored
      - `file_path` (text) - The path to the file in the bucket
      - `file_name` (text) - Original filename
      - `file_type` (text) - MIME type of the file
      - `file_size` (bigint) - Size of the file in bytes
      - `url` (text) - Public URL to access the file
      - `uploaded_by` (uuid) - User who uploaded the file
      - `created_at` (timestamptz) - When the file was uploaded
      
  2. Security
    - Enable RLS on `uploaded_files` table
    - Add policy for authenticated users to insert their own files
    - Add policy for authenticated users to view all files
    - Add policy for authenticated users to delete their own files
*/

CREATE TABLE IF NOT EXISTS uploaded_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  url text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all uploaded files"
  ON uploaded_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert their own files"
  ON uploaded_files FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Authenticated users can delete their own files"
  ON uploaded_files FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE INDEX IF NOT EXISTS idx_uploaded_files_bucket_id ON uploaded_files(bucket_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_by ON uploaded_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_created_at ON uploaded_files(created_at DESC);
