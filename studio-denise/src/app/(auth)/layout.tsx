import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-2/40">
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <Link href="/" className="text-sm font-medium text-muted hover:text-primary">
          ← Voltar ao site
        </Link>
      </header>
      <main className="container-page flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
