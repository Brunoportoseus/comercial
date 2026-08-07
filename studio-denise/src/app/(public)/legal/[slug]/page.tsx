import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const doc = await prisma.legalDocument.findUnique({ where: { slug: params.slug } });
  return { title: doc?.title ?? "Documento" };
}

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const doc = await prisma.legalDocument.findUnique({ where: { slug: params.slug } });
  if (!doc) notFound();

  return (
    <article className="container-page max-w-3xl py-14">
      <p className="eyebrow">Documento legal</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-secondary">{doc.title}</h1>
      <p className="mt-1 text-xs text-muted">
        Versão {doc.version} · publicado em {formatDate(doc.publishedAt)}
      </p>

      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-text/85">{doc.content}</div>

      <div className="mt-10 rounded-xl bg-warning/10 p-4 text-sm text-warning">
        Documento de demonstração. O conteúdo jurídico definitivo deve ser redigido/revisado por
        profissional e cadastrado pelo Studio no painel administrativo.
      </div>
    </article>
  );
}
