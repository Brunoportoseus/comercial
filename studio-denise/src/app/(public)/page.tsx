import Link from "next/link";
import { getActivePlans, getActiveProcedures } from "@/lib/queries";
import { getSetting } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { PlanCard } from "@/components/PlanCard";
import { CATEGORY_LABELS, PAYMENT_MODE_LABELS, type ProcedureCategory, type ProcedurePaymentMode } from "@/lib/domain";

export default async function HomePage() {
  const [plans, procedures, studio, testimonials, faqs] = await Promise.all([
    getActivePlans(),
    getActiveProcedures(),
    getSetting("studio"),
    prisma.testimonial.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.faq.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, take: 6 }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: studio.name,
    description: studio.tagline,
    address: { "@type": "PostalAddress", addressLocality: studio.city, addressRegion: studio.state, addressCountry: "BR" },
    areaServed: `${studio.city}, ${studio.state}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-gradient opacity-[0.14]" aria-hidden />
        <div className="container-page relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Clube de assinatura · {studio.city}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-secondary sm:text-5xl">
              Sua beleza cuidada o ano inteiro, com naturalidade e segurança.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-text/80">
              Assine um plano, acumule créditos mensais e aproveite benefícios exclusivos em
              micropigmentação de sobrancelhas, lábios e olhos — sempre com avaliação profissional
              da especialista {studio.specialist}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/planos" className="btn-primary">
                Ver planos e assinar
              </Link>
              <Link href="/como-funciona" className="btn-outline">
                Como funciona
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Sem procedimentos desnecessários. Tudo depende de avaliação, do intervalo adequado e
              da condição da sua pele.
            </p>
          </div>
          <div className="relative">
            <div className="card overflow-hidden p-0">
              <div className="aspect-[4/5] w-full bg-gradient-to-br from-primary-soft/40 via-surface-2 to-accent/20" />
            </div>
            <div className="card absolute -bottom-5 -left-3 w-48 p-4 sm:-left-6">
              <p className="text-xs text-muted">Carteira de créditos</p>
              <p className="font-display text-2xl font-bold text-primary">398 créditos</p>
              <p className="mt-1 text-xs text-success">Acumuláveis mês a mês</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (resumo) */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Simples assim" title="Como o clube funciona" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1", "Escolha seu plano", "Compare e assine o plano que combina com a sua rotina."],
            ["2", "Acumule créditos", "A cada mês você recebe créditos que se acumulam na sua carteira."],
            ["3", "Solicite avaliação", "Um procedimento só acontece após avaliação profissional."],
            ["4", "Agende e aproveite", "Marque seu horário com prioridade e acompanhe tudo pela sua área."],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                {n}
              </span>
              <h3 className="mt-4 font-semibold text-secondary">{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VANTAGENS */}
      <section className="bg-surface-2/60 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Por que assinar" title="Vantagens de fazer parte" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Créditos acumuláveis", "Sua mensalidade vira créditos que ficam guardados na sua carteira."],
              ["Prioridade no agendamento", "Assinantes têm preferência e acesso antecipado à agenda."],
              ["Benefício de aniversário", "Um mimo especial no seu mês para celebrar você."],
              ["Descontos exclusivos", "Condições especiais em procedimentos adicionais."],
              ["Naturalidade em primeiro lugar", "Resultados discretos, sem exageros, com avaliação criteriosa."],
              ["Previsibilidade", "Pague mensalmente, sem desembolsar tudo de uma vez."],
            ].map(([t, d]) => (
              <div key={t} className="card p-6">
                <h3 className="font-semibold text-secondary">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Escolha o seu"
          title="Planos do clube"
          subtitle="Valores e benefícios são exemplos de demonstração e podem ser ajustados pelo Studio."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.slug} plan={p} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/planos" className="btn-outline">
            Comparar planos em detalhe
          </Link>
        </div>
      </section>

      {/* PROCEDIMENTOS */}
      <section className="bg-surface-2/60 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="No clube" title="Serviços que participam" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {procedures.map((p) => (
              <div key={p.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <span className="chip bg-primary/10 text-primary">
                    {CATEGORY_LABELS[p.category as ProcedureCategory] ?? p.category}
                  </span>
                  {p.isDemo && <span className="demo-badge">Exemplo</span>}
                </div>
                <h3 className="mt-3 font-semibold text-secondary">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.description}</p>
                <p className="mt-3 text-xs font-medium text-primary">
                  {PAYMENT_MODE_LABELS[p.paymentMode as ProcedurePaymentMode]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALISTA */}
      <section className="container-page py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="card aspect-square overflow-hidden bg-gradient-to-br from-secondary/10 via-surface-2 to-primary/10" />
          <div>
            <p className="eyebrow">A especialista</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-secondary">{studio.specialist}</h2>
            <p className="mt-4 text-text/80">
              Referência em micropigmentação em {studio.city}, {studio.specialist} tem como marca a
              naturalidade e o cuidado individual. Cada atendimento começa por uma avaliação
              criteriosa, respeitando a condição da pele e o intervalo adequado entre procedimentos.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-text/80">
              <li>✓ Técnicas de resultado natural e discreto</li>
              <li>✓ Higiene e segurança em primeiro lugar</li>
              <li>✓ Atendimento acolhedor e personalizado</li>
            </ul>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      {testimonials.length > 0 && (
        <section className="bg-surface-2/60 py-16">
          <div className="container-page">
            <SectionHeading eyebrow="Quem já faz parte" title="Depoimentos" />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="card p-6">
                  <div className="text-accent" aria-hidden>
                    {"★".repeat(t.rating)}
                  </div>
                  <blockquote className="mt-3 text-text/90">“{t.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-secondary">
                    {t.author}
                    {t.city && <span className="font-normal text-muted"> · {t.city}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Ainda com dúvidas?" title="Perguntas frequentes" />
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line">
          {faqs.map((f) => (
            <details key={f.id} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-secondary">
                {f.question}
                <span className="text-primary transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-text/80">{f.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="btn-outline">
            Ver todas as dúvidas
          </Link>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-brand-gradient px-8 py-14 text-center text-white">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Pronta para fazer parte do clube?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Comece hoje, acumule créditos e cuide da sua beleza com previsibilidade e carinho.
          </p>
          <Link href="/planos" className="btn mt-8 bg-white text-primary hover:bg-white/90">
            Escolher meu plano
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold text-secondary sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
