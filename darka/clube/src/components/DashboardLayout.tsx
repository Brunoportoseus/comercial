import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import Link from "next/link";
import Logo from "./Logo";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

// Layout reutilizável para áreas autenticadas (sidebar desktop +
// menu inferior mobile + topbar com saudação opcional).
export default function DashboardLayout({ children, title, subtitle, rightSlot }: Props) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-20 bg-surface/90 backdrop-blur border-b border-black/5">
          <div className="spectrum-strip" />
          <div className="px-4 py-3 flex items-center justify-between">
            <Link href="/dashboard"><Logo size="sm" showTagline={false} /></Link>
            <Link href="/notificacoes" aria-label="Notificações" className="relative p-2 rounded-lg hover:bg-surface-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 21a2 2 0 004 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-10 max-w-6xl w-full mx-auto">
          {(title || rightSlot) && (
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                {title && (
                  <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-text leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
              </div>
              {rightSlot}
            </div>
          )}
          {children}
        </main>

        <MobileBottomNav />
      </div>
    </div>
  );
}
