-- ============================================================
-- Create the testimonials table from scratch, seed all 10 rows
-- with the right ratings, and apply RLS so the public site reads
-- them and the admin UI can manage them.
-- Run in Supabase SQL Editor. Idempotent — safe to re-run.
-- ============================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS testimonials (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name    TEXT NOT NULL,
  author_photo   TEXT,
  rating         NUMERIC(2,1) CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  review_text_en TEXT NOT NULL,
  review_text_am TEXT,
  source         TEXT DEFAULT 'google',
  is_featured    BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- If the table already existed with rating INT, widen it.
DO $$
DECLARE coltype TEXT;
BEGIN
  SELECT data_type INTO coltype
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'testimonials'
    AND column_name = 'rating';

  IF coltype IS NOT NULL AND coltype <> 'numeric' THEN
    ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_rating_check;
    ALTER TABLE testimonials
      ALTER COLUMN rating TYPE NUMERIC(2,1) USING rating::numeric;
    ALTER TABLE testimonials
      ADD CONSTRAINT testimonials_rating_check
      CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5));
  END IF;
END$$;

-- 2. Seed the 10 reviews (only when the table is empty so re-runs are safe)
INSERT INTO testimonials
  (author_name, rating, review_text_en, source, is_featured, is_active, created_at)
SELECT * FROM (VALUES
  ('Samuel Melesse',           5.0::numeric, 'I would like to express my sincere appreciation for the exceptional service I received from Melat, one of your staff members. I am writing to commend her outstanding performance.', 'google', TRUE,  TRUE, NOW() - INTERVAL '9 months'),
  ('Muhumed Aden (Macalinka)', 5.0::numeric, 'Sun optics provides quality services and welcomed professional staff, so if you have any challenges about eye go to Sun Optics -Meskel Flower.',                                  'google', TRUE,  TRUE, NOW() - INTERVAL '8 months'),
  ('Amsalu Mulugeta',          4.5::numeric, 'Clean and good service (includes photos)',                                                                                                                                     'google', FALSE, TRUE, NOW() - INTERVAL '1 year'),
  ('Basil Al-attas',           5.0::numeric, 'Good service with Excellent glasses and tests. If u want this service in Addis, it''s definitely the place to go to.',                                                         'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('yonatan ashenafi',         4.5::numeric, 'I don''t know where to start everything is very nice, the sales and optometrist are very helpful, and also the clinic looks very nice.',                                       'google', FALSE, TRUE, NOW() - INTERVAL '1 year'),
  ('Abrham Tsehay',            4.0::numeric, 'Great service thank you for your hospitality',                                                                                                                                 'google', FALSE, TRUE, NOW() - INTERVAL '2 years'),
  ('Melat Beyene',             5.0::numeric, 'Great service with quality glasses, keep up your good work!',                                                                                                                  'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('Betty Tsehaye',            4.5::numeric, 'It is an amazing place for eye clinc and also i really like the glasses thank u for ur speechless service',                                                                    'google', FALSE, TRUE, NOW() - INTERVAL '2 years'),
  ('Feven Bahiru',             5.0::numeric, 'It''s the best place for eye clinic and Glasses and thanks for your service',                                                                                                  'google', FALSE, TRUE, NOW() - INTERVAL '3 years'),
  ('bethelhem zeleke',         5.0::numeric, 'I got good and expeditious treatment and i also got a quality glasses ...Thank you very much for the hospitality.',                                                            'google', FALSE, TRUE, NOW() - INTERVAL '3 years')
) AS v(author_name, rating, review_text_en, source, is_featured, is_active, created_at)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- 3. RLS — public read, anon manage (matches the rest of the admin pattern)
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

NOTIFY pgrst, 'reload schema';

-- 4. Verify
SELECT author_name, rating, is_featured, is_active,
       to_char(created_at, 'YYYY-MM-DD') AS created
FROM testimonials
ORDER BY rating DESC NULLS LAST, created_at DESC;
