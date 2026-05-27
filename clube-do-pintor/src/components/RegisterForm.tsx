"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SPECIALTIES = [
  "Pintura residencial",
  "Pintura comercial",
  "Pintura predial",
  "Pintura decorativa",
  "Texturas e efeitos",
  "Outros",
];

const STEPS = ["Dados pessoais", "Dados profissionais", "Comunicação", "Confirmação"] as const;

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({
    specialties: [] as string[],
    comm: { whatsapp: true, email: true, push: true },
  });

  function update(k: string, v: any) { setForm((f) => ({ ...f, [k]: v })); }

  function toggleSpecialty(s: string) {
    setForm((f) => {
      const arr: string[] = f.specialties || [];
      return { ...f, specialties: arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s] };
    });
  }

  function next() { setStep((s) => Math.min(STEPS.length - 1, s + 1)); }
  function back() { setStep((s) => Math.max(0, s - 1)); }

  function submit() {
    // TODO: integração — POST /api/painters (CRM + sistema de pontos)
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2200);
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center text-3xl">✓</div>
        <h2 className="font-display font-extrabold text-2xl mt-4">Cadastro realizado com sucesso!</h2>
        <p className="text-muted mt-2 max-w-md mx-auto">
          Bem-vindo ao Clube do Pintor Darka. Estamos preparando seu acesso...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Stepper */}
      <ol className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <li key={label} className="flex-1 flex items-center gap-2">
            <div className={[
              "shrink-0 w-7 h-7 rounded-full font-display text-xs font-extrabold flex items-center justify-center transition",
              i <= step ? "bg-primary text-white" : "bg-surface-2 text-muted",
            ].join(" ")}>{i + 1}</div>
            <span className={[
              "text-[11px] font-bold uppercase tracking-widest hidden sm:inline",
              i === step ? "text-primary" : "text-muted",
            ].join(" ")}>{label}</span>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-surface-2 mx-1">
                <div className={[
                  "h-full transition-all",
                  i < step ? "bg-primary" : "",
                ].join(" ")} style={{ width: i < step ? "100%" : "0%" }} />
              </div>
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome completo" required onChange={(v) => update("name", v)} />
          <Field label="CPF" required placeholder="000.000.000-00" onChange={(v) => update("cpf", v)} />
          <Field label="WhatsApp" required placeholder="(00) 00000-0000" onChange={(v) => update("whatsapp", v)} />
          <Field label="E-mail" type="email" required onChange={(v) => update("email", v)} />
          <Field label="Data de nascimento" type="date" onChange={(v) => update("birth", v)} />
          <Field label="CEP" placeholder="00000-000" onChange={(v) => update("zip", v)} />
          <Field label="Cidade" required onChange={(v) => update("city", v)} />
          <Field label="Estado" required onChange={(v) => update("state", v)} />
          <Field label="Senha" type="password" required onChange={(v) => update("password", v)} />
          <Field label="Confirmar senha" type="password" required onChange={(v) => update("passwordConfirm", v)} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <Field label="Há quanto tempo trabalha como pintor (anos)" type="number" onChange={(v) => update("years", v)} />
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Áreas de atuação</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => {
                const active = (form.specialties as string[]).includes(s);
                return (
                  <button type="button" key={s} onClick={() => toggleSpecialty(s)}
                    className={[
                      "px-3.5 py-2 rounded-full text-xs font-bold border transition",
                      active
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-black/10 text-text/80 hover:border-primary/40",
                    ].join(" ")}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <Field label="Marcas de tinta que costuma usar" onChange={(v) => update("brands", v)} />
          <Field label="Loja onde costuma comprar" onChange={(v) => update("store", v)} />
          <Field label="Frequência de compra de tintas" placeholder="Ex.: semanal, quinzenal..." onChange={(v) => update("freq", v)} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <p className="text-sm text-muted">Como prefere receber comunicações do clube?</p>
          {(["whatsapp", "email", "push"] as const).map((k) => (
            <label key={k} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-black/10 cursor-pointer">
              <span className="font-semibold capitalize">
                {k === "push" ? "Notificações push (app)" : k === "whatsapp" ? "WhatsApp" : "E-mail"}
              </span>
              <input
                type="checkbox"
                defaultChecked
                onChange={(e) => setForm((f) => ({ ...f, comm: { ...f.comm, [k]: e.target.checked } }))}
                className="w-5 h-5 accent-primary"
              />
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface border border-black/10 p-5">
            <h3 className="font-display font-bold">Quase lá, {form.name?.split(" ")[0] || "pintor"}!</h3>
            <p className="text-sm text-muted mt-1">Confirme abaixo para finalizar seu cadastro.</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Summary k="Nome" v={form.name} />
              <Summary k="CPF" v={form.cpf} />
              <Summary k="WhatsApp" v={form.whatsapp} />
              <Summary k="E-mail" v={form.email} />
              <Summary k="Cidade/UF" v={[form.city, form.state].filter(Boolean).join(" / ")} />
              <Summary k="Atuação" v={(form.specialties as string[]).join(", ")} />
            </dl>
          </div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input type="checkbox" required className="mt-1 w-4 h-4 accent-primary" />
            <span>
              Li e aceito os{" "}
              <Link href="/regras" className="text-primary font-bold hover:underline">Termos de uso</Link> e a{" "}
              <Link href="/regras" className="text-primary font-bold hover:underline">Política de privacidade</Link>.
            </span>
          </label>
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={back} className="px-4 py-2.5 rounded-xl border border-black/10 text-sm font-bold">
            Voltar
          </button>
        ) : <span />}

        {step < STEPS.length - 1 ? (
          <button onClick={next} className="px-5 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold hover:shadow-glow">
            Continuar
          </button>
        ) : (
          <button onClick={submit} className="px-5 py-2.5 rounded-xl bg-brand-gradient text-white text-sm font-bold hover:shadow-glow">
            Finalizar cadastro
          </button>
        )}
      </div>
    </div>
  );
}

function Field(props: { label: string; type?: string; placeholder?: string; required?: boolean; onChange?: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-muted">
        {props.label}{props.required && <span className="text-primary"> *</span>}
      </span>
      <input
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        required={props.required}
        onChange={(e) => props.onChange?.(e.target.value)}
        className="mt-1.5 w-full px-3.5 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
      />
    </label>
  );
}

function Summary({ k, v }: { k: string; v?: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted">{k}</dt>
      <dd className="font-semibold text-text">{v || "—"}</dd>
    </div>
  );
}
