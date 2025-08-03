import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token');
  
  // This log MUST appear in your terminal when you try to access a protected path.
  console.log(`[Middleware] Checking path: ${pathname}, Token found: ${!!token}`);

  const protectedPaths = ['/dashboard', '/profile', '/settings', '/interview', '/interview/type-selection'];

  // Redirect unauthenticated users from protected paths.
  if (protectedPaths.includes(pathname) && !token) {
    console.log('[Middleware] Unauthorized access, redirecting to login.');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from the login page to the dashboard.
  if (token && pathname === '/login') {
    console.log('[Middleware] User is logged in, redirecting to dashboard.');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If none of the above, continue to the requested path.
  return NextResponse.next();
}

// The matcher configuration is crucial. It tells Next.js which paths the middleware should run on.
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/interview',
    '/interview/type-selection',
  ],
};