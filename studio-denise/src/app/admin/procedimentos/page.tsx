import { prisma } from "@/lib/prisma";
import { formatCredits } from "@/lib/format";
import { ProcedureEditForm } from "@/components/admin/ProcedureEditForm";
import { CATEGORY_LABELS, type ProcedureCategory } from "@/lib/domain";

export default async function AdminProcedimentosPage() {
  const procedures = await prisma.procedure.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Procedimentos</h1>
        <p className="text-sm text-muted">
          Defina categorias, custo em créditos e como cada procedimento pode ser pago.
        </p>
      </div>

      <div className="space-y-4">
        {procedures.map((p) => (
          <details key={p.id} className="card p-6">
            <summary className="flex cursor-pointer items-center justify-between">
              <div>
                <span className="font-semibold text-secondary">{p.name}</span>
                <span className="ml-3 text-sm text-muted">
                  {CATEGORY_LABELS[p.category as ProcedureCategory]} ·{" "}
                  {p.creditCost > 0 ? formatCredits(p.creditCost) : "sem custo em créditos"}
                </span>
              </div>
              <span className={`chip ${p.active ? "bg-success/10 text-success" : "bg-surface-2 text-muted"}`}>
                {p.active ? "Ativo" : "Inativo"}
              </span>
            </summary>
            <ProcedureEditForm
              procedure={{
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.category,
                paymentMode: p.paymentMode,
                creditCost: p.creditCost,
                priceCents: p.priceCents,
                requiresEvaluation: p.requiresEvaluation,
                active: p.active,
                isDemo: p.isDemo,
                imageUrl: p.imageUrl,
              }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}
