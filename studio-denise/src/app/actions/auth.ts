"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import { getSetting } from "@/lib/settings";
import { audit } from "@/lib/audit";
import type { Role } from "@/lib/domain";

export type ActionState = { error?: string; ok?: boolean } | undefined;

const registerSchema = z.object({
  name: z.string().min(3, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  birthDate: z.string().optional(),
  acceptTerms: z.string().optional(),
  acceptMarketing: z.string().optional(),
});

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }
  const data = parsed.data;

  if (!data.acceptTerms) {
    return { error: "É necessário aceitar os termos e o regulamento para continuar." };
  }

  const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (exists) {
    return { error: "Já existe uma conta com este e-mail. Faça login." };
  }

  const legal = await getSetting("legalVersion");
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      role: "CLIENT",
      cpf: data.cpf || null,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      acceptedMarketing: !!data.acceptMarketing,
      termsAcceptedAt: new Date(),
      termsVersion: String(legal),
    },
  });

  await audit({ actorId: user.id, action: "USER_REGISTERED", entity: "User", entityId: user.id });
  await createSession({ sub: user.id, role: user.role as Role, name: user.name });

  const next = String(formData.get("next") || "/dashboard");
  redirect(next);
}

const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }

  await createSession({ sub: user.id, role: user.role as Role, name: user.name });

  const next = String(formData.get("next") || "");
  const isStaff = user.role !== "CLIENT";
  redirect(next || (isStaff ? "/admin" : "/dashboard"));
}

export async function logoutAction() {
  destroySession();
  redirect("/");
}
