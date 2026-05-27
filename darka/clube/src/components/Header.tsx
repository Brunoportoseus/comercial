"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navItems = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#beneficios", label: "Benefícios" },
  { href: "/#treinamentos", label: "Treinamentos" },
  { href: "/#premios", label: "Prêmios" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div className="spectrum-strip" />
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-3 flex items-center gap-6">
        <Link href="/" aria-label="Início Clube do Pintor Darka">
          {/* Header em tamanho "lg" — ~30% maior que o md padrão */}
          <Logo size="lg" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="px-3 py-2 text-sm font-medium text-text/80 rounded-lg hover:text-darka-brand-green hover:bg-darka-brand-green/8 transition"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-text rounded-lg hover:bg-surface-2 transition"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-brand-gradient hover:shadow-glow transition"
          >
            Cadastre-se
          </Link>
        </div>

        <button
          className="md:hidden ml-auto p-2 rounded-lg hover:bg-surface-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-surface px-4 py-3 space-y-1">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-surface-2"
            >
              {it.label}
            </Link>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/login" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-lg border border-black/10">
              Entrar
            </Link>
            <Link href="/cadastro" className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-brand-gradient">
              Cadastre-se
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
