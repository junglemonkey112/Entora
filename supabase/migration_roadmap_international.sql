-- Migration: add country_variant to roadmap_milestones for personalised roadmaps
-- Run via Supabase dashboard SQL editor

ALTER TABLE roadmap_milestones
  ADD COLUMN IF NOT EXISTS country_variant text;

-- NULL = universal milestone shown to everyone
-- Non-null = shown only to users whose country matches this value
COMMENT ON COLUMN roadmap_milestones.country_variant IS
  'Optional country code/name. NULL = shown to all; e.g. ''china'', ''india'', ''korea'', ''japan''';
