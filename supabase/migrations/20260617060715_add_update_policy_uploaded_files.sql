CREATE POLICY "Authenticated users can update their own files"
  ON uploaded_files
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());