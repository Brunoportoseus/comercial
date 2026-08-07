import { prisma } from "./prisma";

/**
 * Notificações. Na v1 gravamos a notificação in-app. Os canais de e-mail e
 * WhatsApp ficam preparados como pontos de integração (TODO) respeitando o
 * consentimento da cliente.
 */
export async function notify(params: {
  userId: string;
  type?: string;
  title: string;
  body?: string;
}) {
  const notification = await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type ?? "INFO",
      title: params.title,
      body: params.body,
    },
  });

  // TODO(integração): despachar e-mail transacional (ex.: Resend/SMTP).
  // TODO(integração): despachar WhatsApp (WABA) se a cliente consentiu.
  return notification;
}
