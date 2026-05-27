import Link from "next/link";
import type { Training } from "@/types";

interface Props {
  training: Training;
  compact?: boolean;
}

export default function TrainingCard({ training, compact }: Props) {
  const date = new Date(training.date);
  const day = date.toLocaleDateString("pt-BR", { day: "2-digit" });
  const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
  const formatColor =
    training.format === "Presencial" ? "darka-red"
    : training.format === "Online ao vivo" ? "darka-blue"
    : training.format === "Workshop" ? "darka-purple"
    : training.format === "Demonstração" ? "darka-green"
    : training.format === "Curso técnico" ? "darka-orange"
    : "darka-yellow";

  if (compact) {
    return (
      <Link href={`/treinamentos/${training.id}`}
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-2 transition">
        <div className="shrink-0 w-14 h-14 rounded-xl bg-secondary text-white flex flex-col items-center justify-center font-display">
          <span className="text-lg font-extrabold leading-none">{day}</span>
          <span className="text-[10px] font-bold tracking-widest text-accent">{month}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-sm font-bold truncate">{training.title}</h4>
          <p className="text-xs text-muted truncate">{training.time} · {training.format}</p>
        </div>
        <span className="text-xs font-bold text-primary shrink-0">+{training.pointsAwarded}pts</span>
      </Link>
    );
  }

  return (
    <article className="rounded-2xl bg-surface border border-black/5 overflow-hidden flex flex-col hover:shadow-soft transition">
      <div className="relative aspect-[16/8] bg-secondary text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-90"
          style={{ background: "linear-gradient(135deg,#8a1220,#18161c 50%,#3da5ff20)" }} />
        <div className="relative text-center px-5">
          <div className={`inline-flex text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full bg-${formatColor}/20 text-${formatColor}`}>
            {training.format}
          </div>
          <h3 className="font-display font-extrabold text-lg mt-2 line-clamp-2">{training.title}</h3>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-sm text-muted line-clamp-2">{training.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Info label="Data" value={`${day}/${month}`} />
          <Info label="Horário" value={training.time} />
          <Info label="Instrutor" value={training.instructor} />
          <Info label="Vagas" value={`${training.seatsAvailable}`} />
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between border-t border-black/5">
          <span className="text-xs font-bold text-primary">+{training.pointsAwarded} pts ao concluir</span>
          <Link
            href={`/treinamentos/${training.id}`}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-primary hover:brightness-110 transition"
          >
            Inscrever-se
          </Link>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted font-bold">{label}</div>
      <div className="text-text font-semibold truncate">{value}</div>
    </div>
  );
}
