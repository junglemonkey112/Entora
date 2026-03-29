-- ============================================================
-- Entora Community Seed — Mock posts & comments
-- Students from China, Korea, and Japan
-- ============================================================
-- NOTE: profiles.id is a FK to auth.users(id).
-- Run with session_replication_role = replica to bypass FK
-- so these display-only mock profiles can be inserted directly.
-- In production, these users would be real Supabase Auth accounts.
-- ============================================================

BEGIN;
SET session_replication_role = replica;

-- ─── Mock profiles ──────────────────────────────────────────────────────────

INSERT INTO profiles (id, full_name, email, role, country, grade, target_major) VALUES
  -- Chinese students
  ('a1000000-0000-0000-0000-000000000001', '李明远', 'liming@example.com',   'student', 'China',  11, 'Computer Science'),
  ('a1000000-0000-0000-0000-000000000002', '陈雪', 'chenxue@example.com',    'student', 'China',  12, 'Economics'),
  -- Korean student
  ('a1000000-0000-0000-0000-000000000003', '김지원', 'jiwon@example.com',    'student', 'Korea',  11, 'Business'),
  -- Japanese student
  ('a1000000-0000-0000-0000-000000000004', '田中はな', 'hana@example.com',    'student', 'Japan',  12, 'Engineering'),
  -- Student Counselor (guide) — now at UCL
  ('a1000000-0000-0000-0000-000000000005', '王思远', 'siyuan@example.com',   'guide',   'China',  NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Update guide profile with counselor-specific fields (requires migration_counselor_applications.sql first)
UPDATE profiles SET
  university  = 'University College London',
  grad_year   = 2027,
  applied_to  = ARRAY['UCL', 'University of Edinburgh', 'King''s College London', 'Durham University'],
  expertise   = ARRAY['essays', 'uk-applications', 'international', 'financial-aid']
WHERE id = 'a1000000-0000-0000-0000-000000000005';

-- ─── Helper: look up category IDs ───────────────────────────────────────────

DO $$
DECLARE
  cat_general     uuid;
  cat_essays      uuid;
  cat_fin_aid     uuid;
  cat_intl        uuid;
  cat_test_prep   uuid;

  post1 uuid; post2 uuid; post3 uuid; post4 uuid; post5 uuid; post6 uuid; post7 uuid;
BEGIN
  SELECT id INTO cat_general   FROM forum_categories WHERE slug = 'general';
  SELECT id INTO cat_essays    FROM forum_categories WHERE slug = 'essays';
  SELECT id INTO cat_fin_aid   FROM forum_categories WHERE slug = 'financial-aid';
  SELECT id INTO cat_intl      FROM forum_categories WHERE slug = 'international';
  SELECT id INTO cat_test_prep FROM forum_categories WHERE slug = 'test-prep';

  -- ─── Posts ─────────────────────────────────────────────────────────────────

  -- Post 1 (Chinese, international) — TOEFL vs IELTS
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    cat_intl,
    '托福还是雅思？美国大学更看重哪个？',
    '大家好，我是高二学生，目前正在备考语言成绩。想请问一下，申请美国大学的话，是考托福还是雅思更好？我看网上说法不一，有人说顶校更接受托福，也有人说雅思认可度越来越高了。有没有已经经历过这个过程的学长学姐分享一下经验？谢谢！',
    7, 4,
    now() - interval '12 days'
  ) RETURNING id INTO post1;

  -- Post 2 (Chinese, test-prep) — SAT Math tips
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    cat_test_prep,
    'SAT数学备考心得分享，国内理科生如何拿满分',
    '大家好！我是高三，上个月刚考完SAT，数学部分拿到了800分。在这里分享一下我的备考经验：

1. 刷题很重要，但要注重错题分析，理解出题思路
2. 官方的College Board练习题是最接近真实考试的，建议优先刷完
3. 对于中国学生来说，代数和数据分析比较简单，重点攻克"Problem Solving"和"Advanced Math"
4. 考试时间管理很关键，建议用计时器模拟真实考试环境

希望对大家有帮助！有问题欢迎在评论区讨论。',
    15, 3,
    now() - interval '8 days'
  ) RETURNING id INTO post2;

  -- Post 3 (Korean, general) — Common App experience from Seoul
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    cat_general,
    '서울에서 미국 대학 Common App 지원한 경험 공유합니다',
    '안녕하세요! 저는 서울 국제고 11학년 학생이에요. 올해 얼리 액션으로 미국 대학 3곳에 지원했는데, 준비 과정에서 느낀 점들을 나눠보고 싶어요.

가장 어려웠던 부분은 역시 Common App 에세이였어요. "your story"를 영어로 표현하는 게 처음엔 정말 막막했는데, 한국어로 먼저 초안을 쓰고 번역하는 방식이 저한테는 효과적이었어요.

