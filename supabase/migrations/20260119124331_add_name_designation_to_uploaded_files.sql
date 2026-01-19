/*
  # Add Name and Designation Fields to Uploaded Files
  
  1. Changes
    - Add `testimonial_name` column to store the name of the person in the testimonial
    - Add `testimonial_designation` column to store the designation/role of the person
    - These fields are optional and primarily used for video testimonials
  
  2. Important Notes
    - Fields are nullable to support all bucket types
    - Only video testimonials will use these fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uploaded_files' AND column_name = 'testimonial_name'
  ) THEN
    ALTER TABLE uploaded_files ADD COLUMN testimonial_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uploaded_files' AND column_name = 'testimonial_designation'
  ) THEN
    ALTER TABLE uploaded_files ADD COLUMN testimonial_designation text;
  END IF;
END $$;