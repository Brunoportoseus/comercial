/**
 * Tipos de domínio (uniões de string) espelhando os campos String do Prisma.
 * Centraliza os valores válidos usados no schema para dar segurança de tipos
 * sem depender de `enum` (não suportado no SQLite).
 */

export const ROLES = ["CLIENT", "ADMIN", "RECEPCAO", "PROFISSIONAL", "FINANCEIRO"] as const;
export type Role = (typeof ROLES)[number];

/** Perfis com acesso ao painel administrativo. */
export const STAFF_ROLES: Role[] = ["ADMIN", "RECEPCAO", "PROFISSIONAL", "FINANCEIRO"];

export const SUBSCRIPTION_STATUS = ["PENDING", "ACTIVE", "PAST_DUE", "PAUSED", "CANCELED"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const PAYMENT_STATUS = ["APPROVED", "PENDING", "REFUSED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const PAYMENT_METHOD = ["CREDIT_CARD", "PIX"] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export const CREDIT_TX_TYPE = ["EARN", "SPEND", "EXPIRE", "ADJUST", "REFUND"] as const;
export type CreditTxType = (typeof CREDIT_TX_TYPE)[number];

export const PROCEDURE_CATEGORY = [
  "SOBRANCELHAS",
  "LABIAL",
  "OLHOS",
  "CORRECAO",
  "DESIGN",
  "COMPLEMENTAR",
] as const;
export type ProcedureCategory = (typeof PROCEDURE_CATEGORY)[number];

export const PROCEDURE_PAYMENT_MODE = ["FULL_CREDITS", "PARTIAL_CREDITS", "DISCOUNT_ONLY"] as const;
export type ProcedurePaymentMode = (typeof PROCEDURE_PAYMENT_MODE)[number];

export const APPOINTMENT_STATUS = [
  "REQUESTED",
  "EVALUATION_REQUIRED",
  "APPROVED",
  "RESCHEDULE_SUGGESTED",
  "CONFIRMED",
  "DONE",
  "NO_SHOW",
  "CANCELED",
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[number];

// ── Rótulos amigáveis (pt-BR) para UI ────────────────────────────────

export const CATEGORY_LABELS: Record<ProcedureCategory, string> = {
  SOBRANCELHAS: "Sobrancelhas",
  LABIAL: "Lábios",
  OLHOS: "Olhos",
  CORRECAO: "Correção",
  DESIGN: "Design & Embelezamento",
  COMPLEMENTAR: "Complementar",
};

export const PAYMENT_MODE_LABELS: Record<ProcedurePaymentMode, string> = {
  FULL_CREDITS: "Pode ser pago integralmente com créditos",
  PARTIAL_CREDITS: "Pagamento parcial com créditos (coparticipação)",
  DISCOUNT_ONLY: "Somente com desconto do plano",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  PENDING: "Pagamento pendente",
  ACTIVE: "Ativa",
  PAST_DUE: "Pagamento em atraso",
  PAUSED: "Pausada",
  CANCELED: "Cancelada",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  REQUESTED: "Solicitado",
  EVALUATION_REQUIRED: "Avaliação necessária",
  APPROVED: "Aprovado",
  RESCHEDULE_SUGGESTED: "Novo horário sugerido",
  CONFIRMED: "Confirmado",
  DONE: "Realizado",
  NO_SHOW: "Falta",
  CANCELED: "Cancelado",
};
