/** @type {import('next').NextConfig} */
// Caminhos públicos quando publicado no GitHub Pages do repo `comercial`.
// O portal vive em /comercial/clube/ para conviver com as propostas HTML
// já existentes na raiz do site.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/comercial/clube" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",          // gera HTML estático em /out
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
