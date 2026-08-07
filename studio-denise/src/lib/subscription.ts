import { prisma } from "./prisma";
import { earnCycleCredits } from "./credits";
import { notify } from "./notifications";
import { audit } from "./audit";
import { getSetting } from "./settings";
import type { PaymentMethod } from "./domain";

/**
 * Ativa (ou renova) um ciclo de assinatura já paga: registra o pagamento
 * aprovado, credita os créditos do ciclo e notifica a cliente. Idempotente
 * por `gatewayPaymentId` para suportar reentrega de webhooks.
 */
export async function activateSubscriptionCycle(params: {
  subscriptionId: string;
  gatewayPaymentId: string;
  method?: PaymentMethod;
}) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: params.subscriptionId },
    include: { plan: true, user: true },
  });
  if (!subscription) throw new Error("Assinatura não encontrada.");

  // Idempotência: se já processamos este pagamento, não repetir.
  const existing = await prisma.payment.findFirst({
    where: { gatewayPaymentId: params.gatewayPaymentId },
  });
  if (existing && existing.status === "APPROVED") return existing;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const payment = await prisma.payment.create({
    data: {
      userId: subscription.userId,
      subscriptionId: subscription.id,
      amountCents: subscription.plan.monthlyPriceCents,
      status: "APPROVED",
      gateway: subscription.gateway,
      gatewayPaymentId: params.gatewayPaymentId,
      method: params.method ?? "CREDIT_CARD",
      paidAt: now,
    },
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "ACTIVE",
      startedAt: subscription.startedAt ?? now,
      currentPeriodEnd: periodEnd,
      nextBillingAt: periodEnd,
    },
  });

  const settings = await getSetting("credits");
  const validityDays = subscription.plan.creditValidityDays || settings.defaultValidityDays;

  await earnCycleCredits({
    userId: subscription.userId,
    subscriptionId: subscription.id,
    credits: subscription.plan.creditsPerCycle,
    validityDays,
    maxAccumulated: subscription.plan.maxAccumulatedCredits,
  });

  await notify({
    userId: subscription.userId,
    type: "PAYMENT",
    title: "Pagamento aprovado ✓",
    body: `Sua assinatura do plano ${subscription.plan.name} está ativa e seus créditos foram liberados.`,
  });

  await audit({
    action: "SUBSCRIPTION_ACTIVATED",
    entity: "Subscription",
    entityId: subscription.id,
    meta: { paymentId: payment.id, gateway: subscription.gateway },
  });

  return payment;
}
