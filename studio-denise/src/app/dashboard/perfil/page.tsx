import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { ProfileForm } from "@/components/ProfileForm";

export default async function PerfilPage() {
  const user = (await getCurrentUser())!;
  const activeSub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PAST_DUE", "PAUSED"] } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-secondary">Meus dados</h1>
        <p className="text-sm text-muted">Mantenha suas informações atualizadas.</p>
      </div>

      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          phone: user.phone,
          whatsapp: user.whatsapp,
          addressLine: user.addressLine,
          city: user.city,
          state: user.state,
          zip: user.zip,
          acceptedMarketing: user.acceptedMarketing,
        }}
        hasActiveSubscription={!!activeSub}
      />

      <div className="card p-6 text-sm text-muted">
        <p className="font-semibold text-secondary">Consentimentos (LGPD)</p>
        <p className="mt-2">
          Termos aceitos na versão <b>{user.termsVersion ?? "—"}</b> em{" "}
          <b>{formatDate(user.termsAcceptedAt)}</b>. Consulte a{" "}
          <Link href="/legal/privacidade" className="text-primary underline">
            política de privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
