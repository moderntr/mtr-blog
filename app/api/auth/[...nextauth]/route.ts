import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (data.success) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              token: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === 'google') {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                googleId: account.providerAccountId,
              }),
            });
            const data = await res.json();
            if (data.success) {
              token.role = data.user.role;
              token.apiToken = data.token;
            }
          } catch (error) {
            console.error('Google auth error:', error);
          }
        } else {
          token.role = user.role;
          token.apiToken = user.token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.apiToken = token.apiToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };