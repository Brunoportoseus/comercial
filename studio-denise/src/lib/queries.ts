import { prisma } from "./prisma";
import type { PlanView } from "@/components/PlanCard";

function parseBenefits(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export async function getActivePlans(): Promise<PlanView[]> {
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return plans.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    monthlyPriceCents: p.monthlyPriceCents,
    creditsPerCycle: p.creditsPerCycle,
    recommended: p.recommended,
    isDemo: p.isDemo,
    minCommitmentMonths: p.minCommitmentMonths,
    gracePeriodDays: p.gracePeriodDays,
    discountPercent: p.discountPercent,
    benefits: parseBenefits(p.benefits),
    rulesText: p.rulesText,
  }));
}

export async function getActiveProcedures() {
  return prisma.procedure.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
}
