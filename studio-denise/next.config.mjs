/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint é rodado em CI separadamente; não bloqueia o build de demonstração.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
