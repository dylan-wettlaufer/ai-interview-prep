import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token');

  console.log(`[Middleware] Checking path: ${pathname}, Token found: ${!!token}`);

  // Define protected base paths and check for dynamic segments
  const protectedBasePaths = [
    '/dashboard',
    '/profile',
    '/settings',
    '/create_interview',
    '/interview'
  ];

  // Check if the current pathname is one of the exact protected paths OR starts with '/interview/'
  const isPathProtected =
    protectedBasePaths.includes(pathname) || pathname.startsWith('/interview/');

  // Redirect unauthenticated users from protected paths.
  if (isPathProtected && !token) {
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
    '/create_interview',
    '/interview/:path*', // This ensures the middleware runs for /interview/ and its sub-paths
  ],
};