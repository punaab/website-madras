import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const password = await hash('admin123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  })
  console.log({ user })

  // Create initial content
  const content = await prisma.content.upsert({
    where: { section: 'welcome' },
    update: {},
    create: {
      section: 'welcome',
      title: 'Welcome to Madras Ward',
      content: 'A warm welcome to all visitors',
      userId: user.id,
    },
  })
  console.log({ content })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 