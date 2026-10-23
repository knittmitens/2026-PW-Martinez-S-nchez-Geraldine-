// Configuración Next.js - Proxy para APIs externas
const MINI_SERVIDOR_URL = 'http://localhost:4000';  // Express mini servidor
const BACKEND_URL = 'http://localhost:3307';        // Backend principal (MySQL)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/mini/:path*', destination: `${MINI_SERVIDOR_URL}/:path*` },
      { source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }
    ];
  }
};

export default nextConfig;