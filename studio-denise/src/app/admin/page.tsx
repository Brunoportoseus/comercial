import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateTime } from "@/lib/format";

export default async function AdminDashboard() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    activeSubs,
    newSubs,
    canceledSubs,
    pastDue,
    activeSubList,
    creditsEmitted,
    creditsUsed,
    pendingAppointments,
    recentAudit,
    revenueThisMonth,
  ] = await Promise.all([
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: startOfMonth } } }),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }),
    prisma.subscription.findMany({ where: { status: "ACTIVE" }, include: { plan: true } }),
    prisma.creditTransaction.aggregate({ where: { type: "EARN" }, _sum: { amount: true } }),
    prisma.creditTransaction.aggregate({ where: { type: "SPEND" }, _sum: { amount: true } }),
    prisma.appointment.count({ where: { status: { in: ["REQUESTED", "EVALUATION_REQUIRED"] } } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.payment.aggregate({
      where: { status: "APPROVED", paidAt: { gte: startOfMonth } },
      _sum: { amountCents: true },
    }),
  ]);

  const mrr = activeSubList.reduce((s, sub) => s + sub.plan.monthlyPriceCents, 0);
  const revenueByPlan = new Map<string, { name: string; count: number; cents: number }>();
  for (const sub of activeSubList) {
    const cur = revenueByPlan.get(sub.plan.id) ?? { name: sub.plan.name, count: 0, cents: 0 };
    cur.count += 1;
    cur.cents += sub.plan.monthlyPriceCents;
    revenueByPlan.set(sub.plan.id, cur);
  }
  const ticket = activeSubs > 0 ? Math.round(mrr / activeSubs) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Painel</h1>
        <p className="text-sm text-muted">Indicadores do clube (dados de demonstração).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Assinantes ativos" value={String(activeSubs)} />
        <Kpi label="Receita recorrente (MRR)" value={formatBRL(mrr)} accent />
        <Kpi label="Ticket médio" value={formatBRL(ticket)} />
        <Kpi label="Novas assinaturas (mês)" value={String(newSubs)} />
        <Kpi label="Cancelamentos (mês)" value={String(canceledSubs)} tone={canceledSubs > 0 ? "warning" : undefined} />
        <Kpi label="Inadimplentes" value={String(pastDue)} tone={pastDue > 0 ? "warning" : undefined} />
        <Kpi label="Créditos emitidos" value={String(creditsEmitted._sum.amount ?? 0)} />
        <Kpi label="Créditos utilizados" value={String(Math.abs(creditsUsed._sum.amount ?? 0))} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-secondary">Receita por plano (assinantes ativos)</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="pb-2">Plano</th>
                <th className="pb-2 text-right">Assinantes</th>
                <th className="pb-2 text-right">Receita/mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...revenueByPlan.values()].length === 0 && (
                <tr><td colSpan={3} className="py-4 text-muted">Sem assinaturas ativas.</td></tr>
              )}
              {[...revenueByPlan.values()].map((r) => (
                <tr key={r.name}>
                  <td className="py-2 text-text">{r.name}</td>
                  <td className="py-2 text-right">{r.count}</td>
                  <td className="py-2 text-right font-medium">{formatBRL(r.cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted">
            Recebido este mês (pagamentos aprovados): <b>{formatBRL(revenueThisMonth._sum.amountCents ?? 0)}</b>
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-secondary">A resolver</h2>
          <div className="mt-4 space-y-3 text-sm">
            <Link href="/admin/agendamentos" className="flex items-center justify-between rounded-lg bg-surface-2/70 px-4 py-3 hover:bg-surface-2">
              <span>Solicitações de agenda</span>
              <span className="chip bg-primary/10 text-primary">{pendingAppointments}</span>
            </Link>
            <Link href="/admin/clientes" className="flex items-center justify-between rounded-lg bg-surface-2/70 px-4 py-3 hover:bg-surface-2">
              <span>Inadimplentes</span>
              <span className="chip bg-warning/10 text-warning">{pastDue}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-secondary">Histórico de alterações (auditoria)</h2>
        <ul className="mt-4 divide-y divide-line text-sm">
          {recentAudit.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-2.5">
              <span className="text-text/85">
                <span className="font-medium">{a.action}</span> · {a.entity}
              </span>
              <span className="text-xs text-muted">{formatDateTime(a.createdAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "warning";
}) {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${accent ? "text-primary" : tone === "warning" ? "text-warning" : "text-secondary"}`}>
        {value}
      </p>
    </div>
  );
}
