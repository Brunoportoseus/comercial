import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBalance, getExpiringCredits } from "@/lib/credits";
import { getSetting } from "@/lib/settings";
import { formatBRL, formatCredits, formatDate, formatDateTime } from "@/lib/format";
import {
  SUBSCRIPTION_STATUS_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type SubscriptionStatus,
  type AppointmentStatus,
} from "@/lib/domain";

export default async function DashboardHome({
  searchParams,
}: {
  searchParams: { assinatura?: string };
}) {
  const user = (await getCurrentUser())!;
  const [subscription, balance, expiring, credits, txs, appointments, settings] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    }),
    getBalance(user.id),
    getExpiringCredits(user.id, 30),
    Promise.resolve(null),
    prisma.creditTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { procedure: true },
    }),
    getSetting("credits"),
  ]);

  const benefits: string[] = subscription?.plan?.benefits
    ? (() => {
        try {
          return JSON.parse(subscription.plan.benefits);
        } catch {
          return [];
        }
      })()
    : [];

  const noPlan = !subscription || subscription.status === "CANCELED";

  return (
    <div className="space-y-6">
      {searchParams.assinatura === "ok" && (
        <div className="rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          🎉 Assinatura confirmada! Seus créditos já estão disponíveis na sua carteira.
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold text-secondary">
          Olá, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted">Aqui está o resumo da sua conta no clube.</p>
      </div>

      {noPlan ? (
        <div className="card p-8 text-center">
          <p className="font-display text-xl font-bold text-secondary">
            Você ainda não tem um plano ativo
          </p>
          <p className="mt-2 text-sm text-muted">
            Escolha um plano para começar a acumular créditos e benefícios.
          </p>
          <Link href="/planos" className="btn-primary mt-6">
            Ver planos
          </Link>
        </div>
      ) : (
        <>
          {/* Cartões de status */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Plano atual" value={subscription!.plan.name} sub={subscription!.plan.isDemo ? "valores de exemplo" : undefined} />
            <StatCard
              label="Situação"
              value={SUBSCRIPTION_STATUS_LABELS[subscription!.status as SubscriptionStatus]}
              tone={subscription!.status === "ACTIVE" ? "success" : "warning"}
            />
            <StatCard label="Saldo de créditos" value={formatCredits(balance)} accent />
            <StatCard label="Próxima cobrança" value={formatDate(subscription!.nextBillingAt)} />
          </div>

          {/* Créditos a vencer */}
          {expiring > 0 && (
            <div className="rounded-xl bg-warning/10 px-4 py-3 text-sm text-warning">
              Atenção: <b>{formatCredits(expiring)}</b> vencem nos próximos 30 dias. Fale com o
              Studio para planejar o uso, sempre com avaliação profissional.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Benefícios */}
            <div className="card p-6 lg:col-span-2">
              <h2 className="font-semibold text-secondary">Benefícios do seu plano</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {benefits.map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text/85">
                    <span className="text-primary">✓</span> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/dashboard/agendamentos" className="btn-primary py-2.5 text-sm">
                  Solicitar avaliação / agendamento
                </Link>
                <Link href="/dashboard/creditos" className="btn-outline py-2.5 text-sm">
                  Ver extrato de créditos
                </Link>
              </div>
            </div>

            {/* Ações rápidas */}
            <div className="card p-6">
              <h2 className="font-semibold text-secondary">Ações rápidas</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Link href="/dashboard/perfil" className="block rounded-lg bg-surface-2/70 px-4 py-3 hover:bg-surface-2">
                  Atualizar meus dados
                </Link>
                <Link href="/planos" className="block rounded-lg bg-surface-2/70 px-4 py-3 hover:bg-surface-2">
                  Trocar de plano
                </Link>
                <Link href="/dashboard/pagamentos" className="block rounded-lg bg-surface-2/70 px-4 py-3 hover:bg-surface-2">
                  Histórico de pagamentos
                </Link>
              </div>
            </div>
          </div>

          {/* Movimentações recentes */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-secondary">Créditos recentes</h2>
                <Link href="/dashboard/creditos" className="text-sm text-primary hover:underline">
                  ver tudo
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-line text-sm">
                {txs.length === 0 && <li className="py-3 text-muted">Sem movimentações ainda.</li>}
                {txs.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3">
                    <span className="text-text/85">{t.reason}</span>
                    <span className={t.amount >= 0 ? "font-semibold text-success" : "font-semibold text-danger"}>
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-secondary">Meus agendamentos</h2>
                <Link href="/dashboard/agendamentos" className="text-sm text-primary hover:underline">
                  ver tudo
                </Link>
              </div>
              <ul className="mt-4 divide-y divide-line text-sm">
                {appointments.length === 0 && (
                  <li className="py-3 text-muted">Nenhuma solicitação ainda.</li>
                )}
                {appointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-text/85">{a.procedure.name}</p>
                      <p className="text-xs text-muted">{formatDateTime(a.createdAt)}</p>
                    </div>
                    <span className="chip bg-primary/10 text-primary">
                      {APPOINTMENT_STATUS_LABELS[a.status as AppointmentStatus]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  tone?: "success" | "warning";
}) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`mt-1 font-display text-xl font-bold ${
          accent ? "text-primary" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-secondary"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-muted">{sub}</p>}
    </div>
  );
}
