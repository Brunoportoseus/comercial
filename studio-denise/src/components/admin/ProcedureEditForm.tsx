"use client";

import { useFormState } from "react-dom";
import { saveProcedureAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { PROCEDURE_CATEGORY, PROCEDURE_PAYMENT_MODE, CATEGORY_LABELS, PAYMENT_MODE_LABELS } from "@/lib/domain";

export type ProcedureEdit = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  paymentMode: string;
  creditCost: number;
  priceCents: number;
  requiresEvaluation: boolean;
  active: boolean;
  isDemo: boolean;
};

export function ProcedureEditForm({ procedure }: { procedure: ProcedureEdit }) {
  const [state, action] = useFormState(saveProcedureAction, undefined);
  return (
    <form action={action} className="mt-4 space-y-4 border-t border-line pt-4">
      <input type="hidden" name="id" value={procedure.id} />

      {state?.ok && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Procedimento salvo.</p>}
      {state?.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Nome</label>
          <input id="name" name="name" className="input" defaultValue={procedure.name} />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Descrição</label>
          <textarea id="description" name="description" rows={2} className="input" defaultValue={procedure.description ?? ""} />
        </div>
        <div>
          <label className="label" htmlFor="category">Categoria</label>
          <select id="category" name="category" className="input" defaultValue={procedure.category}>
            {PROCEDURE_CATEGORY.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="paymentMode">Forma de pagamento</label>
          <select id="paymentMode" name="paymentMode" className="input" defaultValue={procedure.paymentMode}>
            {PROCEDURE_PAYMENT_MODE.map((m) => (
              <option key={m} value={m}>{PAYMENT_MODE_LABELS[m]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="creditCost">Custo em créditos</label>
          <input id="creditCost" name="creditCost" type="number" className="input" defaultValue={procedure.creditCost} />
        </div>
        <div>
          <label className="label" htmlFor="price">Preço avulso (R$)</label>
          <input id="price" name="price" type="number" step="0.01" className="input" defaultValue={(procedure.priceCents / 100).toFixed(2)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 text-sm">
        <label className="flex items-center gap-2 text-text/80">
          <input type="checkbox" name="requiresEvaluation" value="1" defaultChecked={procedure.requiresEvaluation} className="h-4 w-4" />
          Exige avaliação
        </label>
        <label className="flex items-center gap-2 text-text/80">
          <input type="checkbox" name="active" value="1" defaultChecked={procedure.active} className="h-4 w-4" />
          Ativo
        </label>
        <label className="flex items-center gap-2 text-text/80">
          <input type="checkbox" name="isDemo" value="1" defaultChecked={procedure.isDemo} className="h-4 w-4" />
          Dado de exemplo
        </label>
      </div>

      <SubmitButton className="btn-primary py-2.5 text-sm">Salvar procedimento</SubmitButton>
    </form>
  );
}
