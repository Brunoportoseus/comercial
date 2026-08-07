"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { href: "/planos", label: "Planos" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/procedimentos", label: "Procedimentos" },
  { href: "/faq", label: "Dúvidas" },
];

export function Header({ loggedIn }: { loggedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-text/80 transition hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary py-2.5 text-sm">
              Minha área
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-text hover:text-primary">
                Entrar
              </Link>
              <Link href="/planos" className="btn-primary py-2.5 text-sm">
                Quero fazer parte
              </Link>
            </>
          )}
        </div>
        <button
          className="md:hidden rounded-lg p-2 text-secondary"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-surface md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-text hover:bg-surface-2"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-3">
              {loggedIn ? (
                <Link href="/dashboard" className="btn-primary flex-1 py-2.5 text-sm">
                  Minha área
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost flex-1 py-2.5 text-sm">
                    Entrar
                  </Link>
                  <Link href="/planos" className="btn-primary flex-1 py-2.5 text-sm">
                    Assinar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
