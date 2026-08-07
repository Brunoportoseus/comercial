import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_STATUS_LABELS, type SubscriptionStatus } from "@/lib/domain";

export default async function AdminClientesPage() {
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: { orderBy: { createdAt: "desc" }, take: 1, include: { plan: true } },
      creditTransactions: { select: { amount: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Clientes</h1>
        <p className="text-sm text-muted">{clients.length} cliente(s) cadastrado(s).</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line text-left text-muted">
            <tr>
              <th className="p-4">Cliente</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Situação</th>
              <th className="p-4 text-right">Saldo</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.map((c) => {
              const sub = c.subscriptions[0];
              const balance = c.creditTransactions.reduce((s, t) => s + t.amount, 0);
              return (
                <tr key={c.id} className={!c.active ? "opacity-60" : ""}>
                  <td className="p-4">
                    <p className="font-medium text-secondary">{c.name}</p>
                    <p className="text-xs text-muted">{c.email}</p>
                  </td>
                  <td className="p-4 text-text/85">{sub?.plan.name ?? "—"}</td>
                  <td className="p-4">
                    {sub ? (
                      <span className="chip bg-primary/10 text-primary">
                        {SUBSCRIPTION_STATUS_LABELS[sub.status as SubscriptionStatus]}
                      </span>
                    ) : (
                      <span className="text-muted">sem plano</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-medium">{balance}</td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/clientes/${c.id}`} className="text-primary hover:underline">
                      Detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
