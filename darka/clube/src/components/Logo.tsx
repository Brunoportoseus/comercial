// Logo do Clube do Pintor Darka.
// O símbolo "D" vem de gradiente Darka; o texto identifica o programa.
// Substituir o quadrado pela imagem oficial quando disponível em /public/logo.svg

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
  const sizes = {
    sm: { box: "w-8 h-8 text-base rounded-lg", title: "text-sm", small: "text-[9px]" },
    md: { box: "w-10 h-10 text-lg rounded-xl", title: "text-base", small: "text-[10px]" },
    lg: { box: "w-14 h-14 text-2xl rounded-2xl", title: "text-xl", small: "text-[11px]" },
  }[size];

  const textColor = variant === "light" ? "text-white" : "text-text";
  const subColor = variant === "light" ? "text-white/70" : "text-muted";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${sizes.box} flex items-center justify-center font-display font-extrabold text-white shadow-soft`}
        style={{ background: "linear-gradient(135deg,#ff3d4d,#ff8a3d 50%,#ffd23d)" }}
        aria-hidden
      >
        D
      </div>
      <div className={`leading-tight font-display font-extrabold ${textColor} ${sizes.title}`}>
        DARKA
        {showTagline && (
          <span className={`block font-sans font-medium tracking-[0.22em] ${sizes.small} uppercase ${subColor} mt-0.5`}>
            Clube do Pintor
          </span>
        )}
      </div>
    </div>
  );
}
