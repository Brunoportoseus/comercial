"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getGateway } from "@/lib/payments";
import { notify } from "@/lib/notifications";
import { audit } from "@/lib/audit";
import type { ActionState } from "./auth";

/** Solicitação de agendamento (o Studio confirma/sugere horário/pede avaliação). */
export async function requestAppointmentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sessão expirada." };

  const procedureId = String(formData.get("procedureId") || "");
  const procedure = await prisma.procedure.findUnique({ where: { id: procedureId } });
  if (!procedure) return { error: "Selecione um procedimento válido." };

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE"] } },
    include: { plan: true },
  });
  if (!subscription) return { error: "É necessário ter uma assinatura ativa." };

  // Verificação de carência (informativa — não bloqueia a solicitação de avaliação).
  const dates = [formData.get("date1"), formData.get("date2"), formData.get("date3")]
    .map((d) => (d ? String(d) : ""))
    .filter(Boolean);
  if (dates.length === 0) return { error: "Informe ao menos uma data de preferência." };

  await prisma.appointment.create({
    data: {
      userId: user.id,
      procedureId,
      status: procedure.requiresEvaluation ? "EVALUATION_REQUIRED" : "REQUESTED",
      preferredDates: JSON.stringify(dates),
      clientNotes: String(formData.get("notes") || "") || null,
    },
  });

  await notify({
    userId: user.id,
    type: "APPOINTMENT",
    title: "Solicitação de agendamento recebida",
    body: `Recebemos seu pedido para ${procedure.name}. Em breve o Studio confirmará.`,
  });

  await audit({ actorId: user.id, action: "APPOINTMENT_REQUESTED", entity: "Appointment" });
  revalidatePath("/dashboard/agendamentos");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sessão expirada." };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: String(formData.get("name") || user.name),
      phone: String(formData.get("phone") || "") || null,
      whatsapp: String(formData.get("whatsapp") || "") || null,
      addressLine: String(formData.get("addressLine") || "") || null,
      city: String(formData.get("city") || "") || null,
      state: String(formData.get("state") || "") || null,
      zip: String(formData.get("zip") || "") || null,
      acceptedMarketing: formData.get("acceptMarketing") === "1",
    },
  });

  await audit({ actorId: user.id, action: "PROFILE_UPDATED", entity: "User", entityId: user.id });
  revalidatePath("/dashboard/perfil");
  return { ok: true };
}

export async function cancelSubscriptionAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sessão expirada." };

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
  });
  if (!subscription) return { error: "Nenhuma assinatura ativa para cancelar." };

  if (subscription.gatewaySubscriptionId) {
    try {
      await getGateway().cancelSubscription(subscription.gatewaySubscriptionId);
    } catch (e) {
      console.error("Falha ao cancelar no gateway", e);
    }
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
      cancelReason: String(formData.get("reason") || "") || null,
    },
  });

  await notify({
    userId: user.id,
    type: "SUBSCRIPTION",
    title: "Assinatura cancelada",
    body: "Sua assinatura foi cancelada. Seus créditos seguem a política vigente do plano.",
  });

  await audit({ actorId: user.id, action: "SUBSCRIPTION_CANCELED", entity: "Subscription", entityId: subscription.id });
  revalidatePath("/dashboard");
  return { ok: true };
}
