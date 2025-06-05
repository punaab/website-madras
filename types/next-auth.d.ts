import 'next-auth'

type Role = 'USER' | 'ADMIN'

declare module 'next-auth' {
  interface User {
    role: Role
  }

  interface Session {
    user: User & {
      role: Role
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role
  }
} 