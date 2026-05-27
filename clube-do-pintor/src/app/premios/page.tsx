"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RewardCard from "@/components/RewardCard";
import { mockPainter, mockRewards } from "@/data/mock";
import type { RewardCategory } from "@/types";

const CATEGORIES: ("Todos" | RewardCategory)[] = [
  "Todos", "Brindes", "Ferramentas", "Uniformes",
  "Treinamentos", "Vouchers", "Experiências", "Kits",
];

export default function PremiosPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Todos");

  const list = useMemo(
    () => (active === "Todos" ? mockRewards : mockRewards.filter((r) => r.category === active)),
    [active]
  );

  return (
    <DashboardLayout
      title="Loja de prêmios"
      subtitle="Troque seus pontos por brindes, ferramentas e experiências exclusivas Darka."
      rightSlot={
        <div className="rounded-xl bg-secondary text-white px-4 py-2.5 text-sm font-bold">
          Seu saldo: <span className="text-accent">{mockPainter.points.toLocaleString("pt-BR")}</span> pts
        </div>
      }
    >
      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={[
              "shrink-0 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition",
              active === c
                ? "bg-primary text-white border-primary"
                : "bg-surface border-black/10 text-text/70 hover:border-primary/40",
            ].join(" ")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {list.map((r) => (
          <RewardCard key={r.id} reward={r} userPoints={mockPainter.points} />
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-10 text-center text-muted">Nenhum prêmio nesta categoria.</div>
      )}
    </DashboardLayout>
  );
}
