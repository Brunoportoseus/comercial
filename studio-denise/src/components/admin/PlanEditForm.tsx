"use client";

import { useFormState } from "react-dom";
import { savePlanAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export type PlanEdit = {
  id: string;
  name: string;
  tagline: string | null;
  monthlyPriceCents: number;
  creditsPerCycle: number;
  gracePeriodDays: number;
  minCommitmentMonths: number;
  creditValidityDays: number;
  maxAccumulatedCredits: number;
  discountPercent: number;
  recommended: boolean;
  active: boolean;
  isDemo: boolean;
  rulesText: string | null;
  benefits: string[];
};

export function PlanEditForm({ plan }: { plan: PlanEdit }) {
  const [state, action] = useFormState(savePlanAction, undefined);
  return (
    <form action={action} className="mt-4 space-y-4 border-t border-line pt-4">
      <input type="hidden" name="id" value={plan.id} />

      {state?.ok && <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Plano salvo.</p>}
      {state?.error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" defaultValue={plan.name} />
        <Field label="Chamada" name="tagline" defaultValue={plan.tagline ?? ""} />
        <Field label="Mensalidade (R$)" name="price" type="number" step="0.01" defaultValue={(plan.monthlyPriceCents / 100).toFixed(2)} />
        <Field label="Créditos por ciclo" name="creditsPerCycle" type="number" defaultValue={plan.creditsPerCycle} />
        <Field label="Carência (dias)" name="gracePeriodDays" type="number" defaultValue={plan.gracePeriodDays} />
        <Field label="Permanência mínima (meses)" name="minCommitmentMonths" type="number" defaultValue={plan.minCommitmentMonths} />
        <Field label="Validade dos créditos (dias)" name="creditValidityDays" type="number" defaultValue={plan.creditValidityDays} />
        <Field label="Teto de acúmulo (0 = ilimitado)" name="maxAccumulatedCredits" type="number" defaultValue={plan.maxAccumulatedCredits} />
        <Field label="Desconto adicionais (%)" name="discountPercent" type="number" defaultValue={plan.discountPercent} />
      </div>

      <div>
        <label className="label">
          Benefícios <span className="font-normal text-muted">(um por linha — aparecem com ✓ no cartão)</span>
        </label>
        <textarea
          name="benefits"
          rows={7}
          className="input font-mono text-sm"
          defaultValue={plan.benefits.join("\n")}
          placeholder={"1 procedimento incluso por ano\n6 retoques inclusos por ano\n..."}
        />
      </div>

      <div>
        <label className="label">Resumo de regras</label>
        <textarea name="rulesText" rows={2} className="input" defaultValue={plan.rulesText ?? ""} />
      </div>

      <div className="flex flex-wrap gap-5 text-sm">
        <Check label="Ativo" name="active" defaultChecked={plan.active} />
        <Check label="Recomendado" name="recommended" defaultChecked={plan.recommended} />
        <Check label="Dado de exemplo" name="isDemo" defaultChecked={plan.isDemo} />
      </div>

      <SubmitButton className="btn-primary py-2.5 text-sm">Salvar plano</SubmitButton>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} step={step} className="input" defaultValue={defaultValue} />
    </div>
  );
}

function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-text/80">
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} className="h-4 w-4" />
      {label}
    </label>
  );
}
