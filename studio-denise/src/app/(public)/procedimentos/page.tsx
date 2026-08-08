import type { Metadata } from "next";
import { getActiveProcedures } from "@/lib/queries";
import { formatBRL, formatCredits } from "@/lib/format";
import {
  CATEGORY_LABELS,
  PAYMENT_MODE_LABELS,
  type ProcedureCategory,
  type ProcedurePaymentMode,
} from "@/lib/domain";

export const metadata: Metadata = {
  title: "Procedimentos",
  description:
    "Micropigmentação de sobrancelhas, lábios e olhos, correção, design e serviços complementares.",
};

export default async function ProcedimentosPage() {
  const procedures = await getActiveProcedures();
  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">O que participa do clube</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-secondary">Procedimentos</h1>
        <p className="mt-3 text-muted">
          Cada procedimento indica se pode ser pago integralmente com créditos, parcialmente
          (coparticipação) ou somente com desconto do plano. Valores de exemplo.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {procedures.map((p) => (
          <div key={p.id} className="card flex flex-col overflow-hidden p-0">
            {p.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.name} className="h-44 w-full object-cover" />
            )}
            <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="chip bg-primary/10 text-primary">
                {CATEGORY_LABELS[p.category as ProcedureCategory] ?? p.category}
              </span>
              {p.isDemo && <span className="demo-badge">Exemplo</span>}
            </div>
            <h3 className="mt-3 font-semibold text-secondary">{p.name}</h3>
            <p className="mt-1 flex-1 text-sm text-muted">{p.description}</p>

            <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
              {p.creditCost > 0 && (
                <p className="text-text">
                  <span className="font-semibold text-primary">{formatCredits(p.creditCost)}</span>{" "}
                  para utilizar
                </p>
              )}
              <p className="text-xs text-muted">Referência avulsa: {formatBRL(p.priceCents)}</p>
              <p className="mt-2 text-xs font-medium text-secondary">
                {PAYMENT_MODE_LABELS[p.paymentMode as ProcedurePaymentMode]}
              </p>
              {p.requiresEvaluation && (
                <p className="mt-1 text-xs text-warning">Depende de avaliação profissional</p>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