추천서도 미리미리 부탁드리세요. 저는 9월에야 선생님께 부탁했는데 정말 촉박했어요.

여기 같은 상황의 분들 계신가요? 서로 정보 공유해요!',
    12, 5,
    now() - interval '6 days'
  ) RETURNING id INTO post3;

  -- Post 4 (Korean, essays) — Recommendation letters
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000003',
    cat_essays,
    '추천서, 어떤 선생님께 부탁해야 할까요?',
    '미국 대학들은 보통 교사 추천서 2개가 필요한데요, 어떤 선생님께 부탁드리는 게 좋을까요?

저는 지금 수학 선생님이랑 영어 선생님을 생각하고 있는데, 성적이 좋은 과목 선생님이 좋은지, 아니면 저를 잘 아시는 선생님이 좋은지 고민이에요.

그리고 한국 선생님들이 영어로 추천서를 직접 쓰시기 어려우신 경우도 있을 것 같은데, 그럴 때는 어떻게 하셨나요?',
    9, 4,
    now() - interval '4 days'
  ) RETURNING id INTO post4;

  -- Post 5 (Japanese, international) — UCAS from Japan
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000004',
    cat_intl,
    '日本の高校生がUCASで英国大学に出願する手順をまとめました',
    'こんにちは！私は東京の高校3年生で、今年UCASを通じてイギリスの大学に出願しました。同じように悩んでいる方のために、流れをまとめました。

①UCASアカウント作成（出願年の9月頃から）
②志望校を最大5校選ぶ（Oxbridgeは2校には出せない）
③パーソナルステートメントを書く（4000文字以内、英語）
④レファレンス（担任か進路指導の先生に依頼）
⑤出願→インタビューがある場合は準備

一番大変だったのはパーソナルステートメントです。なぜその専攻を選んだのか、具体的な経験と結びつけて書くのがポイントです。

質問があればお気軽にどうぞ！',
    18, 5,
    now() - interval '5 days'
  ) RETURNING id INTO post5;

  -- Post 6 (Chinese, essays) — Cultural background in essays
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000006',
    'a1000000-0000-0000-0000-000000000001',
    cat_essays,
    '申请文书如何展示文化背景？会不会有刻板印象的问题',
    '我在写Common App文书的时候一直纠结一个问题：作为中国学生，要不要在文书里提到自己的文化背景？

一方面，我觉得这是我独特的经历，可以让招生官更了解我；另一方面，我担心会有"中国学生都这么写"的刻板印象，反而让文书变得平庸。

