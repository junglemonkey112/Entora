export type Locale = "en" | "zh" | "es" | "ko" | "ja";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  ko: "한국어",
  ja: "日本語",
};

export const translations = {
  en: {
    nav: {
      community: "Community",
      roadmap: "Roadmap",
      schools: "Schools",
      resources: "Resources",
      forParents: "For Parents",
      signIn: "Sign in",
      getStarted: "Get started",
      signOut: "Sign out",
    },
    landing: {
      badge: "US · UK · Canada · Australia",
      heroHeadline: "Your complete college admissions",
      heroHighlight: "companion",
      heroSub:
        "Free community, grade-by-grade roadmap, school explorer, and expert sessions. Everything you need — from first research to acceptance letter.",
      cta1: "Get started free",
      cta2: "Browse community",
      statsUniversities: "Universities indexed",
      statsCountries: "Countries supported",
      statsFree: "Free core features",
      statsGrades: "Grades covered",
      layersTitle: "Three layers, one platform",
      layersSub:
        "Every layer feeds the next — free users become paid users, paid users generate data that powers partnerships, and partnerships drive more free users.",
      freeTitle: "Everything you need to get started",
      freeSub:
        "No paywall. No trial. The free layer is genuinely useful on its own — not a teaser.",
      stakeholdersTitle: "Built for everyone in the journey",
      testimonialsTitle: "What students say",
      finalTitle: "Start your college journey today",
      finalSub:
        "Join thousands of students using Entora's free tools to navigate college admissions with confidence.",
    },
    signup: {
      title: "Create your account",
      subtitle: "Join thousands of students on their college journey",
      iAm: "I am a...",
      changeRole: "← Change role",
      fullName: "Full name",
      fullNamePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "At least 6 characters",
      creating: "Creating account...",
      create: "Create account",
      haveAccount: "Already have an account?",
      signInLink: "Sign in",
      successTitle: "Check your email",
      successSub:
        "We sent a confirmation link to {email}. Click the link to activate your account.",
      backToSignIn: "Back to sign in",
      roles: {
        student: { label: "Student", desc: "I'm applying to college" },
        parent: { label: "Parent", desc: "My child is applying" },
        counselor: {
          label: "School Counselor",
          desc: "I'm a school guidance counselor",
        },
        specialist: {
          label: "Industry Specialist",
          desc: "I'm a mentor or industry expert",
        },
        school_rep: {
          label: "School Representative",
          desc: "I represent a university or institution",
        },
      },
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
    },
  },

  zh: {
    nav: {
      community: "社区",
      roadmap: "学习路线",
      schools: "大学探索",
      resources: "学习资源",
      forParents: "家长专区",
      signIn: "登录",
      getStarted: "立即开始",
      signOut: "退出登录",
    },
    landing: {
      badge: "美国 · 英国 · 加拿大 · 澳大利亚",
      heroHeadline: "您的全方位大学申请",
      heroHighlight: "助手",
      heroSub:
        "免费社区、年级路线图、大学探索器及专家课程。从初步调研到录取通知，所需一切尽在其中。",
      cta1: "免费开始",
      cta2: "浏览社区",
      statsUniversities: "已收录大学",
      statsCountries: "支持国家",
      statsFree: "核心功能免费",
      statsGrades: "覆盖年级",
      layersTitle: "三层平台，一站解决",
      layersSub:
        "每一层驱动下一层——免费用户成为付费用户，付费用户产生数据赋能合作，合作吸引更多免费用户。",
      freeTitle: "开启大学之旅所需一切",
      freeSub: "无需付费，无需试用。免费层本身就真正有用——不是诱饵。",
      stakeholdersTitle: "为旅程中每一位而建",
      testimonialsTitle: "学生怎么说",
      finalTitle: "今天开始您的大学旅程",
      finalSub:
        "加入数以千计的学生，使用 Entora 的免费工具，自信地驾驭大学申请流程。",
    },
    signup: {
      title: "创建您的账户",
      subtitle: "加入数以千计的学生踏上大学之旅",
      iAm: "我是...",
      changeRole: "← 更改角色",
      fullName: "姓名",
      fullNamePlaceholder: "您的姓名",
      email: "邮箱",
      emailPlaceholder: "you@example.com",
      password: "密码",
      passwordPlaceholder: "至少6个字符",
      creating: "创建中...",
      create: "创建账户",
      haveAccount: "已有账户？",
      signInLink: "登录",
      successTitle: "请查看您的邮箱",
      successSub: "我们已向 {email} 发送确认链接，点击链接激活您的账户。",
      backToSignIn: "返回登录",
      roles: {
        student: { label: "学生", desc: "我正在申请大学" },
        parent: { label: "家长", desc: "我的孩子正在申请大学" },
        counselor: { label: "学校辅导员", desc: "我是学校升学辅导员" },
        specialist: { label: "行业专家", desc: "我是导师或行业专家" },
        school_rep: { label: "学校招生代表", desc: "我代表一所大学或机构" },
      },
    },
    common: {
      loading: "加载中...",
      error: "出现错误",
    },
  },

  es: {
    nav: {
      community: "Comunidad",
      roadmap: "Hoja de Ruta",
      schools: "Universidades",
      resources: "Recursos",
      forParents: "Para Padres",
      signIn: "Iniciar sesión",
      getStarted: "Comenzar",
      signOut: "Cerrar sesión",
    },
    landing: {
      badge: "EE.UU. · Reino Unido · Canadá · Australia",
      heroHeadline: "Tu guía completa de admisiones",
      heroHighlight: "universitarias",
      heroSub:
        "Comunidad gratuita, hoja de ruta por grado, explorador de universidades y sesiones con expertos. Todo lo que necesitas, desde la investigación inicial hasta la carta de aceptación.",
      cta1: "Comenzar gratis",
      cta2: "Explorar comunidad",
      statsUniversities: "Universidades indexadas",
      statsCountries: "Países soportados",
      statsFree: "Funciones gratuitas",
      statsGrades: "Cursos cubiertos",
      layersTitle: "Tres niveles, una plataforma",
      layersSub:
        "Cada nivel alimenta al siguiente — los usuarios gratuitos se vuelven de pago, los de pago generan datos que potencian alianzas, y las alianzas atraen más usuarios gratuitos.",
      freeTitle: "Todo lo que necesitas para empezar",
      freeSub:
        "Sin barreras de pago. Sin prueba. El nivel gratuito es genuinamente útil por sí solo — no es un anzuelo.",
      stakeholdersTitle: "Construido para todos en el camino",
      testimonialsTitle: "Lo que dicen los estudiantes",
      finalTitle: "Comienza tu camino universitario hoy",
      finalSub:
        "Únete a miles de estudiantes que usan las herramientas gratuitas de Entora para navegar las admisiones universitarias con confianza.",
    },
    signup: {
      title: "Crea tu cuenta",
      subtitle: "Únete a miles de estudiantes en su camino universitario",
      iAm: "Soy...",
      changeRole: "← Cambiar rol",
      fullName: "Nombre completo",
      fullNamePlaceholder: "Tu nombre completo",
      email: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      password: "Contraseña",
      passwordPlaceholder: "Al menos 6 caracteres",
      creating: "Creando cuenta...",
      create: "Crear cuenta",
      haveAccount: "¿Ya tienes una cuenta?",
      signInLink: "Iniciar sesión",
      successTitle: "Revisa tu correo",
      successSub:
        "Enviamos un enlace de confirmación a {email}. Haz clic en el enlace para activar tu cuenta.",
      backToSignIn: "Volver a iniciar sesión",
      roles: {
        student: { label: "Estudiante", desc: "Estoy solicitando ingreso a la universidad" },
        parent: { label: "Padre/Madre", desc: "Mi hijo/a está solicitando admisión" },
        counselor: {
          label: "Consejero Escolar",
          desc: "Soy consejero/a de orientación escolar",
        },
        specialist: {
          label: "Especialista",
          desc: "Soy mentor/a o experto/a en la industria",
        },
        school_rep: {
          label: "Representante Universitario",
          desc: "Represento una universidad o institución",
        },
      },
    },
    common: {
      loading: "Cargando...",
      error: "Algo salió mal",
    },
  },

  ko: {
    nav: {
      community: "커뮤니티",
      roadmap: "로드맵",
      schools: "학교",
      resources: "자료",
      forParents: "학부모",
      signIn: "로그인",
      getStarted: "시작하기",
      signOut: "로그아웃",
    },
    landing: {
      badge: "미국 · 영국 · 캐나다 · 호주",
      heroHeadline: "대학 입시를 위한 완벽한",
      heroHighlight: "가이드",
      heroSub:
        "무료 커뮤니티, 학년별 로드맵, 학교 탐색기, 전문가 세션. 첫 번째 조사부터 합격 통지서까지 필요한 모든 것이 여기 있습니다.",
      cta1: "무료로 시작",
      cta2: "커뮤니티 둘러보기",
      statsUniversities: "대학 수",
      statsCountries: "지원 국가",
      statsFree: "무료 핵심 기능",
      statsGrades: "지원 학년",
      layersTitle: "세 가지 레이어, 하나의 플랫폼",
      layersSub:
        "각 레이어가 다음을 이끕니다 — 무료 사용자는 유료 사용자가 되고, 유료 사용자는 파트너십을 강화하는 데이터를 생성하며, 파트너십은 더 많은 무료 사용자를 끌어옵니다.",
      freeTitle: "시작에 필요한 모든 것",
      freeSub:
        "유료 장벽 없음. 체험판 없음. 무료 레이어 자체가 진정으로 유용합니다 — 미끼가 아닙니다.",
      stakeholdersTitle: "여정의 모든 이를 위해 만들었습니다",
      testimonialsTitle: "학생들의 이야기",
      finalTitle: "오늘 대학 여정을 시작하세요",
      finalSub:
        "수천 명의 학생들과 함께 Entora의 무료 도구를 사용해 자신감 있게 대학 입시를 준비하세요.",
    },
    signup: {
      title: "계정 만들기",
      subtitle: "수천 명의 학생들과 함께 대학 여정을 시작하세요",
      iAm: "저는...",
      changeRole: "← 역할 변경",
      fullName: "이름",
      fullNamePlaceholder: "이름을 입력하세요",
      email: "이메일",
      emailPlaceholder: "you@example.com",
      password: "비밀번호",
      passwordPlaceholder: "최소 6자 이상",
      creating: "계정 생성 중...",
      create: "계정 만들기",
      haveAccount: "이미 계정이 있으신가요?",
      signInLink: "로그인",
      successTitle: "이메일을 확인하세요",
      successSub:
        "{email}로 확인 링크를 보냈습니다. 링크를 클릭하여 계정을 활성화하세요.",
      backToSignIn: "로그인으로 돌아가기",
      roles: {
        student: { label: "학생", desc: "대학에 지원하고 있어요" },
        parent: { label: "학부모", desc: "자녀가 대학에 지원하고 있어요" },
        counselor: { label: "학교 상담사", desc: "학교 진학 상담사예요" },
        specialist: { label: "업계 전문가", desc: "멘토 또는 업계 전문가예요" },
        school_rep: {
          label: "학교 대표",
          desc: "대학교나 기관을 대표합니다",
        },
      },
    },
    common: {
      loading: "로딩 중...",
      error: "오류가 발생했습니다",
    },
  },

  ja: {
    nav: {
      community: "コミュニティ",
      roadmap: "ロードマップ",
      schools: "大学",
      resources: "リソース",
      forParents: "保護者向け",
      signIn: "サインイン",
      getStarted: "はじめる",
      signOut: "サインアウト",
    },
    landing: {
      badge: "米国 · 英国 · カナダ · オーストラリア",
      heroHeadline: "大学受験のための完全な",
      heroHighlight: "サポート",
      heroSub:
        "無料コミュニティ、学年別ロードマップ、大学検索、専門家セッション。最初の調査から合格通知まで、必要なすべてが揃っています。",
      cta1: "無料ではじめる",
      cta2: "コミュニティを見る",
      statsUniversities: "大学数",
      statsCountries: "対応国数",
      statsFree: "無料コア機能",
      statsGrades: "対応学年",
      layersTitle: "3つのレイヤー、1つのプラットフォーム",
      layersSub:
        "各レイヤーが次を強化します — 無料ユーザーは有料ユーザーになり、有料ユーザーはパートナーシップを強化するデータを生み出し、パートナーシップはより多くの無料ユーザーを引き込みます。",
      freeTitle: "スタートに必要なすべて",
      freeSub:
        "ペイウォールなし。トライアルなし。無料レイヤー自体が本当に役立ちます — 囮ではありません。",
      stakeholdersTitle: "旅のすべての人のために作りました",
      testimonialsTitle: "学生の声",
      finalTitle: "今日、大学への旅を始めましょう",
      finalSub:
        "数千人の学生とともに Entora の無料ツールを使って、自信を持って大学受験を乗り越えましょう。",
    },
    signup: {
      title: "アカウントを作成",
      subtitle: "数千人の学生とともに大学への旅を始めましょう",
      iAm: "私は...",
      changeRole: "← 役割を変更",
      fullName: "フルネーム",
      fullNamePlaceholder: "フルネームを入力",
      email: "メールアドレス",
      emailPlaceholder: "you@example.com",
      password: "パスワード",
      passwordPlaceholder: "6文字以上",
      creating: "アカウント作成中...",
      create: "アカウントを作成",
      haveAccount: "すでにアカウントをお持ちですか？",
      signInLink: "サインイン",
      successTitle: "メールをご確認ください",
      successSub:
        "{email} に確認リンクを送りました。リンクをクリックしてアカウントを有効化してください。",
      backToSignIn: "サインインに戻る",
      roles: {
        student: { label: "学生", desc: "大学に出願しています" },
        parent: { label: "保護者", desc: "子どもが受験中です" },
        counselor: {
          label: "スクールカウンセラー",
          desc: "学校のガイダンスカウンセラーです",
        },
        specialist: {
          label: "業界専門家",
          desc: "メンターまたは業界の専門家です",
        },
        school_rep: {
          label: "大学代表者",
          desc: "大学または機関を代表しています",
        },
      },
    },
    common: {
      loading: "読み込み中...",
      error: "エラーが発生しました",
    },
  },
} as const;

// Explicit interface so all language objects are assignable to a single type
export interface RoleEntry { label: string; desc: string; }
export interface TranslationKey {
  nav: {
    community: string; roadmap: string; schools: string; resources: string;
    forParents: string; signIn: string; getStarted: string; signOut: string;
  };
  landing: {
    badge: string; heroHeadline: string; heroHighlight: string; heroSub: string;
    cta1: string; cta2: string;
    statsUniversities: string; statsCountries: string; statsFree: string; statsGrades: string;
    layersTitle: string; layersSub: string;
    freeTitle: string; freeSub: string;
    stakeholdersTitle: string; testimonialsTitle: string;
    finalTitle: string; finalSub: string;
  };
  signup: {
    title: string; subtitle: string; iAm: string; changeRole: string;
    fullName: string; fullNamePlaceholder: string;
    email: string; emailPlaceholder: string;
    password: string; passwordPlaceholder: string;
    creating: string; create: string;
    haveAccount: string; signInLink: string;
    successTitle: string; successSub: string; backToSignIn: string;
    roles: {
      student: RoleEntry; parent: RoleEntry; counselor: RoleEntry;
      specialist: RoleEntry; school_rep: RoleEntry;
    };
  };
  common: { loading: string; error: string };
}
