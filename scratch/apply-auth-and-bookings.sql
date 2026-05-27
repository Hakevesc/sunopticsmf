-- ============================================================
-- Run this in the Supabase SQL Editor
--   Dashboard → SQL Editor → New query → paste → RUN
-- It is idempotent: safe to run multiple times.
-- Fixes:
--   1. "Could not find function public.admin_login" on admin sign in
--   2. "new row violates row-level security policy for table bookings" on booking submit
-- ============================================================

-- Make sure bcrypt / crypt() are available.
-- Supabase installs pgcrypto into the "extensions" schema, not "public",
-- so we reference functions as extensions.crypt / extensions.gen_salt below.
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ── 1. Admin users table + seed ────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_users (email, password_hash, full_name) VALUES
  ('admin@sunopticsmf.com',
   extensions.crypt('SunOptics@2026', extensions.gen_salt('bf')),
   'SunOptics Admin')
ON CONFLICT (email) DO UPDATE
  SET password_hash = extensions.crypt('SunOptics@2026', extensions.gen_salt('bf')),
      full_name     = 'SunOptics Admin';

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin users self read" ON admin_users;
CREATE POLICY "Admin users self read" ON admin_users
  FOR SELECT TO authenticated USING (FALSE);

-- ── 2. admin_login RPC ─────────────────────────────────────
CREATE OR REPLACE FUNCTION admin_login(p_email TEXT, p_password TEXT)
RETURNS TABLE(id UUID, email TEXT, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.full_name
  FROM admin_users u
  WHERE u.email = p_email
    AND u.password_hash = extensions.crypt(p_password, u.password_hash);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_login(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION admin_login(TEXT, TEXT) TO authenticated;

-- Refresh PostgREST so the function appears in the schema cache immediately
NOTIFY pgrst, 'reload schema';

-- ── 3. Bookings RLS (let anon insert and let admin UI read/update) ──
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create bookings" ON bookings;
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Anon manage bookings" ON bookings;
CREATE POLICY "Anon manage bookings"
  ON bookings FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage bookings" ON bookings;
CREATE POLICY "Admin can manage bookings"
  ON bookings FOR ALL TO authenticated USING (TRUE);

-- Same for the "publishable" / new key role naming, just in case:
GRANT INSERT, SELECT, UPDATE, DELETE ON bookings TO anon;
GRANT INSERT, SELECT, UPDATE, DELETE ON bookings TO authenticated;

-- ── 4. Sanity checks ───────────────────────────────────────
-- Should return one row with the admin info:
SELECT * FROM admin_login('admin@sunopticsmf.com', 'SunOptics@2026');

-- Should return the policies on bookings:
SELECT polname FROM pg_policy WHERE polrelid = 'public.bookings'::regclass;
