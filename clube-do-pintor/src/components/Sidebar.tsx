"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

/* ── Ícones inline (sem dependência externa) ── */
type IconProps = { className?: string };
function svg(d: string) {
  return ({ className }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const HomeIcon  = svg("M3 11l9-8 9 8M5 10v10h14V10");
const StarIcon  = svg("M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z");
const TicketIcon = svg("M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8zM13 6v12");
const GiftIcon  = svg("M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H8a2 2 0 110-4c2 0 4 4 4 4zM12 7h4a2 2 0 100-4c-2 0-4 4-4 4z");
const BookIcon  = svg("M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14zM4 19.5A2.5 2.5 0 006.5 22H20v-5");
const ShareIcon = svg("M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13");
const BellIcon  = svg("M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3zM10 21a2 2 0 004 0");
const UserIcon  = svg("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z");
const ShopIcon  = svg("M3 9l1-5h16l1 5M3 9v11h18V9M3 9h18M9 13h6");

const items = [
  { href: "/dashboard",    label: "Início",       icon: HomeIcon },
  { href: "/pontos",       label: "Pontos",       icon: StarIcon },
  { href: "/vouchers",     label: "Vouchers",     icon: TicketIcon },
  { href: "/premios",      label: "Prêmios",      icon: GiftIcon },
  { href: "/treinamentos", label: "Treinamentos", icon: BookIcon },
  { href: "/indicacoes",   label: "Indicações",   icon: ShareIcon },
  { href: "/loja-beneficios", label: "Loja & Descontos", icon: ShopIcon },
  { href: "/notificacoes", label: "Notificações", icon: BellIcon },
  { href: "/perfil",       label: "Perfil",       icon: UserIcon },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface border-r border-black/5 sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-black/5">
        <Link href="/dashboard"><Logo size="md" /></Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                active
                  ? "bg-primary text-white shadow-soft"
                  : "text-text/80 hover:bg-surface-2",
              ].join(" ")}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-black/5">
        <Link href="/regras" className="text-xs text-muted hover:text-primary">
          Regras do clube
        </Link>
      </div>
    </aside>
  );
}
