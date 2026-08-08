import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { PlanEditForm } from "@/components/admin/PlanEditForm";

function parseBenefits(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export default async function AdminPlanosPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Planos</h1>
        <p className="text-sm text-muted">
          Crie e ajuste preços, créditos, carências e benefícios. Nada é fixo no código.
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((p) => (
          <details key={p.id} className="card p-6">
            <summary className="flex cursor-pointer items-center justify-between">
              <div>
                <span className="font-display text-xl font-bold text-secondary">{p.name}</span>
                <span className="ml-3 text-sm text-muted">
                  {formatBRL(p.monthlyPriceCents)}/mês · {p.creditsPerCycle} créditos
                </span>
              </div>
              <div className="flex items-center gap-2">
                {p.recommended && <span className="chip bg-primary/10 text-primary">Recomendado</span>}
                <span className={`chip ${p.active ? "bg-success/10 text-success" : "bg-surface-2 text-muted"}`}>
                  {p.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            </summary>
            <PlanEditForm
              plan={{
                id: p.id,
                name: p.name,
                tagline: p.tagline,
                monthlyPriceCents: p.monthlyPriceCents,
                creditsPerCycle: p.creditsPerCycle,
                gracePeriodDays: p.gracePeriodDays,
                minCommitmentMonths: p.minCommitmentMonths,
                creditValidityDays: p.creditValidityDays,
                maxAccumulatedCredits: p.maxAccumulatedCredits,
                discountPercent: p.discountPercent,
                recommended: p.recommended,
                active: p.active,
                isDemo: p.isDemo,
                rulesText: p.rulesText,
                benefits: parseBenefits(p.benefits),
              }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}
