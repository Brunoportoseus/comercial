/** Teste de fumaça do pipeline de pagamento → créditos (modo simulação). */
import { PrismaClient } from "@prisma/client";
import { getGateway } from "../src/lib/payments";
import { activateSubscriptionCycle } from "../src/lib/subscription";
import { getBalance } from "../src/lib/credits";

const prisma = new PrismaClient();

async function main() {
  const email = `teste_${Date.now()}@exemplo.com`;
  const user = await prisma.user.create({
    data: { name: "Teste Pagamento", email, passwordHash: "x", role: "CLIENT" },
  });
  const plan = await prisma.plan.findUniqueOrThrow({ where: { slug: "premium" } });

  const gateway = getGateway();
  console.log("Gateway ativo:", gateway.name);

  const sub = await prisma.subscription.create({
    data: { userId: user.id, planId: plan.id, status: "PENDING", gateway: gateway.name },
  });

  const result = await gateway.createSubscription({
    subscriptionId: sub.id,
    planName: plan.name,
    amountCents: plan.monthlyPriceCents,
    payerEmail: email,
    payerName: user.name,
    backUrl: "http://localhost:3000/dashboard",
  });
  console.log("createSubscription ->", result);

  if (result.autoApproved) {
    await activateSubscriptionCycle({ subscriptionId: sub.id, gatewayPaymentId: `sim_${sub.id}` });
  }

  const balance = await getBalance(user.id);
  const updated = await prisma.subscription.findUniqueOrThrow({ where: { id: sub.id } });
  const payment = await prisma.payment.findFirst({ where: { subscriptionId: sub.id } });

  console.log("Assinatura status:", updated.status);
  console.log("Pagamento:", payment?.status, payment?.amountCents, "centavos");
  console.log("Saldo de créditos após pagamento:", balance, "(esperado:", plan.creditsPerCycle, ")");

  const ok = updated.status === "ACTIVE" && payment?.status === "APPROVED" && balance === plan.creditsPerCycle;
  console.log(ok ? "\n✅ PIPELINE DE PAGAMENTO OK" : "\n❌ FALHOU");

  // limpeza
  await prisma.creditTransaction.deleteMany({ where: { userId: user.id } });
  await prisma.payment.deleteMany({ where: { userId: user.id } });
  await prisma.subscription.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
