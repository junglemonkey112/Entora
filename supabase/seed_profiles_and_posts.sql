-- ============================================================
-- Seed: auth users, profiles (guides/specialists/students/counselor),
--       and forum posts across all 5 categories
-- ============================================================

-- Auth users (seed accounts — not real logins)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'james.chen@entora.dev',    '$2a$10$placeholder', now(), now(), now(), '{"full_name":"James Chen","role":"guide"}'),
  ('a1000000-0000-0000-0000-000000000002', 'priya.sharma@entora.dev',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Priya Sharma","role":"specialist"}'),
  ('a1000000-0000-0000-0000-000000000003', 'amara.osei@entora.dev',    '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Amara Osei","role":"guide"}'),
  ('a1000000-0000-0000-0000-000000000004', 'luca.ferrari@entora.dev',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Luca Ferrari","role":"specialist"}'),
  ('a1000000-0000-0000-0000-000000000005', 'sofia.nguyen@entora.dev',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Sofia Nguyen","role":"student"}'),
  ('a1000000-0000-0000-0000-000000000006', 'kwame.boateng@entora.dev', '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Kwame Boateng","role":"student"}'),
  ('a1000000-0000-0000-0000-000000000007', 'emily.park@entora.dev',    '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Emily Park","role":"student"}'),
  ('a1000000-0000-0000-0000-000000000008', 'raj.patel@entora.dev',     '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Raj Patel","role":"counselor"}')
ON CONFLICT (id) DO NOTHING;
-- Note: auth trigger (handle_new_user) auto-creates profiles rows from the above

-- Forum posts across all 5 categories
INSERT INTO forum_posts (author_id, category_id, title, content, is_pinned, likes_count, comments_count, created_at)
SELECT p.author_id::uuid, c.id, p.title, p.content, p.is_pinned, p.likes, p.comments, p.created_at
FROM (VALUES

  ('a1000000-0000-0000-0000-000000000001', 'general',
   'Welcome to Entora Community — read this first',
   'Hi everyone! I''m James, one of the guides here. This community is a place to ask questions, share experiences, and support each other through the college admissions process.

A few ground rules:
- Be kind and specific. Vague questions get vague answers.
- Search before posting — your question has probably been asked before.
- Share your context: country, grade, target schools. It helps us help you.

Whether you''re in Grade 9 just starting out or a Grade 12 student finishing your last applications — you belong here. Ask anything.',
   true, 47, 12, now() - interval '30 days'),

  ('a1000000-0000-0000-0000-000000000005', 'general',
   'How do you stay motivated when the process feels overwhelming?',
   'I''m in Grade 11 and the amount of stuff I need to do feels impossible some days. SAT prep, maintaining GPA, extracurriculars, AND starting to think about essays. How do you all stay motivated?',
   false, 23, 8, now() - interval '12 days'),

  ('a1000000-0000-0000-0000-000000000008', 'general',
   'The difference between a "good" and "great" college application',
   'After reviewing hundreds of applications, here is what separates good from great:

Good applications check all the boxes — strong GPA, solid test scores, decent extracurriculars, competent essays.

Great applications tell a story. Every piece connects. The essays explain the activities. The activities reinforce the academic interest. The recommendations confirm what the student says about themselves.

Ask yourself: if you removed your name, would your application still sound distinctly like you?',
   false, 61, 14, now() - interval '8 days'),

  ('a1000000-0000-0000-0000-000000000002', 'essays',
   'Common App essay mistakes I see every year',
   'Pinning this because I see these in almost every first draft:

1. Starting with a quote. Start with action or a specific moment instead.
2. The "I learned so much" ending. Tell us what you actually learned, specifically.
3. Writing about volunteer work as if it changed the world. Focus on what it revealed about you.
4. Trying to sound impressive rather than honest. The best essays are specific and a little vulnerable.
5. Treating 650 words as a minimum. Some of the best essays are 500 words.

Post your first paragraph in replies — happy to give feedback.',
   true, 89, 31, now() - interval '20 days'),

  ('a1000000-0000-0000-0000-000000000007', 'essays',
   'Can I write about my cultural background for my Common App essay?',
   'I''m Nigerian-British and I want to write about navigating two very different cultures growing up. But I''ve heard that writing about being an immigrant or mixed-culture experience is "overdone."

Is that true? Should I pick a different topic? This feels like the most important thing about who I am.',
   false, 34, 19, now() - interval '6 days'),

  ('a1000000-0000-0000-0000-000000000003', 'financial-aid',
   'FAFSA opens October 1 — here''s everything you need to prepare now',
   'For US students applying this cycle, FAFSA opens October 1. Do not wait.

What to gather before October 1:
- Your Social Security Number (and parents'' if dependent)
- 2023 tax returns or IRS Data Link login
- Bank account and investment balances
- Records of untaxed income

Why submit early: some state and institutional aid is first-come, first-served. Submitting in October vs January can make a real difference.

International students: FAFSA is for US citizens and eligible non-citizens only. Check each school''s international aid policy separately.',
   true, 55, 9, now() - interval '25 days'),

  ('a1000000-0000-0000-0000-000000000006', 'financial-aid',
   'Does applying for financial aid hurt your admission chances?',
   'I''ve heard that some schools are "need-blind" and some are "need-aware." Can someone explain the difference and which schools I should be careful with?

My family definitely needs aid but I don''t want to hurt my chances at my target schools.',
   false, 28, 11, now() - interval '4 days'),

  ('a1000000-0000-0000-0000-000000000004', 'international',
   'Applying to both US and UK universities simultaneously — tips',
   'The systems are fundamentally different:

- UCAS wants to know why you love your subject (academic personal statement)
- Common App wants to know who you are as a person (personal narrative)

You need two completely different personal statements. Do not try to adapt one for the other — it shows.

Timelines also conflict: UCAS (October 15 for Oxford/Cambridge, January 31 for most others) overlaps with US Early Decision season. Plan carefully.',
   false, 42, 16, now() - interval '15 days'),

  ('a1000000-0000-0000-0000-000000000005', 'international',
   'F-1 visa interview — what questions should I expect?',
   'I have my US F-1 visa interview next week and I''m really nervous. I''ve heard the officer can deny you with no appeal. What questions do they usually ask?

I''m from Ghana applying to a university in California.',
   false, 19, 7, now() - interval '2 days'),

  ('a1000000-0000-0000-0000-000000000002', 'test-prep',
   'SAT vs ACT — how to actually decide',
   'The honest answer: take a full practice test of each and compare your scores. That is the only reliable way to know.

SAT tends to suit students who are strong readers, comfortable with data interpretation, and prefer more time per question.

ACT tends to suit faster test-takers who are strong in science reasoning and prefer straightforward math.

Neither is harder — they are just different. Most colleges accept both equally.',
   true, 73, 22, now() - interval '18 days'),

  ('a1000000-0000-0000-0000-000000000006', 'test-prep',
   'Is it worth retaking the SAT a third time?',
   'I took the SAT twice and got 1380 both times. My target schools have a median around 1480-1520. Worth taking a third time or should I focus on other parts of my application?

I''m Grade 12 so time is limited.',
   false, 31, 15, now() - interval '5 days')

) AS p(author_id, cat_slug, title, content, is_pinned, likes, comments, created_at)
JOIN forum_categories c ON c.slug = p.cat_slug
ON CONFLICT DO NOTHING;
