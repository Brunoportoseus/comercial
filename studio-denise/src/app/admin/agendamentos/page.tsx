import { prisma } from "@/lib/prisma";
import { formatCredits, formatDateTime } from "@/lib/format";
import { AppointmentManageForm } from "@/components/admin/AppointmentManageForm";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/lib/domain";

export default async function AdminAgendamentosPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { procedure: true, user: true },
  });

  const pending = appointments.filter((a) =>
    ["REQUESTED", "EVALUATION_REQUIRED", "APPROVED", "RESCHEDULE_SUGGESTED"].includes(a.status)
  );
  const done = appointments.filter((a) => !pending.includes(a));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-secondary">Agendamentos</h1>
        <p className="text-sm text-muted">
          Aprove, sugira horário, solicite avaliação ou registre a realização/falta.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-semibold text-secondary">Pendentes ({pending.length})</h2>
        <div className="space-y-4">
          {pending.length === 0 && <p className="text-sm text-muted">Nada pendente. 🎉</p>}
          {pending.map((a) => (
            <AppointmentCard key={a.id} a={a} />
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold text-secondary">Concluídos / arquivados</h2>
          <div className="space-y-4">
            {done.map((a) => (
              <AppointmentCard key={a.id} a={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function AppointmentCard({ a }: { a: any }) {
  let dates: string[] = [];
  try {
    dates = JSON.parse(a.preferredDates);
  } catch {}
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-secondary">{a.procedure.name}</p>
          <p className="text-sm text-muted">
            {a.user.name} · {a.user.email}
          </p>
          <p className="mt-1 text-xs text-muted">
            Preferências: {dates.map((d) => formatDateTime(d)).join(" · ") || "—"}
          </p>
          {a.clientNotes && <p className="mt-1 text-xs text-text/70">Obs.: {a.clientNotes}</p>}
          {a.procedure.creditCost > 0 && (
            <p className="mt-1 text-xs text-primary">
              Custo: {formatCredits(a.procedure.creditCost)} (debitado ao marcar como realizado)
            </p>
          )}
        </div>
        <span className="chip bg-primary/10 text-primary">
          {APPOINTMENT_STATUS_LABELS[a.status as AppointmentStatus]}
        </span>
      </div>
      <AppointmentManageForm id={a.id} status={a.status} adminNotes={a.adminNotes} />
    </div>
  );
}
