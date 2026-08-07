"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { SubmitButton } from "./SubmitButton";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState(loginAction, undefined);
  return (
    <form action={action} className="card p-8">
      <h1 className="font-display text-2xl font-bold text-secondary">Entrar</h1>
      <p className="mt-1 text-sm text-muted">Acesse sua área da cliente.</p>

      {next && <input type="hidden" name="next" value={next} />}

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
        </div>
      </div>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="mt-6">
        <SubmitButton>Entrar</SubmitButton>
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Ainda não é assinante?{" "}
        <Link href="/cadastro" className="font-semibold text-primary hover:underline">
          Criar conta
        </Link>
      </p>
      <div className="mt-4 rounded-lg bg-surface-2/70 p-3 text-center text-xs text-muted">
        Demo — cliente: <b>cliente@exemplo.com</b> / cliente123 · admin:{" "}
        <b>denise@studio.exemplo</b> / admin123
      </div>
    </form>
  );
}
