import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const userRoutes = ['/home', '/dashboard', '/evaluate', '/history'];
  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  const redirectTo = (path) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = '';
    return NextResponse.redirect(url);
  };

  if (pathname === '/') {
    if (token && role === 'admin') {
      return redirectTo('/admin');
    }
    if (token && role === 'user') {
      return redirectTo('/home');
    }
    return redirectTo('/login');
  }

  if (token && isPublicRoute) {
    return redirectTo(role === 'admin' ? '/admin' : '/home');
  }

  if (!token && !isPublicRoute) {
    return redirectTo('/login');
  }

  if (token) {
    if (role === 'admin' && isUserRoute) {
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
