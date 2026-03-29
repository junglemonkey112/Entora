-- ============================================================
-- Entora Migration: Guide Profiles, Bookings, Reviews
-- ============================================================
-- Run after schema.sql and migration_counselor_applications.sql.
-- ============================================================

-- ─── guide_profiles ─────────────────────────────────────────────────────────
-- Rich profile for student counselors (guides). Separate from `profiles`
-- so guides can have a public-facing card with specialties, rates, etc.
-- Linked to profiles.id via user_id.

CREATE TABLE IF NOT EXISTS guide_profiles (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               uuid REFERENCES profiles(id) ON DELETE CASCADE,
  slug                  text NOT NULL UNIQUE,
  bio                   text,
  languages             text[],          -- e.g. ['English','Mandarin','Korean']
  specialties           text[],          -- e.g. ['essays','financial-aid','us-applications']
  universities_attended text[],          -- Schools the guide currently attends or has attended
  also_accepted_to      text[],          -- Schools they were accepted to (for social proof)
  country               text,            -- Country of origin (for filter matching)
  hourly_rate           int,             -- Session rate in USD whole dollars (e.g. 75)
  is_verified           boolean NOT NULL DEFAULT false,
  rating                numeric(3,2)     NOT NULL DEFAULT 0,
  review_count          int              NOT NULL DEFAULT 0,
  sessions_count        int              NOT NULL DEFAULT 0,
  is_active             boolean          NOT NULL DEFAULT true,
  created_at            timestamptz      NOT NULL DEFAULT now()
);

ALTER TABLE guide_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guide_profiles_public_read"
  ON guide_profiles FOR SELECT USING (true);

CREATE POLICY "guide_profiles_owner_update"
  ON guide_profiles FOR UPDATE USING (
    auth.uid() = user_id
  );

CREATE POLICY "guide_profiles_owner_insert"
  ON guide_profiles FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- ─── bookings ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id          uuid NOT NULL REFERENCES guide_profiles(id) ON DELETE CASCADE,
  scheduled_at      timestamptz NOT NULL,
  duration_mins     int          NOT NULL DEFAULT 60,
  topic             text,
  status            text         NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','confirmed','completed','cancelled')),
  stripe_session_id text,
  amount_cents      int,
  created_at        timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Students can see their own bookings; guides can see bookings for their profile
CREATE POLICY "bookings_student_read"
  ON bookings FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "bookings_guide_read"
  ON bookings FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM guide_profiles gp
      WHERE gp.id = guide_id AND gp.user_id = auth.uid()
    )
  );

CREATE POLICY "bookings_student_insert"
  ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "bookings_update_own"
  ON bookings FOR UPDATE USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM guide_profiles gp
      WHERE gp.id = guide_id AND gp.user_id = auth.uid()
    )
  );

-- ─── guide_reviews ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guide_reviews (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guide_id    uuid NOT NULL REFERENCES guide_profiles(id) ON DELETE CASCADE,
  rating      int  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id)   -- one review per session
);

ALTER TABLE guide_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guide_reviews_public_read"
  ON guide_reviews FOR SELECT USING (true);

CREATE POLICY "guide_reviews_student_insert"
  ON guide_reviews FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_guide_profiles_is_active
  ON guide_profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_guide_profiles_slug
  ON guide_profiles(slug);

CREATE INDEX IF NOT EXISTS idx_guide_profiles_user_id
  ON guide_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_bookings_student_id
  ON bookings(student_id);

CREATE INDEX IF NOT EXISTS idx_bookings_guide_id
  ON bookings(guide_id);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_guide_reviews_guide_id
  ON guide_reviews(guide_id);

-- ─── testimonials ────────────────────────────────────────────────────────────
-- Used by the landing page to display social proof quotes.

CREATE TABLE IF NOT EXISTS testimonials (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            text NOT NULL,
  photo_url       text,
  school_accepted text NOT NULL,
  country         text,
  quote           text NOT NULL,
  is_featured     boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read"
  ON testimonials FOR SELECT USING (true);

CREATE POLICY "testimonials_anyone_insert"
  ON testimonials FOR INSERT WITH CHECK (true);

-- ─── school_tags on forum_posts ──────────────────────────────────────────────
-- Allows posts to be tagged with one or more university slugs so they
-- appear on the corresponding /schools/[slug] detail page.

ALTER TABLE forum_posts
  ADD COLUMN IF NOT EXISTS school_tags text[];

CREATE INDEX IF NOT EXISTS idx_forum_posts_school_tags
  ON forum_posts USING GIN (school_tags);
