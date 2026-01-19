/*
  # Fix RLS Performance and Remove Unused Index

  1. Performance Optimizations
    - Update RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth function for each row, improving query performance at scale
    - Affects INSERT and DELETE policies that check file ownership

  2. Index Cleanup
    - Remove unused index `idx_uploaded_files_created_at`
    - This index is not being used by any queries and adds unnecessary overhead

  3. Changes Made
    - Drop and recreate "Authenticated users can insert their own files" policy with optimized auth check
    - Drop and recreate "Authenticated users can delete their own files" policy with optimized auth check
    - Drop unused created_at index

  4. Security Notes
    - All existing security restrictions remain in place
    - Only the performance of the auth checks is improved
    - No changes to access control logic
*/

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Authenticated users can insert their own files" ON uploaded_files;
DROP POLICY IF EXISTS "Authenticated users can delete their own files" ON uploaded_files;

-- Recreate policies with optimized auth function calls
CREATE POLICY "Authenticated users can insert their own files"
  ON uploaded_files FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = (select auth.uid()));

CREATE POLICY "Authenticated users can delete their own files"
  ON uploaded_files FOR DELETE
  TO authenticated
  USING (uploaded_by = (select auth.uid()));

-- Remove unused index
DROP INDEX IF EXISTS idx_uploaded_files_created_at;