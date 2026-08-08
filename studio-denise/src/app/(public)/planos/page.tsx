import type { Metadata } from "next";
import { getActivePlans } from "@/lib/queries";
import { PlanCard } from "@/components/PlanCard";
import { PointsTable } from "@/components/PointsTable";

export const metadata: Metadata = {
  title: "Planos",
  description: "Compare os planos do Clube Studio Denise de Paula e escolha o ideal para você.",
};

export default async function PlanosPage() {
  const plans = await getActivePlans();
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Escolha o seu</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-secondary">Planos do clube</h1>
        <p className="mt-3 text-muted">
          Compare benefícios, créditos e regras. Os valores abaixo são exemplos de demonstração e
          podem ser ajustados pelo Studio a qualquer momento.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.slug} plan={p} />
        ))}
      </div>

      {/* Tabela comparativa de regras */}
      <div className="mt-14 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-muted">
              <th className="p-3">Regras principais</th>
              {plans.map((p) => (
                <th key={p.slug} className="p-3 font-display text-lg text-secondary">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            <Row label="Mensalidade" values={plans.map((p) => `R$ ${(p.monthlyPriceCents / 100).toFixed(2)}`)} />
            <Row label="Créditos por mês" values={plans.map((p) => String(p.creditsPerCycle))} />
            <Row label="Carência" values={plans.map((p) => `${p.gracePeriodDays} dias`)} />
            <Row label="Permanência mínima" values={plans.map((p) => `${p.minCommitmentMonths} meses`)} />
            <Row label="Desconto em adicionais" values={plans.map((p) => `${p.discountPercent}%`)} />
            <Row label="Resumo de regras" values={plans.map((p) => p.rulesText || "—")} />
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Ponto não é autorização automática de procedimento. Toda utilização depende de avaliação
        profissional.
      </p>

      {/* Tabela de resgate de pontos */}
      <div className="mt-16">
        <PointsTable />
      </div>
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="p-3 font-medium text-text">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="p-3 text-text/80">
          {v}
        </td>
      ))}
    </tr>
  );
}
