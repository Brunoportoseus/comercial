"use client";

import { useFormState } from "react-dom";
import { subscribeAction } from "@/app/actions/checkout";
import { SubmitButton } from "./SubmitButton";

export function CheckoutForm({ planSlug, simulation }: { planSlug: string; simulation: boolean }) {
  const [state, action] = useFormState(subscribeAction, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="plano" value={planSlug} />

      <fieldset className="space-y-3">
        <legend className="label">Forma de pagamento</legend>
        <label className="flex items-center gap-3 rounded-xl border border-primary bg-primary/5 px-4 py-3">
          <input type="radio" name="method" value="CREDIT_CARD" defaultChecked className="h-4 w-4" />
          <span className="text-sm font-medium text-text">Cartão de crédito (cobrança recorrente)</span>
        </label>
        <label className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
          <input type="radio" name="method" value="PIX" className="h-4 w-4" />
          <span className="text-sm font-medium text-text">Pix (quando compatível com recorrência)</span>
        </label>
      </fieldset>

      {state?.error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="mt-6">
        <SubmitButton>Concluir assinatura e pagar</SubmitButton>
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        {simulation
          ? "Modo demonstração: o pagamento é aprovado automaticamente, sem cobrança real."
          : "Você será direcionada ao ambiente seguro do Mercado Pago para concluir o pagamento."}
      </p>
    </form>
  );
}
