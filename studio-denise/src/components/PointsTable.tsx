import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, type ProcedureCategory } from "@/lib/domain";

/**
 * Tabela de resgate de pontos — lista os procedimentos ativos e quantos
 * pontos são necessários para resgatar cada um. Os valores vêm do painel
 * (Admin → Procedimentos), então a administradora ajusta quando quiser.
 */
export async function PointsTable({ title = true }: { title?: boolean }) {
  const procedures = await prisma.procedure.findMany({
    where: { active: true, creditCost: { gt: 0 } },
    orderBy: { sortOrder: "asc" },
  });

  if (procedures.length === 0) return null;

  return (
    <div>
      {title && (
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Resgate seus pontos</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-secondary sm:text-4xl">
            Tabela de resgate de pontos
          </h2>
          <p className="mt-3 text-sm text-muted">
            Acumule pontos com sua assinatura e resgate os procedimentos abaixo, sempre mediante
            avaliação profissional. Valores de exemplo, ajustáveis pelo Studio.
          </p>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <table className="w-full text-left">
          <thead className="border-b border-line bg-surface-2/50 text-sm text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Procedimento</th>
              <th className="px-5 py-3 text-right font-semibold">Pontos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {procedures.map((p) => (
              <tr key={p.id} className="transition hover:bg-surface-2/40">
                <td className="px-5 py-4">
                  <span className="font-medium text-secondary">{p.name}</span>
                  <span className="ml-2 hidden text-xs text-muted sm:inline">
                    {CATEGORY_LABELS[p.category as ProcedureCategory] ?? ""}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-display text-lg font-bold text-primary">{p.creditCost}</span>
                  <span className="ml-1 text-xs text-muted">pts</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-muted">
        Ter pontos não autoriza automaticamente um procedimento — a utilização depende de avaliação
        profissional e do intervalo adequado da pele.
      </p>
    </div>
  );
}
