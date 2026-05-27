-- ============================================================
-- SUNOPTICS SUPABASE DATABASE SCHEMA
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABLE: services
CREATE TABLE IF NOT EXISTS services (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  description_en TEXT,
  description_am TEXT,
  icon_name   TEXT,
  image_url   TEXT,
  display_order INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed services
INSERT INTO services (name_en, name_am, description_en, icon_name, display_order) VALUES
  ('Computerized Eye Testing',  'የኮምፒዩተር የዓይን ምርመራ', 'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.', 'scan-eye', 1),
  ('Optical Dispensary',        'ኦፕቲካል ዲስፔንሰሪ', 'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.', 'glasses', 2)
ON CONFLICT DO NOTHING;

-- 2. TABLE: staff
CREATE TABLE IF NOT EXISTS staff (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  role_en    TEXT,
  role_am    TEXT,
  bio_en     TEXT,
  bio_am     TEXT,
  photo_url  TEXT,
  is_active  BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: glass_categories (frame shapes)
CREATE TABLE IF NOT EXISTS glass_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE,
  description_en TEXT,
  description_am TEXT,
  hero_image  TEXT,
  display_order INT DEFAULT 0
);

-- Seed glass categories
INSERT INTO glass_categories (name_en, slug, display_order) VALUES
  ('Cat-Eye / Butterfly', 'cat-eye-butterfly', 1),
  ('Rounded Rectangle',   'rounded-rectangle', 2),
  ('Round / Oval',        'round-oval', 3),
  ('Wayfarer / Square',   'wayfarer-square', 4),
  ('Sunglasses',          'sunglasses', 5),
  ('Rectangle',           'rectangle', 6),
  ('Modified Rectangle',  'modified-rectangle', 7)
ON CONFLICT (slug) DO NOTHING;

-- 4. TABLE: lens_categories (top-level filter)
CREATE TABLE IF NOT EXISTS lens_categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_am TEXT,
  display_order INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed lens categories
INSERT INTO lens_categories (name_en, name_am, slug, display_order) VALUES
  ('Correct Your Vision', 'ራዕይዎን ያስተካክሉ', 'correct-your-vision', 1),
  ('Protect Your Eyes',   'ዓይኖትዎን ይጠብቁ',   'protect-your-eyes',   2),
  ('Enhance Your Vision', 'ራዕይዎን ያሻሽሉ',     'enhance-your-vision', 3)
ON CONFLICT (slug) DO NOTHING;

-- 5. TABLE: lens_needs (specific use-case filter)
CREATE TABLE IF NOT EXISTS lens_needs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en     TEXT NOT NULL,
  name_am     TEXT,
  slug        TEXT UNIQUE NOT NULL,
  description_en TEXT,
  description_am TEXT,
  display_order INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed lens needs
INSERT INTO lens_needs (name_en, name_am, slug, display_order) VALUES
  ('For Kids',              'ለልጆች',               'for-kids',              1),
  ('Near Vision',           'የቅርብ ራዕይ',          'near-vision',           2),
  ('Far Vision',            'የሩቅ ራዕይ',           'far-vision',            3),
  ('Blue Light Protection', 'ሰማያዊ ብርሃን ጥበቃ',  'blue-light-protection', 4),
  ('Sun Protection',        'የፀሐይ ጥበቃ',         'sun-protection',        5),
  ('Light Sensitivity',     'የብርሃን ስሜት',        'light-sensitivity',     6),
  ('Lens Durability',       'የሌንስ ጥንካሬ',        'lens-durability',       7)
ON CONFLICT (slug) DO NOTHING;

-- 6. TABLE: glasses
CREATE TABLE IF NOT EXISTS glasses (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id  UUID REFERENCES glass_categories(id),
  name_en      TEXT NOT NULL,
  name_am      TEXT,
  glass_code   TEXT,
  description_en TEXT,
  image_url    TEXT,
  price_range  TEXT,
  is_featured  BOOLEAN DEFAULT FALSE,
  is_new       BOOLEAN DEFAULT FALSE,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 20 eyewear glasses
INSERT INTO glasses (category_id, name_en, glass_code, image_url) VALUES
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Cat-Eye Black Frame',           '28 011 52 17-140 C5', '/Glasses/Cat-Eye  Butterfly.webp'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Soft Cat-Eye Black Frame',      '28 098 51 15-140 C1', '/Glasses/Cat-Eye.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rounded-rectangle'), 'Matte Brown/Taupe Frame',       '72 043 51 19 148 C6', '/Glasses/Rounded Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Classic Round Black Frame',     '1261 48 18 C1',       '/Glasses/Round-Oval.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Round Wire/Thin Black Frame',   '1395 49 17 C1',       '/Glasses/Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='wayfarer-square'),   'Thick Square Black Frame',      '02003 50 21-145 C1',  '/Glasses/Wayfarer-Square.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Clear / Pastel Round Frame',    '2132 49 17-140',      '/Glasses/Pastel Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Thin Rose Gold/Pink Round Frame','2134 50 20-147',      '/Glasses/Thin Rose Gold Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Daily Oval Black Frame',        '2311 53 17-142 C2',   '/Glasses/Oval-Rounded.webp'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Ultra-Thin Round Wire Frame',   '3111 53 18-145',      '/Glasses/Ultra-Thin Round.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Minimalist Round Black Frame',  '7910 48 18-148',      '/Glasses/Minimalist Round.avif'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Slim Rectangle Black Frame',    '8186 50 17-145 C2',   '/Glasses/Slim Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='sunglasses'),        'Square Tinted Sunglasses',      '8191 49 23-146',      '/Glasses/Sunglasses.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Standard Rectangle Black Frame','28001 52 17-140 C1',  '/Glasses/Rectangle-Wayfarer.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Deep Rectangle Black Frame',    '28006 52 17-140 C1',  '/Glasses/Deep Rectangle.avif'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Flared Cat-Eye Black Frame',    '28015 49 17-140 C1',  '/Glasses/Flared Cat-Eye.avif'),
  ((SELECT id FROM glass_categories WHERE slug='round-oval'),        'Thick Rim Round Black Frame',   '28016 46 21-140 C1',  '/Glasses/Thick Rim Round.webp'),
  ((SELECT id FROM glass_categories WHERE slug='rectangle'),         'Angular Rectangle Black Frame', '28020 52 19-140 C1',  '/Glasses/Angular Rectangle.avif'),
  ((SELECT id FROM glass_categories WHERE slug='modified-rectangle'),'Soft Corner Rectangle Black Frame','28022 51 18-140 C1',  '/Glasses/Soft Corner Rectangle.webp'),
  ((SELECT id FROM glass_categories WHERE slug='cat-eye-butterfly'), 'Bold Curved Cat-Eye Black Frame','28025 53 18-140 C1',  '/Glasses/Bold Curved Cat-Eye.avif')
