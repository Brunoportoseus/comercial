import DashboardLayout from "@/components/DashboardLayout";
import NotificationItem from "@/components/NotificationItem";
import { mockNotifications } from "@/data/mock";

export default function NotificacoesPage() {
  const unread = mockNotifications.filter((n) => !n.read).length;
  return (
    <DashboardLayout
      title="Notificações"
      subtitle={`${unread} ${unread === 1 ? "nova notificação" : "novas notificações"}`}
      rightSlot={
        <button className="px-3.5 py-2 rounded-xl text-sm font-bold border border-black/10 hover:border-primary/40">
          Marcar todas como lidas
        </button>
      }
    >
      {mockNotifications.length === 0 ? (
        <div className="rounded-3xl bg-surface border border-dashed border-black/15 py-16 text-center">
          <div className="text-4xl">🔔</div>
          <h3 className="font-display font-bold text-lg mt-3">Você está em dia!</h3>
          <p className="text-muted text-sm mt-1">Nenhuma notificação no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockNotifications.map((n) => <NotificationItem key={n.id} notification={n} />)}
        </div>
      )}

      <p className="text-xs text-muted mt-6 text-center">
        {/* TODO: integração — Push Notifications via Web Push API / Firebase Cloud Messaging */}
        Ative as notificações push no seu navegador para receber novidades em tempo real.
      </p>
    </DashboardLayout>
  );
}
