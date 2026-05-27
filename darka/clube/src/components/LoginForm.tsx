"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: integração — POST /api/auth/login (CRM ou Identity Provider)
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="E-mail, CPF ou WhatsApp" type="text" name="identifier" placeholder="seu@email.com" required />
      <Field label="Senha" type="password" name="password" placeholder="Sua senha" required />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" className="rounded border-black/20" defaultChecked />
          Manter conectado
        </label>
        <Link href="#" className="font-bold text-primary hover:underline">Esqueci minha senha</Link>
      </div>

      <button
        disabled={loading}
        className="w-full px-4 py-3 rounded-xl bg-brand-gradient text-white font-bold hover:shadow-glow transition disabled:opacity-70"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {/* Futura integração: login por WhatsApp */}
      <button type="button" disabled
        className="w-full px-4 py-3 rounded-xl bg-surface-2 text-muted font-bold cursor-not-allowed">
        Entrar com WhatsApp (em breve)
      </button>

      <p className="text-center text-sm text-muted">
        Ainda não tenho cadastro?{" "}
        <Link href="/cadastro" className="font-bold text-primary hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
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
        className="mt-1.5 w-full px-3.5 py-3 rounded-xl bg-surface border border-black/10 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm"
      />
    </label>
  );
}
