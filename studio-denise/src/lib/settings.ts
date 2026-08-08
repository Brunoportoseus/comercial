import { prisma } from "./prisma";

/**
 * Configurações globais do clube — nada de valores fixos no código de produto.
 * Estes são apenas os PADRÕES iniciais (dados de exemplo). A administradora
 * altera tudo pelo painel (/admin/configuracoes), e os valores passam a vir
 * da tabela `Setting`.
 */
export const DEFAULT_SETTINGS = {
  studio: {
    name: "Studio Denise de Paula",
    specialist: "Denise de Paula",
    tagline: "Micropigmentação com naturalidade, segurança e cuidado.",
    city: "Curitiba",
    state: "PR",
    address: "Endereço de exemplo — Curitiba/PR (configurável no painel)",
    phone: "(41) 0000-0000",
    whatsapp: "5541000000000", // formato internacional p/ link wa.me (exemplo)
    email: "contato@studiodenisedepaula.com.br",
    instagram: "https://instagram.com/",
    // URLs de imagens (opcionais) — cole no painel admin.
    heroImageUrl: "", // foto de destaque no topo da home
    specialistPhotoUrl: "", // foto da Denise (seção "A especialista")
  },
  credits: {
    // 1 crédito equivale a R$ 1,00 por padrão (configurável).
    creditValueCents: 100,
    // Regras padrão (podem ser sobrescritas por plano).
    defaultValidityDays: 365,
    defaultGracePeriodDays: 30,
    allowPartialUse: true,
    suspendOnPastDue: true,
    // Destino dos créditos ao cancelar: KEEP_UNTIL_EXPIRE | FORFEIT
    creditsOnCancel: "KEEP_UNTIL_EXPIRE",
    allowTransfer: false,
  },
  legalVersion: "1.0",
} as const;

export type SettingsGroup = keyof typeof DEFAULT_SETTINGS;

/** Lê um grupo de configurações, mesclando os padrões com o que está no banco. */
export async function getSetting<K extends SettingsGroup>(
  group: K
): Promise<(typeof DEFAULT_SETTINGS)[K]> {
  const row = await prisma.setting.findUnique({ where: { key: group } });
  const def = DEFAULT_SETTINGS[group];
  if (!row) return def;
  try {
    const parsed = JSON.parse(row.value);
    if (def && typeof def === "object" && parsed && typeof parsed === "object") {
      return { ...(def as object), ...(parsed as object) } as (typeof DEFAULT_SETTINGS)[K];
    }
    return parsed as (typeof DEFAULT_SETTINGS)[K];
  } catch {
    return def;
  }
}

export async function setSetting(group: SettingsGroup, value: unknown, label?: string) {
  const json = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key: group },
    update: { value: json, label },
    create: { key: group, value: json, label, group },
  });
}
