import { prisma } from "./prisma";

/** Registra uma ação no log de auditoria (histórico de alterações). */
export async function audit(params: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      meta: params.meta ? JSON.stringify(params.meta) : null,
    },
  });
}