ON CONFLICT DO NOTHING;

-- 7. JUNCTION TABLE: glasses_lens_categories
CREATE TABLE IF NOT EXISTS glasses_lens_categories (
  glass_id         UUID REFERENCES glasses(id) ON DELETE CASCADE,
  lens_category_id UUID REFERENCES lens_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (glass_id, lens_category_id)
);

-- Seed lens category assignments
INSERT INTO glasses_lens_categories (glass_id, lens_category_id)
SELECT g.id, lc.id
FROM glasses g, lens_categories lc
WHERE 
  (g.name_en = 'Cat-Eye Black Frame' AND lc.slug = 'correct-your-vision') OR
  (g.name_en = 'Soft Cat-Eye Black Frame' AND lc.slug IN ('correct-your-vision', 'enhance-your-vision')) OR
  (g.name_en = 'Matte Brown/Taupe Frame' AND lc.slug IN ('correct-your-vision', 'protect-your-eyes')) OR
  (g.name_en = 'Classic Round Black Frame' AND lc.slug IN ('correct-your-vision', 'enhance-your-vision')) OR
  (g.name_en = 'Round Wire/Thin Black Frame' AND lc.slug = 'enhance-your-vision') OR
  (g.name_en = 'Thick Square Black Frame' AND lc.slug IN ('correct-your-vision', 'protect-your-eyes')) OR
  (g.name_en = 'Clear / Pastel Round Frame' AND lc.slug IN ('protect-your-eyes', 'enhance-your-vision')) OR
  (g.name_en = 'Thin Rose Gold/Pink Round Frame' AND lc.slug = 'enhance-your-vision') OR
  (g.name_en = 'Daily Oval Black Frame' AND lc.slug = 'correct-your-vision') OR
  (g.name_en = 'Ultra-Thin Round Wire Frame' AND lc.slug IN ('enhance-your-vision', 'correct-your-vision')) OR
  (g.name_en = 'Minimalist Round Black Frame' AND lc.slug = 'correct-your-vision') OR
  (g.name_en = 'Slim Rectangle Black Frame' AND lc.slug IN ('correct-your-vision', 'protect-your-eyes')) OR
  (g.name_en = 'Square Tinted Sunglasses' AND lc.slug = 'protect-your-eyes') OR
  (g.name_en = 'Standard Rectangle Black Frame' AND lc.slug = 'correct-your-vision') OR
  (g.name_en = 'Deep Rectangle Black Frame' AND lc.slug IN ('correct-your-vision', 'protect-your-eyes')) OR
  (g.name_en = 'Flared Cat-Eye Black Frame' AND lc.slug = 'enhance-your-vision') OR
  (g.name_en = 'Thick Rim Round Black Frame' AND lc.slug IN ('correct-your-vision', 'protect-your-eyes')) OR
  (g.name_en = 'Angular Rectangle Black Frame' AND lc.slug = 'correct-your-vision') OR
  (g.name_en = 'Soft Corner Rectangle Black Frame' AND lc.slug IN ('correct-your-vision', 'enhance-your-vision')) OR
  (g.name_en = 'Bold Curved Cat-Eye Black Frame' AND lc.slug IN ('protect-your-eyes', 'enhance-your-vision'))
