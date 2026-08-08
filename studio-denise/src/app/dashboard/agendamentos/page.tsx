import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { AppointmentForm } from "@/components/AppointmentForm";
import { APPOINTMENT_STATUS_LABELS, type AppointmentStatus } from "@/lib/domain";

export default async function AgendamentosPage() {
  const user = (await getCurrentUser())!;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE"] } },
    include: { plan: true },
  });

  const [appointments, activeProcedures] = await Promise.all([
    prisma.appointment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { procedure: true },
    }),
    prisma.procedure.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  // Resgate por pontos: todos os procedimentos ativos ficam disponíveis.
  const eligible = subscription
    ? activeProcedures.map((p) => ({ id: p.id, name: p.name, requiresEvaluation: p.requiresEvaluation }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-secondary">Agendamentos</h1>
        <p className="text-sm text-muted">Solicite e acompanhe seus procedimentos.</p>
      </div>

      {!subscription ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-muted">
            É necessário ter uma assinatura ativa para solicitar agendamentos.
          </p>
          <Link href="/planos" className="btn-primary mt-4">
            Ver planos
          </Link>
        </div>
      ) : (
        <AppointmentForm procedures={eligible} />
      )}

      <div className="card p-6">
        <h2 className="font-semibold text-secondary">Minhas solicitações</h2>
        <ul className="mt-4 divide-y divide-line">
          {appointments.length === 0 && (
            <li className="py-4 text-sm text-muted">Você ainda não fez solicitações.</li>
          )}
          {appointments.map((a) => {
            let dates: string[] = [];
            try {
              dates = JSON.parse(a.preferredDates);
            } catch {}
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium text-secondary">{a.procedure.name}</p>
                  <p className="text-xs text-muted">
                    Preferências:{" "}
                    {dates.map((d) => formatDateTime(d)).join(" · ") || "—"}
                  </p>
                  {a.adminNotes && (
                    <p className="mt-1 text-xs text-primary">Studio: {a.adminNotes}</p>
                  )}
                </div>
                <span className="chip bg-primary/10 text-primary">
                  {APPOINTMENT_STATUS_LABELS[a.status as AppointmentStatus]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
