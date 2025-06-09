import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }

          const dbUser = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!dbUser) {
            console.log('User not found');
            return null;
          }

          if (!dbUser.password) {
            console.log('User has no password');
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );

          if (!isCorrectPassword) {
            console.log('Invalid password');
            return null;
          }

          // Transform database user to NextAuth user
          const user: User = {
            id: dbUser.id,
            email: dbUser.email || '',
            name: dbUser.name || '',
            image: dbUser.image || '',
          };

          console.log('Authentication successful');
          return user;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 