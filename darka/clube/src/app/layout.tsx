import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clube do Pintor Darka — Programa de relacionamento Tintas Darka",
  description:
    "Um programa exclusivo para valorizar quem transforma ambientes todos os dias. Ganhe pontos, participe de cursos e troque por prêmios.",
  manifest: "/manifest.json",
  applicationName: "Clube do Pintor Darka",
  appleWebApp: {
    capable: true,
    title: "Clube do Pintor Darka",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#8a1220",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
