import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateTime } from "@/lib/format";

export default async function AdminPagamentosPage() {
  const [payments, totals] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: true, subscription: { include: { plan: true } } },
    }),
    prisma.payment.aggregate({ where: { status: "APPROVED" }, _sum: { amountCents: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-secondary">Pagamentos</h1>
          <p className="text-sm text-muted">Transações do gateway (demonstração).</p>
        </div>
        <div className="card px-5 py-3 text-right">
          <p className="text-xs text-muted">Total recebido</p>
          <p className="font-display text-xl font-bold text-primary">
            {formatBRL(totals._sum.amountCents ?? 0)}
          </p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line text-left text-muted">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Gateway</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {payments.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted">Sem pagamentos.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="p-4 text-muted">{formatDateTime(p.paidAt ?? p.createdAt)}</td>
                <td className="p-4 text-text/85">{p.user.name}</td>
                <td className="p-4">{p.subscription?.plan.name ?? "—"}</td>
                <td className="p-4 text-muted">{p.gateway}</td>
                <td className="p-4">{p.status}</td>
                <td className="p-4 text-right font-semibold">{formatBRL(p.amountCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
