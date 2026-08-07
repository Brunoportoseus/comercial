"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const LINKS = [
  { href: "/dashboard", label: "Visão geral" },
  { href: "/dashboard/creditos", label: "Créditos" },
  { href: "/dashboard/agendamentos", label: "Agendamentos" },
  { href: "/dashboard/pagamentos", label: "Pagamentos" },
  { href: "/dashboard/perfil", label: "Meus dados" },
];

export function DashboardNav({ name }: { name: string }) {
  const pathname = usePathname();
  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page flex items-center justify-between py-3">
        <Link href="/dashboard" className="font-display text-lg font-bold text-secondary">
          Área da cliente
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:inline">Olá, {name.split(" ")[0]}</span>
          <form action={logoutAction}>
            <button className="text-sm font-medium text-muted hover:text-danger">Sair</button>
          </form>
        </div>
      </div>
      <nav className="container-page flex gap-1 overflow-x-auto pb-2">
        {LINKS.map((l) => {
          const active = l.href === "/dashboard" ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                active ? "bg-primary text-white" : "text-text/80 hover:bg-surface-2"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
