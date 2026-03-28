-- ============================================================
-- Entora College Admissions Platform - Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  email         text,
  role          text NOT NULL DEFAULT 'student'
                  CHECK (role IN ('student','parent','counselor','guide','specialist','university_admin')),
  avatar_url    text,
  grade         int,
  gpa           numeric(3,2),
  interests     text[],
  target_major  text,
  target_schools text[],
  country       text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. roadmap_milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade       int NOT NULL CHECK (grade BETWEEN 9 AND 12),
  title       text NOT NULL,
  description text,
  category    text NOT NULL
                CHECK (category IN ('academics','testing','extracurriculars','essays','applications','financial')),
  due_month   text,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. user_milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS user_milestones (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_id uuid NOT NULL REFERENCES roadmap_milestones(id) ON DELETE CASCADE,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, milestone_id)
);

-- ============================================================
-- 4. universities
-- ============================================================
CREATE TABLE IF NOT EXISTS universities (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  country         text NOT NULL,
  city            text,
  state           text,
  acceptance_rate numeric(5,2),
  avg_cost        int,
  ranking         int,
  programs        text[],
  description     text,
  website         text,
  logo_url        text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. resources
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         text NOT NULL UNIQUE,
  type         text NOT NULL
                 CHECK (type IN ('essay_example','checklist','visa_guide','success_story')),
  category     text,
  title        text NOT NULL,
  preview_text text,
  author_name  text,
  content      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. forum_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_categories (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug       text NOT NULL UNIQUE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. forum_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_posts (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id    uuid NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  title          text NOT NULL,
  content        text NOT NULL,
  is_pinned      boolean NOT NULL DEFAULT false,
  likes_count    int NOT NULL DEFAULT 0,
  comments_count int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. forum_comments
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_comments (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id           uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES forum_comments(id) ON DELETE CASCADE,
  content           text NOT NULL,
  likes_count       int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 9. forum_likes
-- ============================================================
CREATE TABLE IF NOT EXISTS forum_likes (
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  post_id    uuid NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_grade   ON roadmap_milestones(grade);
CREATE INDEX IF NOT EXISTS idx_universities_country        ON universities(country);
CREATE INDEX IF NOT EXISTS idx_resources_type              ON resources(type);
CREATE INDEX IF NOT EXISTS idx_user_milestones_user_id     ON user_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id     ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id       ON forum_posts(author_id);

-- ============================================================
-- Auth Trigger: Create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Row-Level Security
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities      ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources         ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes       ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_public_read"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_update"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_owner_delete"  ON profiles FOR DELETE USING (auth.uid() = id);
CREATE POLICY "profiles_auth_insert"   ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- roadmap_milestones
CREATE POLICY "milestones_public_read" ON roadmap_milestones FOR SELECT USING (true);

-- user_milestones
CREATE POLICY "user_milestones_select" ON user_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_milestones_insert" ON user_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_milestones_delete" ON user_milestones FOR DELETE USING (auth.uid() = user_id);

-- universities
CREATE POLICY "universities_public_read" ON universities FOR SELECT USING (true);

-- resources
CREATE POLICY "resources_public_read" ON resources FOR SELECT USING (true);

-- forum_categories
CREATE POLICY "forum_categories_public_read" ON forum_categories FOR SELECT USING (true);

-- forum_posts
CREATE POLICY "forum_posts_public_read"   ON forum_posts FOR SELECT USING (true);
CREATE POLICY "forum_posts_auth_insert"   ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_posts_owner_update"  ON forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "forum_posts_owner_delete"  ON forum_posts FOR DELETE USING (auth.uid() = author_id);

-- forum_comments
CREATE POLICY "forum_comments_public_read"  ON forum_comments FOR SELECT USING (true);
CREATE POLICY "forum_comments_auth_insert"  ON forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "forum_comments_owner_update" ON forum_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "forum_comments_owner_delete" ON forum_comments FOR DELETE USING (auth.uid() = author_id);

-- forum_likes
CREATE POLICY "forum_likes_select" ON forum_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "forum_likes_insert" ON forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_likes_delete" ON forum_likes FOR DELETE USING (auth.uid() = user_id);
