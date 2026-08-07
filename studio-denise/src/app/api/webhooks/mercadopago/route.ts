import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activateSubscriptionCycle } from "@/lib/subscription";
import { notify } from "@/lib/notifications";
import { audit } from "@/lib/audit";

/**
 * Webhook do Mercado Pago (assinaturas e pagamentos).
 * Recebe as notificações, consulta o recurso na API e atualiza a assinatura.
 *
 * Segurança: o segredo do webhook (MP_WEBHOOK_SECRET) deve ser validado via
 * a assinatura `x-signature` do Mercado Pago em produção. Deixado como TODO
 * para não bloquear a demonstração; NUNCA confie no corpo sem validar.
 */
const MP_API = "https://api.mercadopago.com";

export async function POST(req: NextRequest) {
  const token = process.env.MP_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ ok: true, note: "Modo simulação: webhook ignorado." });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* corpo vazio/query-only também é aceito pelo MP */
  }

  // TODO(segurança): validar header `x-signature` com MP_WEBHOOK_SECRET.

  const type = body?.type || req.nextUrl.searchParams.get("type");
  const dataId = body?.data?.id || req.nextUrl.searchParams.get("data.id");

  try {
    if (type === "payment" && dataId) {
      const res = await fetch(`${MP_API}/v1/payments/${dataId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payment = await res.json();
      const preapprovalId: string | undefined =
        payment?.metadata?.preapproval_id || payment?.point_of_interaction?.transaction_data?.subscription_id;
      const externalRef: string | undefined = payment?.external_reference;

      const subscription = await prisma.subscription.findFirst({
        where: {
          OR: [
            externalRef ? { id: externalRef } : {},
            preapprovalId ? { gatewaySubscriptionId: preapprovalId } : {},
          ],
        },
      });

      if (subscription && payment?.status === "approved") {
        await activateSubscriptionCycle({
          subscriptionId: subscription.id,
          gatewayPaymentId: String(payment.id),
          method: payment?.payment_type_id === "pix" ? "PIX" : "CREDIT_CARD",
        });
      } else if (subscription && payment?.status === "rejected") {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "PAST_DUE" },
        });
        await notify({
          userId: subscription.userId,
          type: "PAYMENT",
          title: "Pagamento recusado",
          body: "Não conseguimos confirmar seu pagamento. Atualize sua forma de pagamento.",
        });
      }
    } else if (type === "subscription_preapproval" && dataId) {
      const res = await fetch(`${MP_API}/preapproval/${dataId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pre = await res.json();
      const subscription = await prisma.subscription.findFirst({
        where: { gatewaySubscriptionId: String(dataId) },
      });
      if (subscription && pre?.status === "cancelled") {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "CANCELED", canceledAt: new Date() },
        });
      }
    }

    await audit({ action: "WEBHOOK_MP", entity: "Webhook", meta: { type, dataId } });
  } catch (e) {
    console.error("Webhook MP error", e);
    // 200 mesmo em erro interno evita reentregas infinitas; logue e monitore.
  }

  return NextResponse.json({ ok: true });
}
