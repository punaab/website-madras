import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from 'next-auth/jwt'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user?.password) {
          return null
        }

        const isValid = await bcryptjs.compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role as Role
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 