-- ============================================================
-- Seed: roadmap_milestones (~28 rows, ~7 per grade)
-- ============================================================
INSERT INTO roadmap_milestones (grade, title, description, category, due_month, sort_order) VALUES

-- ---- Grade 9 ----
(9, 'Set up a GPA tracking system',
 'Create a spreadsheet or use an app to track your GPA each semester. Knowing where you stand early helps you set realistic goals.',
 'academics', 'September', 1),

(9, 'Explore extracurricular options',
 'Try at least two new clubs, sports, or activities. Colleges want to see sustained commitment, so start finding what you love.',
 'extracurriculars', 'October', 2),

(9, 'Learn about the SAT/ACT',
 'Understand the format, timing, and scoring of both tests. Decide which one aligns better with your strengths.',
 'testing', 'November', 3),

(9, 'Start a college interest list',
 'Research 5-10 colleges that appeal to you. Note what you like about each — location, programs, size, culture.',
 'applications', 'January', 4),

(9, 'Meet with your school counselor',
 'Introduce yourself and discuss your academic goals. Counselors can recommend courses and flag important deadlines.',
 'academics', 'February', 5),

(9, 'Understand financial aid basics',
 'Learn what FAFSA, scholarships, grants, and loans are. Talk to your family about your college budget expectations.',
 'financial', 'March', 6),

(9, 'Keep a brag sheet',
 'Start documenting achievements, awards, and activities. This becomes invaluable when writing essays and filling applications.',
 'essays', 'May', 7),

-- ---- Grade 10 ----
(10, 'Take the PSAT 10',
 'The PSAT 10 is great practice for the SAT. Use your score report to identify weak areas for focused study.',
 'testing', 'October', 1),

(10, 'Deepen extracurricular commitments',
 'Narrow down to 2-3 activities and pursue leadership roles or deeper involvement. Quality beats quantity.',
 'extracurriculars', 'September', 2),

(10, 'Research college majors',
 'Explore 3-5 potential majors. Look at required courses, career outcomes, and which colleges have strong programs.',
 'applications', 'November', 3),

(10, 'Build strong study habits',
 'Develop a weekly study schedule. Consistent habits now will make junior year — the hardest year — much more manageable.',
 'academics', 'September', 4),

(10, 'Start SAT/ACT prep',
 'Begin light test prep using free resources like Khan Academy. Take one full practice test to get a baseline score.',
 'testing', 'January', 5),

(10, 'Shadow a professional in a field of interest',
 'Arrange a job shadow or informational interview. Real-world exposure helps clarify your interests and impresses admissions officers.',
 'extracurriculars', 'March', 6),

(10, 'Research scholarship opportunities',
 'Find scholarships you may be eligible for in grades 11 or 12. Note deadlines and requirements so you can prepare.',
 'financial', 'April', 7),

-- ---- Grade 11 ----
(11, 'Take the PSAT/NMSQT',
 'This test qualifies you for the National Merit Scholarship. Prep seriously — even a top score opens doors to merit aid.',
 'testing', 'October', 1),

(11, 'Build your college list',
 'Create a balanced list of 10-15 schools: reach, target, and likely. Visit campuses virtually or in person if possible.',
 'applications', 'October', 2),

(11, 'Take the SAT or ACT',
 'Aim for your first official SAT/ACT attempt by spring. Most students test 2-3 times to achieve their best score.',
 'testing', 'March', 3),

(11, 'Request letters of recommendation',
 'Identify 2-3 teachers who know you well. Ask them by April so they have ample time to write strong letters.',
 'applications', 'April', 4),

(11, 'Attend college fairs and info sessions',
 'Meet admissions reps and ask thoughtful questions. Notes from these interactions can personalize your application essays.',
 'applications', 'November', 5),

(11, 'Draft your activities list',
 'Write a concise 150-character description for each extracurricular. Emphasize impact, leadership, and hours committed.',
 'essays', 'May', 6),

(11, 'Explore CSS Profile and FAFSA requirements',
 'Some private colleges require the CSS Profile in addition to FAFSA. Learn what documents your family will need.',
 'financial', 'June', 7),

-- ---- Grade 12 ----
(12, 'Finalize your college list',
 'Confirm your final list of 8-12 colleges. Make sure you have realistic safety schools where you would be happy attending.',
 'applications', 'August', 1),

(12, 'Write and revise your Common App essay',
 'Draft, get feedback, and polish your personal statement. Aim for a story only you could tell — authentic and specific.',
 'essays', 'August', 2),

(12, 'Submit Early Decision / Early Action applications',
 'ED/EA deadlines are typically November 1 or 15. Submitting early can improve your odds at many schools.',
 'applications', 'November', 3),

(12, 'Complete and submit FAFSA',
 'FAFSA opens October 1. Submit as early as possible — some financial aid is first-come, first-served.',
 'financial', 'October', 4),

(12, 'Submit Regular Decision applications',
 'Most RD deadlines fall January 1-15. Review each application carefully before submitting.',
 'applications', 'January', 5),

(12, 'Compare financial aid award letters',
 'When offers arrive, compare net cost (not sticker price). Use the College Scorecard and net price calculators.',
 'financial', 'March', 6),

(12, 'Commit to your college by May 1',
 'Submit your enrollment deposit to your chosen school by National Decision Day. Notify other schools you are declining.',
 'applications', 'May', 7)

ON CONFLICT DO NOTHING;
