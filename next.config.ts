import type { NextConfig } from 'next';

/**
 * Sub-path deploy (mis. https://psimkg.bmkg.go.id/p3dn/).
 * Set NEXT_PUBLIC_BASE_PATH=/p3dn sebelum `npm run build` di produksi.
 * Kosongkan untuk development (http://localhost:3000).
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || '';
const basePath = rawBasePath.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
