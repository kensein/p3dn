import type { NextConfig } from 'next';

/**
 * Base path configuration.
 *
 * The application is designed to be served from a sub-path of the PSIMKG portal
 * (https://psimkg.bmkg.go.id/p3dn/). Set NEXT_PUBLIC_BASE_PATH=/p3dn in the
 * environment for production deployments. Leave it empty for local development
 * so the app runs at the domain root (http://localhost:3000).
 *
 * basePath automatically prefixes all <Link> navigations, the router, and
 * static assets served by Next.js. For raw references to files in /public,
 * use the withBasePath() helper from lib/base-path.js.
 */
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || '';
const basePath = rawBasePath.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Sub-path serving (e.g. /p3dn). Omitted entirely when empty.
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
