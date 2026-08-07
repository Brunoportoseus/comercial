import Link from "next/link";

/** Wordmark provisório. Substituir pelo logotipo oficial do Studio. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group inline-flex flex-col leading-none">
      <span
        className={`font-display text-xl font-bold tracking-tight ${
          light ? "text-white" : "text-secondary"
        }`}
      >
        Denise de Paula
      </span>
      <span
        className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
          light ? "text-white/70" : "text-primary"
        }`}
      >
        Clube · Micropigmentação
      </span>
    </Link>
  );
}
