-- Entora Database Schema
-- Run this file against your Supabase project to create all tables.

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  email      text not null,
  role       text not null check (role in ('student','parent','counselor','guide','specialist','university_admin')),
  avatar_url text,
  grade      text,
  gpa        numeric,
  interests  text[],
  target_major  text,
  target_schools text[],
  country    text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. ROADMAP MILESTONES
-- ============================================================
create table public.roadmap_milestones (
  id          uuid primary key default gen_random_uuid(),
  grade       integer not null check (grade between 9 and 12),
  title       text not null,
  description text,
  category    text not null check (category in ('academics','testing','extracurriculars','essays','applications','financial')),
  due_month   text,
  sort_order  integer not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 3. USER MILESTONES
-- ============================================================
create table public.user_milestones (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.roadmap_milestones(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, milestone_id)
);

-- ============================================================
-- 4. UNIVERSITIES
-- ============================================================
create table public.universities (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  slug            text unique not null,
  country         text not null,
  city            text,
  state           text,
  acceptance_rate numeric,
  avg_cost        numeric,
  ranking         integer,
  programs        text[],
  description     text,
  website         text,
  logo_url        text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- 5. RESOURCES
-- ============================================================
create table public.resources (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  type         text not null check (type in ('essay_example','checklist','visa_guide','success_story')),
  category     text,
  title        text not null,
  preview_text text,
  author_name  text,
  content      text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- 6. FORUM CATEGORIES
-- ============================================================
create table public.forum_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. FORUM POSTS
-- ============================================================
create table public.forum_posts (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid not null references public.profiles(id) on delete cascade,
  category_id    uuid references public.forum_categories(id),
  title          text not null,
  content        text not null,
  is_pinned      boolean not null default false,
  likes_count    integer not null default 0,
  comments_count integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ============================================================
-- 8. FORUM COMMENTS
-- ============================================================
create table public.forum_comments (
  id                uuid primary key default gen_random_uuid(),
  post_id           uuid not null references public.forum_posts(id) on delete cascade,
  author_id         uuid not null references public.profiles(id) on delete cascade,
  parent_comment_id uuid references public.forum_comments(id) on delete cascade,
  content           text not null,
  likes_count       integer not null default 0,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- 9. FORUM LIKES
-- ============================================================
create table public.forum_likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.forum_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_roadmap_milestones_grade on public.roadmap_milestones(grade);
create index idx_universities_country     on public.universities(country);
create index idx_resources_type           on public.resources(type);
create index idx_user_milestones_user     on public.user_milestones(user_id);
create index idx_forum_posts_category     on public.forum_posts(category_id);
create index idx_forum_posts_author       on public.forum_posts(author_id);
create index idx_forum_comments_post      on public.forum_comments(post_id);

-- ============================================================
-- AUTH TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
alter table public.profiles enable row level security;
create policy "Anyone can view profiles"       on public.profiles for select using (true);
create policy "Users can update own profile"   on public.profiles for update using (auth.uid() = id);

-- roadmap_milestones
alter table public.roadmap_milestones enable row level security;
create policy "Anyone can view milestones"     on public.roadmap_milestones for select using (true);

-- user_milestones
alter table public.user_milestones enable row level security;
create policy "Users can view own milestones"  on public.user_milestones for select using (auth.uid() = user_id);
create policy "Users can insert own milestones" on public.user_milestones for insert with check (auth.uid() = user_id);
create policy "Users can delete own milestones" on public.user_milestones for delete using (auth.uid() = user_id);

-- universities
alter table public.universities enable row level security;
create policy "Anyone can view universities"   on public.universities for select using (true);

-- resources
alter table public.resources enable row level security;
create policy "Anyone can view resources"      on public.resources for select using (true);

-- forum_categories
alter table public.forum_categories enable row level security;
create policy "Anyone can view categories"     on public.forum_categories for select using (true);

-- forum_posts
alter table public.forum_posts enable row level security;
create policy "Anyone can view posts"          on public.forum_posts for select using (true);
create policy "Auth users can create posts"    on public.forum_posts for insert with check (auth.uid() = author_id);
create policy "Authors can update own posts"   on public.forum_posts for update using (auth.uid() = author_id);
create policy "Authors can delete own posts"   on public.forum_posts for delete using (auth.uid() = author_id);

-- forum_comments
alter table public.forum_comments enable row level security;
create policy "Anyone can view comments"       on public.forum_comments for select using (true);
create policy "Auth users can create comments" on public.forum_comments for insert with check (auth.uid() = author_id);
create policy "Authors can update own comments" on public.forum_comments for update using (auth.uid() = author_id);
create policy "Authors can delete own comments" on public.forum_comments for delete using (auth.uid() = author_id);

-- forum_likes
alter table public.forum_likes enable row level security;
create policy "Users can view own likes"       on public.forum_likes for select using (auth.uid() = user_id);
create policy "Users can insert own likes"     on public.forum_likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes"     on public.forum_likes for delete using (auth.uid() = user_id);
