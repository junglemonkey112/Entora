-- ============================================================
-- Entora Migration: Student Counselor Applications
-- ============================================================
-- Run this after schema.sql.
-- Adds the counselor_applications table so students can apply
-- to become Student Counselors, and adds useful columns to
-- profiles for counselors (applied_to, expertise).
-- ============================================================

-- ─── counselor_applications ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS counselor_applications (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    text NOT NULL,
  email        text NOT NULL,
  university   text NOT NULL,       -- University the applicant attends/attended
  grad_year    int,                  -- Expected or actual graduation year
  applied_to   text[],              -- Schools they applied to (for context)
  expertise    text[],              -- e.g. ['essays','financial-aid','us-applications']
  message      text NOT NULL,       -- Why they want to be a counselor
  status       text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE counselor_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can apply (no auth required for public application form)
CREATE POLICY "counselor_apps_insert"
  ON counselor_applications FOR INSERT WITH CHECK (true);

-- Admins/guides can view applications (simplified: anyone authenticated)
CREATE POLICY "counselor_apps_select"
  ON counselor_applications FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Add counselor display columns to profiles ───────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS university   text,       -- For guides: university they attend/attended
  ADD COLUMN IF NOT EXISTS grad_year    int,         -- Graduation year
  ADD COLUMN IF NOT EXISTS applied_to   text[],     -- Schools they applied to (display on counselor card)
  ADD COLUMN IF NOT EXISTS expertise    text[];      -- Areas of expertise for counselors

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_counselor_apps_status
  ON counselor_applications(status);

CREATE INDEX IF NOT EXISTS idx_counselor_apps_created
  ON counselor_applications(created_at DESC);
