import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'music.seanlayton@gmail.com' },
    update: {
      emailVerified: new Date(),
    },
    create: {
      email: 'music.seanlayton@gmail.com',
      name: 'Sean Layton',
      password: hashedPassword,
      role: 'ADMIN',
      isSuperUser: true,
      emailVerified: new Date(),
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 