"use client";

import { useState } from "react";
import type { Painter } from "@/types";

interface Props { painter: Painter; }

export default function ProfileForm({ painter }: Props) {
  const [saved, setSaved] = useState(false);
  const [comm, setComm] = useState(painter.communicationPreferences);

  function save(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integração — PATCH /api/painter/me
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  }

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Foto + identidade */}
      <section className="rounded-2xl bg-surface border border-black/5 p-5 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-gradient text-white flex items-center justify-center font-display font-extrabold text-2xl">
          {painter.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg">{painter.name}</h2>
          <p className="text-sm text-muted">Nível {painter.level} · {painter.points.toLocaleString("pt-BR")} pontos</p>
        </div>
        <button type="button" className="px-3 py-2 rounded-lg text-xs font-bold border border-black/10 hover:border-primary/40">
          Alterar foto
        </button>
      </section>

      <section className="rounded-2xl bg-surface border border-black/5 p-5 space-y-4">
        <h3 className="font-display font-bold">Dados pessoais</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo" defaultValue={painter.name} />
          <Field label="CPF" defaultValue={painter.cpf} readOnly />
          <Field label="WhatsApp" defaultValue={painter.whatsapp} />
          <Field label="E-mail" defaultValue={painter.email} />
          <Field label="Cidade" defaultValue={painter.city} />
          <Field label="Estado" defaultValue={painter.state} />
        </div>
      </section>

      <section className="rounded-2xl bg-surface border border-black/5 p-5 space-y-4">
        <h3 className="font-display font-bold">Atuação profissional</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Anos como pintor" defaultValue={String(painter.yearsAsPainter ?? "")} />
          <Field label="Loja preferida" defaultValue={painter.preferredStore} />
          <Field label="Especialidades" defaultValue={painter.specialties.join(", ")} />
          <Field label="Marcas utilizadas" defaultValue={painter.brandsUsed.join(", ")} />
        </div>
      </section>

      <section className="rounded-2xl bg-surface border border-black/5 p-5 space-y-3">
        <h3 className="font-display font-bold">Preferências de comunicação</h3>
        {(["whatsapp", "email", "push"] as const).map((k) => (
          <label key={k} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-2 cursor-pointer">
            <span className="font-semibold capitalize">
              {k === "push" ? "Notificações push" : k === "whatsapp" ? "WhatsApp" : "E-mail"}
            </span>
            <input type="checkbox" checked={comm[k]}
              onChange={(e) => setComm({ ...comm, [k]: e.target.checked })}
              className="w-5 h-5 accent-primary" />
          </label>
        ))}
      </section>

      <section className="rounded-2xl bg-surface border border-black/5 p-5 space-y-4">
        <h3 className="font-display font-bold">Alterar senha</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Senha atual" type="password" />
          <Field label="Nova senha" type="password" />
          <Field label="Confirmar" type="password" />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {saved && (
          <span className="text-sm text-success font-bold">✓ Dados atualizados com sucesso</span>
        )}
        <button className="ml-auto px-5 py-3 rounded-xl bg-brand-gradient text-white font-bold hover:shadow-glow">
          Salvar alterações
        </button>
      </div>
    </form>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted">{label}</span>
      <input
        {...rest}
        className={[
          "mt-1.5 w-full px-3.5 py-3 rounded-xl bg-surface border border-black/10 outline-none text-sm",
          props.readOnly
            ? "text-muted cursor-not-allowed bg-surface-2"
            : "focus:border-primary focus:ring-2 focus:ring-primary/15",
        ].join(" ")}
      />
    </label>
  );
}
