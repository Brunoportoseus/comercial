// Logo Tintas Darka.
// Usa o SVG vetorial em /public/logo-darka.svg (faixa multicolor + marca).
// A variação "light" é aplicada sobre fundos escuros.
// Mantemos `showTagline` para retrocompatibilidade com chamadas existentes.

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({
  variant = "dark",
  size = "md",
  showTagline = true,
}: LogoProps) {
  const dims = {
    sm: { w: 64,  sub: "text-[9px]"  },
    md: { w: 84,  sub: "text-[10px]" },
    lg: { w: 112, sub: "text-[11px]" },
  }[size];

  const src = variant === "light" ? "/logo-darka-light.svg" : "/logo-darka.svg";
  const subColor = variant === "light" ? "text-white/75" : "text-darka-brand-green";

  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Tintas Darka"
        width={dims.w}
        className="block shrink-0"
        style={{ height: "auto" }}
      />
      {showTagline && (
        <span
          className={`hidden sm:block font-display font-bold tracking-[0.18em] uppercase leading-tight border-l border-current/20 pl-3 ${dims.sub} ${subColor}`}
        >
          Clube
          <br />
          do Pintor
        </span>
      )}
    </div>
  );
}
