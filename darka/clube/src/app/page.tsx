import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BenefitCard from "@/components/BenefitCard";
import TrainingCard from "@/components/TrainingCard";
import RewardCard from "@/components/RewardCard";
import { mockRewards, mockTrainings } from "@/data/mock";

export default function PublicHome() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Benefícios */}
        <section id="beneficios" className="py-16 lg:py-20 bg-surface">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <SectionTitle eyebrow="Benefícios" title="Tudo o que o Clube do Pintor Darka oferece" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <BenefitCard accent="red"    icon={<Ic d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z" />}
                title="Acumule pontos" description="Ganhe pontos em compras, cursos, indicações e campanhas." />
              <BenefitCard accent="orange" icon={<Ic d="M3 8h18v8H3zM7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />}
                title="Vouchers de desconto" description="Cupons exclusivos para a loja virtual e produtos selecionados." />
              <BenefitCard accent="yellow" icon={<Ic d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" />}
                title="Treinamentos" description="Cursos online e presenciais com instrutores especialistas." />
              <BenefitCard accent="green"  icon={<Ic d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7" />}
                title="Troque por prêmios" description="Brindes, ferramentas, uniformes, vouchers e experiências." />
              <BenefitCard accent="blue"   icon={<Ic d="M21 11.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM12 7v5l3 3" />}
                title="Condições exclusivas" description="Descontos especiais para membros e ofertas relâmpago." />
              <BenefitCard accent="purple" icon={<Ic d="M3 11l7.89 5.26a2 2 0 002.22 0L21 11M5 19h14a2 2 0 002-2V7l-9-4-9 4v10a2 2 0 002 2z" />}
                title="Campanhas especiais" description="Promoções sazonais e ações pensadas para o pintor." />
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="py-16 lg:py-20 bg-background">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <SectionTitle eyebrow="Como funciona" title="Participar é simples — em 4 passos" />
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {[
                { n: 1, t: "Faça seu cadastro", d: "Em poucos minutos no celular ou computador." },
                { n: 2, t: "Compre ou participe", d: "Compre produtos participantes ou ações do clube." },
                { n: 3, t: "Acumule pontos", d: "Cada ação vira pontos e benefícios reais." },
                { n: 4, t: "Troque por vantagens", d: "Descontos, brindes, cursos ou prêmios." },
              ].map((s) => (
                <li key={s.n} className="rounded-2xl bg-surface border border-black/5 p-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-gradient text-white font-display font-extrabold flex items-center justify-center">
                    {s.n}
                  </div>
                  <h4 className="font-display font-bold text-base mt-4">{s.t}</h4>
                  <p className="text-sm text-muted mt-1.5">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Treinamentos */}
        <section id="treinamentos" className="py-16 lg:py-20 bg-surface">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <SectionTitle
              eyebrow="Treinamentos"
              title="Aprenda, evolua e ganhe mais oportunidades"
              subtitle="Cursos online e presenciais com profissionais reconhecidos do mercado."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {mockTrainings.slice(0, 3).map((t) => <TrainingCard key={t.id} training={t} />)}
            </div>
          </div>
        </section>

        {/* Prêmios */}
        <section id="premios" className="py-16 lg:py-20 bg-background">
          <div className="mx-auto max-w-6xl px-4 lg:px-6">
            <SectionTitle
              eyebrow="Prêmios"
              title="Troque seus pontos por benefícios reais"
              subtitle="De ferramentas profissionais a experiências exclusivas com a marca."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {mockRewards.slice(0, 4).map((r) => <RewardCard key={r.id} reward={r} userPoints={0} />)}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 lg:py-24 bg-secondary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-painter-pattern opacity-50 pointer-events-none" />
          <div className="relative mx-auto max-w-3xl text-center px-4">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Faça parte do Clube do Pintor{" "}
              <span className="text-accent">Darka</span>
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Seu trabalho merece reconhecimento. Cadastre-se grátis e comece a acumular benefícios hoje mesmo.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link href="/cadastro" className="px-7 py-3.5 rounded-xl bg-brand-gradient text-white font-bold hover:shadow-glow">
                Quero participar
              </Link>
              <Link href="/login" className="px-7 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold hover:bg-white/15">
                Já sou cadastrado
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-extrabold tracking-[0.16em] uppercase text-primary">
        <span className="w-6 h-px bg-primary" /> {eyebrow}
      </span>
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight mt-3 text-text">
        {title}
      </h2>
      {subtitle && <p className="text-muted mt-3">{subtitle}</p>}
    </div>
  );
}

function Ic({ d }: { d: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
