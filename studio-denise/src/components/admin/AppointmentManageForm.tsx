"use client";

import { useFormState } from "react-dom";
import { updateAppointmentAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { APPOINTMENT_STATUS, APPOINTMENT_STATUS_LABELS } from "@/lib/domain";

export function AppointmentManageForm({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: string;
  adminNotes: string | null;
}) {
  const [state, action] = useFormState(updateAppointmentAction, undefined);
  return (
    <form action={action} className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="label text-xs">Status</label>
        <select name="status" className="input py-2 text-sm" defaultValue={status}>
          {APPOINTMENT_STATUS.map((s) => (
            <option key={s} value={s}>{APPOINTMENT_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label text-xs">Data confirmada</label>
        <input name="scheduledAt" type="datetime-local" className="input py-2 text-sm" />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-xs">Mensagem para a cliente</label>
        <input name="adminNotes" className="input py-2 text-sm" defaultValue={adminNotes ?? ""} />
      </div>
      {state?.error && <p className="text-sm text-danger sm:col-span-4">{state.error}</p>}
      {state?.ok && <p className="text-sm text-success sm:col-span-4">Atualizado.</p>}
      <div className="sm:col-span-4">
        <SubmitButton className="btn-primary py-2 text-sm">Atualizar</SubmitButton>
      </div>
    </form>
  );
}
