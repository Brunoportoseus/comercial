import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const site = DEFAULT_SETTINGS.studio;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Clube de Assinatura de Micropigmentação`,
    template: `%s · ${site.name}`,
  },
  description:
    "Clube de assinatura de micropigmentação e beleza em Curitiba. Créditos mensais, benefícios exclusivos e atendimento com naturalidade e segurança.",
  keywords: [
    "micropigmentação Curitiba",
    "clube de assinatura beleza",
    "sobrancelhas",
    "micropigmentação labial",
    "Studio Denise de Paula",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: `${site.name} — Clube de Assinatura`,
    description:
      "Assine, acumule créditos e cuide da sua beleza com naturalidade e segurança em Curitiba.",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#78565A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
