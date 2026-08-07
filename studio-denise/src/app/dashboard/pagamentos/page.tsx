import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatBRL, formatDateTime } from "@/lib/format";

const STATUS: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Aprovado", cls: "bg-success/10 text-success" },
  PENDING: { label: "Pendente", cls: "bg-warning/10 text-warning" },
  REFUSED: { label: "Recusado", cls: "bg-danger/10 text-danger" },
  REFUNDED: { label: "Estornado", cls: "bg-surface-2 text-muted" },
};

export default async function PagamentosPage() {
  const user = (await getCurrentUser())!;
  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { subscription: { include: { plan: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-secondary">Pagamentos</h1>
        <p className="text-sm text-muted">Histórico de cobranças e comprovantes.</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-line text-left text-muted">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Método</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted">
                  Nenhum pagamento registrado.
                </td>
              </tr>
            )}
            {payments.map((p) => {
              const st = STATUS[p.status] ?? { label: p.status, cls: "bg-surface-2 text-muted" };
              return (
                <tr key={p.id}>
                  <td className="p-4 text-muted">{formatDateTime(p.paidAt ?? p.createdAt)}</td>
                  <td className="p-4 text-text/85">{p.subscription?.plan.name ?? "—"}</td>
                  <td className="p-4">{p.method === "PIX" ? "Pix" : "Cartão"}</td>
                  <td className="p-4">
                    <span className={`chip ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="p-4 text-right font-semibold text-text">{formatBRL(p.amountCents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
