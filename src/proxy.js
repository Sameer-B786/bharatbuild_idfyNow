import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard');
  const isPublicRoute = path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/verify';

  const idToken = request.cookies.get('idToken')?.value;
  let isValidSession = false;

  if (idToken) {
    try {
      const decoded = decodeJwt(idToken);
      if (decoded.exp * 1000 >= Date.now()) {
        isValidSession = true;
      }
    } catch (e) {
      isValidSession = false;
    }
  }

  if (isProtectedRoute && !isValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.nextUrl));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  if (isPublicRoute && isValidSession) {
    const response = NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
