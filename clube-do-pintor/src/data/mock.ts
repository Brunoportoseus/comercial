// ============================================================
// Dados mockados — Clube do Pintor Darka.
// Substituir por chamadas à API/CRM real quando disponível.
// Pontos de integração marcados com // TODO: integração.
// ============================================================

import type {
  AppNotification,
  BenefitProduct,
  Painter,
  PointEntry,
  Referral,
  Reward,
  Training,
  Voucher,
} from "@/types";

// TODO: integração — substituir por GET /api/painter/me
export const mockPainter: Painter = {
  id: "p_001",
  name: "João Carlos",
  cpf: "123.456.789-00",
  whatsapp: "(41) 99876-5432",
  email: "joao.carlos@email.com",
  birthDate: "1985-04-12",
  city: "Curitiba",
  state: "PR",
  neighborhood: "Bairro Alto",
  address: "Rua das Tintas, 200",
  zipCode: "82820-000",
  yearsAsPainter: 12,
  specialties: ["Pintura residencial", "Texturas e efeitos"],
  brandsUsed: ["Darka", "Premium Plus"],
  preferredStore: "Tintas Darka — Curitiba Centro",
  avatarUrl: "",
  level: "Prata",
  points: 1280,
  pointsToNextLevel: 2000,
  nextLevel: "Ouro",
  communicationPreferences: { whatsapp: true, email: true, push: true },
};

// TODO: integração — substituir por GET /api/painter/points
export const mockPointHistory: PointEntry[] = [
  {
    id: "ph_01",
    date: "2026-05-20",
    description: "Compra registrada na loja Darka Centro",
    points: 150,
    status: "Aprovado",
  },
  {
    id: "ph_02",
    date: "2026-05-15",
    description: "Participação no curso Texturas Decorativas",
    points: 80,
    status: "Aprovado",
  },
  {
    id: "ph_03",
    date: "2026-05-10",
    description: "Indicação convertida — Cliente Maria Souza",
    points: 100,
    status: "Aprovado",
  },
  {
    id: "ph_04",
    date: "2026-05-05",
    description: "Resgate de voucher R$ 30 OFF",
    points: -200,
    status: "Utilizado",
  },
  {
    id: "ph_05",
    date: "2026-04-28",
    description: "Campanha Mês do Pintor — bônus",
    points: 250,
    status: "Aprovado",
  },
  {
    id: "ph_06",
    date: "2026-04-15",
    description: "Atualização cadastral completa",
    points: 50,
    status: "Aprovado",
  },
];

// TODO: integração — GET /api/painter/vouchers
export const mockVouchers: Voucher[] = [
  {
    id: "v_01",
    title: "R$ 30 OFF na loja virtual",
    description: "Use em compras acima de R$ 199 na loja virtual da Darka.",
    discount: "R$ 30",
    code: "PINTOR30",
    expiresAt: "2026-06-30",
    type: "loja-virtual",
    rules: [
      "Válido para compras acima de R$ 199",
      "Uso único por CPF",
      "Não cumulativo com outras promoções",
    ],
    highlightColor: "darka-red",
  },
  {
    id: "v_02",
    title: "10% OFF em produtos selecionados",
    description: "Desconto em linha de tintas premium e esmaltes Darka.",
    discount: "10%",
    code: "DARKA10",
    expiresAt: "2026-07-15",
    type: "produtos",
    rules: ["Válido apenas para linha Premium", "Limite de 5 unidades"],
    highlightColor: "darka-orange",
  },
  {
    id: "v_03",
    title: "Frete especial",
    description: "Frete reduzido em compras acima de R$ 299.",
    discount: "Frete R$ 9,90",
    code: "FRETEDARKA",
    expiresAt: "2026-06-30",
    type: "frete",
    rules: ["Para entregas na região Sul"],
    highlightColor: "darka-blue",
  },
  {
    id: "v_04",
    title: "15% OFF em ferramentas",
    description: "Rolos, trinchas, espátulas e acessórios profissionais.",
    discount: "15%",
    code: "FERRA15",
    expiresAt: "2026-08-01",
    type: "ferramentas",
    rules: ["Mínimo de 3 produtos no carrinho"],
    highlightColor: "darka-green",
  },
];

