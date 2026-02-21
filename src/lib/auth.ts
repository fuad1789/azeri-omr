import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { sendAuthNotification } from './auth-notify';

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
    maxAge: 8 * 60 * 60, // 8 saat (saniyə ilə)
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

