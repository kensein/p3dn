'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '../app/contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import Header from './header';
import Footer from './footer';

// Prefiks rute milik portal publik P3DN. Halaman-halaman ini memakai
// chrome portal (PortalHeader/PortalFooter) yang disediakan oleh layout grup
// (portal), sehingga ClientLayout tidak menambahkan header/footer evaluator.
const PORTAL_PREFIXES = [
  '/pengumuman',
  '/statistik',
  '/dokumen',
  '/bmn',
  '/tautan',
];

function isPortalRoute(pathname) {
  if (!pathname) return false;
  if (pathname === '/') return true;
  return PORTAL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Portal publik: dirender penuh di server (tanpa AuthProvider) agar konten
  // tetap tampil tanpa JS dan SEO-friendly. Chrome disediakan oleh
  // app/(portal)/layout.js.
  if (isPortalRoute(pathname)) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  // Modul evaluator TKDN (terproteksi auth): butuh AuthProvider + chrome internal.
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
