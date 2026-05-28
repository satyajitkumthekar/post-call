/*
  # Convert leads unique index to a proper constraint

  ## Summary
  Drops the unique index and replaces it with a proper UNIQUE constraint,
  which is required for PostgREST/Supabase JS upsert with onConflict to work.

  ## Changes
  - Drops `leads_name_phone_unique` index
  - Adds `leads_first_name_whatsapp_number_key` unique constraint on (first_name, whatsapp_number)

  ## Notes
  1. PostgREST requires a named constraint (not just an index) for ON CONFLICT resolution
  2. This enables the frontend upsert with ignoreDuplicates to work correctly
*/

DROP INDEX IF EXISTS leads_name_phone_unique;

ALTER TABLE leads ADD CONSTRAINT leads_first_name_whatsapp_number_key
  UNIQUE (first_name, whatsapp_number);
