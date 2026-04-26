import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const PUBLIC_AUTH_ROUTES = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has authentication token in cookies
  const hasAuthToken = request.cookies.has('accessToken') || 
                      request.cookies.has('refreshToken');

  const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route));

  // If trying to access private route without auth, redirect to sign-in
  if (isPrivateRoute && !hasAuthToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If authenticated and trying to access auth routes, redirect to profile
  if (isAuthRoute && hasAuthToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
