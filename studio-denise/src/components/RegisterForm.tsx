"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { SubmitButton } from "./SubmitButton";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useFormState(registerAction, undefined);
  return (
    <form action={action} className="card p-8">
      <h1 className="font-display text-2xl font-bold text-secondary">Criar conta</h1>
      <p className="mt-1 text-sm text-muted">
        Rápido e sem informações clínicas. A ficha de avaliação é feita depois, em etapa protegida.
      </p>

      {next && <input type="hidden" name="next" value={next} />}

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">Nome completo</label>
          <input id="name" name="name" className="input" required autoComplete="name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className="input" required autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" className="input" required minLength={6} autoComplete="new-password" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="cpf">CPF</label>
            <input id="cpf" name="cpf" className="input" inputMode="numeric" placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="label" htmlFor="birthDate">Data de nascimento</label>
            <input id="birthDate" name="birthDate" type="date" className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="phone">Telefone</label>
            <input id="phone" name="phone" className="input" inputMode="tel" />
          </div>
          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" className="input" inputMode="tel" />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-text/80">
          <input type="checkbox" name="acceptTerms" value="1" className="mt-1 h-4 w-4" required />
          <span>
            Li e aceito os{" "}
            <Link href="/legal/termos" className="text-primary underline" target="_blank">termos de uso</Link>,{" "}
            o{" "}
            <Link href="/legal/regulamento" className="text-primary underline" target="_blank">regulamento</Link>{" "}
            e a{" "}
            <Link href="/legal/privacidade" className="text-primary underline" target="_blank">política de privacidade</Link> (LGPD).
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-text/80">
          <input type="checkbox" name="acceptMarketing" value="1" className="mt-1 h-4 w-4" />
          <span>Autorizo receber comunicações e novidades (opcional).</span>
        </label>
      </div>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="mt-6">
        <SubmitButton>Criar minha conta</SubmitButton>
      </div>

      <p className="mt-5 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
