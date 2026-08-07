import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "",
    "/planos",
    "/como-funciona",
    "/procedimentos",
    "/faq",
    "/legal/termos",
    "/legal/regulamento",
    "/legal/privacidade",
    "/legal/cancelamento",
    "/legal/agendamento",
    "/legal/lgpd",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
