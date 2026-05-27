"use client";

import { useState } from "react";
import type { Voucher } from "@/types";

interface Props { voucher: Voucher; }

export default function VoucherCard({ voucher }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    // TODO: integração — registrar evento de uso de voucher no backend
    navigator.clipboard?.writeText(voucher.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const expires = new Date(voucher.expiresAt).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-surface border border-black/5 hover:shadow-soft transition">
      <div className={`h-2 bg-${voucher.highlightColor ?? "darka-red"}`} />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Voucher</div>
            <h3 className="font-display text-lg font-bold mt-0.5">{voucher.title}</h3>
          </div>
          <span className="shrink-0 px-3 py-1.5 rounded-full text-xs font-extrabold text-white bg-brand-gradient">
            {voucher.discount}
          </span>
        </div>

        <p className="text-sm text-muted">{voucher.description}</p>

        <div className="mt-2 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest">Código</div>
            <div className="font-display font-extrabold text-primary tracking-wider">{voucher.code}</div>
          </div>
          <button
            onClick={copy}
            className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:brightness-110 transition"
          >
            {copied ? "Copiado!" : "Copiar código"}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>Válido até {expires}</span>
          <a
            href="https://tintasdarka.wscommerce.com.br/"
            className="font-bold text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Usar na loja virtual →
          </a>
        </div>

        {voucher.rules.length > 0 && (
          <details className="text-xs text-muted">
            <summary className="cursor-pointer font-medium hover:text-text">Regras de uso</summary>
            <ul className="mt-2 pl-4 list-disc space-y-1">
              {voucher.rules.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
