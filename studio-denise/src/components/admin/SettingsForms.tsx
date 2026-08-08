"use client";

import { useFormState } from "react-dom";
import { saveStudioSettingsAction, saveCreditSettingsAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

type Studio = {
  name: string; specialist: string; tagline: string; city: string; state: string;
  address: string; phone: string; whatsapp: string; email: string; instagram: string;
  heroImageUrl?: string; specialistPhotoUrl?: string;
};
type Credits = {
  creditValueCents: number; defaultValidityDays: number; defaultGracePeriodDays: number;
  allowPartialUse: boolean; suspendOnPastDue: boolean; creditsOnCancel: string; allowTransfer: boolean;
};

export function StudioSettingsForm({ studio }: { studio: Studio }) {
  const [state, action] = useFormState(saveStudioSettingsAction, undefined);
  return (
    <form action={action} className="card p-6">
      <h2 className="font-semibold text-secondary">Dados do Studio</h2>
      {state?.ok && <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Salvo.</p>}
      {state?.error && <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <F label="Nome" name="name" v={studio.name} />
        <F label="Especialista" name="specialist" v={studio.specialist} />
        <F label="Chamada" name="tagline" v={studio.tagline} full />
        <F label="Cidade" name="city" v={studio.city} />
        <F label="UF" name="state" v={studio.state} />
        <F label="Endereço" name="address" v={studio.address} full />
        <F label="Telefone" name="phone" v={studio.phone} />
        <F label="WhatsApp (só números, com DDI)" name="whatsapp" v={studio.whatsapp} />
        <F label="E-mail" name="email" v={studio.email} />
        <F label="Instagram (URL)" name="instagram" v={studio.instagram} />
        <F label="Foto da Denise (URL)" name="specialistPhotoUrl" v={studio.specialistPhotoUrl ?? ""} full />
        <F label="Foto de destaque do topo (URL)" name="heroImageUrl" v={studio.heroImageUrl ?? ""} full />
      </div>
      <div className="mt-5">
        <SubmitButton className="btn-primary py-2.5 text-sm">Salvar dados do Studio</SubmitButton>
      </div>
    </form>
  );
}

export function CreditSettingsForm({ credits }: { credits: Credits }) {
  const [state, action] = useFormState(saveCreditSettingsAction, undefined);
  return (
    <form action={action} className="card p-6">
      <h2 className="font-semibold text-secondary">Regras de crédito (padrões)</h2>
      <p className="mt-1 text-xs text-muted">Aplicam-se quando o plano não define regra específica.</p>
      {state?.ok && <p className="mt-3 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">Salvo.</p>}
      {state?.error && <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <F label="Valor do crédito (centavos) — 100 = R$1" name="creditValueCents" v={String(credits.creditValueCents)} type="number" />
        <F label="Validade padrão (dias)" name="defaultValidityDays" v={String(credits.defaultValidityDays)} type="number" />
        <F label="Carência padrão (dias)" name="defaultGracePeriodDays" v={String(credits.defaultGracePeriodDays)} type="number" />
        <div>
          <label className="label">Destino dos créditos ao cancelar</label>
          <select name="creditsOnCancel" className="input" defaultValue={credits.creditsOnCancel}>
            <option value="KEEP_UNTIL_EXPIRE">Manter até vencer</option>
            <option value="FORFEIT">Perder ao cancelar</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-5 text-sm">
        <Chk label="Permitir uso parcial" name="allowPartialUse" c={credits.allowPartialUse} />
        <Chk label="Suspender créditos na inadimplência" name="suspendOnPastDue" c={credits.suspendOnPastDue} />
        <Chk label="Permitir transferência" name="allowTransfer" c={credits.allowTransfer} />
      </div>
      <div className="mt-5">
        <SubmitButton className="btn-primary py-2.5 text-sm">Salvar regras de crédito</SubmitButton>
      </div>
    </form>
  );
}

function F({ label, name, v, type = "text", full }: { label: string; name: string; v: string; type?: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="input" defaultValue={v} />
    </div>
  );
}
function Chk({ label, name, c }: { label: string; name: string; c: boolean }) {
  return (
    <label className="flex items-center gap-2 text-text/80">
      <input type="checkbox" name={name} value="1" defaultChecked={c} className="h-4 w-4" />
      {label}
    </label>
  );
}
