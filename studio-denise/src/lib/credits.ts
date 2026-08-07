import { prisma } from "./prisma";
import type { CreditTxType } from "./domain";

/**
 * Motor de créditos — todas as movimentações passam por aqui e geram um
 * lançamento no ledger (CreditTransaction) com o saldo resultante.
 *
 * IMPORTANTE (regra de negócio do briefing): crédito NÃO é autorização
 * automática de procedimento. Débito de créditos por procedimento só deve
 * ocorrer após aprovação profissional (feito no fluxo de agendamento/admin).
 */

export async function getBalance(userId: string): Promise<number> {
  const agg = await prisma.creditTransaction.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  return agg._sum.amount ?? 0;
}

/** Créditos que vencem nos próximos `days` dias (aproximação por lançamentos EARN não vencidos). */
export async function getExpiringCredits(userId: string, days = 30): Promise<number> {
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  const rows = await prisma.creditTransaction.findMany({
    where: {
      userId,
      type: "EARN",
      expiresAt: { not: null, lte: limit, gte: new Date() },
    },
    select: { amount: true },
  });
  return rows.reduce((s, r) => s + r.amount, 0);
}

type MoveInput = {
  userId: string;
  type: CreditTxType;
  amount: number; // positivo p/ crédito, negativo p/ débito
  reason: string;
  expiresAt?: Date | null;
  subscriptionId?: string | null;
  procedureId?: string | null;
  createdById?: string | null;
};

/** Lança uma movimentação e devolve o saldo resultante. */
export async function moveCredits(input: MoveInput) {
  return prisma.$transaction(async (tx) => {
    const agg = await tx.creditTransaction.aggregate({
      where: { userId: input.userId },
      _sum: { amount: true },
    });
    const current = agg._sum.amount ?? 0;
    const balanceAfter = current + input.amount;

    if (balanceAfter < 0) {
      throw new Error("Saldo de créditos insuficiente.");
    }

    return tx.creditTransaction.create({
      data: {
        userId: input.userId,
        type: input.type,
        amount: input.amount,
        balanceAfter,
        reason: input.reason,
        expiresAt: input.expiresAt ?? null,
        subscriptionId: input.subscriptionId ?? null,
        procedureId: input.procedureId ?? null,
        createdById: input.createdById ?? null,
      },
    });
  });
}

/** Credita os créditos de um ciclo pago, respeitando validade e teto do plano. */
export async function earnCycleCredits(params: {
  userId: string;
  subscriptionId: string;
  credits: number;
  validityDays: number;
  maxAccumulated: number; // 0 = ilimitado
}) {
  if (params.credits <= 0) return null;

  let toEarn = params.credits;
  if (params.maxAccumulated > 0) {
    const balance = await getBalance(params.userId);
    const room = Math.max(0, params.maxAccumulated - balance);
    toEarn = Math.min(toEarn, room);
    if (toEarn <= 0) return null; // já atingiu o teto acumulável
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + params.validityDays);

  return moveCredits({
    userId: params.userId,
    type: "EARN",
    amount: toEarn,
    reason: "Créditos do ciclo da assinatura",
    expiresAt,
    subscriptionId: params.subscriptionId,
  });
}
