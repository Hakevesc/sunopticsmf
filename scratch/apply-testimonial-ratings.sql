-- ============================================================
-- Standalone: testimonial ratings only.
-- Run in Supabase SQL Editor. Idempotent.
-- Widens testimonials.rating to NUMERIC(2,1) (so 4.5 is allowed)
-- and sets ratings: 6× 5.0, 3× 4.5, 1× 4.0.
-- ============================================================

-- 1. Widen rating to allow half stars
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

-- 2. Assign ratings by author name (case-insensitive, prefix match)
UPDATE testimonials SET rating = CASE
  -- Six full stars
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

-- 3. Verify
SELECT author_name, rating
FROM testimonials
ORDER BY rating DESC NULLS LAST, author_name;
