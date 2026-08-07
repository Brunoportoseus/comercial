import Link from "next/link";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const LEGAL = [
  { href: "/legal/termos", label: "Termos de uso" },
  { href: "/legal/regulamento", label: "Regulamento do clube" },
  { href: "/legal/privacidade", label: "Política de privacidade" },
  { href: "/legal/cancelamento", label: "Política de cancelamento" },
  { href: "/legal/agendamento", label: "Agendamento e faltas" },
  { href: "/legal/lgpd", label: "Consentimento LGPD" },
];

export function Footer() {
  const s = DEFAULT_SETTINGS.studio;
  return (
    <footer className="mt-20 border-t border-line bg-secondary text-white/85">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-bold text-white">{s.name}</p>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Clube de assinatura de micropigmentação e beleza em {s.city}/{s.state}. Naturalidade,
            segurança e cuidado, com avaliação profissional em cada etapa.
          </p>
          <p className="mt-4 text-sm text-white/70">{s.address}</p>
          <p className="mt-1 text-sm text-white/70">
            {s.phone} · {s.email}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Navegar</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/planos" className="hover:text-white">Planos</Link></li>
            <li><Link href="/como-funciona" className="hover:text-white">Como funciona</Link></li>
            <li><Link href="/procedimentos" className="hover:text-white">Procedimentos</Link></li>
            <li><Link href="/faq" className="hover:text-white">Dúvidas frequentes</Link></li>
            <li><Link href="/login" className="hover:text-white">Área da cliente</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.name}. Todos os direitos reservados.</p>
          <p>
            Os procedimentos dependem de avaliação profissional. Protótipo com dados de
            demonstração.
          </p>
        </div>
      </div>
    </footer>
  );
}