// TODO: integração — GET /api/rewards
export const mockRewards: Reward[] = [
  {
    id: "r_01",
    name: "Camiseta Clube do Pintor Darka",
    category: "Uniformes",
    pointsCost: 500,
    image: "/img/reward-tshirt.svg",
    status: "disponivel",
    description: "Camiseta dry-fit oficial do Clube do Pintor Darka.",
  },
  {
    id: "r_02",
    name: "Boné personalizado Darka",
    category: "Brindes",
    pointsCost: 350,
    image: "/img/reward-cap.svg",
    status: "disponivel",
    description: "Boné bordado com a marca Darka.",
  },
  {
    id: "r_03",
    name: "Kit de trinchas profissional",
    category: "Ferramentas",
    pointsCost: 1200,
    image: "/img/reward-brushes.svg",
    status: "disponivel",
    description: "Kit com 6 trinchas de cerdas naturais e sintéticas.",
  },
  {
    id: "r_04",
    name: "Rolo profissional anti-respingo",
    category: "Ferramentas",
    pointsCost: 800,
    image: "/img/reward-roller.svg",
    status: "disponivel",
  },
  {
    id: "r_05",
    name: "Voucher R$ 50 loja virtual",
    category: "Vouchers",
    pointsCost: 900,
    image: "/img/reward-voucher.svg",
    status: "disponivel",
  },
  {
    id: "r_06",
    name: "Curso avançado de pintura decorativa",
    category: "Treinamentos",
    pointsCost: 1500,
    image: "/img/reward-course.svg",
    status: "disponivel",
    description: "Curso online ao vivo com certificado.",
  },
  {
    id: "r_07",
    name: "Kit Premium do Pintor",
    category: "Kits",
    pointsCost: 2500,
    image: "/img/reward-kit.svg",
    status: "em-breve",
  },
  {
    id: "r_08",
    name: "Experiência fábrica Darka",
    category: "Experiências",
    pointsCost: 5000,
    image: "/img/reward-experience.svg",
    status: "esgotado",
  },
];

// TODO: integração — GET /api/trainings
export const mockTrainings: Training[] = [
  {
    id: "t_01",
    title: "Preparação correta de paredes",
    description:
      "Aprenda as técnicas para preparar superfícies antes da pintura e garantir um acabamento profissional duradouro.",
    date: "2026-06-08",
    time: "19:00",
    format: "Online ao vivo",
    location: "Plataforma Darka",
    instructor: "Mestre André Lima",
    seatsAvailable: 47,
    pointsAwarded: 80,
    cover: "/img/training-prep.svg",
    tags: ["Iniciante", "Online"],
  },
  {
    id: "t_02",
    title: "Como aplicar textura corretamente",
    description:
      "Workshop prático sobre aplicação de texturas grafiato, projetada e rústica.",
    date: "2026-06-15",
    time: "14:00",
    format: "Presencial",
    location: "Centro de Treinamento Darka — Curitiba",
    instructor: "Ricardo Faria",
    seatsAvailable: 12,
    pointsAwarded: 150,
    cover: "/img/training-texture.svg",
    tags: ["Avançado", "Presencial"],
  },
  {
    id: "t_03",
    title: "Pintura decorativa para ambientes internos",
    description:
      "Técnicas modernas de cimento queimado, marmorato e efeitos para áreas residenciais.",
    date: "2026-06-22",
    time: "19:30",
    format: "Online ao vivo",
    location: "Plataforma Darka",
    instructor: "Camila Borges",
    seatsAvailable: 80,
    pointsAwarded: 100,
    cover: "/img/training-deco.svg",
    tags: ["Decorativa", "Online"],
  },
  {
    id: "t_04",
    title: "Como vender melhor seus serviços de pintura",
    description:
      "Aulas de precificação, atendimento ao cliente e marketing para pintores autônomos.",
    date: "2026-07-02",
    time: "20:00",
    format: "Workshop",
    location: "Online",
    instructor: "Lucas Pereira",
    seatsAvailable: 200,
    pointsAwarded: 120,
    cover: "/img/training-sales.svg",
    tags: ["Negócios"],
  },
  {
    id: "t_05",
    title: "Novidades em tintas premium Darka",
    description:
      "Conheça toda a linha premium e tire dúvidas com nossos especialistas.",
    date: "2026-07-10",
    time: "15:00",
    format: "Demonstração",
    location: "Loja Darka — Curitiba Boqueirão",
    instructor: "Equipe Técnica Darka",
    seatsAvailable: 30,
    pointsAwarded: 60,
    cover: "/img/training-premium.svg",
    tags: ["Produto"],
  },
  {
    id: "t_06",
    title: "Aplicação correta de esmaltes e vernizes",
    description:
      "Boas práticas para acabamentos perfeitos em madeira e metal.",
    date: "2026-07-18",
    time: "19:00",
    format: "Curso técnico",
    location: "Plataforma Darka",
    instructor: "Mestre André Lima",
    seatsAvailable: 60,
    pointsAwarded: 90,
    cover: "/img/training-varnish.svg",
    tags: ["Acabamento", "Técnico"],
  },
];

