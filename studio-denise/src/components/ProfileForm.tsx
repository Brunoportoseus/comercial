"use client";

import { useFormState } from "react-dom";
import { updateProfileAction, cancelSubscriptionAction } from "@/app/actions/client";
import { SubmitButton } from "./SubmitButton";

type Props = {
  user: {
    name: string;
    email: string;
    cpf: string | null;
    phone: string | null;
    whatsapp: string | null;
    addressLine: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    acceptedMarketing: boolean;
  };
  hasActiveSubscription: boolean;
};

export function ProfileForm({ user, hasActiveSubscription }: Props) {
  const [state, action] = useFormState(updateProfileAction, undefined);
  const [cancelState, cancelAction] = useFormState(cancelSubscriptionAction, undefined);

  return (
    <div className="space-y-6">
      <form action={action} className="card p-6">
        <h2 className="font-semibold text-secondary">Meus dados</h2>

        {state?.ok && (
          <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
            Dados atualizados com sucesso.
          </p>
        )}
        {state?.error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">Nome completo</label>
            <input id="name" name="name" className="input" defaultValue={user.name} />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input bg-surface-2/60" value={user.email} disabled />
          </div>
          <div>
            <label className="label">CPF</label>
            <input className="input bg-surface-2/60" value={user.cpf ?? "—"} disabled />
          </div>
          <div>
            <label className="label" htmlFor="phone">Telefone</label>
            <input id="phone" name="phone" className="input" defaultValue={user.phone ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp</label>
            <input id="whatsapp" name="whatsapp" className="input" defaultValue={user.whatsapp ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="addressLine">Endereço</label>
            <input id="addressLine" name="addressLine" className="input" defaultValue={user.addressLine ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="city">Cidade</label>
            <input id="city" name="city" className="input" defaultValue={user.city ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="state">UF</label>
              <input id="state" name="state" className="input" maxLength={2} defaultValue={user.state ?? ""} />
            </div>
            <div>
              <label className="label" htmlFor="zip">CEP</label>
              <input id="zip" name="zip" className="input" defaultValue={user.zip ?? ""} />
            </div>
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-sm text-text/80">
          <input type="checkbox" name="acceptMarketing" value="1" defaultChecked={user.acceptedMarketing} className="h-4 w-4" />
          Autorizo receber comunicações e novidades.
        </label>

        <div className="mt-5">
          <SubmitButton className="btn-primary">Salvar alterações</SubmitButton>
        </div>
      </form>

      {hasActiveSubscription && (
        <form action={cancelAction} className="card border-danger/30 p-6">
          <h2 className="font-semibold text-danger">Cancelar assinatura</h2>
          <p className="mt-1 text-sm text-muted">
            O cancelamento respeita a permanência mínima e a política vigente do plano. Seus créditos
            seguem a regra do plano após o cancelamento.
          </p>
          {cancelState?.ok && (
            <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              Assinatura cancelada.
            </p>
          )}
          {cancelState?.error && (
            <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {cancelState.error}
            </p>
          )}
          <div className="mt-4">
            <label className="label" htmlFor="reason">Motivo (opcional)</label>
            <input id="reason" name="reason" className="input" placeholder="Nos ajude a melhorar" />
          </div>
          <div className="mt-4">
            <SubmitButton className="btn-outline border-danger/40 text-danger hover:bg-danger/5">
              Solicitar cancelamento
            </SubmitButton>
          </div>
        </form>
      )}
    </div>
  );
}
