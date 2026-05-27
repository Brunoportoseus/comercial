import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-painter-pattern bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 py-16 lg:py-24 grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-darka-brand-green/10 text-darka-brand-green text-[11px] font-bold tracking-[0.16em] uppercase px-3 py-1.5 border border-darka-brand-green/25">
            <span className="w-1.5 h-1.5 rounded-full bg-darka-brand-green" />
            Programa de relacionamento Darka
          </span>

          <h1 className="font-display font-extrabold mt-5 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-text">
            Clube do Pintor{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg,#0d6b4d,#3aa761 50%,#8a1220)" }}>
              Darka
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted max-w-xl">
            Um programa exclusivo para valorizar quem transforma ambientes todos os dias.
            Ganhe pontos, participe de cursos e conquiste benefícios reais.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/cadastro"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-gradient hover:shadow-glow transition"
            >
              Quero participar
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl text-sm font-bold text-text bg-surface border border-black/10 hover:border-primary/40 transition"
            >
              Já sou cadastrado
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted">
            <Stat number="+5.000" label="Pintores cadastrados" />
            <Stat number="200+" label="Cursos realizados" />
            <Stat number="4,9★" label="Avaliação do clube" />
          </div>
        </div>

        {/* Card hero mock — pré-visualização do app */}
        <div className="relative">
          <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-secondary text-white p-6 shadow-soft overflow-hidden">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,138,61,.45), transparent 60%)" }} />
            <div className="absolute -bottom-16 -left-12 w-52 h-52 rounded-full" style={{ background: "radial-gradient(circle, rgba(13,107,77,.45), transparent 60%)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Nível Prata
              </div>
              <div className="mt-3 text-sm text-white/70">Olá, João Carlos</div>
              <div className="mt-1 font-display text-4xl font-extrabold">1.280<span className="text-accent text-2xl ml-1">pts</span></div>
              <div className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-accent-gradient" style={{ width: "64%" }} />
              </div>
              <div className="mt-2 text-xs text-white/60">Faltam 720 pts para o nível Ouro</div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <Mini title="Vouchers" value="4 ativos" />
                <Mini title="Prêmios" value="8 disponíveis" />
                <Mini title="Cursos" value="6 abertos" />
                <Mini title="Indicações" value="3 ativas" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <strong className="font-display text-lg text-text">{number}</strong>
      <span>{label}</span>
    </div>
  );
}
function Mini({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-white/55 text-[10px] uppercase tracking-widest">{title}</div>
      <div className="font-display font-bold text-sm mt-1">{value}</div>
    </div>
  );
}
