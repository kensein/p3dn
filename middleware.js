import { NextResponse } from 'next/server';

// Portal publik P3DN (tidak memerlukan login).
const PUBLIC_PORTAL_ROUTES = [
  '/',
  '/pengumuman',
  '/statistik',
  '/dokumen',
  '/bmn',
  '/tautan',
];

// Halaman autentikasi modul evaluator.
const AUTH_ROUTES = ['/login', '/register'];

// Rute modul evaluator TKDN yang memerlukan login.
const PROTECTED_ROUTES = [
  '/home',
  '/dashboard',
  '/evaluate',
  '/history',
  '/info',
];
const ADMIN_ROUTES = ['/admin'];

function matchesAny(pathname, routes) {
  return routes.some(
    (route) =>
      pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
  );
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const isPublicPortal = matchesAny(pathname, PUBLIC_PORTAL_ROUTES);
  const isAuthRoute = matchesAny(pathname, AUTH_ROUTES);
  const isProtected = matchesAny(pathname, PROTECTED_ROUTES);
  const isAdminRoute = matchesAny(pathname, ADMIN_ROUTES);

  // Portal publik selalu boleh diakses tanpa login.
  if (isPublicPortal) {
    return NextResponse.next();
  }

  const redirectTo = (target) => {
    const url = request.nextUrl.clone(); // menjaga basePath (/p3dn) tetap utuh
    url.pathname = target;
    url.search = '';
    return NextResponse.redirect(url);
  };

  // Pengguna sudah login mencoba membuka login/register → arahkan ke modulnya.
  if (token && isAuthRoute) {
    return redirectTo(role === 'admin' ? '/admin' : '/home');
  }

  // Belum login mencoba membuka rute terproteksi → ke halaman login.
  if (!token && (isProtected || isAdminRoute)) {
    return redirectTo('/login');
  }

  // Kontrol akses berbasis peran.
  if (token) {
    if (role === 'admin' && isProtected) {
      return redirectTo('/admin');
    }
    if (role === 'user' && isAdminRoute) {
      return redirectTo('/home');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*|favicon.ico).*)'],
};