// TODO: integração — GET /api/notifications
export const mockNotifications: AppNotification[] = [
  {
    id: "n_01",
    kind: "voucher",
    title: "Novo voucher disponível",
    summary: "Você acaba de ganhar R$ 30 OFF na loja virtual da Darka.",
    date: "2026-05-26",
    read: false,
  },
  {
    id: "n_02",
    kind: "curso",
    title: "Nova turma aberta",
    summary: "Inscrições abertas para 'Pintura decorativa para ambientes'.",
    date: "2026-05-25",
    read: false,
  },
  {
    id: "n_03",
    kind: "pontos",
    title: "+150 pontos liberados",
    summary: "Sua última compra na loja Darka Centro foi pontuada.",
    date: "2026-05-22",
    read: true,
  },
  {
    id: "n_04",
    kind: "campanha",
    title: "Mês do Pintor",
    summary: "Pontuação dobrada durante o mês de junho. Aproveite!",
    date: "2026-05-20",
    read: true,
  },
  {
    id: "n_05",
    kind: "aviso",
    title: "Pontos prestes a expirar",
    summary: "Você possui 120 pontos que expiram em 30 dias.",
    date: "2026-05-18",
    read: false,
  },
  {
    id: "n_06",
    kind: "inscricao",
    title: "Inscrição confirmada",
    summary: "Você está inscrito no curso 'Texturas Decorativas'.",
    date: "2026-05-14",
    read: true,
  },
];

// TODO: integração — GET /api/referrals
export const mockReferrals: Referral[] = [
  {
    id: "ref_01",
    name: "Maria Souza",
    phone: "(41) 99988-7766",
    city: "Curitiba",
    kind: "Cliente",
    notes: "Cliente residencial, reforma de 80m².",
    status: "Convertida",
    createdAt: "2026-05-05",
  },
  {
    id: "ref_02",
    name: "Obra Edifício Atlântico",
    phone: "(41) 99876-1122",
    city: "Curitiba",
    kind: "Obra",
    notes: "Sindicato precisa de cotação para pintura externa.",
    status: "Em análise",
    createdAt: "2026-05-18",
  },
  {
    id: "ref_03",
    name: "Carlos — colega pintor",
    phone: "(41) 98765-4321",
    city: "São José dos Pinhais",
    kind: "Produto",
    notes: "Indiquei a linha Premium Darka.",
    status: "Pontos liberados",
    createdAt: "2026-04-22",
  },
];

// TODO: integração — GET /api/products?benefits=true
export const mockBenefitProducts: BenefitProduct[] = [
  {
    id: "pr_01",
    name: "Tinta Acrílica Premium Darka 18L",
    category: "Tintas",
    image: "/img/product-paint.svg",
    priceOriginal: 369.9,
    priceBenefit: 314.9,
    pointsBonus: 80,
  },
  {
    id: "pr_02",
    name: "Esmalte Sintético Darka 3,6L",
    category: "Esmaltes",
    image: "/img/product-enamel.svg",
    priceOriginal: 129.9,
    priceBenefit: 109.9,
    pointsBonus: 40,
  },
  {
    id: "pr_03",
    name: "Textura Projetada Darka 25Kg",
    category: "Texturas",
    image: "/img/product-texture.svg",
    priceOriginal: 219.0,
    priceBenefit: 189.0,
    pointsBonus: 60,
  },
  {
    id: "pr_04",
    name: "Massa Corrida Profissional 25Kg",
    category: "Preparação",
    image: "/img/product-mass.svg",
    priceOriginal: 89.9,
    priceBenefit: 74.9,
    pointsBonus: 30,
  },
];

// Helpers de derivação (níveis, percentual etc.)
export function levelProgress(p: Painter): number {
  if (!p.pointsToNextLevel) return 100;
  return Math.min(100, Math.round((p.points / p.pointsToNextLevel) * 100));
}

export function levelBenefits(level: Painter["level"]): string[] {
  switch (level) {
    case "Bronze":
      return [
        "Acesso à plataforma e treinamentos básicos",
        "Pontuação em compras participantes",
        "Vouchers de boas-vindas",
      ];
    case "Prata":
      return [
        "Tudo do Bronze",
        "Acesso a cursos intermediários",
        "Vouchers exclusivos mensais",
        "5% extra em pontos por compra",
      ];
    case "Ouro":
      return [
        "Tudo do Prata",
        "Acesso prioritário a treinamentos",
        "Brindes exclusivos no aniversário",
        "10% extra em pontos por compra",
      ];
    case "Diamante":
      return [
        "Tudo do Ouro",
        "Experiências exclusivas com a marca",
        "Atendimento dedicado",
        "20% extra em pontos por compra",
      ];
  }
}
