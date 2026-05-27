import type { Painter } from "@/types";
import { levelProgress } from "@/data/mock";

interface Props {
  painter: Painter;
  variant?: "default" | "onDark";
  showLabel?: boolean;
}

export default function ProgressLevel({ painter, variant = "default", showLabel = true }: Props) {
  const pct = levelProgress(painter);
  const remaining = Math.max(0, painter.pointsToNextLevel - painter.points);
  const isDark = variant === "onDark";

  return (
    <div>
      {showLabel && (
        <div className={`flex items-center justify-between text-xs ${isDark ? "text-white/70" : "text-muted"} mb-2`}>
          <span>Progresso até <strong className={isDark ? "text-white" : "text-text"}>{painter.nextLevel ?? "—"}</strong></span>
          <span>{pct}%</span>
        </div>
      )}
      <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? "bg-white/15" : "bg-surface-2"}`}>
        <div
          className="h-full rounded-full bg-accent-gradient transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className={`text-xs mt-2 ${isDark ? "text-white/65" : "text-muted"}`}>
          {remaining > 0
            ? `Faltam ${remaining.toLocaleString("pt-BR")} pontos para o nível ${painter.nextLevel}.`
            : "Parabéns! Você atingiu o nível máximo."}
        </p>
      )}
    </div>
  );
}
