import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/dashboard');
  const isPublicRoute = path === '/login' || path === '/signup' || path === '/forgot-password' || path === '/verify';

  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userInfo) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicRoute && session?.userInfo) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
