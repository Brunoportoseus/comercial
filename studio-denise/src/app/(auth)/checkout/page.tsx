import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatBRL } from "@/lib/format";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Contratar plano" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { plano?: string };
}) {
  const slug = searchParams.plano;
  if (!slug) redirect("/planos");

  const plan = await prisma.plan.findUnique({ where: { slug } });
  if (!plan || !plan.active) redirect("/planos");

  const user = await getCurrentUser();
  if (!user) redirect(`/cadastro?next=${encodeURIComponent(`/checkout?plano=${slug}`)}`);

  // Já possui assinatura ativa?
  const active = await prisma.subscription.findFirst({
    where: { userId: user!.id, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
    include: { plan: true },
  });
  if (active) {
    return (
      <div className="card p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-secondary">Você já é assinante</h1>
        <p className="mt-2 text-sm text-muted">
          Seu plano atual é <b>{active.plan.name}</b>. Para trocar de plano, acesse sua área.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6">
          Ir para minha área
        </Link>
      </div>
    );
  }

  const simulation = !process.env.MP_ACCESS_TOKEN?.trim();

  return (
    <div className="card p-8">
      <p className="eyebrow">Contratação</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-secondary">
        Confirmar assinatura
      </h1>

      <div className="mt-6 rounded-xl bg-surface-2/70 p-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold text-secondary">{plan.name}</span>
          {plan.isDemo && <span className="demo-badge">Valores de exemplo</span>}
        </div>
        <div className="mt-2 flex items-end gap-1">
          <span className="font-display text-3xl font-bold text-primary">
            {formatBRL(plan.monthlyPriceCents)}
          </span>
          <span className="mb-1 text-sm text-muted">/mês</span>
        </div>
        <ul className="mt-3 space-y-1 text-sm text-text/80">
          <li>• {plan.creditsPerCycle} créditos liberados a cada cobrança</li>
          <li>• Carência de {plan.gracePeriodDays} dias · permanência mínima {plan.minCommitmentMonths} meses</li>
          <li>• {plan.discountPercent}% de desconto em procedimentos adicionais</li>
        </ul>
      </div>

      <p className="mt-4 text-sm text-muted">
        Assinando como <b>{user!.name}</b> ({user!.email}).
      </p>

      <div className="mt-6">
        <CheckoutForm planSlug={plan.slug} simulation={simulation} />
      </div>
    </div>
  );
}
