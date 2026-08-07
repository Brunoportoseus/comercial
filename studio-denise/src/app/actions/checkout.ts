"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getGateway } from "@/lib/payments";
import { activateSubscriptionCycle } from "@/lib/subscription";
import { audit } from "@/lib/audit";
import type { ActionState } from "./auth";

/**
 * Contrata um plano para o usuário logado.
 * • Modo simulação: aprova na hora (o sistema "permite o pagamento" de ponta a ponta).
 * • Mercado Pago: cria a assinatura e redireciona a cliente para o checkout do gateway;
 *   a confirmação chega depois via webhook.
 */
export async function subscribeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/checkout?plano=${formData.get("plano")}`);

  const slug = String(formData.get("plano") || "");
  const plan = await prisma.plan.findUnique({ where: { slug } });
  if (!plan || !plan.active) return { error: "Plano indisponível." };

  // Impede duplicidade de assinatura ativa.
  const active = await prisma.subscription.findFirst({
    where: { userId: user!.id, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
  });
  if (active) redirect("/dashboard");

  const gateway = getGateway();

  const subscription = await prisma.subscription.create({
    data: {
      userId: user!.id,
      planId: plan.id,
      status: "PENDING",
      gateway: gateway.name,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let result;
  try {
    result = await gateway.createSubscription({
      subscriptionId: subscription.id,
      planName: plan.name,
      amountCents: plan.monthlyPriceCents,
      payerEmail: user!.email,
      payerName: user!.name,
      backUrl: `${siteUrl}/dashboard?assinatura=ok`,
    });
  } catch (e) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELED", cancelReason: "Falha ao criar no gateway" },
    });
    return { error: e instanceof Error ? e.message : "Falha ao iniciar o pagamento." };
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { gatewaySubscriptionId: result.gatewaySubscriptionId },
  });

  await audit({
    actorId: user!.id,
    action: "CHECKOUT_STARTED",
    entity: "Subscription",
    entityId: subscription.id,
    meta: { gateway: result.gateway, plan: plan.slug },
  });

  if (result.autoApproved) {
    // Simulação: aprova o pagamento e libera créditos imediatamente.
    await activateSubscriptionCycle({
      subscriptionId: subscription.id,
      gatewayPaymentId: `sim_${subscription.id}`,
      method: "CREDIT_CARD",
    });
    redirect("/dashboard?assinatura=ok");
  }

  if (result.checkoutUrl) {
    redirect(result.checkoutUrl);
  }

  redirect("/dashboard");
}
