-- ============================================================
-- Run in Supabase SQL Editor. Idempotent.
-- Fixes:
--   1. Admin deletes silently fail / rows reappear on reload
--      → ensures anon-manage RLS exists on services & testimonials
--   2. "Failed to load admins"
--      → creates the admin_users_* RPCs
--   3. Rating column shows "—" and can't hold 4.5
--      → widens testimonials.rating to NUMERIC(2,1) and sets
--        ratings: 6× 5.0, 3× 4.5, 1× 4.0 by author name
-- ============================================================

-- ── 1. RLS so anon (the admin UI's role) can delete / update ──
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
GRANT SELECT, INSERT, UPDATE, DELETE ON services TO anon, authenticated;

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials
  FOR SELECT TO anon USING (is_active = TRUE);
DROP POLICY IF EXISTS "Anon manage testimonials" ON testimonials;
CREATE POLICY "Anon manage testimonials" ON testimonials
  FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admin manage testimonials" ON testimonials;
CREATE POLICY "Admin manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (TRUE);
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials TO anon, authenticated;

-- ── 2. Admin users RPCs (list / create / delete / reset pwd) ──
CREATE OR REPLACE FUNCTION admin_users_list()
RETURNS TABLE(id UUID, email TEXT, full_name TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.full_name, u.created_at
  FROM admin_users u
  ORDER BY u.created_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION admin_users_create(p_email TEXT, p_password TEXT, p_full_name TEXT)
RETURNS TABLE(id UUID, email TEXT, full_name TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE new_id UUID;
BEGIN
  INSERT INTO admin_users (email, password_hash, full_name)
  VALUES (p_email, extensions.crypt(p_password, extensions.gen_salt('bf')), NULLIF(p_full_name, ''))
  RETURNING admin_users.id INTO new_id;
  RETURN QUERY
  SELECT u.id, u.email, u.full_name, u.created_at
  FROM admin_users u WHERE u.id = new_id;
END;
$$;

CREATE OR REPLACE FUNCTION admin_users_delete(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM admin_users WHERE id = p_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION admin_users_update_password(p_id UUID, p_new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE admin_users
  SET password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf'))
  WHERE id = p_id;
  RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION admin_users_list()                     TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_users_create(TEXT, TEXT, TEXT)   TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_users_delete(UUID)               TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_users_update_password(UUID,TEXT) TO anon, authenticated;

-- ── 3. Widen rating to allow half stars, then set ratings ────
DO $$
DECLARE coltype TEXT;
BEGIN
  SELECT data_type INTO coltype
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'testimonials'
    AND column_name = 'rating';

  IF coltype IS NOT NULL AND coltype <> 'numeric' THEN
    -- Drop the old CHECK (which forbids decimals), widen type, re-add check
    ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_rating_check;
    ALTER TABLE testimonials
      ALTER COLUMN rating TYPE NUMERIC(2,1) USING rating::numeric;
    ALTER TABLE testimonials
      ADD CONSTRAINT testimonials_rating_check
      CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
  END IF;
END$$;

-- Assign ratings per author (6× 5.0, 3× 4.5, 1× 4.0)
UPDATE testimonials SET rating = CASE
  -- Six 5.0 (full)
  WHEN author_name ILIKE 'Samuel Melesse%'   THEN 5.0
  WHEN author_name ILIKE 'Muhumed Aden%'     THEN 5.0
  WHEN author_name ILIKE 'Basil Al-attas%'   THEN 5.0
  WHEN author_name ILIKE 'Melat Beyene%'     THEN 5.0
  WHEN author_name ILIKE 'Feven Bahiru%'     THEN 5.0
  WHEN author_name ILIKE 'bethelhem zeleke%' THEN 5.0
  -- Three 4.5
  WHEN author_name ILIKE 'Amsalu Mulugeta%'  THEN 4.5
  WHEN author_name ILIKE 'yonatan ashenafi%' THEN 4.5
  WHEN author_name ILIKE 'Betty Tsehaye%'    THEN 4.5
  -- One 4.0
  WHEN author_name ILIKE 'Abrham Tsehay%'    THEN 4.0
  ELSE rating
END;

NOTIFY pgrst, 'reload schema';

-- ── Sanity checks ────────────────────────────────────────────
SELECT author_name, rating FROM testimonials ORDER BY rating DESC NULLS LAST, author_name;
SELECT * FROM admin_users_list();
SELECT polname FROM pg_policy WHERE polrelid IN ('public.services'::regclass, 'public.testimonials'::regclass);
