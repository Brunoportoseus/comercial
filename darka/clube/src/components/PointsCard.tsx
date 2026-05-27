import Link from "next/link";
import ProgressLevel from "./ProgressLevel";
import type { Painter } from "@/types";

interface Props { painter: Painter; }

// Card principal de saldo de pontos exibido no dashboard.
export default function PointsCard({ painter }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-secondary text-white p-6 lg:p-8 shadow-soft">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(245,184,28,.35), transparent 60%)" }} />
      <div className="absolute -bottom-20 -left-16 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(13,107,77,.7), transparent 60%)" }} />

      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Nível {painter.level}
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-5xl lg:text-6xl font-extrabold leading-none">
            {painter.points.toLocaleString("pt-BR")}
          </span>
          <span className="text-accent font-display font-bold text-2xl">pts</span>
        </div>
        <p className="text-sm text-white/70 mt-1">Saldo total do Clube</p>

        <div className="mt-6">
          <ProgressLevel painter={painter} variant="onDark" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/premios"
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-secondary bg-accent hover:brightness-110 transition"
          >
            Trocar pontos
          </Link>
          <Link
            href="/pontos"
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/15 transition border border-white/15"
          >
            Ver histórico
          </Link>
        </div>
      </div>
    </div>
  );
}
