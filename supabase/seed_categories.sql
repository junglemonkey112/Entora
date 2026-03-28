-- ============================================================
-- Seed: forum_categories (5 rows)
-- ============================================================
INSERT INTO forum_categories (slug, name) VALUES
  ('general',       'General'),
  ('essays',        'Essays'),
  ('financial-aid', 'Financial Aid'),
  ('international', 'International'),
  ('test-prep',     'Test Prep')
ON CONFLICT (slug) DO NOTHING;
