// Logo Tintas Darka.
// Usa sempre o arquivo oficial em /public/logo-darka.svg.
// Quando aplicada sobre fundos escuros (variant="light"), um filtro CSS
// converte a logo inteira em branco puro — assim mantemos um único
// arquivo da marca, sem precisar de versão negativa separada.

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
    sm: { w: 72,  sub: "text-[9px]"  },
    md: { w: 96,  sub: "text-[10px]" },
    lg: { w: 128, sub: "text-[11px]" },
  }[size];

  const subColor = variant === "light" ? "text-white/80" : "text-darka-brand-green";

  // basePath precisa ser prefixado manualmente em <img src> porque o
  // Next.js só aplica automaticamente em rotas, não em assets estáticos.
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${base}/logo-darka.svg`}
        alt="Tintas Darka"
        width={dims.w}
        className="block shrink-0"
        style={{
          height: "auto",
          // Sobre fundos escuros: zera saturação e força branco puro.
          filter: variant === "light" ? "brightness(0) invert(1)" : undefined,
        }}
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
