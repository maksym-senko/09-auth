import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';
import axios from 'axios';

const PRIVATE_ROUTES = ['/notes', '/profile', '/api/users/me'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const response = NextResponse.next();
  let isValidSession = !!accessToken;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession(); 
      
      if (sessionResponse) {
        isValidSession = true;
        
        const setCookie = sessionResponse.headers['set-cookie'];
        
        if (setCookie) {
          const cookieValue = Array.isArray(setCookie) ? setCookie.join(', ') : setCookie;
          response.headers.set('set-cookie', cookieValue);
        }
      }
    } catch (error) {
      console.error('Middleware session refresh failed:', error);
      isValidSession = false;
    }
  }

  if (isPrivateRoute && !isValidSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export default proxy;

export const config = {
  matcher: [
    '/notes/:path*', 
    '/profile/:path*', 
    '/sign-in', 
    '/sign-up', 
    '/api/users/me'
  ],
};