有没有成功用文化背景写出好文书的同学，可以分享一下思路？或者有没有招生顾问有过这方面的建议？',
    11, 6,
    now() - interval '3 days'
  ) RETURNING id INTO post6;

  -- Post 7 (Japanese, financial-aid) — Bank statement / proof of funds
  INSERT INTO forum_posts (id, author_id, category_id, title, content, likes_count, comments_count, created_at)
  VALUES (
    'b1000000-0000-0000-0000-000000000007',
    'a1000000-0000-0000-0000-000000000004',
    cat_fin_aid,
    '留学の財務証明、いくら必要？準備のタイミングは？',
    '合格後のビザ申請に必要な財務証明（Proof of Funds）について教えてください。

アメリカのF-1ビザ、イギリスのStudent Visaそれぞれで必要な金額や書類が違うと聞いたのですが、実際にどう準備されましたか？

特に気になっているのは以下の点です：
・残高証明書は何ヶ月分必要？
・円建ての証明書でも大丈夫？
・親の収入証明書も必要？

経験者の方、ぜひ教えてください！',
    8, 3,
    now() - interval '2 days'
  ) RETURNING id INTO post7;

  -- ─── Comments ──────────────────────────────────────────────────────────────

  -- Post 1 comments: TOEFL vs IELTS
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post1, 'a1000000-0000-0000-0000-000000000005',
   '好问题！我当初申请UCL时两个成绩都准备了。总结一下：美国大学两个都接受，但托福历史更悠久，很多学校官网只列托福分数要求，雅思要单独查。英国大学普遍更喜欢雅思。如果只能准备一个，申美国选托福更稳，申英国/澳洲选雅思。',
   now() - interval '11 days'),
  (post1, 'a1000000-0000-0000-0000-000000000003',
   '저도 같은 고민을 했어요! 저는 결국 토플을 선택했는데, 미국 대학 위주로 지원했기 때문이에요. 시험 방식은 토플이 컴퓨터 기반이라 타이핑에 익숙한 분들께 더 편할 수 있어요.',
   now() - interval '10 days'),
  (post1, 'a1000000-0000-0000-0000-000000000004',
   '私もこの悩みがありました！私はIELTSを選びました。理由はUCASでイギリスの大学も受けたかったから。どちらか迷っている人は志望校リストを先に決めてから選ぶといいと思います。',
   now() - interval '10 days'),
  (post1, 'a1000000-0000-0000-0000-000000000001',
   '学长谢谢！我想申请的主要是美国，所以应该选托福对吧。还有一个问题，托福多少分算安全线？',
   now() - interval '9 days');

  -- Post 2 comments: SAT Math
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post2, 'a1000000-0000-0000-0000-000000000003',
   'SAT 수학 800점 축하드려요! 저는 지금 SAT 준비 중인데 수학에서 760점대에서 막혀있어요. 혹시 어떤 문제집 추천하시나요?',
   now() - interval '7 days'),
  (post2, 'a1000000-0000-0000-0000-000000000002',
   '谢谢大家的鼓励！@김지원 我推荐Khan Academy的官方练习，完全免费而且和College Board直接合作，题目质量最高。另外Barron's 的SAT书也不错，讲解很详细。',
   now() - interval '7 days'),
  (post2, 'a1000000-0000-0000-0000-000000000004',
   '数学800点はすごい！私は今750点ぐらいです…。時間内に全部解けないことが多いのですが、何かコツはありますか？',
   now() - interval '6 days');

  -- Post 3 comments: Common App from Seoul (mixed CN/KR/JP thread)
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post3, 'a1000000-0000-0000-0000-000000000001',
   '我也在准备Common App！关于文书，你说先用中文写再翻译的方法很有参考价值。请问你翻译完之后有找母语是英语的人帮你润色吗？还是直接提交的？',
   now() - interval '5 days'),
  (post3, 'a1000000-0000-0000-0000-000000000003',
   '@李明远 네, 저는 학교 영어 선생님께 피드백을 받았어요. 번역 후에 원어민에게 검토를 받는 게 정말 중요한 것 같아요. Grammarly도 문법 체크에 도움이 됐어요.',
   now() - interval '5 days'),
  (post3, 'a1000000-0000-0000-0000-000000000004',
   '私もCommon Appで出願しようと思っています！日本からだとサポートしてくれる先生が少なくて孤独な戦いになりがちですよね。みんなで情報共有できるのがありがたいです。',
   now() - interval '4 days'),
  (post3, 'a1000000-0000-0000-0000-000000000005',
   'Great thread! As someone who''s been through this: getting a native English speaker to review your essay is really valuable — not just for grammar but for making sure the "voice" feels natural. Many schools also have writing centers you can use once admitted. Keep going, you''re all doing great!',
   now() - interval '4 days'),
  (post3, 'a1000000-0000-0000-0000-000000000001',
   '谢谢学长的鼓励！请问学长当时用的是学校写作中心还是私人顾问？',
   now() - interval '3 days');

  -- Post 4 comments: Recommendation letters
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post4, 'a1000000-0000-0000-0000-000000000005',
   '추천서에 대해 좋은 질문이에요! 제 경험상: 성적보다는 당신을 구체적인 에피소드로 설명할 수 있는 선생님이 훨씬 더 좋아요. 미국 대학들은 "이 학생이 어떤 사람인지"를 알고 싶어하거든요. 한국 선생님이 영어 추천서를 쓰기 어려우시면 학교 카운슬러를 통해 번역을 지원받을 수 있는지 알아보세요.',
   now() - interval '3 days'),
  (post4, 'a1000000-0000-0000-0000-000000000002',
   '我们学校老师也遇到这个问题！我的做法是：先和老师聊，问他们是否愿意写英文版，如果老师更擅长中文，可以写中文版然后附上英文翻译，让老师确认无误后提交。Common App平台支持附加翻译文件。',
   now() - interval '3 days'),
  (post4, 'a1000000-0000-0000-0000-000000000004',
   '日本でも同じ問題あります！私の先生は「英語で書くのは難しい」とおっしゃっていたので、私が大まかな下書きを渡して先生に確認・修正していただく形にしました。もちろん内容は先生の言葉で書いてもらいましたが。',
   now() - interval '2 days'),
  (post4, 'a1000000-0000-0000-0000-000000000003',
   '모두 감사해요! 저도 일단 두 선생님과 대화를 먼저 해봐야겠네요. 저를 잘 아시는 분이 역시 중요한 것 같아요.',
   now() - interval '2 days');

  -- Post 5 comments: UCAS from Japan
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post5, 'a1000000-0000-0000-0000-000000000005',
   'Very helpful summary! One more tip for UCAS personal statements: UK universities are very subject-focused. They want to see your passion and academic preparation for that specific subject — unlike US essays which are more about you as a person. Read around your subject: journals, books, news. Mention them specifically!',
   now() - interval '4 days'),
  (post5, 'a1000000-0000-0000-0000-000000000001',
   '非常有用！请问英国大学和美国大学在申请要求上有什么主要区别？我在考虑两边都申，但不知道时间精力上能不能兼顾。',
   now() - interval '4 days'),
  (post5, 'a1000000-0000-0000-0000-000000000003',
   '영국 대학도 관심이 있었는데 UCAS는 처음 들어봤어요. UCASPersonal Statement와 미국 Common App 에세이를 동시에 준비하는 게 가능할까요? 초점이 많이 다른 것 같아서요.',
   now() - interval '3 days'),
  (post5, 'a1000000-0000-0000-0000-000000000004',
   '@李明远 両方やるのは可能ですが、かなり大変です！私はUCAS優先で進めて、余力でCommon Appの準備をしています。両方やるなら夏休みから始めるのをおすすめします。',
   now() - interval '3 days'),
  (post5, 'a1000000-0000-0000-0000-000000000004',
   '@김지원 UCASのパーソナルステートメントとCommon Appのエッセイは確かに方向性が全然違います。UCASは「なぜこの専攻？」が中心、Common Appは「あなたはどんな人？」が中心です。同時進行するなら、共通して使えるエピソードを軸にして、それぞれの視点で書き直すのがコツです。',
   now() - interval '2 days');

  -- Post 6 comments: Cultural background in essays
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post6, 'a1000000-0000-0000-0000-000000000005',
   '这是个非常好的问题，也是很多国际学生都会纠结的地方。我的建议是：写文化背景本身不是问题，关键是"你从中得到了什么独特的视角或行动"。不要只是描述文化，要展示它如何塑造了你的思维方式或影响了你的选择。避免过于笼统的表达，比如"我从小学古筝，让我懂得了坚持"——这样的写法太通用。要具体、要独特。',
   now() - interval '2 days'),
  (post6, 'a1000000-0000-0000-0000-000000000003',
   '저도 비슷한 고민을 했어요. 한국 학생들도 "K-pop", "유교 가치관" 같은 주제는 좀 진부하다는 말을 많이 들어서요. 결국 저는 문화적 배경보다 구체적인 활동(Model UN, 봉사 활동)에서 출발해서 제 정체성을 간접적으로 보여주는 방식을 택했어요.',
   now() - interval '2 days'),
  (post6, 'a1000000-0000-0000-0000-000000000004',
   '日本人として感じることは、「日本の文化は特殊」という先入観を持ちすぎないことが大事かなと思います。審査官は世界中の学生を見ているので、文化の「違い」より、あなた個人の「経験と成長」に焦点を当てた方が伝わりやすいと思います。',
   now() - interval '1 day'),
  (post6, 'a1000000-0000-0000-0000-000000000001',
   '大家的回复真的太有帮助了！学长说的"具体、独特"让我豁然开朗。我觉得我可以写我自己在学习编程时遇到的文化冲突——国内教育强调死记硬背，但编程需要创造性思维，我是怎么在两者之间找到平衡的。这样是不是更具体？',
   now() - interval '1 day'),
  (post6, 'a1000000-0000-0000-0000-000000000005',
   '这个角度非常好！教育体系的张力 + 你的应对方式 = 展示了思辨能力和适应性，正是顶校招生官想看到的。去写吧！',
   now() - interval '20 hours'),
  (post6, 'a1000000-0000-0000-0000-000000000002',
   '太羡慕了，我还在苦苦思考写什么主题……',
   now() - interval '12 hours');

  -- Post 7 comments: Proof of funds
  INSERT INTO forum_comments (post_id, author_id, content, created_at) VALUES
  (post7, 'a1000000-0000-0000-0000-000000000005',
   'Great question about finances! Quick overview: For US F-1, you need to show you can cover the first year''s full cost of attendance (check your university''s I-20). For UK Student Visa, you need 9 months of living costs (approx £1,334/month outside London) plus tuition, held for 28 consecutive days before applying. Both accept foreign currency accounts — just attach a certified translation if needed. Your parents'' accounts are fine!',
   now() - interval '1 day'),
  (post7, 'a1000000-0000-0000-0000-000000000002',
   '我当时申请英国学生签证时，是用父母的银行账户，需要提供：1) 最近28天的银行流水（不只是余额截图） 2) 如果是父母账户，还需要提供关系证明（出生证明英文版）。大使馆网站上有详细要求，建议直接看官方的。',
   now() - interval '22 hours'),
  (post7, 'a1000000-0000-0000-0000-000000000004',
   'みなさんありがとうございます！28日間の残高維持というのは知りませんでした。申請のギリギリで準備するのは危ないですね。早めに準備します！',
   now() - interval '10 hours');

END $$;

SET session_replication_role = DEFAULT;
COMMIT;
