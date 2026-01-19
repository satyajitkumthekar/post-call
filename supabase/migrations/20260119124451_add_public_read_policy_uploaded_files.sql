/*
  # Add Public Read Access for Uploaded Files
  
  1. Changes
    - Add policy to allow anyone (including unauthenticated users) to view uploaded files
    - This is needed so the public-facing testimonials section can display videos
  
  2. Security Notes
    - Only SELECT operations are allowed for public users
    - INSERT, UPDATE, and DELETE remain restricted to authenticated users
*/

CREATE POLICY "Anyone can view uploaded files"
  ON uploaded_files FOR SELECT
  TO anon
  USING (true);