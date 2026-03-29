-- Migration: add school_slug and outcome columns to resources for success stories
-- Run via Supabase dashboard SQL editor

ALTER TABLE resources
  ADD COLUMN IF NOT EXISTS school_slug text,
  ADD COLUMN IF NOT EXISTS outcome text
    CHECK (outcome IN ('accepted', 'waitlisted', 'rejected') OR outcome IS NULL),
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS gpa_range text,
  ADD COLUMN IF NOT EXISTS test_scores text,
  ADD COLUMN IF NOT EXISTS major text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN resources.school_slug IS 'Slug of the university this story is about';
COMMENT ON COLUMN resources.outcome IS 'Admission outcome: accepted, waitlisted, or rejected';
COMMENT ON COLUMN resources.is_published IS 'Admin-approval gate; false = pending review';

-- Allow anyone to insert a new success story submission
CREATE POLICY IF NOT EXISTS "stories_insert_public" ON resources
  FOR INSERT WITH CHECK (type = 'success_story' AND is_published = false);
