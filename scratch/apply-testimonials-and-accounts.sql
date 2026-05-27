-- ============================================================
-- Run in Supabase SQL Editor. Idempotent — safe to re-run.
-- Adds:
--   * Testimonials seed + anon-manage RLS so the public carousel
--     reads them and the admin UI can manage them
--   * admin_users_list / create / delete / update_password RPCs
--     (table stays locked down; only these SECURITY DEFINER funcs
--      can read or modify it)
-- ============================================================

-- ── Testimonials RLS ───────────────────────────────────────
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

GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials TO authenticated;

-- ── Seed initial testimonials (only if table is empty) ─────
INSERT INTO testimonials (author_name, rating, review_text_en, source, is_featured, is_active, created_at)
SELECT * FROM (VALUES
  ('Samuel Melesse',   5, 'I would like to express my sincere appreciation for the exceptional service I received from Melat, one of your staff members. I am writing to commend her outstanding performance.', 'google', TRUE, TRUE, NOW() - INTERVAL '9 months'),
  ('Muhumed Aden',     5, 'Sun Optics provides quality services and welcomed professional staff, so if you have any challenges about your eyes, go to Sun Optics — Meskel Flower.',                              'google', TRUE, TRUE, NOW() - INTERVAL '8 months'),
  ('Basil Al-attas',   5, 'Good service with excellent glasses and tests. If you want this service in Addis, it''s definitely the place to go.',                                                              'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Yonatan Ashenafi', 5, 'I don''t know where to start — everything is very nice. The sales team and optometrist are very helpful, and the clinic looks great.',                                            'google', FALSE, TRUE, NOW() - INTERVAL '1 year'),
  ('Melat Beyene',     5, 'Great service with quality glasses. Keep up your good work!',                                                                                                                      'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Betty Tsehaye',    5, 'It is an amazing place for an eye clinic, and I really like the glasses. Thank you for your wonderful service.',                                                                  'google', FALSE, TRUE, NOW() - INTERVAL '2 years'),
  ('Feven Bahiru',     5, 'It''s the best place for an eye clinic and glasses — thanks for your service.',                                                                                                    'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Bethelhem Zeleke', 5, 'I got good and expeditious treatment, and I also got quality glasses. Thank you very much for the hospitality.',                                                                  'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Anteneh Ab',       5, 'I like the way you approach and treat your customers. Thank you.',                                                                                                                'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Yared Siyum',      5, 'The best eye clinic and glass shop in Addis Ababa.',                                                                                                                              'google', FALSE, TRUE, NOW() - INTERVAL '3 years')
) AS v(author_name, rating, review_text_en, source, is_featured, is_active, created_at)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- ── Admin users management RPCs ────────────────────────────
-- List admins (no password_hash exposed)
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
DECLARE
  new_id UUID;
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM admin_users WHERE id = p_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION admin_users_update_password(p_id UUID, p_new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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

NOTIFY pgrst, 'reload schema';

-- ── Sanity ─────────────────────────────────────────────────
SELECT count(*) AS testimonial_count FROM testimonials;
SELECT * FROM admin_users_list();
