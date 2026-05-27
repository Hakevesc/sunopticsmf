-- ============================================================
-- Run in Supabase SQL Editor. Idempotent.
-- Allows the admin UI (which uses the anon/publishable key) to
-- read/write the services table, matching the pattern used for
-- glasses and testimonials.
-- ============================================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services
  FOR SELECT TO anon USING (is_active = TRUE);

DROP POLICY IF EXISTS "Anon manage services" ON services;
CREATE POLICY "Anon manage services" ON services
  FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin manage services" ON services;
CREATE POLICY "Admin manage services" ON services
  FOR ALL TO authenticated USING (TRUE);

GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO authenticated;

NOTIFY pgrst, 'reload schema';

SELECT id, name_en, is_active, display_order FROM services ORDER BY display_order;
