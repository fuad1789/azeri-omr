import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Double-check allowed emails (ALLOWED_EMAILS is comma-separated)
    const allowedEmails = (process.env.ALLOWED_EMAILS || process.env.ALLOWED_EMAIL || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    if (token && allowedEmails.length > 0 && !allowedEmails.includes((token.email || '').toLowerCase())) {
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


