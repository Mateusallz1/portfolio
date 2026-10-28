export interface Profile {
  name: string;
  githubUser: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  whatsappNumber: string;
  whatsappUrl: string;
  location: string;
  availability: {
    pt: string;
    en: string;
  };
  headline: {
    pt: string;
    en: string;
  };
  bio: {
    pt: string;
    en: string;
  };
  aboutLong: {
    pt: string[];
    en: string[];
  };
  skills: {
    category: {
      pt: string;
      en: string;
    };
    items: {
      name: string;
      highlight?: boolean;
    }[];
  }[];
  services: {
    id: string;
    title: string;
    description: string;
    deliverables: string[];
    badge: string;
  }[];
  experience: {
    role: { pt: string; en: string };
    company: string;
    period: { pt: string; en: string };
    location: string;
    description: { pt: string; en: string };
    achievements: { pt: string[]; en: string[] };
    techs: string[];
  }[];
}

export const profile: Profile = {
  name: 'Mateus Alves',
  githubUser: 'Mateusallz1',
  githubUrl: 'https://github.com/Mateusallz1',
  linkedinUrl: 'https://linkedin.com/in/mateus-alves-dev', // editável pelo usuário
  email: 'mateusdgonzaga@gmail.com',
  whatsappNumber: '+55 86 99867-4004',
  whatsappUrl: 'https://wa.me/5586998674004?text=Ol%C3%A1%20Mateus!%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.',
  location: 'Teresina, PI - Brasil (Remoto)',
  availability: {
    pt: 'Disponível para projetos freelance e consultoria',
    en: 'Open to full-time remote opportunities worldwide',
  },
  headline: {
    pt: 'Software Engineer | Python (Django & uv) & TypeScript',
    en: 'Software Engineer | Python (Django & uv) & TypeScript',
  },
  bio: {
    pt: 'Engenheiro de Software especializado no desenvolvimento de sistemas robustos e escaláveis com Python (Django), gerenciamento moderno de dependências com uv e interfaces reativas em TypeScript.',
    en: 'Software Engineer specializing in building resilient, high-performance backends with Python (Django), modern package workflows with uv, and clean TypeScript applications.',
  },
  aboutLong: {
    pt: [
      'Sou desenvolvedor de software focado em resolver problemas reais de negócio através de código limpo, arquitetura sólida e automação de processos.',
      'No ecossistema Python, atuo com Django, Django REST Framework, FastAPI e ferramentas de alta performance como uv para gerenciamento de dependências ultra-rápido. No frontend, desenvolvo com TypeScript, garantindo consistência de ponta a ponta.',
      'Acredito firmemente na cultura de "Aprender em Público" (Learn in Public): documento minhas descobertas, estudos de caso e lições aprendidas em artigos técnicos e notas contínuas.',
    ],
    en: [
      'I am a software engineer focused on delivering business value through clean architecture, maintainable code, and high developer velocity.',
      'In the Python landscape, I specialize in Django, Django REST Framework, FastAPI, and next-gen developer tooling like uv for blazingly fast dependency management. On the client side, I leverage TypeScript to ensure end-to-end type safety and smooth user experiences.',
      'I am a strong advocate of "Learning in Public": continuously documenting architectural decisions, performance benchmarks, and production lessons in technical deep dives and study notes.',
    ],
  },
  skills: [
    {
      category: {
        pt: 'Backend & Core',
        en: 'Backend & Core',
      },
      items: [
        { name: 'Python 3.12+', highlight: true },
        { name: 'Django / DRF', highlight: true },
        { name: 'uv (Astral)', highlight: true },
        { name: 'FastAPI', highlight: false },
        { name: 'Pydantic', highlight: false },
        { name: 'Celery / Redis', highlight: false },
        { name: 'PostgreSQL', highlight: true },
      ],
    },
    {
      category: {
        pt: 'Frontend & Web',
        en: 'Frontend & Web',
      },
      items: [
        { name: 'TypeScript', highlight: true },
        { name: 'JavaScript (ESNext)', highlight: false },
        { name: 'Astro', highlight: true },
        { name: 'React / Next.js', highlight: false },
        { name: 'Tailwind CSS', highlight: true },
        { name: 'HTML5 & Responsive CSS', highlight: false },
      ],
    },
    {
      category: {
        pt: 'Arquitetura & Boas Práticas',
        en: 'Architecture & Practices',
      },
      items: [
        { name: 'RESTful API Design', highlight: true },
        { name: 'Clean Architecture & SOLID', highlight: false },
        { name: 'Docker & Conteinerização', highlight: false },
        { name: 'Git & GitHub Actions', highlight: true },
        { name: 'Testes Automatizados (pytest)', highlight: true },
      ],
    },
  ],
  services: [
    {
      id: 'web-systems',
      title: 'Desenvolvimento de Sistemas Web & SaaS',
      description: 'Criação de aplicações web completas, seguras e prontas para produção, utilizando Django no backend e interfaces modernas em TypeScript.',
      deliverables: [
        'Painéis administrativos e dashboards sob medida',
        'Modelagem de banco de dados relacional (PostgreSQL)',
        'Autenticação segura, controle de permissões e auditoria',
        'Deploy e configuração de ambientes de produção',
      ],
      badge: 'Solução Completa',
    },
    {
      id: 'apis-microservices',
      title: 'APIs RESTful & Microsserviços Escaláveis',
      description: 'Construção e integração de APIs de alta performance com Django REST Framework ou FastAPI para abastecer apps web, mobile e sistemas legados.',
      deliverables: [
        'Documentação interativa OpenAPI/Swagger',
        'Filas de tarefas em segundo plano (Celery + Redis)',
        'Integração com gateways de pagamento (Stripe, Asaas, Mercado Pago)',
        'Otimização de queries para baixa latência',
      ],
      badge: 'Alta Performance',
    },
    {
      id: 'consulting-refactoring',
      title: 'Consultoria Técnica & Otimização de Ambientes',
      description: 'Modernização de projetos Python existentes, migração de gerenciamento de dependências para uv e refatoração de gargalos de desempenho.',
      deliverables: [
        'Diagnóstico e aceleração de pipelines de CI/CD',
        'Padronização de código, tipagem estática e testes',
        'Auditoria e eliminação de N+1 queries no Django ORM',
        'Mentoria técnica e alinhamento de boas práticas',
      ],
      badge: 'Consultoria Especializada',
    },
  ],
  experience: [
    {
      role: {
        pt: 'Engenheiro de Software',
        en: 'Software Engineer',
      },
      company: 'Projetos e Contratos Independentes',
      period: {
        pt: '2023 - Presente',
        en: '2023 - Present',
      },
      location: 'Remoto',
      description: {
        pt: 'Desenvolvimento de soluções backend e fullstack para clientes e sistemas corporativos.',
        en: 'Designing and building scalable backend and fullstack solutions with Python, Django, and TypeScript.',
      },
      achievements: {
        pt: [
          'Desenvolvimento de APIs robustas com Django REST Framework e integração com PostgreSQL.',
          'Adoção de uv e automação de builds, reduzindo tempos de instalação de dependências em mais de 80%.',
          'Implementação de interfaces tipadas em TypeScript com foco em usabilidade e performance.',
        ],
        en: [
          'Engineered production-grade REST APIs using Django and PostgreSQL with high test coverage.',
          'Adopted Astral uv across development workflows, slashing virtual environment creation and CI setup times by 80%+.',
          'Delivered responsive client interfaces with TypeScript, improving user engagement and application reliability.',
        ],
      },
      techs: ['Python', 'Django', 'uv', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    },
  ],
};
