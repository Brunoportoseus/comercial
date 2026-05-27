// ============================================================
// Tipos de domínio do Clube do Pintor Darka.
// Preparado para futura integração com APIs reais (CRM, sistema
// de pontos, e-commerce). Os campos refletem o contrato esperado.
// ============================================================

export type ClubLevel = "Bronze" | "Prata" | "Ouro" | "Diamante";

export interface Painter {
  id: string;
  name: string;
  cpf: string;
  whatsapp: string;
  email: string;
  birthDate?: string;
  city: string;
  state: string;
  neighborhood?: string;
  address?: string;
  zipCode?: string;
  yearsAsPainter?: number;
  specialties: string[];
  brandsUsed: string[];
  preferredStore?: string;
  avatarUrl?: string;
  level: ClubLevel;
  points: number;
  pointsToNextLevel: number;
  nextLevel?: ClubLevel;
  communicationPreferences: {
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
}

export type PointEntryStatus = "Aprovado" | "Pendente" | "Utilizado" | "Expirado";

export interface PointEntry {
  id: string;
  date: string;          // ISO date
  description: string;
  points: number;        // pode ser negativo (consumo)
  status: PointEntryStatus;
}

export type VoucherType =
  | "loja-virtual"
  | "produtos"
  | "ferramentas"
  | "campanha"
  | "frete";

export interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiresAt: string;
  type: VoucherType;
  rules: string[];
  highlightColor?: string;
}

export type RewardCategory =
  | "Brindes"
  | "Ferramentas"
  | "Uniformes"
  | "Treinamentos"
  | "Vouchers"
  | "Experiências"
  | "Kits";

export type RewardStatus = "disponivel" | "em-breve" | "esgotado";

export interface Reward {
  id: string;
  name: string;
  category: RewardCategory;
  pointsCost: number;
  image: string;
  status: RewardStatus;
  description?: string;
}

export type TrainingFormat =
  | "Presencial"
  | "Online ao vivo"
  | "Gravado"
  | "Workshop"
  | "Demonstração"
  | "Curso técnico";

export interface Training {
  id: string;
  title: string;
  description: string;
  date: string;             // ISO
  time: string;             // ex.: "19:00"
  format: TrainingFormat;
  location: string;
  instructor: string;
  seatsAvailable: number;
  pointsAwarded: number;
  cover: string;
  tags: string[];
}

export type NotificationKind =
  | "voucher"
  | "curso"
  | "pontos"
  | "premio"
  | "campanha"
  | "aviso"
  | "promo"
  | "inscricao";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  summary: string;
  date: string;
  read: boolean;
}

export type ReferralStatus =
  | "Recebida"
  | "Em análise"
  | "Convertida"
  | "Pontos liberados"
  | "Não convertida";

export interface Referral {
  id: string;
  name: string;
  phone: string;
  city: string;
  kind: "Cliente" | "Obra" | "Produto";
  notes?: string;
  status: ReferralStatus;
  createdAt: string;
}

export interface BenefitProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  priceOriginal: number;
  priceBenefit: number;
  pointsBonus: number;
  url?: string;
}
