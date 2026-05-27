"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockReferrals } from "@/data/mock";

const KINDS = ["Cliente", "Obra", "Produto"] as const;

export default function IndicacoesPage() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integração — POST /api/referrals (CRM + sistema de pontos)
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  }

  return (
    <DashboardLayout
      title="Indicações"
      subtitle="Indique clientes, obras ou produtos e ganhe pontos quando a indicação for convertida."
    >
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Formulário */}
        <form onSubmit={submit} className="rounded-3xl bg-surface border border-black/5 p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">Nova indicação</h3>

          <div className="grid sm:grid-cols-3 gap-3">
            {KINDS.map((k) => (
              <label key={k} className="cursor-pointer">
                <input type="radio" name="kind" className="peer sr-only" defaultChecked={k === "Cliente"} />
                <div className="px-4 py-3 rounded-xl border border-black/10 text-sm font-bold text-center peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition">
                  {k}
                </div>
              </label>
            ))}
          </div>

          <Field label="Nome do indicado" required />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Telefone" required placeholder="(00) 00000-0000" />
            <Field label="Cidade" required />
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Observações</span>
            <textarea rows={4}
              className="mt-1.5 w-full px-3.5 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm" />
          </label>

          <button className="w-full px-4 py-3 rounded-xl bg-brand-gradient text-white font-bold hover:shadow-glow transition">
            Enviar indicação
          </button>

          {sent && (
            <div className="rounded-xl bg-success/10 text-success p-3 text-sm font-semibold text-center">
              ✓ Indicação enviada com sucesso. Você poderá acompanhar o status no seu painel.
            </div>
          )}
        </form>

        {/* Lista de status */}
        <aside className="rounded-3xl bg-surface border border-black/5 p-6">
          <h3 className="font-display font-bold mb-3">Suas indicações</h3>
          <div className="space-y-3">
            {mockReferrals.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-black/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{r.kind}</div>
                    <h4 className="font-display font-bold text-sm leading-tight">{r.name}</h4>
                    <p className="text-xs text-muted mt-1">{r.city} · {r.phone}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.notes && <p className="text-xs text-muted mt-2 italic">{r.notes}</p>}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="mt-8 rounded-2xl bg-secondary text-white p-6 lg:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-xl">Compartilhe seu link de indicação</h3>
          <p className="text-white/70 text-sm mt-1">Cada novo cadastro pelo seu link gera pontos para você.</p>
        </div>
        <a
          // TODO: integração — gerar link único do CRM e abrir em WhatsApp
          href="https://wa.me/?text=Conhe%C3%A7a%20o%20Clube%20do%20Pintor%20Darka"
          className="px-5 py-3 rounded-xl bg-accent text-secondary font-extrabold hover:brightness-110"
        >
          Compartilhar no WhatsApp
        </a>
      </section>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Recebida": "bg-darka-blue/15 text-darka-blue",
    "Em análise": "bg-warning/15 text-warning",
    "Convertida": "bg-success/15 text-success",
    "Pontos liberados": "bg-accent/20 text-secondary",
    "Não convertida": "bg-danger/15 text-danger",
  };
  return (
    <span className={`shrink-0 text-[10px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-full ${map[status] || "bg-black/5 text-muted"}`}>
      {status}
    </span>
  );
}

function Field(props: { label: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted">
        {props.label}{props.required && <span className="text-primary"> *</span>}
      </span>
      <input
        required={props.required}
        placeholder={props.placeholder}
        className="mt-1.5 w-full px-3.5 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
      />
    </label>
  );
}
