import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSession } from "@/lib/auth";
import { getSetting } from "@/lib/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const studio = await getSetting("studio");
  return (
    <div className="flex min-h-screen flex-col">
      <Header loggedIn={!!session} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phone={studio.whatsapp} />
    </div>
  );
}
