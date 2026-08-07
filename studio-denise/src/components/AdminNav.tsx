"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

const LINKS = [
  { href: "/admin", label: "Painel", icon: "▤" },
  { href: "/admin/clientes", label: "Clientes", icon: "☺" },
  { href: "/admin/planos", label: "Planos", icon: "✦" },
  { href: "/admin/procedimentos", label: "Procedimentos", icon: "✎" },
  { href: "/admin/agendamentos", label: "Agendamentos", icon: "◷" },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: "₵" },
  { href: "/admin/configuracoes", label: "Configurações", icon: "⚙" },
];

export function AdminNav({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex w-full flex-col border-b border-line bg-secondary text-white/90 md:h-screen md:w-64 md:border-b-0 md:border-r md:border-white/10">
      <div className="p-5">
        <p className="font-display text-lg font-bold text-white">Studio Denise</p>
        <p className="text-xs text-white/50">Painel administrativo</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10"
              }`}
            >
              <span aria-hidden>{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 p-4 text-sm md:block">
        <p className="text-white/90">{name}</p>
        <p className="text-xs text-white/50">{role}</p>
        <div className="mt-3 flex gap-3">
          <Link href="/" className="text-xs text-white/60 hover:text-white">
            Ver site
          </Link>
          <form action={logoutAction}>
            <button className="text-xs text-white/60 hover:text-white">Sair</button>
          </form>
        </div>
      </div>
    </aside>
  );
}
