/*
  # Deduplicate leads and add unique constraint

  ## Summary
  Removes duplicate lead entries (keeping the earliest per name+phone combination),
  then adds a unique constraint to prevent future duplicates.

  ## Changes
  - Deletes duplicate rows from leads, keeping the one with the earliest created_at
  - Adds unique index on (first_name, whatsapp_number)

  ## Notes
  1. Only the oldest entry per (first_name, whatsapp_number) pair is retained
  2. Future inserts with a conflicting name+phone will be rejected at the DB level
  3. The frontend should use ON CONFLICT DO NOTHING to handle this gracefully
*/

DELETE FROM leads
WHERE id NOT IN (
  SELECT DISTINCT ON (first_name, whatsapp_number) id
  FROM leads
  ORDER BY first_name, whatsapp_number, created_at ASC
);

CREATE UNIQUE INDEX IF NOT EXISTS leads_name_phone_unique
  ON leads (first_name, whatsapp_number);
