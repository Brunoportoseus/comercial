"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { moveCredits } from "@/lib/credits";
import { notify } from "@/lib/notifications";
import { audit } from "@/lib/audit";
import { setSetting } from "@/lib/settings";
import type { Role } from "@/lib/domain";
import type { ActionState } from "./auth";

async function requireStaff(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user || !isStaff(user.role as Role)) throw new Error("Acesso negado.");
  if (roles && !roles.includes(user.role as Role)) throw new Error("Sem permissão para esta ação.");
  return user;
}

/** Ajuste manual de créditos (com justificativa obrigatória). */
export async function adjustCreditsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN", "FINANCEIRO", "PROFISSIONAL"]);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const userId = String(formData.get("userId") || "");
  const amount = parseInt(String(formData.get("amount") || "0"), 10);
  const reason = String(formData.get("reason") || "").trim();
  if (!userId || !amount || !reason) {
    return { error: "Informe valor (≠0) e justificativa." };
  }

  try {
    await moveCredits({
      userId,
      type: "ADJUST",
      amount,
      reason: `Ajuste manual: ${reason}`,
      createdById: admin.id,
    });
  } catch (e) {
    return { error: (e as Error).message };
  }

  await notify({
    userId,
    type: "CREDIT",
    title: amount > 0 ? "Créditos adicionados" : "Ajuste de créditos",
    body: `${amount > 0 ? "+" : ""}${amount} créditos — ${reason}`,
  });
  await audit({ actorId: admin.id, action: "CREDIT_ADJUST", entity: "User", entityId: userId, meta: { amount, reason } });
  revalidatePath(`/admin/clientes/${userId}`);
  return { ok: true };
}

/** Atualiza uma solicitação de agendamento. Ao marcar como realizado, debita créditos. */
export async function updateAppointmentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const adminNotes = String(formData.get("adminNotes") || "") || null;
  const scheduledAtRaw = String(formData.get("scheduledAt") || "");

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { procedure: true },
  });
  if (!appointment) return { error: "Agendamento não encontrado." };

  // Débito de créditos ao concluir procedimento pago com créditos.
  if (status === "DONE" && appointment.status !== "DONE" && appointment.procedure.creditCost > 0) {
    try {
      await moveCredits({
        userId: appointment.userId,
        type: "SPEND",
        amount: -appointment.procedure.creditCost,
        reason: `Procedimento realizado: ${appointment.procedure.name}`,
        procedureId: appointment.procedureId,
        createdById: admin.id,
      });
    } catch (e) {
      return { error: `Não foi possível debitar créditos: ${(e as Error).message}` };
    }
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      status,
      adminNotes,
      scheduledAt: scheduledAtRaw ? new Date(scheduledAtRaw) : appointment.scheduledAt,
    },
  });

  const labels: Record<string, string> = {
    APPROVED: "Seu agendamento foi aprovado.",
    CONFIRMED: "Seu agendamento está confirmado.",
    RESCHEDULE_SUGGESTED: "O Studio sugeriu um novo horário. Confira na sua área.",
    EVALUATION_REQUIRED: "É necessária uma avaliação antes do procedimento.",
    DONE: "Procedimento registrado como realizado.",
    NO_SHOW: "Registro de falta atualizado.",
    CANCELED: "Agendamento cancelado.",
  };
  if (labels[status]) {
    await notify({ userId: appointment.userId, type: "APPOINTMENT", title: "Atualização de agendamento", body: labels[status] });
  }

  await audit({ actorId: admin.id, action: "APPOINTMENT_UPDATED", entity: "Appointment", entityId: id, meta: { status } });
  revalidatePath("/admin/agendamentos");
  return { ok: true };
}