ON CONFLICT DO NOTHING;

-- 8. JUNCTION TABLE: glasses_lens_needs
CREATE TABLE IF NOT EXISTS glasses_lens_needs (
  glass_id     UUID REFERENCES glasses(id) ON DELETE CASCADE,
  lens_need_id UUID REFERENCES lens_needs(id) ON DELETE CASCADE,
  PRIMARY KEY (glass_id, lens_need_id)
);

-- Seed lens need assignments
INSERT INTO glasses_lens_needs (glass_id, lens_need_id)
SELECT g.id, ln.id
FROM glasses g, lens_needs ln
WHERE 
  (g.name_en = 'Cat-Eye Black Frame' AND ln.slug IN ('for-kids', 'far-vision')) OR
  (g.name_en = 'Soft Cat-Eye Black Frame' AND ln.slug IN ('near-vision', 'light-sensitivity')) OR
  (g.name_en = 'Matte Brown/Taupe Frame' AND ln.slug IN ('for-kids', 'blue-light-protection')) OR
  (g.name_en = 'Classic Round Black Frame' AND ln.slug IN ('far-vision', 'near-vision')) OR
  (g.name_en = 'Round Wire/Thin Black Frame' AND ln.slug IN ('light-sensitivity', 'lens-durability')) OR
  (g.name_en = 'Thick Square Black Frame' AND ln.slug IN ('lens-durability', 'sun-protection')) OR
  (g.name_en = 'Clear / Pastel Round Frame' AND ln.slug IN ('blue-light-protection', 'light-sensitivity')) OR
  (g.name_en = 'Thin Rose Gold/Pink Round Frame' AND ln.slug IN ('light-sensitivity', 'for-kids')) OR
  (g.name_en = 'Daily Oval Black Frame' AND ln.slug IN ('near-vision', 'far-vision')) OR
  (g.name_en = 'Ultra-Thin Round Wire Frame' AND ln.slug IN ('lens-durability', 'near-vision')) OR
  (g.name_en = 'Minimalist Round Black Frame' AND ln.slug IN ('for-kids', 'far-vision')) OR
  (g.name_en = 'Slim Rectangle Black Frame' AND ln.slug IN ('blue-light-protection', 'lens-durability')) OR
  (g.name_en = 'Square Tinted Sunglasses' AND ln.slug IN ('sun-protection', 'light-sensitivity')) OR
  (g.name_en = 'Standard Rectangle Black Frame' AND ln.slug IN ('near-vision', 'far-vision')) OR
  (g.name_en = 'Deep Rectangle Black Frame' AND ln.slug IN ('lens-durability', 'blue-light-protection')) OR
  (g.name_en = 'Flared Cat-Eye Black Frame' AND ln.slug IN ('for-kids', 'light-sensitivity')) OR
  (g.name_en = 'Thick Rim Round Black Frame' AND ln.slug IN ('sun-protection', 'lens-durability')) OR
  (g.name_en = 'Angular Rectangle Black Frame' AND ln.slug IN ('far-vision', 'near-vision')) OR
  (g.name_en = 'Soft Corner Rectangle Black Frame' AND ln.slug IN ('blue-light-protection', 'light-sensitivity')) OR
  (g.name_en = 'Bold Curved Cat-Eye Black Frame' AND ln.slug IN ('sun-protection', 'light-sensitivity'))
