"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TrainingCard from "@/components/TrainingCard";
import { mockTrainings } from "@/data/mock";
import type { TrainingFormat } from "@/types";

const FORMATS: ("Todos" | TrainingFormat)[] = [
  "Todos", "Presencial", "Online ao vivo", "Gravado", "Workshop", "Demonstração", "Curso técnico",
];

export default function TreinamentosPage() {
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("Todos");
  const [month, setMonth] = useState<string>("Todos");

  const months = useMemo(() => {
    const set = new Set(
      mockTrainings.map((t) =>
        new Date(t.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      )
    );
    return ["Todos", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return mockTrainings.filter((t) => {
      const okFormat = format === "Todos" || t.format === format;
      const m = new Date(t.date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const okMonth = month === "Todos" || m === month;
      return okFormat && okMonth;
    });
  }, [format, month]);

  return (
    <DashboardLayout
      title="Agenda de treinamentos"
      subtitle="Inscreva-se e ganhe pontos enquanto evolui na profissão."
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as any)}
          className="px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-sm font-semibold"
        >
          {FORMATS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-surface border border-black/10 text-sm font-semibold capitalize"
        >
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((t) => <TrainingCard key={t.id} training={t} />)}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-center text-muted">Nenhum curso encontrado com os filtros selecionados.</div>
      )}
    </DashboardLayout>
  );
}
