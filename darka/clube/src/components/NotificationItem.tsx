import type { AppNotification, NotificationKind } from "@/types";

interface Props { notification: AppNotification; }

const iconByKind: Record<NotificationKind, { d: string; color: string }> = {
  voucher:   { d: "M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8zM13 6v12", color: "darka-red" },
  curso:     { d: "M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z", color: "darka-blue" },
  pontos:    { d: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z", color: "darka-yellow" },
  premio:    { d: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7", color: "darka-green" },
  campanha:  { d: "M3 11l7.89 5.26a2 2 0 002.22 0L21 11M5 19h14a2 2 0 002-2V7l-9-4-9 4v10a2 2 0 002 2z", color: "darka-purple" },
  aviso:     { d: "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", color: "darka-orange" },
  promo:     { d: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01", color: "darka-red" },
  inscricao: { d: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", color: "darka-green" },
};

export default function NotificationItem({ notification }: Props) {
  const ic = iconByKind[notification.kind];
  const date = new Date(notification.date).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit",
  });

  return (
    <article className={[
      "flex items-start gap-3 p-4 rounded-2xl border transition",
      notification.read
        ? "bg-surface border-black/5"
        : "bg-primary/5 border-primary/15",
    ].join(" ")}>
      <div className={`shrink-0 w-10 h-10 rounded-xl bg-${ic.color}/15 text-${ic.color} flex items-center justify-center`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={ic.d} />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-display font-bold text-sm truncate">{notification.title}</h4>
          {!notification.read && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-primary" aria-label="Não lida" />
          )}
        </div>
        <p className="text-sm text-muted mt-0.5">{notification.summary}</p>
        <p className="text-[11px] text-muted mt-1.5">{date}</p>
      </div>
    </article>
  );
}
