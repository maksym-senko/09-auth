import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const PRIVATE_ROUTES = ['/notes', '/profile'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(';').map(p => p.trim());
  const [nameValue] = parts;
  const [name, value] = nameValue.split('=');
  const options: Record<string, string | boolean> = {};
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.includes('=')) {
      const [key, val] = part.split('=');
      options[key.toLowerCase()] = val;
    } else {
      options[part.toLowerCase()] = true;
    }
  }
  return { name, value, options };
}

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
          const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
          for (const cookieStr of cookiesArray) {
            const { name, value, options } = parseSetCookie(cookieStr);
            response.cookies.set(name, value, options);
          }
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
    '/sign-up'
  ],
};