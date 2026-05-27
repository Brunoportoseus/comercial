"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard",    label: "Início",      d: "M3 11l9-8 9 8M5 10v10h14V10" },
  { href: "/pontos",       label: "Pontos",      d: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" },
  { href: "/vouchers",     label: "Vouchers",    d: "M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8zM13 6v12" },
  { href: "/premios",      label: "Prêmios",     d: "M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H8a2 2 0 110-4c2 0 4 4 4 4zM12 7h4a2 2 0 100-4c-2 0-4 4-4 4z" },
  { href: "/perfil",       label: "Perfil",      d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
];

export default function MobileBottomNav() {
  const path = usePathname();
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-black/10 bg-surface/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação inferior"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, d }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={[
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition",
                  active ? "text-primary" : "text-muted",
                ].join(" ")}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
