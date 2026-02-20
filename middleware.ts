import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const allowed = process.env.ALLOWED_EMAIL || '';

    if (token && token.email !== allowed) {
      return NextResponse.redirect(new URL('/login?error=AccessDenied', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Only protect /admin and /api/exams — everything else is public
export const config = {
  matcher: ['/admin/:path*', '/api/exams/:path*'],
};

