import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      isSuperUser: true,
    },
  })
  console.log({ admin })

  // Create initial content
  const content = await prisma.content.upsert({
    where: { section: 'welcome' },
    update: {},
    create: {
      section: 'welcome',
      title: 'Welcome to Madras Ward',
      content: 'A warm welcome to all visitors',
      userId: admin.id,
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