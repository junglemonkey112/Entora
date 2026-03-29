-- ============================================================
-- Entora Guide Profiles Seed
-- 5 mock student counselors (guides) — CN/KR/JP/US/IN
-- ============================================================
-- NOTE: guide_profiles.user_id → profiles.id → auth.users(id) FK.
-- Use session_replication_role = replica to bypass FK for demo data.
-- These profiles are display-only mocks; production guides are real
-- Supabase Auth accounts approved via the counselor application flow.
-- ============================================================

BEGIN;
SET session_replication_role = replica;

-- ─── Base profiles (role = 'guide') ─────────────────────────────────────────

INSERT INTO profiles (id, full_name, email, role, country, created_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Jessica Chen',    'jessica@example.com',  'guide', 'China',         now() - interval '180 days'),
  ('c1000000-0000-0000-0000-000000000002', 'Min-jun Lee',     'minjun@example.com',   'guide', 'South Korea',   now() - interval '150 days'),
  ('c1000000-0000-0000-0000-000000000003', 'Yuki Tanaka',     'yuki@example.com',     'guide', 'Japan',         now() - interval '120 days'),
  ('c1000000-0000-0000-0000-000000000004', 'Arjun Sharma',    'arjun@example.com',    'guide', 'India',         now() - interval '90 days'),
  ('c1000000-0000-0000-0000-000000000005', 'Maya Rodriguez',  'maya@example.com',     'guide', 'United States', now() - interval '60 days')
ON CONFLICT (id) DO NOTHING;

-- ─── Guide profiles ──────────────────────────────────────────────────────────

INSERT INTO guide_profiles (
  id, user_id, slug, bio, languages, specialties,
  universities_attended, also_accepted_to, country,
  hourly_rate, is_verified, rating, review_count, sessions_count, is_active
) VALUES

-- 1. Jessica Chen — MIT CS sophomore, China
(
  'd1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'jessica-chen',
  'Hi! I''m a sophomore at MIT studying Computer Science. I grew up in Shenzhen and went through the entire US college application process as an international student — TOEFL, SAT, Common App, financial aid applications, you name it. I know how daunting it feels when you''re doing this from China without much local support. I''m especially good at helping with "Why This School" essays and showing your authentic story in your personal statement. I''ve helped 20+ students from China so far and love seeing them get into their dream schools.',
  ARRAY['English', 'Mandarin'],
  ARRAY['essays', 'us-applications', 'test-prep', 'international'],
  ARRAY['MIT'],
  ARRAY['Stanford', 'Harvard', 'Caltech', 'Princeton', 'Carnegie Mellon'],
  'China',
  85,
  true,
  4.93,
  47,
  52,
  true
),

-- 2. Min-jun Lee — Columbia Business junior, South Korea
(
  'd1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002',
  'minjun-lee',
  'Junior at Columbia studying Economics. I applied from Seoul and got into 6 of my 9 schools. The thing most Korean students struggle with is making their extracurriculars sound compelling in English — activities that feel ordinary in Korea (math olympiad, student council) are actually impressive if you frame them right. I also know the financial aid process inside out, including the CSS Profile and how to negotiate aid packages. I speak fluent Korean so we can talk through your application in whichever language you''re more comfortable with.',
  ARRAY['English', 'Korean'],
  ARRAY['essays', 'financial-aid', 'us-applications', 'international'],
  ARRAY['Columbia University'],
  ARRAY['Yale', 'Duke', 'NYU', 'University of Michigan', 'Georgetown'],
  'South Korea',
  70,
  true,
  4.88,
  33,
  38,
  true
),

-- 3. Yuki Tanaka — UCL Engineering sophomore, Japan
(
  'd1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003',
  'yuki-tanaka',
  'I''m a second-year Mechanical Engineering student at UCL. I applied to both UK (UCAS) and US (Common App) universities from Tokyo, so I can help you navigate both systems. The UCAS Personal Statement is a completely different beast from Common App essays — it''s all about your academic passion for the subject, not your life story. I also went through the UK Student Visa process and can help you prepare your finances and documentation. Japanese students often undersell themselves in applications; I''ll help you find the confidence to tell your story.',
  ARRAY['English', 'Japanese'],
  ARRAY['uk-applications', 'essays', 'international', 'test-prep'],
  ARRAY['University College London'],
  ARRAY['University of Edinburgh', 'Imperial College London', 'King''s College London', 'University of Toronto', 'UCLA'],
  'Japan',
  60,
  true,
  4.91,
  28,
  31,
  true
),

-- 4. Arjun Sharma — Stanford Engineering senior, India
(
  'd1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000004',
  'arjun-sharma',
  'Senior at Stanford studying Electrical Engineering. I came from Mumbai and was fortunate to receive a full scholarship. I know the Indian college application landscape very well — JEE vs SAT tradeoffs, how to present competitive olympiad scores, and how to write about your family background without it feeling like a sob story. I''m particularly experienced with need-based financial aid and scholarship applications for international students, including the CSS Profile. If you''re aiming for top US engineering programs, let''s talk.',
  ARRAY['English', 'Hindi'],
  ARRAY['financial-aid', 'essays', 'us-applications', 'test-prep'],
  ARRAY['Stanford University'],
  ARRAY['MIT', 'Caltech', 'UC Berkeley', 'Carnegie Mellon', 'University of Michigan'],
  'India',
  90,
  true,
  4.97,
  61,
  68,
  true
),

-- 5. Maya Rodriguez — Harvard sophomore, United States (international-facing)
(
  'd1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000005',
  'maya-rodriguez',
  'Sophomore at Harvard studying Government. I grew up in Miami with Cuban heritage and am passionate about helping first-generation and international students navigate the US admissions process. I know how to write about cultural identity in a way that feels genuine and stands out — not as a gimmick, but as a real part of your story. I also have experience with the financial aid process as a Pell Grant recipient. I speak Spanish fluently and work with a lot of Latin American students.',
  ARRAY['English', 'Spanish'],
  ARRAY['essays', 'us-applications', 'financial-aid'],
  ARRAY['Harvard University'],
  ARRAY['Yale', 'Princeton', 'Columbia', 'University of Chicago', 'Georgetown'],
  'United States',
  75,
  true,
  4.85,
  22,
  25,
  true
)
ON CONFLICT (id) DO NOTHING;

SET session_replication_role = DEFAULT;
COMMIT;
