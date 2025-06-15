import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
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
            console.error('Missing credentials');
            throw new Error('Invalid credentials');
          }

          const dbUser = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!dbUser) {
            console.error('User not found:', credentials.email);
            throw new Error('Invalid credentials');
          }

          if (!dbUser.password) {
            console.error('User has no password set:', credentials.email);
            throw new Error('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            dbUser.password
          );

          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email);
            throw new Error('Invalid credentials');
          }

          console.log('Authentication successful for user:', credentials.email);
          return {
            id: dbUser.id,
            email: dbUser.email || '',
            name: dbUser.name || '',
            role: dbUser.role,
            isSuperUser: dbUser.isSuperUser
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: (user as User).role,
          isSuperUser: (user as User).isSuperUser
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          isSuperUser: token.isSuperUser
        }
      };
    }
  }
}; 