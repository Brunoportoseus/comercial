import Link from "next/link";
import { formatBRL } from "@/lib/format";

export type PlanView = {
  slug: string;
  name: string;
  tagline: string | null;
  monthlyPriceCents: number;
  creditsPerCycle: number;
  recommended: boolean;
  isDemo: boolean;
  minCommitmentMonths: number;
  gracePeriodDays: number;
  discountPercent: number;
  benefits: string[];
  rulesText: string | null;
};

export function PlanCard({ plan, compact = false }: { plan: PlanView; compact?: boolean }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-surface p-6 shadow-card transition ${
        plan.recommended ? "border-primary ring-2 ring-primary/30" : "border-line"
      }`}
    >
      {plan.recommended && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Mais escolhido
        </span>
      )}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl font-bold text-secondary">{plan.name}</h3>
        {plan.isDemo && <span className="demo-badge">Exemplo</span>}
      </div>
      {plan.tagline && <p className="mt-1 text-sm text-muted">{plan.tagline}</p>}

      <div className="mt-5 flex items-end gap-1">
        <span className="font-display text-4xl font-bold text-primary">
          {formatBRL(plan.monthlyPriceCents)}
        </span>
        <span className="mb-1 text-sm text-muted">/mês</span>
      </div>
      <p className="mt-1 text-sm font-medium text-text">
        {plan.creditsPerCycle} créditos por mês
      </p>

      {!compact && (
        <ul className="mt-5 space-y-2.5 text-sm">
          {plan.benefits.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 text-primary" aria-hidden>
                ✓
              </span>
              <span className="text-text/90">{b}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-xs text-muted">
        <div>
          <p className="font-semibold text-text">{plan.gracePeriodDays}d</p>
          <p>carência</p>
        </div>
        <div>
          <p className="font-semibold text-text">{plan.minCommitmentMonths}m</p>
          <p>permanência</p>
        </div>
        <div>
          <p className="font-semibold text-text">{plan.discountPercent}%</p>
          <p>desconto</p>
        </div>
      </div>

      <Link href={`/checkout?plano=${plan.slug}`} className="btn-primary mt-6 w-full">
        Quero fazer parte
      </Link>
    </div>
  );
}
