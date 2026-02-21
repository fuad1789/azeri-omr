import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { sendAuthNotification } from './auth-notify';

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Session expires in 8 hours — user must re-authenticate daily
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60,
  },

  // Fix 'State cookie was missing' error behind Nginx reverse proxy
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: !!useSecureCookies },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: { sameSite: 'lax', path: '/', secure: !!useSecureCookies },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: !!useSecureCookies },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: !!useSecureCookies, maxAge: 900 },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: !!useSecureCookies, maxAge: 900 },
    },
  },

  callbacks: {
    async signIn({ user }) {
      // Read FRESH on every request — fixes production env var timing issue
      const allowedEmails = (process.env.ALLOWED_EMAILS || process.env.ALLOWED_EMAIL || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);

      if (allowedEmails.length === 0) return false;

      const allowed = allowedEmails.includes((user.email || '').toLowerCase());

      // Console log
      const timestamp = new Date().toISOString();
      if (allowed) {
        console.log(`[AUTH] ✅ GİRİŞ: ${user.email} — ${timestamp}`);
      } else {
        console.warn(`[AUTH] ⛔ REDDEDİLDİ: ${user.email} — ${timestamp}`);
        console.warn(`[AUTH] Mövcud ALLOWED_EMAILS: "${process.env.ALLOWED_EMAILS}"`);
      }

      // Gmail bildirişi göndər (async — auth-u gözlətmir)
      sendAuthNotification({
        attemptEmail: user.email || 'naməlum',
        attemptName: user.name || undefined,
        allowed,
      });

      return allowed;
    },


    async session({ session }) {
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

