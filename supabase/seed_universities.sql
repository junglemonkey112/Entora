-- ============================================================
-- Seed: universities (24 rows)
-- ============================================================
INSERT INTO universities (name, slug, country, city, state, acceptance_rate, avg_cost, ranking, programs, description, website) VALUES

-- United States (10)
('Massachusetts Institute of Technology', 'mit', 'US', 'Cambridge', 'MA',
 4.0, 57590, 1,
 ARRAY['Computer Science','Engineering','Physics','Mathematics','Economics'],
 'MIT is a world-leading research university renowned for science, technology, and entrepreneurship. Located in Cambridge, Massachusetts, it fosters an intense culture of innovation and hands-on problem solving.',
 'https://web.mit.edu'),

('Stanford University', 'stanford', 'US', 'Stanford', 'CA',
 3.7, 56169, 2,
 ARRAY['Computer Science','Business','Engineering','Medicine','Humanities'],
 'Stanford sits at the heart of Silicon Valley and is known for its entrepreneurial spirit, cutting-edge research, and interdisciplinary programs. It consistently ranks among the top universities globally.',
 'https://www.stanford.edu'),

('Harvard University', 'harvard', 'US', 'Cambridge', 'MA',
 3.4, 57261, 3,
 ARRAY['Law','Medicine','Business','Government','Economics','Arts & Sciences'],
 'Harvard is the oldest university in the United States and one of the most prestigious in the world. Its alumni network spans every sector of global leadership.',
 'https://www.harvard.edu'),

('Princeton University', 'princeton', 'US', 'Princeton', 'NJ',
 4.4, 57410, 4,
 ARRAY['Engineering','Public Policy','Mathematics','Humanities','Sciences'],
 'Princeton is a private Ivy League university known for its undergraduate focus, generous financial aid, and beautiful campus. It offers a unique "no-loan" financial aid policy.',
 'https://www.princeton.edu'),

('Yale University', 'yale', 'US', 'New Haven', 'CT',
 4.6, 59950, 5,
 ARRAY['Law','Drama','Medicine','Economics','History','Political Science'],
 'Yale is an Ivy League research university celebrated for its arts programs, residential college system, and commitment to public service.',
 'https://www.yale.edu'),

('Columbia University', 'columbia', 'US', 'New York City', 'NY',
 3.9, 65524, 6,
 ARRAY['Journalism','Business','Engineering','Law','Medicine','Social Sciences'],
 'Columbia is located in the heart of Manhattan, offering unmatched access to New York City''s professional, cultural, and intellectual communities.',
 'https://www.columbia.edu'),

('University of Chicago', 'uchicago', 'US', 'Chicago', 'IL',
 5.4, 62241, 7,
 ARRAY['Economics','Philosophy','Mathematics','Statistics','Law','Sociology'],
 'UChicago is known for intellectual rigor and its distinctive Core Curriculum. It has produced more Nobel laureates in economics than any other institution.',
 'https://www.uchicago.edu'),

('California Institute of Technology', 'caltech', 'US', 'Pasadena', 'CA',
 3.9, 60816, 8,
 ARRAY['Physics','Chemistry','Engineering','Biology','Computer Science'],
 'Caltech is a small, highly selective research university with an outsized impact on science and technology. Its close faculty-student ratio enables deep research collaboration.',
 'https://www.caltech.edu'),

('Duke University', 'duke', 'US', 'Durham', 'NC',
 6.0, 60488, 9,
 ARRAY['Medicine','Law','Engineering','Public Policy','Business','Biology'],
 'Duke combines a top-ranked research university with a strong athletic tradition and a vibrant campus in North Carolina''s Research Triangle.',
 'https://www.duke.edu'),

('University of California, Los Angeles', 'ucla', 'US', 'Los Angeles', 'CA',
 8.6, 36001, 10,
 ARRAY['Film','Engineering','Business','Pre-Med','Political Science','Psychology'],
 'UCLA is one of the most applied-to universities in the world, offering exceptional programs alongside the cultural richness of Los Angeles.',
 'https://www.ucla.edu'),

-- United Kingdom (6)
('University of Oxford', 'oxford', 'UK', 'Oxford', NULL,
 14.3, 27000, 1,
 ARRAY['Philosophy','Politics & Economics','Law','Medicine','Engineering','Humanities'],
 'Oxford is the oldest English-speaking university in the world. Its tutorial system provides an unparalleled depth of one-on-one academic engagement.',
 'https://www.ox.ac.uk'),

('University of Cambridge', 'cambridge', 'UK', 'Cambridge', NULL,
 15.0, 26000, 2,
 ARRAY['Natural Sciences','Mathematics','Engineering','Law','Economics','Medicine'],
 'Cambridge is one of the world''s foremost research institutions, with 31 Nobel Prizes among its alumni since 2000. The collegiate system offers a rich community experience.',
 'https://www.cam.ac.uk'),

