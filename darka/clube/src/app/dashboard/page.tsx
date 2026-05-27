import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import PointsCard from "@/components/PointsCard";
import VoucherCard from "@/components/VoucherCard";
import TrainingCard from "@/components/TrainingCard";
import NotificationItem from "@/components/NotificationItem";
import {
  mockPainter,
  mockVouchers,
  mockTrainings,
  mockNotifications,
  mockRewards,
} from "@/data/mock";

export default function DashboardPage() {
  const firstName = mockPainter.name.split(" ")[0];
  const nextTraining = mockTrainings[0];
  const featuredRewards = mockRewards.filter((r) => r.status === "disponivel").slice(0, 3);

  return (
    <DashboardLayout
      title={`Olá, ${firstName}.`}
      subtitle="Bem-vindo ao seu Clube do Pintor Darka."
      rightSlot={
        <Link
          href="/notificacoes"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/10 text-sm font-bold hover:border-primary/40"
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          {mockNotifications.filter((n) => !n.read).length} novas
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <PointsCard painter={mockPainter} />

        <div className="rounded-3xl bg-surface border border-black/5 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">Próximo treinamento</h3>
            <Link href="/treinamentos" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          {nextTraining ? (
            <TrainingCard training={nextTraining} compact />
          ) : (
            <EmptyState text="Nenhum curso agendado." />
          )}

          <div className="mt-5 pt-5 border-t border-black/5">
            <h3 className="font-display font-bold mb-3">Notificações recentes</h3>
            <div className="space-y-2">
              {mockNotifications.slice(0, 3).map((n) => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat color="darka-red"              label="Vouchers ativos" value={mockVouchers.length.toString()} href="/vouchers" />
        <Stat color="darka-brand-green"      label="Prêmios disponíveis" value={mockRewards.filter(r => r.status === "disponivel").length.toString()} href="/premios" />
        <Stat color="darka-blue"             label="Cursos abertos" value={mockTrainings.length.toString()} href="/treinamentos" />
        <Stat color="darka-brand-green-soft" label="Indicações" value="3" href="/indicacoes" />
      </div>

      {/* Vouchers em destaque */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Vouchers para você</h2>
          <Link href="/vouchers" className="text-sm font-bold text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockVouchers.slice(0, 3).map((v) => <VoucherCard key={v.id} voucher={v} />)}
        </div>
      </section>

      {/* Prêmios em destaque */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl">Prêmios em destaque</h2>
          <Link href="/premios" className="text-sm font-bold text-primary hover:underline">Ver todos</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredRewards.map((r) => (
            // Reutilizamos RewardCard via link rápido — para manter dashboard leve, mostramos card simplificado:
            <Link key={r.id} href="/premios" className="rounded-2xl bg-surface border border-black/5 p-4 flex items-center gap-4 hover:shadow-soft transition">
              <div className="w-14 h-14 rounded-xl bg-brand-gradient" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{r.category}</div>
                <h4 className="font-display font-bold text-sm leading-tight truncate">{r.name}</h4>
                <div className="text-xs text-primary font-bold mt-0.5">{r.pointsCost.toLocaleString("pt-BR")} pts</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

function Stat({ color, label, value, href }: { color: string; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl bg-surface border border-black/5 p-4 hover:shadow-soft transition">
      <div className={`w-9 h-1 rounded-full bg-${color}`} />
      <div className="font-display text-2xl font-extrabold mt-3">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-sm text-muted py-6 text-center bg-surface-2 rounded-xl">{text}</div>
  );
}
