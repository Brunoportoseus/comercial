"use client";

import { useFormState } from "react-dom";
import { requestAppointmentAction } from "@/app/actions/client";
import { SubmitButton } from "./SubmitButton";

type ProcOption = { id: string; name: string; requiresEvaluation: boolean };

export function AppointmentForm({ procedures }: { procedures: ProcOption[] }) {
  const [state, action] = useFormState(requestAppointmentAction, undefined);
  return (
    <form action={action} className="card p-6">
      <h2 className="font-semibold text-secondary">Solicitar avaliação / agendamento</h2>
      <p className="mt-1 text-sm text-muted">
        Escolha o procedimento e até 3 datas de preferência. O Studio confirmará, sugerirá outro
        horário ou solicitará avaliação.
      </p>

      {state?.ok && (
        <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          Solicitação enviada! Acompanhe o status abaixo.
        </p>
      )}
      {state?.error && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="procedureId">Procedimento</label>
          <select id="procedureId" name="procedureId" className="input" required defaultValue="">
            <option value="" disabled>
              Selecione…
            </option>
            {procedures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="date1">1ª opção</label>
            <input id="date1" name="date1" type="datetime-local" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="date2">2ª opção</label>
            <input id="date2" name="date2" type="datetime-local" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="date3">3ª opção</label>
            <input id="date3" name="date3" type="datetime-local" className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="notes">Observações (opcional)</label>
          <textarea id="notes" name="notes" rows={3} className="input" placeholder="Conte o que desejar sobre sua preferência." />
        </div>
      </div>

      <div className="mt-5">
        <SubmitButton className="btn-primary">Enviar solicitação</SubmitButton>
      </div>
    </form>
  );
}
