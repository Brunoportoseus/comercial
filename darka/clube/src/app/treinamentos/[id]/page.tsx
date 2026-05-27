import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { mockTrainings } from "@/data/mock";

interface PageProps { params: { id: string } }

export default function TreinamentoDetalhe({ params }: PageProps) {
  const t = mockTrainings.find((x) => x.id === params.id);
  if (!t) return notFound();

  const date = new Date(t.date).toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <DashboardLayout>
      <Link href="/treinamentos" className="text-sm font-bold text-primary hover:underline">← Voltar à agenda</Link>

      <article className="mt-4 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div>
          <div className="rounded-3xl overflow-hidden bg-secondary text-white relative aspect-[16/9]">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#8a1220,#18161c 50%,#3da5ff30)" }} />
            <div className="relative h-full flex flex-col justify-end p-7">
              <span className="inline-flex w-fit text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent text-secondary">
                {t.format}
              </span>
              <h1 className="font-display font-extrabold text-2xl lg:text-4xl mt-3 leading-tight">{t.title}</h1>
              <p className="text-white/75 mt-2 max-w-2xl">{t.description}</p>
            </div>
          </div>

          <section className="mt-6 rounded-2xl bg-surface border border-black/5 p-6">
            <h3 className="font-display font-bold">Sobre o treinamento</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Treinamento ministrado por <strong>{t.instructor}</strong>, com foco prático no dia a dia
              do pintor profissional. Material complementar disponível após a aula, com certificado
              de participação registrado no Clube do Pintor Darka.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                "Conteúdo prático e aplicável",
                "Certificado digital ao final",
                "Pontos no Clube do Pintor",
                "Material de apoio em PDF",
              ].map((b) => (
                <li key={b} className="flex gap-2"><span className="text-success font-extrabold">✓</span>{b}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl bg-surface border border-black/5 p-6">
            <h3 className="font-display font-bold">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {t.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-bold bg-surface-2 text-text/80">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Coluna lateral — inscrição */}
        <aside className="rounded-3xl bg-surface border border-black/5 p-6 h-fit sticky top-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Recompensa</div>
          <div className="font-display text-3xl font-extrabold text-primary mt-1">+{t.pointsAwarded} pts</div>

          <dl className="mt-6 space-y-3 text-sm">
            <Item k="Data" v={date} />
            <Item k="Horário" v={t.time} />
            <Item k="Formato" v={t.format} />
            <Item k="Local" v={t.location} />
            <Item k="Instrutor" v={t.instructor} />
            <Item k="Vagas restantes" v={`${t.seatsAvailable} disponíveis`} />
          </dl>

          <button className="mt-6 w-full px-4 py-3 rounded-xl bg-brand-gradient text-white font-bold hover:shadow-glow transition">
            Inscrever-se agora
          </button>
          <p className="text-[11px] text-muted mt-2 text-center">
            Sua inscrição aparecerá em "Notificações" após confirmada.
          </p>
        </aside>
      </article>
    </DashboardLayout>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-muted">{k}</dt>
      <dd className="text-text font-semibold text-right">{v}</dd>
    </div>
  );
}
