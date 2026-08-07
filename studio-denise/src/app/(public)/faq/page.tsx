import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dúvidas frequentes",
  description: "Tudo sobre créditos, carência, cancelamento, agendamento e cobrança recorrente.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="container-page py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Perguntas frequentes</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-secondary">Tire suas dúvidas</h1>
      </div>

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-line">
        {faqs.map((f) => (
          <details key={f.id} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-secondary">
              {f.question}
              <span className="text-primary transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 text-text/80">{f.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/planos" className="btn-primary">
          Quero fazer parte
        </Link>
      </div>
    </div>
  );
}