/** Salva os campos configuráveis de um plano. */
export async function savePlanAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN"]);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const id = String(formData.get("id") || "");
  const num = (k: string) => parseInt(String(formData.get(k) || "0"), 10) || 0;

  await prisma.plan.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      tagline: String(formData.get("tagline") || "") || null,
      monthlyPriceCents: Math.round(parseFloat(String(formData.get("price") || "0")) * 100),
      creditsPerCycle: num("creditsPerCycle"),
      gracePeriodDays: num("gracePeriodDays"),
      minCommitmentMonths: num("minCommitmentMonths"),
      creditValidityDays: num("creditValidityDays"),
      maxAccumulatedCredits: num("maxAccumulatedCredits"),
      discountPercent: num("discountPercent"),
      recommended: formData.get("recommended") === "1",
      active: formData.get("active") === "1",
      isDemo: formData.get("isDemo") === "1",
      rulesText: String(formData.get("rulesText") || "") || null,
    },
  });

  await audit({ actorId: admin.id, action: "PLAN_UPDATED", entity: "Plan", entityId: id });
  revalidatePath("/admin/planos");
  revalidatePath("/planos");
  return { ok: true };
}

/** Salva os campos configuráveis de um procedimento. */
export async function saveProcedureAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN"]);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const id = String(formData.get("id") || "");
  await prisma.procedure.update({
    where: { id },
    data: {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || "") || null,
      category: String(formData.get("category") || "COMPLEMENTAR"),
      paymentMode: String(formData.get("paymentMode") || "FULL_CREDITS"),
      creditCost: parseInt(String(formData.get("creditCost") || "0"), 10) || 0,
      priceCents: Math.round(parseFloat(String(formData.get("price") || "0")) * 100),
      requiresEvaluation: formData.get("requiresEvaluation") === "1",
      active: formData.get("active") === "1",
      isDemo: formData.get("isDemo") === "1",
    },
  });

  await audit({ actorId: admin.id, action: "PROCEDURE_UPDATED", entity: "Procedure", entityId: id });
  revalidatePath("/admin/procedimentos");
  revalidatePath("/procedimentos");
  return { ok: true };
}

/** Bloqueia/reativa um usuário. */
export async function toggleUserActiveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN", "RECEPCAO"]);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const userId = String(formData.get("userId") || "");
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return { error: "Cliente não encontrado." };

  await prisma.user.update({ where: { id: userId }, data: { active: !target.active } });
  await audit({ actorId: admin.id, action: target.active ? "USER_BLOCKED" : "USER_REACTIVATED", entity: "User", entityId: userId });
  revalidatePath(`/admin/clientes/${userId}`);
  revalidatePath("/admin/clientes");
  return { ok: true };
}

/** Configurações do Studio. */
export async function saveStudioSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN"]);
  } catch (e) {
    return { error: (e as Error).message };
  }
  await setSetting("studio", {
    name: String(formData.get("name") || ""),
    specialist: String(formData.get("specialist") || ""),
    tagline: String(formData.get("tagline") || ""),
    city: String(formData.get("city") || ""),
    state: String(formData.get("state") || ""),
    address: String(formData.get("address") || ""),
    phone: String(formData.get("phone") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    email: String(formData.get("email") || ""),
    instagram: String(formData.get("instagram") || ""),
  });
  await audit({ actorId: admin.id, action: "SETTINGS_UPDATED", entity: "Setting", entityId: "studio" });
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}

/** Regras de crédito. */
export async function saveCreditSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let admin;
  try {
    admin = await requireStaff(["ADMIN"]);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const num = (k: string, d = 0) => parseInt(String(formData.get(k) || d), 10) || d;
  await setSetting("credits", {
    creditValueCents: num("creditValueCents", 100),
    defaultValidityDays: num("defaultValidityDays", 365),
    defaultGracePeriodDays: num("defaultGracePeriodDays", 30),
    allowPartialUse: formData.get("allowPartialUse") === "1",
    suspendOnPastDue: formData.get("suspendOnPastDue") === "1",
    creditsOnCancel: String(formData.get("creditsOnCancel") || "KEEP_UNTIL_EXPIRE"),
    allowTransfer: formData.get("allowTransfer") === "1",
  });
  await audit({ actorId: admin.id, action: "SETTINGS_UPDATED", entity: "Setting", entityId: "credits" });
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}
