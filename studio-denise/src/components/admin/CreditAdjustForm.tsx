"use client";

import { useFormState } from "react-dom";
import { adjustCreditsAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export function CreditAdjustForm({ userId }: { userId: string }) {
  const [state, action] = useFormState(adjustCreditsAction, undefined);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      {state?.ok && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Ajuste lançado.</p>}
      {state?.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      <div>
        <label className="label" htmlFor="amount">Créditos (use negativo para debitar)</label>
        <input id="amount" name="amount" type="number" className="input" placeholder="ex.: 50 ou -30" required />
      </div>
      <div>
        <label className="label" htmlFor="reason">Justificativa (obrigatória)</label>
        <input id="reason" name="reason" className="input" required />
      </div>
      <SubmitButton className="btn-primary py-2.5 text-sm">Lançar ajuste</SubmitButton>
    </form>
  );
}
