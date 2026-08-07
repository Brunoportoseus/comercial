import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBalance } from "@/lib/credits";
import { formatCredits, formatDate, formatDateTime } from "@/lib/format";

const TYPE_LABELS: Record<string, string> = {
  EARN: "Crédito",
  SPEND: "Utilização",
  EXPIRE: "Expiração",
  ADJUST: "Ajuste",
  REFUND: "Estorno",
};

export default async function CreditosPage() {
  const user = (await getCurrentUser())!;
  const [balance, txs] = await Promise.all([
    getBalance(user.id),
    prisma.creditTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary">Carteira de créditos</h1>
          <p className="text-sm text-muted">Histórico completo de créditos e utilizações.</p>
        </div>
        <div className="card px-5 py-3 text-right">
          <p className="text-xs text-muted">Saldo atual</p>
          <p className="font-display text-2xl font-bold text-primary">{formatCredits(balance)}</p>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-line text-left text-muted">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Validade</th>
              <th className="p-4 text-right">Créditos</th>
              <th className="p-4 text-right">Saldo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {txs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  Nenhuma movimentação ainda.
                </td>
              </tr>
            )}
            {txs.map((t) => (
              <tr key={t.id}>
                <td className="p-4 text-muted">{formatDateTime(t.createdAt)}</td>
                <td className="p-4">{TYPE_LABELS[t.type] ?? t.type}</td>
                <td className="p-4 text-text/85">{t.reason}</td>
                <td className="p-4 text-muted">{t.expiresAt ? formatDate(t.expiresAt) : "—"}</td>
                <td className={`p-4 text-right font-semibold ${t.amount >= 0 ? "text-success" : "text-danger"}`}>
                  {t.amount >= 0 ? "+" : ""}
                  {t.amount}
                </td>
                <td className="p-4 text-right font-medium text-text">{t.balanceAfter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted">
        Lembrete: ter créditos não autoriza automaticamente um procedimento. A utilização depende de
        avaliação profissional.
      </p>
    </div>
  );
}