('Imperial College London', 'imperial', 'UK', 'London', NULL,
 14.5, 29000, 3,
 ARRAY['Engineering','Medicine','Natural Sciences','Business','Computing'],
 'Imperial specialises in science, technology, medicine, and business. Located in South Kensington, London, it has direct links to global industry and research.',
 'https://www.imperial.ac.uk'),

('University College London', 'ucl', 'UK', 'London', NULL,
 16.0, 28000, 4,
 ARRAY['Architecture','Laws','Economics','Arts','Engineering','Medical Sciences'],
 'UCL is London''s leading multidisciplinary university, known for its diverse student body and commitment to social impact research.',
 'https://www.ucl.ac.uk'),

('London School of Economics', 'lse', 'UK', 'London', NULL,
 9.7, 27500, 5,
 ARRAY['Economics','Political Science','Law','Sociology','International Relations','Finance'],
 'LSE is the world''s leading social science institution. Its global network and London location make it the top choice for careers in finance, policy, and international affairs.',
 'https://www.lse.ac.uk'),

('University of Edinburgh', 'edinburgh', 'UK', 'Edinburgh', NULL,
 40.0, 22000, 6,
 ARRAY['Medicine','Law','Engineering','Arts','Science','Business'],
 'One of the world''s top research universities, Edinburgh offers a rich intellectual tradition in a city ranked among the most livable in the world.',
 'https://www.ed.ac.uk'),

-- Canada (4)
('University of Toronto', 'utoronto', 'CA', 'Toronto', 'ON',
 43.0, 35000, 1,
 ARRAY['Computer Science','Engineering','Medicine','Business','Arts & Science','Law'],
 'The University of Toronto is Canada''s top-ranked university and a global research leader. Its location in downtown Toronto provides exceptional co-op and career opportunities.',
 'https://www.utoronto.ca'),

('University of British Columbia', 'ubc', 'CA', 'Vancouver', 'BC',
 52.0, 30000, 2,
 ARRAY['Engineering','Forestry','Medicine','Arts','Science','Business'],
 'UBC combines world-class research with a stunning Pacific Rim setting in Vancouver. It is consistently ranked among the top 40 universities in the world.',
 'https://www.ubc.ca'),

('McGill University', 'mcgill', 'CA', 'Montreal', 'QC',
 46.0, 28000, 3,
 ARRAY['Medicine','Law','Engineering','Music','Arts','Management'],
 'McGill is Canada''s most internationally recognized university. Based in Montreal, a vibrant bilingual city, McGill attracts students from over 150 countries.',
 'https://www.mcgill.ca'),

('University of Waterloo', 'waterloo', 'CA', 'Waterloo', 'ON',
 53.0, 26000, 4,
 ARRAY['Computer Science','Engineering','Mathematics','Accounting','Sciences'],
 'Waterloo is globally renowned for its co-op program and produces more software engineering graduates than any other Canadian university. A top destination for tech careers.',
 'https://uwaterloo.ca'),

-- Australia (4)
('University of Melbourne', 'umelbourne', 'AU', 'Melbourne', 'VIC',
 70.0, 38000, 1,
 ARRAY['Medicine','Law','Engineering','Arts','Science','Commerce'],
 'Australia''s leading university, Melbourne offers a broad-based undergraduate model followed by professional graduate degrees. Its vibrant campus sits in one of the world''s most livable cities.',
 'https://www.unimelb.edu.au'),

('Australian National University', 'anu', 'AU', 'Canberra', 'ACT',
 35.0, 35000, 2,
 ARRAY['Politics','International Relations','Science','Law','Economics','Arts'],
 'ANU is Australia''s national research university, located in the capital Canberra. It is Australia''s top-ranked university and excels in political science and public policy.',
 'https://www.anu.edu.au'),

('University of Sydney', 'usyd', 'AU', 'Sydney', 'NSW',
 30.0, 40000, 3,
 ARRAY['Medicine','Law','Engineering','Architecture','Arts','Business'],
 'Australia''s first university, Sydney combines a rich heritage with modern research excellence. Its sandstone campus is one of the most beautiful in the Southern Hemisphere.',
 'https://www.sydney.edu.au'),

('University of New South Wales', 'unsw', 'AU', 'Sydney', 'NSW',
 34.0, 39000, 4,
 ARRAY['Engineering','Business','Law','Medicine','Arts','Computer Science'],
 'UNSW is one of Australia''s leading research and teaching universities, located in the beachside suburb of Kensington, Sydney. Strong industry partnerships fuel its graduate employment rates.',
 'https://www.unsw.edu.au')

ON CONFLICT (slug) DO NOTHING;
