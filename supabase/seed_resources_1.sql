-- ============================================================
-- Seed: resources batch 1 (5 rows: essay_example x3, checklist x2)
-- ============================================================
INSERT INTO resources (slug, type, category, title, preview_text, author_name, content) VALUES

('common-app-essay-identity', 'essay_example', 'essays',
 'Finding My Voice: A First-Generation Student''s Story',
 'How growing up translating for my parents shaped my identity and my drive to study public policy.',
 'Maya R.',
 'Growing up as the eldest child of Vietnamese immigrants, I became fluent in two languages before I started kindergarten — Vietnamese at home and English everywhere else. But the language I struggled with the longest was the one that mattered most to my family: the language of American bureaucracy.

At age nine, I sat beside my mother at the DMV, translating a form that asked for her "legal permanent resident alien number." I did not know what alien meant in that context. I asked the clerk. She looked at me the way adults look at children when they are being inconvenient.

That moment did not break me. It shaped me.

By the time I was twelve, I had translated lease agreements, medical intake forms, utility disconnection notices, and one terrifying letter from the IRS. I learned that language is not just communication — it is access. And that access is not equally distributed.

When I discovered debate club in eighth grade, I found a place where my ability to absorb dense information quickly and reframe it persuasively was not just useful — it was celebrated. I went from a quiet student who sat in the back row to a state qualifier in Lincoln-Douglas debate by junior year. The topic that year was healthcare policy. I already knew more about its real-world stakes than most of my opponents.

I want to study public policy because I have lived the gap between what institutions say they offer and what people actually receive. My mother never received a proper explanation of her rights as a tenant. My father spent three years in the wrong tax bracket because no one helped him understand the forms. I want to be the person who closes those gaps — not just for my family, but at scale.

College, for me, is not an escape from where I came from. It is the next step toward being able to go back and fix it.'),

('mit-engineering-essay', 'essay_example', 'essays',
 'The Robot That Wouldn''t Turn Left',
 'A summer robotics project that failed spectacularly — and what it taught me about engineering and persistence.',
 'James K.',
 'The robot could turn right perfectly. Left turns, however, produced a result that could only be described as a slow, dignified spiral into the nearest wall.

I had spent six weeks building it. The chassis was hand-cut aluminum. The motor controllers were salvaged from broken RC cars. The code was mine, written and rewritten across forty-three commits in a GitHub repository that my teammates generously described as "ambitious."

The left turn problem traced back to a single integer overflow in my PID controller — a bug so small it took me four days to find and thirty seconds to fix. In those four days I learned more about embedded systems than in the previous year of reading textbooks. Frustration, it turns out, is an excellent teacher.

What I did not expect was how much I would learn about collaboration. When I finally posted the bug in our team''s Discord at 11pm on a Thursday, my teammate Priya responded in four minutes with a line of pseudocode that pointed me directly to the problem. She had seen the same overflow in a project the year before. I had been sitting on a solved problem without knowing it.

Engineering is not a solo pursuit. I grew up believing that the best engineers were lone geniuses — people who locked themselves in garages and emerged with inventions. Reality is messier and more interesting. The best solutions come from people who are willing to share what they know, ask what they don''t, and iterate relentlessly.

The robot eventually completed a full obstacle course, including left turns, at our regional competition. We placed third. I was more proud of that third place than I expected, not because of the trophy, but because of the forty-three commits and one critical assist that got us there.'),

('international-student-essay-nigeria', 'essay_example', 'essays',
 'What NEPA Taught Me About Resourcefulness',
 'Growing up with unpredictable power cuts in Lagos made me a better problem-solver and a stronger engineering applicant.',
 'Chidi O.',
 'In Lagos, we do not say the power went out. We say NEPA took the light. The National Electric Power Authority — long since renamed but never forgotten — was a constant presence in my childhood, more through its absence than its supply.

Load shedding was not an inconvenience. It was a design constraint. You planned around it. You charged devices during the hours power was available. You bought a generator if you could afford one, a small inverter if you could not. Our neighborhood ran on a complex, unwritten schedule that everyone understood intuitively.

I was twelve when I decided to map it. Not out of frustration, but out of genuine curiosity about the pattern. I recorded outage times for three months in a notebook, then transcribed them into a spreadsheet on my school''s one shared computer. The pattern was not random. It cycled. Knowing the cycle meant my mother could plan when to cook, when to run the sewing machine that supplemented our income, when to let me study without a candle.

My teacher saw the spreadsheet and asked me to present it at a parent-teacher evening. The room was quiet in a way that felt different from polite attention. People were taking photos of my slides on their phones.

That evening taught me two things. First, that data, even simple data, has power when it is organized and shared. Second, that the problems I grew up treating as normal — as simply the conditions of life — were problems worth solving.

I want to study electrical engineering and energy systems because I know exactly what reliable power means to a family that does not have it. I have felt the difference between a candle and a lamp. I intend to spend my career narrowing that gap.'),

('grade-9-10-checklist', 'checklist', 'academics',
 'Grade 9–10 College Prep Checklist',
 'Everything you should accomplish in your first two years of high school to build a strong college application foundation.',
 'Entora Team',
 'GRADE 9

Academics
- Take the most challenging courses available to you (honors, IB, or AP if offered)
- Aim for a GPA of 3.5 or higher from day one — it is much harder to recover later
- Meet your teachers and make sure they know your name
- Develop a consistent study routine (dedicated time, distraction-free space)

Testing
- Research the SAT and ACT formats — understand what each tests
- Take a free practice test for both (Khan Academy and ACT.org have free versions)
- Note which format felt more natural to you

Extracurriculars
- Join 2–3 clubs, sports, or activities that genuinely interest you
- Do not join things just for the résumé — admissions officers can tell
- Start tracking your hours and any roles or achievements

Planning
- Create a simple document listing colleges you are curious about
- Talk to your family about their general expectations for college (in-state vs. out, budget range)
- Schedule a meeting with your school counselor to introduce yourself

GRADE 10

Academics
- Continue or increase rigor in your course load
- If struggling in any subject, get help early — tutoring or office hours
- Begin thinking about which AP or IB exams you might take in grades 11–12

Testing
- Take the PSAT 10 (offered at most high schools in October)
- Review your PSAT score report carefully — it shows exactly where to improve
- Begin structured SAT/ACT prep (1–2 hours per week is enough at this stage)

Extracurriculars
- Deepen your commitment to 2–3 core activities
- Seek leadership opportunities: captain, president, editor, section leader
- Consider a summer program, internship, or community project related to your interests

Planning
- Expand your college list to 10–15 schools across reach, target, and likely categories
- Research financial aid options: FAFSA, scholarships, and merit aid
- Attend at least one college fair or virtual information session'),

('grade-11-12-checklist', 'checklist', 'applications',
 'Grade 11–12 Application Checklist',
 'A step-by-step guide to navigating the most important two years of your college application journey.',
 'Entora Team',
 'GRADE 11

Fall Semester
- Take the PSAT/NMSQT in October (qualifies for National Merit Scholarship)
- Attend college fairs and take notes on each school you visit
- Start a list of 3–5 teachers you might ask for recommendation letters

Spring Semester
- Take your first official SAT or ACT (March or May sitting)
- Request recommendation letters from teachers by April — give them the full summer
- Narrow your college list to 10–15 schools
- Draft a résumé or activities list documenting all extracurriculars with hours and impact

Summer Before Grade 12
- Research and outline your Common App essay topic
- Write a full draft of your personal statement
- Visit campuses (in person or virtually) for your top 5–8 schools
- Research CSS Profile requirements for private colleges on your list

GRADE 12

August–September
- Finalize your Common App personal statement
- Complete all supplemental essay outlines
- Confirm recommendation letter writers and provide them your résumé and essay drafts

October–November
- FAFSA opens October 1 — submit as early as possible
- Submit Early Decision or Early Action applications by November 1 or 15
- Complete CSS Profile for private colleges that require it

December–January
- Submit all Regular Decision applications (most deadlines: January 1–15)
- Follow up with recommenders and transcript offices to confirm submissions
- Check application portals for missing materials

February–April
- Receive admission decisions (rolling or April 1 for most RD schools)
- Compare financial aid award letters — look at net cost, not sticker price
- Visit admitted students days if possible

May 1 — National Decision Day
- Submit enrollment deposit to your chosen school
- Send polite declination letters to all other schools
- Notify your recommenders and counselor — they deserve to celebrate with you')

ON CONFLICT (slug) DO NOTHING;
