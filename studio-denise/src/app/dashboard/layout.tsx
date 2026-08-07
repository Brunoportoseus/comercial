import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardNav } from "@/components/DashboardNav";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSetting } from "@/lib/settings";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  const studio = await getSetting("studio");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav name={user.name} />
      <main className="container-page py-8">{children}</main>
      <WhatsAppButton phone={studio.whatsapp} message={`Olá! Sou assinante (${user.email}).`} />
    </div>
  );
}
