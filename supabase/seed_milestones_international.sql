-- International student milestone additions
-- Run AFTER migration_roadmap_international.sql
-- Bypasses RLS so data can be inserted without auth

SET session_replication_role = replica;

-- ── China-specific milestones ────────────────────────────────────────────────
INSERT INTO roadmap_milestones (grade, title, description, category, due_month, sort_order, country_variant) VALUES
(9,  'Register for IELTS or TOEFL (China)',
     'Chinese students applying to US/UK/AU/CA universities typically need IELTS or TOEFL. Start prep early in Grade 9 — scores are valid for 2 years.',
     'testing', 'September', 5, 'china'),
(10, 'Research US Common App vs UK UCAS (China)',
     'Decide early whether you are targeting US universities (Common App), UK (UCAS), or both. Each has different essay and reference requirements.',
     'applications', 'October', 15, 'china'),
(11, 'Take TOEFL/IELTS — aim for first attempt (China)',
     'Target TOEFL 100+ or IELTS 7.0+ for selective schools. Plan to retake once if needed — schedule now.',
     'testing', 'March', 20, 'china'),
(11, 'Build your financial documentation (China)',
     'US and UK schools require proof of financial support for international students. Gather bank statements and family sponsor letters early.',
     'financial', 'August', 25, 'china'),
(12, 'Apply for F-1 student visa (US) or UK Student Visa (China)',
     'After receiving a US acceptance, schedule your SEVIS fee payment and F-1 visa interview at the US Embassy. For UK, apply for the Student Route visa after CAS is issued.',
     'applications', 'May', 90, 'china');

-- ── India-specific milestones ────────────────────────────────────────────────
INSERT INTO roadmap_milestones (grade, title, description, category, due_month, sort_order, country_variant) VALUES
(9,  'Start IELTS / TOEFL preparation (India)',
     'Most US and UK universities require IELTS 6.5+ or TOEFL 90+ from Indian applicants. Begin prep in Grade 9.',
     'testing', 'September', 5, 'india'),
(10, 'Explore CSS Profile and FAFSA for international aid (India)',
     'Many US universities offer need-based aid to international students via the CSS Profile. Research which schools meet full need before building your list.',
     'financial', 'November', 15, 'india'),
(11, 'Register for SAT Subject Tests / AP Exams (India)',
     'Strong AP scores (4s and 5s) can substitute for A-levels and show academic rigor. Plan 2–3 AP exams that align with your intended major.',
     'testing', 'January', 20, 'india'),
(12, 'Gather financial aid documents (India)',
     'Prepare CA-certified income statements, ITR filings, and bank statements. CSS Profile typically opens October 1.',
     'financial', 'September', 85, 'india'),
(12, 'Apply for F-1 visa after acceptance (India)',
     'Book your US Embassy visa interview early — slots fill fast in May/June. Bring I-20, SEVIS payment receipt, and financial proof.',
     'applications', 'May', 92, 'india');

-- ── South Korea-specific milestones ─────────────────────────────────────────
INSERT INTO roadmap_milestones (grade, title, description, category, due_month, sort_order, country_variant) VALUES
(9,  'Begin TOEFL preparation (Korea)',
     'Korean students targeting US Top 50 schools should aim for TOEFL 105+. Start vocab building and practice tests in Grade 9.',
     'testing', 'September', 5, 'south korea'),
(10, 'Research Common App vs QS World Rankings (Korea)',
     'Decide between US-focused (Common App) and globally-ranked schools (UK, HK, Singapore). Each route needs a different extracurricular strategy.',
     'applications', 'October', 15, 'south korea'),
(11, 'Take SAT — aim for 1450+ for Top 30 (Korea)',
     'Koreans applying to selective US schools are expected to have strong SAT scores (1450–1550+). Build test prep into your Grade 11 schedule.',
     'testing', 'March', 20, 'south korea'),
(12, 'Prepare military service plan if applicable (Korea)',
     'Male Korean students may need to explain their military obligation timeline in applications. Address it briefly in additional information sections.',
     'applications', 'October', 88, 'south korea');

-- ── Japan-specific milestones ────────────────────────────────────────────────
INSERT INTO roadmap_milestones (grade, title, description, category, due_month, sort_order, country_variant) VALUES
(9,  'Choose IELTS or TOEFL path (Japan)',
     'Japanese students should decide between IELTS (preferred by UK/AU) and TOEFL (preferred by US) early. Both take significant preparation time.',
     'testing', 'October', 5, 'japan'),
(10, 'Explore JASSO and Monbukagakusho scholarships (Japan)',
     'Japanese students can apply for Monbukagakusho (MEXT) government scholarships and JASSO scholarships for study abroad. Research eligibility early.',
     'financial', 'November', 12, 'japan'),
(11, 'Build independent research or project portfolio (Japan)',
     'US universities value demonstrated initiative. Use summer of Grade 11 for a research project, internship, or community initiative you can write about in essays.',
     'extracurriculars', 'June', 22, 'japan'),
(12, 'Apply for Certificate of Eligibility before visa (Japan)',
     'Once accepted to a US school, obtain the Certificate of Eligibility (CoE) for your F-1 visa. Begin this process as soon as you receive your I-20.',
     'applications', 'June', 91, 'japan');

SET session_replication_role = DEFAULT;
