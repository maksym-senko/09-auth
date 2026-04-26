import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi'; 

const PRIVATE_ROUTES = ['/notes', '/profile', '/api/users/me'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // --- ЛОГІКА ПОНОВЛЕННЯ СЕСІЇ ---
  let isValidSession = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const user = await checkSession();
      if (user) {
        isValidSession = true;
      }
    } catch (error) {
      console.error('Middleware session refresh failed:', error);
      isValidSession = false;
    }
  }

  // --- РЕДІРЕКТИ ---

  if (isPrivateRoute && !isValidSession) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isValidSession) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/notes/:path*',
    '/profile/:path*',
    '/sign-in',
    '/sign-up',
    '/api/users/me'
  ],
};