ON CONFLICT DO NOTHING;

-- 9. TABLE: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT,
  service_id      UUID REFERENCES services(id),
  staff_id        UUID REFERENCES staff(id),
  booking_date    DATE NOT NULL,
  booking_time    TIME NOT NULL,
  reason          TEXT,
  special_requests TEXT,
  guest_emails    TEXT[],
  glasses_interest UUID[],
  status          TEXT DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seed sample bookings
INSERT INTO bookings (first_name, last_name, email, phone, booking_date, booking_time, status) VALUES
  ('Abebe', 'Kebede', 'abebe@email.com', '0911 234 567', '2026-05-26', '09:00:00', 'pending'),
  ('Sara', 'Mohammed', 'sara@email.com', '0922 345 678', '2026-05-26', '10:30:00', 'confirmed'),
  ('Dawit', 'Tesfaye', 'dawit@email.com', '0933 456 789', '2026-05-27', '14:00:00', 'pending')
ON CONFLICT DO NOTHING;

-- 10. TABLE: site_stats
CREATE TABLE IF NOT EXISTS site_stats (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key   TEXT UNIQUE NOT NULL,
  stat_value INT NOT NULL,
  label_en   TEXT NOT NULL,
  label_am   TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed site stats
INSERT INTO site_stats (stat_key, stat_value, label_en, label_am) VALUES
  ('years_experience', 15, 'Years of Experience', 'ዓመታት ልምድ'),
  ('happy_patients', 10000, 'Happy Patients', 'ደስተኛ ታካሚዎች'),
  ('expert_staff', 8, 'Expert Staff', 'ባለሙያ ሠራተኞች'),
  ('frame_collection', 200, 'Frame Collection', 'የመነፅር ስብስብ')
ON CONFLICT (stat_key) DO NOTHING;

-- 11. TABLE: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_photo TEXT,
  rating      INT CHECK (rating BETWEEN 1 AND 5),
  review_text_en TEXT NOT NULL,
  review_text_am TEXT,
  source      TEXT DEFAULT 'google',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABLE: admin_users (lightweight credential store; uses pgcrypto bcrypt)
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default admin: admin@sunopticsmf.com / SunOptics@2026
-- pgcrypto is installed in the "extensions" schema on Supabase, so qualify the calls.
INSERT INTO admin_users (email, password_hash, full_name) VALUES
  ('admin@sunopticsmf.com',
   extensions.crypt('SunOptics@2026', extensions.gen_salt('bf')),
   'SunOptics Admin')
ON CONFLICT (email) DO UPDATE
  SET password_hash = extensions.crypt('SunOptics@2026', extensions.gen_salt('bf')),
      full_name = 'SunOptics Admin';

-- RPC: admin_login — verifies email + password via bcrypt and returns the admin record.
-- Runs as SECURITY DEFINER so anon role can call it without touching the table directly.
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

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Admin users: lock table down; only the SECURITY DEFINER function reads it.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin users self read" ON admin_users;
CREATE POLICY "Admin users self read" ON admin_users
  FOR SELECT TO authenticated USING (FALSE);

-- Bookings: public can create, admin can manage
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

-- Glasses: public can read active, admin can manage
ALTER TABLE glasses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read glasses" ON glasses;
CREATE POLICY "Public read glasses" ON glasses FOR SELECT TO anon USING (is_active = TRUE);
DROP POLICY IF EXISTS "Anon manage glasses" ON glasses;
CREATE POLICY "Anon manage glasses" ON glasses FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admin manage glasses" ON glasses;
CREATE POLICY "Admin manage glasses" ON glasses FOR ALL TO authenticated USING (TRUE);

-- Services: public can read active, admin can manage
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read services" ON services;
CREATE POLICY "Public read services" ON services FOR SELECT TO anon USING (is_active = TRUE);
DROP POLICY IF EXISTS "Admin manage services" ON services;
CREATE POLICY "Admin manage services" ON services FOR ALL TO authenticated USING (TRUE);

-- Glass categories: public read, admin manage
ALTER TABLE glass_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON glass_categories;
CREATE POLICY "Public read categories" ON glass_categories FOR SELECT TO anon USING (TRUE);
DROP POLICY IF EXISTS "Admin manage categories" ON glass_categories;
CREATE POLICY "Admin manage categories" ON glass_categories FOR ALL TO authenticated USING (TRUE);

-- Lens categories: public read, admin manage
ALTER TABLE lens_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read lens categories" ON lens_categories;
CREATE POLICY "Public read lens categories" ON lens_categories FOR SELECT TO anon USING (TRUE);
DROP POLICY IF EXISTS "Admin manage lens categories" ON lens_categories;
CREATE POLICY "Admin manage lens categories" ON lens_categories FOR ALL TO authenticated USING (TRUE);

-- Lens needs: public read, admin manage
ALTER TABLE lens_needs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read lens needs" ON lens_needs;
CREATE POLICY "Public read lens needs" ON lens_needs FOR SELECT TO anon USING (TRUE);
DROP POLICY IF EXISTS "Admin manage lens needs" ON lens_needs;
CREATE POLICY "Admin manage lens needs" ON lens_needs FOR ALL TO authenticated USING (TRUE);

-- Junction tables: public read, admin manage
ALTER TABLE glasses_lens_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read glasses_lens_categories" ON glasses_lens_categories;
CREATE POLICY "Public read glasses_lens_categories" ON glasses_lens_categories FOR SELECT TO anon USING (TRUE);
DROP POLICY IF EXISTS "Anon manage glasses_lens_categories" ON glasses_lens_categories;
CREATE POLICY "Anon manage glasses_lens_categories" ON glasses_lens_categories FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admin manage glasses_lens_categories" ON glasses_lens_categories;
CREATE POLICY "Admin manage glasses_lens_categories" ON glasses_lens_categories FOR ALL TO authenticated USING (TRUE);

ALTER TABLE glasses_lens_needs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read glasses_lens_needs" ON glasses_lens_needs;
CREATE POLICY "Public read glasses_lens_needs" ON glasses_lens_needs FOR SELECT TO anon USING (TRUE);
DROP POLICY IF EXISTS "Anon manage glasses_lens_needs" ON glasses_lens_needs;
CREATE POLICY "Anon manage glasses_lens_needs" ON glasses_lens_needs FOR ALL TO anon USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admin manage glasses_lens_needs" ON glasses_lens_needs;
CREATE POLICY "Admin manage glasses_lens_needs" ON glasses_lens_needs FOR ALL TO authenticated USING (TRUE);