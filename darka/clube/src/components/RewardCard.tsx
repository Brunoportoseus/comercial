"use client";

import { useState } from "react";
import type { Reward } from "@/types";

interface Props {
  reward: Reward;
  userPoints: number;
}

export default function RewardCard({ reward, userPoints }: Props) {
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const canRedeem = reward.status === "disponivel" && userPoints >= reward.pointsCost;
  const statusLabel = {
    disponivel: "Disponível",
    "em-breve": "Em breve",
    esgotado: "Esgotado",
  }[reward.status];

  function redeem() {
    // TODO: integração — POST /api/rewards/{id}/redeem
    setDone(true);
    setConfirm(false);
  }

  return (
    <article className="rounded-2xl bg-surface border border-black/5 overflow-hidden flex flex-col hover:shadow-soft transition">
      <div className="relative aspect-[4/3] bg-surface-2 flex items-center justify-center">
        <RewardPlaceholder category={reward.category} />
        <span
          className={[
            "absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full",
            reward.status === "disponivel" && "bg-success/15 text-success",
            reward.status === "em-breve" && "bg-warning/15 text-warning",
            reward.status === "esgotado" && "bg-black/10 text-muted",
          ].filter(Boolean).join(" ")}
        >
          {statusLabel}
        </span>
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-surface text-muted">
          {reward.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display font-bold text-base leading-tight">{reward.name}</h3>
        {reward.description && (
          <p className="text-xs text-muted leading-relaxed">{reward.description}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-extrabold text-primary">
              {reward.pointsCost.toLocaleString("pt-BR")}
            </span>
            <span className="text-xs text-muted font-bold">pts</span>
          </div>
          <button
            onClick={() => setConfirm(true)}
            disabled={!canRedeem}
            className={[
              "px-3.5 py-2 rounded-lg text-xs font-bold transition",
              canRedeem
                ? "bg-primary text-white hover:brightness-110"
                : "bg-surface-2 text-muted cursor-not-allowed",
            ].join(" ")}
          >
            {reward.status === "disponivel" ? "Resgatar" : statusLabel}
          </button>
        </div>
      </div>

      {confirm && (
        <Modal onClose={() => setConfirm(false)}>
          {done ? (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center text-2xl">✓</div>
              <h3 className="font-display font-bold text-lg mt-3">Resgate solicitado!</h3>
              <p className="text-sm text-muted mt-1">
                Acompanhe o status do seu prêmio na área de notificações.
              </p>
              <button className="mt-5 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-bold w-full"
                onClick={() => { setConfirm(false); setDone(false); }}>
                Entendi
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-display font-bold text-lg">Confirmar resgate</h3>
              <p className="text-sm text-muted mt-1">
                Deseja trocar <strong>{reward.pointsCost.toLocaleString("pt-BR")} pontos</strong> por{" "}
                <strong>{reward.name}</strong>?
              </p>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-black/10 text-sm font-bold">
                  Cancelar
                </button>
                <button onClick={redeem}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-bold">
                  Confirmar
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </article>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-surface p-5 shadow-soft animate-fade-up"
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// SVG ilustrativo simples por categoria (substituir por imagens reais).
function RewardPlaceholder({ category }: { category: string }) {
  const palette = {
    Uniformes: ["#ff3d4d", "#ff8a3d"],
    Brindes:   ["#ffd23d", "#ff8a3d"],
    Ferramentas:["#3da5ff", "#a06bff"],
    Vouchers:  ["#3ddc97", "#3da5ff"],
    Treinamentos:["#a06bff", "#ff3d4d"],
    Kits:      ["#8a1220", "#ff3d4d"],
    Experiências:["#3ddc97", "#ffd23d"],
  }[category] ?? ["#8a1220", "#ff8a3d"];

  return (
    <svg viewBox="0 0 200 150" className="w-3/5 h-3/5">
      <defs>
        <linearGradient id={`g-${category}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette[0]} />
          <stop offset="100%" stopColor={palette[1]} />
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="160" height="100" rx="14" fill={`url(#g-${category})`} opacity="0.95" />
      <text x="100" y="92" textAnchor="middle" fontFamily="Sora, Inter" fontWeight="800" fontSize="24" fill="white">
        {category.slice(0, 1)}
      </text>
    </svg>
  );
}
