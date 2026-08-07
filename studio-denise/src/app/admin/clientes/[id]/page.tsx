import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/credits";
import { formatBRL, formatDate, formatDateTime } from "@/lib/format";
import { CreditAdjustForm } from "@/components/admin/CreditAdjustForm";
import { ToggleUserButton } from "@/components/admin/ToggleUserButton";
import { SUBSCRIPTION_STATUS_LABELS, type SubscriptionStatus } from "@/lib/domain";

export default async function ClienteDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      subscriptions: { orderBy: { createdAt: "desc" }, include: { plan: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 10 },
      creditTransactions: { orderBy: { createdAt: "desc" }, take: 15 },
      appointments: { orderBy: { createdAt: "desc" }, include: { procedure: true }, take: 10 },
    },
  });
  if (!user) notFound();

  const balance = await getBalance(user.id);
  const sub = user.subscriptions[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary">{user.name}</h1>
          <p className="text-sm text-muted">
            {user.email} · {user.phone ?? "sem telefone"} · {user.city ?? "—"}/{user.state ?? "—"}
          </p>
          {!user.active && <span className="chip mt-2 bg-danger/10 text-danger">Acesso bloqueado</span>}
        </div>
        <ToggleUserButton userId={user.id} active={user.active} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <p className="text-xs uppercase tracking-wide text-muted">Saldo de créditos</p>
          <p className="mt-1 font-display text-3xl font-bold text-primary">{balance}</p>
        </div>
        <div className="card p-6 lg:col-span-2">
          <p className="font-semibold text-secondary">Assinatura</p>
          {sub ? (
            <div className="mt-2 text-sm text-text/85">
              <p>Plano: <b>{sub.plan.name}</b> ({formatBRL(sub.plan.monthlyPriceCents)}/mês)</p>
              <p>Situação: {SUBSCRIPTION_STATUS_LABELS[sub.status as SubscriptionStatus]}</p>
              <p>Próxima cobrança: {formatDate(sub.nextBillingAt)}</p>
              <p className="text-xs text-muted">Gateway: {sub.gateway} · ID {sub.gatewaySubscriptionId ?? "—"}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">Sem assinatura.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold text-secondary">Ajustar créditos</p>
          <p className="mb-4 mt-1 text-xs text-muted">
            Todo ajuste exige justificativa e fica registrado na auditoria.
          </p>
          <CreditAdjustForm userId={user.id} />
        </div>

        <div className="card p-6">
          <p className="font-semibold text-secondary">Histórico de créditos</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {user.creditTransactions.length === 0 && <li className="py-2 text-muted">Sem lançamentos.</li>}
            {user.creditTransactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2">
                <span className="text-text/85">{t.reason}</span>
                <span className={t.amount >= 0 ? "font-semibold text-success" : "font-semibold text-danger"}>
                  {t.amount >= 0 ? "+" : ""}{t.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold text-secondary">Pagamentos</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {user.payments.length === 0 && <li className="py-2 text-muted">Sem pagamentos.</li>}
            {user.payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span className="text-muted">{formatDateTime(p.paidAt ?? p.createdAt)}</span>
                <span>{formatBRL(p.amountCents)} · {p.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <p className="font-semibold text-secondary">Agendamentos</p>
          <ul className="mt-3 divide-y divide-line text-sm">
            {user.appointments.length === 0 && <li className="py-2 text-muted">Sem solicitações.</li>}
            {user.appointments.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2">
                <span className="text-text/85">{a.procedure.name}</span>
                <span className="text-xs text-muted">{a.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
